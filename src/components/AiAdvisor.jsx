import React, { useState } from "react";
import { useSelector } from "react-redux";
import { calculateTotals } from "../utils/helpers";
import Card from "./common/Card";
import Button from "./common/Button";
import SafeIcon from "../common/SafeIcon";
import * as FiIcons from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const AiAdvisor = () => {
  const { transactions } = useSelector((state) => state.finance);
  const [advice, setAdvice] = useState("");
  const [adviceSource, setAdviceSource] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastGenTime, setLastGenTime] = useState(null);

  const generateFallbackAdvice = ({
    transactions,
    balance,
    income,
    expense,
  }) => {
    const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;
    let highestCategory = { name: "N/A", amount: 0 };
    const categoryTotals = {};

    transactions.forEach((t) => {
      if (t.type === "expense") {
        categoryTotals[t.category] =
          (categoryTotals[t.category] || 0) + t.amount;
      }
    });

    for (const [name, amount] of Object.entries(categoryTotals)) {
      if (amount > highestCategory.amount) highestCategory = { name, amount };
    }

    const goodMargin = [
      "You are maintaining a very healthy margin, comfortably clearing the standard 20% financial safety baseline. ",
      "Your cash flow is stable and secure, keeping you well above the danger zone. ",
      "You have a solid grip on your finances with a highly sustainable savings cushion. ",
    ];

    const enders = [
      "To push your portfolio to the next level, try to incrementally increase your savings rate by just 1% each month to slowly build towards financial independence. ",
      "Keep optimizing your discretionary spending, and your portfolio's liquidity will only continue to strengthen. ",
      "Stay disciplined with your allocations and you will see compounded growth by the end of the quarter. ",
    ];

    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    let fallbackAdvice = `Your current savings rate stands at ${savingsRate.toFixed(1)}%. `;

    if (savingsRate <= 0) {
      fallbackAdvice +=
        "WARNING: You are currently operating at a critical net-negative cash flow deficit. To overcome this immediately, you must initiate a strict spending freeze on non-essential lifestyle purchases. I highly recommend utilizing a zero-based budget to ruthlessly cut discretionary spending until your incoming cash flow fully covers all baseline operations without relying on credit. ";
    } else if (savingsRate < 20) {
      fallbackAdvice +=
        "This is below the universally recommended 20% threshold, indicating that a disproportionate amount of your capital is tied up in outgoing expenses rather than wealth accumulation. To improve this, actively audit your recurring subscriptions this week and allocate at least 10% of next month's income automatically into a hidden savings account before you see it. ";
    } else if (savingsRate >= 50) {
      fallbackAdvice +=
        "This is an exceptionally strong margin, putting you in an elite tier of savers! Your liquidity is remarkably optimized. To snowball this success, you must ensure your massive surplus capital is not sitting idle; automatically sweep these excess funds into high-yield index funds, ETFs, or tax-advantaged accounts to aggressively multiply your wealth and combat inflation. ";
    } else {
      fallbackAdvice += pick(goodMargin);
      fallbackAdvice += pick(enders);
    }

    if (highestCategory.amount > 0) {
      fallbackAdvice += `Looking granularly at your ledger, your absolute heaviest capital drain right now is the '${highestCategory.name}' category, commanding a massive $${highestCategory.amount} of your outgoing cash flow. `;
      fallbackAdvice += `If you want to rapidly accelerate your portfolio's growth curve in the next 30 days, I strongly advise implementing strict micro-budgets specifically targeting your ${highestCategory.name} expenditures.`;
    }

    return fallbackAdvice;
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const generateAdvice = async () => {
    if (lastGenTime && Date.now() - lastGenTime < 30000) {
      setError("Please wait 30 seconds before requesting another analysis.");
      return;
    }

    setIsLoading(true);
    setError("");

    const minLoadingMs = 700;
    const startTime = Date.now();
    const { balance, income, expense } = calculateTotals(transactions);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactions,
          balance,
          income,
          expense,
        }),
      });

      const rawText = await response.text();
      let data = {};

      if (rawText) {
        try {
          data = JSON.parse(rawText);
        } catch (parseError) {
          throw new Error("Received invalid JSON from the analysis server.");
        }
      }

      if (!response.ok) {
        throw new Error(
          data.error || `Failed to fetch AI advice (${response.status})`,
        );
      }

      if (!data.advice) {
        throw new Error(
          "Analysis server responded with no advice. Please try again.",
        );
      }

      setAdvice(data.advice);
      setAdviceSource(data.source === "fallback" ? "Local fallback" : "AI");
      setLastGenTime(Date.now());
    } catch (err) {
      console.error(err);
      const shouldFallback =
        err.message.includes("fetch") ||
        err.message.includes("Failed to fetch") ||
        err.message.includes("waking up") ||
        err.message.includes("Invalid JSON") ||
        err.message.includes("analysis server responded") ||
        err.message.includes("Failed to fetch AI advice");

      if (shouldFallback) {
        setAdvice(
          generateFallbackAdvice({ transactions, balance, income, expense }),
        );
        setAdviceSource("Local fallback");
        setLastGenTime(Date.now());
      } else {
        setAdviceSource("");
        setError(err.message);
      }
    } finally {
      const elapsed = Date.now() - startTime;
      if (elapsed < minLoadingMs) {
        await delay(minLoadingMs - elapsed);
      }
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4 sm:p-6 overflow-hidden relative group">
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 p-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none transition-all duration-1000 group-hover:scale-110"></div>

      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white shadow-lg shadow-indigo-500/30">
            <SafeIcon icon={FiIcons.FiCpu} className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            AI Advisor
          </h3>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Get brutal, personalized financial feedback analyzed directly from
          your spending profile.
        </p>

        <AnimatePresence mode="wait">
          {!advice && !isLoading && !error && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Button
                onClick={generateAdvice}
                className="w-full sm:w-auto px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-0 flex items-center justify-center"
              >
                <SafeIcon icon={FiIcons.FiZap} className="w-4 h-4 mr-2" />
                Generate Instant Portfolio Analysis
              </Button>
            </motion.div>
          )}

          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-800/50 flex flex-col items-center justify-center space-y-3"
            >
              <div className="relative">
                <SafeIcon
                  icon={FiIcons.FiCpu}
                  className="w-6 h-6 text-indigo-500 animate-pulse"
                />
                <div className="absolute inset-0 bg-indigo-500 blur-md opacity-40 animate-pulse rounded-full"></div>
              </div>
              <p className="text-sm font-medium text-indigo-700 dark:text-indigo-400 animate-pulse">
                AI is analyzing your habits...
              </p>
            </motion.div>
          )}

          {advice && !isLoading && (
            <motion.div
              key="result"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50"
            >
              <div className="flex items-start space-x-3 mb-3">
                <SafeIcon
                  icon={FiIcons.FiMessageSquare}
                  className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0"
                />
                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-medium italic">
                  "{advice}"
                </p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                  Source: {adviceSource || "Unknown"}
                </span>
                <button
                  onClick={generateAdvice}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition-colors uppercase tracking-wider flex items-center"
                >
                  <SafeIcon
                    icon={FiIcons.FiRefreshCw}
                    className="w-3 h-3 mr-1"
                  />{" "}
                  Re-Analyze
                </button>
              </div>
            </motion.div>
          )}

          {error && !isLoading && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/50"
            >
              <div className="flex items-start space-x-3 mb-3">
                <SafeIcon
                  icon={FiIcons.FiAlertCircle}
                  className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                />
                <p className="text-sm text-red-800 dark:text-red-300 font-medium">
                  {error}
                </p>
              </div>
              <Button
                onClick={generateAdvice}
                variant="ghost"
                size="sm"
                className="w-full text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 flex justify-center"
              >
                Try Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default AiAdvisor;
