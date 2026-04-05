import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import analyzeHandler from "./api/analyze.js";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  Object.assign(process.env, env);

  return {
    plugins: [
      react(),
      {
        name: "local-api-analyze",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const url = req.url ? req.url.split("?")[0] : "";
            if (url !== "/api/analyze") {
              next();
              return;
            }

            if (req.method === "OPTIONS") {
              res.writeHead(200, {
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST",
                "Access-Control-Allow-Headers":
                  "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
              });
              res.end();
              return;
            }

            if (req.method !== "POST") {
              res.statusCode = 405;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ message: "Method not allowed" }));
              return;
            }

            let body = "";
            req.on("data", (chunk) => {
              body += chunk;
            });

            req.on("end", async () => {
              try {
                req.body = body ? JSON.parse(body) : {};
              } catch (err) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Invalid JSON body" }));
                return;
              }

              try {
                const resShim = Object.create(res);
                resShim.status = (code) => {
                  res.statusCode = code;
                  return resShim;
                };
                resShim.json = (data) => {
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify(data));
                  return resShim;
                };
                await analyzeHandler(req, resShim);
              } catch (err) {
                console.error(err);
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({ error: "Local analyze handler failed" }),
                );
              }
            });
          });
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      historyApiFallback: true,
    },
    build: {
      outDir: "dist",
      sourcemap: true,
    },
  };
});
