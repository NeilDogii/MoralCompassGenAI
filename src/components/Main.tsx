"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { FetchAiResponse } from "@/lib/requests/FetchAiResponse";
import { AiResponse } from "@/types/AiResponse";
import {
  Loader2,
  Plus,
  Trash2,
  Sparkles,
  TrendingUp,
  BarChart3,
} from "lucide-react";

interface ActionResult {
  action: string;
  response: AiResponse;
}

export default function Main() {
  const router = useRouter();
  const [situation, setSituation] = useState("");
  const [actions, setActions] = useState([""]);
  const [results, setResults] = useState<ActionResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [bestAction, setBestAction] = useState<ActionResult | null>(null);

  // Reference policing index for comparison (baseline neutral action)
  const REFERENCE_POLICING_INDEX = 50.0;

  const addAction = () => setActions([...actions, ""]);

  const removeAction = (index: number) => {
    if (actions.length > 1) {
      setActions(actions.filter((_, i) => i !== index));
    }
  };

  const updateAction = (i: number, value: string) => {
    const copy = [...actions];
    copy[i] = value;
    setActions(copy);
  };

  const analyze = async () => {
    if (!situation.trim() || actions.every((a) => !a.trim())) {
      return;
    }

    setLoading(true);
    setResults(null);
    setBestAction(null);

    try {
      const responses = await Promise.all(
        actions
          .filter((a) => a.trim())
          .map(async (action) => {
            const response = await FetchAiResponse(situation, action);
            return { action, response };
          }),
      );

      const validResults = responses.filter(
        (r): r is ActionResult => r.response !== null,
      );

      if (validResults.length > 0) {
        setResults(validResults);

        // Check if all actions are unethical
        const allUnethical = validResults.every(
          (result) => result.response.layer1_ethics.label === "Unethical",
        );

        if (allUnethical) {
          // If all actions are unethical, don't recommend any
          setBestAction(null);
        } else {
          // Calculate best action using combined score: 60% ethics + 40% inverted policing
          // Note: Lower policing index is better, so we invert it (100 - policing_index)
          const best = validResults.reduce((prev, current) => {
            const currentCombined =
              current.response.layer1_ethics.scores.ethical * 0.6 +
              (100 - current.response.layer3_policing.policing_index) * 0.4;
            const prevCombined =
              prev.response.layer1_ethics.scores.ethical * 0.6 +
              (100 - prev.response.layer3_policing.policing_index) * 0.4;
            return currentCombined > prevCombined ? current : prev;
          });
          setBestAction(best);
        }
      }
    } catch (error) {
      console.error("Error analyzing actions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEmotionColor = (index: number) => {
    const colors = [
      "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "bg-purple-500/20 text-purple-400 border-purple-500/30",
      "bg-pink-500/20 text-pink-400 border-pink-500/30",
    ];
    return colors[index] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-emerald-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Moral Compass AI
            </h1>
          </div>
          <p className="text-slate-400 text-lg">
            Analyze ethical decisions with advanced AI-powered insights
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8 bg-slate-900/50 border-slate-800 backdrop-blur-sm shadow-2xl">
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Situation
                </label>
                <Input
                  placeholder="Describe the moral dilemma or situation..."
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 h-12 text-base focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-300">
                  Possible Actions
                </label>
                <AnimatePresence mode="popLayout">
                  {actions.map((action, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-2"
                    >
                      <Input
                        placeholder={`Action ${i + 1}`}
                        value={action}
                        onChange={(e) => updateAction(i, e.target.value)}
                        className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                      />
                      {actions.length > 1 && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeAction(i)}
                          className="border-slate-700 bg-slate-800/50 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={addAction}
                  className="border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-slate-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Action
                </Button>
                <Button
                  onClick={analyze}
                  disabled={loading || !situation.trim()}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold shadow-lg shadow-emerald-500/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Analyze Morality
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        {results && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Reference Score Info */}
            <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">
                      Reference Policing Index (Baseline)
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Neutral action baseline for comparison
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-slate-300">
                    {REFERENCE_POLICING_INDEX.toFixed(1)}%
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Best Action Highlight or Warning */}
            {bestAction ? (
              <Card className="bg-gradient-to-br from-emerald-900/30 via-emerald-800/20 to-teal-900/30 border-emerald-500/30 backdrop-blur-sm shadow-2xl shadow-emerald-500/10">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-emerald-500/20 rounded-full">
                      <TrendingUp className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-emerald-300 mb-2">
                        Recommended Action
                      </h3>
                      <p className="text-lg text-slate-100 font-medium mb-4">
                        {bestAction.action}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                          <div className="text-sm text-slate-400 mb-1">
                            Ethics Classification
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-2xl font-bold ${
                                bestAction.response.layer1_ethics.label ===
                                "Ethical"
                                  ? "text-emerald-400"
                                  : "text-red-400"
                              }`}
                            >
                              {bestAction.response.layer1_ethics.label}
                            </span>
                            <span className="text-slate-400 text-sm">
                              (
                              {bestAction.response.layer1_ethics.scores.ethical.toFixed(
                                1,
                              )}
                              %)
                            </span>
                          </div>
                        </div>

                        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                          <div className="text-sm text-slate-400 mb-1">
                            Policing Index
                          </div>
                          <div className="text-2xl font-bold text-cyan-400">
                            {bestAction.response.layer3_policing.policing_index.toFixed(
                              1,
                            )}
                            %
                          </div>
                        </div>

                        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                          <div className="text-sm text-slate-400 mb-1">
                            Combined Score
                          </div>
                          <div className="text-2xl font-bold text-purple-400">
                            {(
                              bestAction.response.layer1_ethics.scores.ethical *
                                0.6 +
                              bestAction.response.layer3_policing
                                .policing_index *
                                0.4
                            ).toFixed(1)}
                            %
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            60% Ethics + 40% Policing
                          </div>
                        </div>

                        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                          <div className="text-sm text-slate-400 mb-1">
                            Primary Aesthetic
                          </div>
                          <div className="text-lg font-semibold text-purple-400 capitalize">
                            {bestAction &&
                            bestAction.response.layer2_emotions &&
                            bestAction.response.layer2_emotions[0] &&
                            bestAction.response.layer2_emotions[0].emotion
                              ? bestAction.response.layer2_emotions[0].emotion
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gradient-to-br from-red-900/30 via-red-800/20 to-orange-900/30 border-red-500/30 backdrop-blur-sm shadow-2xl shadow-red-500/10">
                <CardContent className="">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-500/20 rounded-full">
                      <svg
                        className="w-6 h-6 text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-red-300 mb-2">
                        No Recommended Action
                      </h3>
                      <p className="text-slate-300 mb-4">
                        All analyzed actions have been classified as{" "}
                        <span className="font-semibold text-red-400">
                          unethical
                        </span>
                        . We cannot recommend any of these courses of action.
                      </p>
                      <p className="text-sm text-slate-400">
                        Consider exploring alternative approaches or reframing
                        the situation to find more ethical solutions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Detailed Analysis for Each Action */}
            {results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`${
                    bestAction?.action === result.action
                      ? "bg-slate-800/50 border-emerald-500/50"
                      : "bg-slate-900/50 border-slate-800"
                  } backdrop-blur-sm shadow-xl`}
                >
                  <CardContent className="pt-6 space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-100 mb-1">
                          {result.action}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {result.response.input_text}
                        </p>
                      </div>
                      {bestAction?.action === result.action && (
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold border border-emerald-500/30">
                          Best Choice
                        </span>
                      )}
                    </div>

                    {/* Ethics Scores */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-slate-300">
                        Ethical Assessment
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-800/50 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-slate-400">
                              Ethical
                            </span>
                            <span className="text-sm font-bold text-emerald-400">
                              {result.response.layer1_ethics.scores.ethical.toFixed(
                                1,
                              )}
                              %
                            </span>
                          </div>
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${result.response.layer1_ethics.scores.ethical}%`,
                              }}
                              transition={{ duration: 0.8, delay: 0.2 }}
                              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                            />
                          </div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-slate-400">
                              Unethical
                            </span>
                            <span className="text-sm font-bold text-red-400">
                              {result.response.layer1_ethics.scores.unethical.toFixed(
                                1,
                              )}
                              %
                            </span>
                          </div>
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${result.response.layer1_ethics.scores.unethical}%`,
                              }}
                              transition={{ duration: 0.8, delay: 0.2 }}
                              className="h-full bg-gradient-to-r from-red-500 to-red-400"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Aesthetic */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-slate-300">
                        Aesthetic Analysis
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.response.layer2_emotions
                          .slice(0, 3)
                          .map((emotion, i) => (
                            <div
                              key={i}
                              className={`px-4 py-2 rounded-full border ${getEmotionColor(
                                i,
                              )}`}
                            >
                              <span className="capitalize font-medium">
                                {emotion.emotion}
                              </span>
                              <span className="ml-2 text-xs opacity-75">
                                {emotion.score.toFixed(1)}%
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Policing Index */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-slate-300">
                        Policing Index
                      </h4>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-400">Index Value</span>
                          <span className="text-2xl font-bold text-cyan-400">
                            {result.response.layer3_policing.policing_index.toFixed(
                              1,
                            )}
                            %
                          </span>
                        </div>
                        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${result.response.layer3_policing.policing_index}%`,
                            }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* View Detailed Analysis Button */}
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm shadow-2xl">
              <CardContent className="pt-6 pb-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-100 mb-3">
                    Ready for Detailed Comparison?
                  </h3>
                  <p className="text-slate-400 mb-6">
                    View comprehensive charts, graphs, and side-by-side
                    comparison of all actions
                  </p>
                  <Button
                    onClick={() => {
                      const data = encodeURIComponent(
                        JSON.stringify({ results, bestAction }),
                      );
                      router.push(`/results?data=${data}`);
                    }}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/20 px-8 py-6 text-lg"
                  >
                    <BarChart3 className="w-5 h-5 mr-2" />
                    View Detailed Analysis & Graphs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
