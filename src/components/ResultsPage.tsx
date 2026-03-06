"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { AiResponse } from "@/types/AiResponse";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { ArrowLeft, BarChart3, TrendingUp, RefreshCw } from "lucide-react";

interface ActionResult {
  action: string;
  response: AiResponse;
}

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [results, setResults] = useState<ActionResult[]>([]);
  const [bestAction, setBestAction] = useState<ActionResult | null>(null);
  const [situation, setSituation] = useState("");
  const [actions, setActions] = useState<string[]>([]);

  useEffect(() => {
    const data = searchParams.get("data");
    if (data) {
      try {
        const parsed = JSON.parse(decodeURIComponent(data));
        setResults(parsed.results);
        setBestAction(parsed.bestAction);
        if (parsed.situation) setSituation(parsed.situation);
        if (parsed.actions) setActions(parsed.actions);
      } catch (error) {
        console.error("Error parsing results:", error);
      }
    }
  }, [searchParams]);

  // Prepare data for charts
  const barChartData = results.map((result, index) => ({
    name: `Action ${index + 1}`,
    action:
      result.action.substring(0, 20) + (result.action.length > 20 ? "..." : ""),
    "Ethics Score": result.response.layer1_ethics.scores.ethical,
    "Inverted Policing": 100 - result.response.layer3_policing.policing_index,
    "Combined Score":
      result.response.layer1_ethics.scores.ethical * 0.6 +
      (100 - result.response.layer3_policing.policing_index) * 0.4,
  }));

  const emotionComparisonData = results.map((result, index) => ({
    name: `Action ${index + 1}`,
    ...result.response.layer2_emotions.slice(0, 3).reduce(
      (acc, emotion) => {
        acc[emotion.emotion] = emotion.score;
        return acc;
      },
      {} as Record<string, number>,
    ),
  }));

  if (results.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 flex items-center justify-center">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-8 text-center">
            <p className="text-slate-400 mb-4">No results to display</p>
            <Button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Analysis
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex gap-3 mb-6">
            <Button
              onClick={() => {
                const data = encodeURIComponent(
                  JSON.stringify({ results, bestAction, situation, actions }),
                );
                router.push(`/?data=${data}`);
              }}
              variant="outline"
              className="border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-slate-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Analysis
            </Button>

            <Button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold shadow-lg shadow-emerald-500/20"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-10 h-10 text-emerald-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Comparative Analysis
            </h1>
          </div>
          <p className="text-slate-400 text-lg">
            Detailed comparison of ethical scores across all actions
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8 bg-slate-900/50 border-slate-800 backdrop-blur-sm shadow-2xl">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold text-slate-100 mb-6">
                Actions Comparison
              </h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-slate-800/50">
                      <TableHead className="text-slate-300 font-semibold">
                        Action
                      </TableHead>
                      <TableHead className="text-slate-300 font-semibold">
                        Ethics Label
                      </TableHead>
                      <TableHead className="text-slate-300 font-semibold">
                        Ethical %
                      </TableHead>
                      <TableHead className="text-slate-300 font-semibold">
                        Primary Aesthetic
                      </TableHead>
                      <TableHead className="text-slate-300 font-semibold">
                        Policing Index
                      </TableHead>
                      <TableHead className="text-slate-300 font-semibold">
                        Combined Score
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result, i) => {
                      const combinedScore =
                        result.response.layer1_ethics.scores.ethical * 0.6 +
                        (100 - result.response.layer3_policing.policing_index) *
                          0.4;
                      return (
                        <TableRow
                          key={i}
                          className={`border-slate-800 ${
                            bestAction?.action === result.action
                              ? "bg-emerald-500/10 hover:bg-emerald-500/20"
                              : "hover:bg-slate-800/50"
                          }`}
                        >
                          <TableCell className="font-medium text-slate-100">
                            <div className="flex items-center gap-2">
                              {result.action}
                              {bestAction?.action === result.action && (
                                <span className="text-emerald-400">★</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                result.response.layer1_ethics.label ===
                                "Ethical"
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {result.response.layer1_ethics.label}
                            </span>
                          </TableCell>
                          <TableCell className="text-slate-300">
                            {result.response.layer1_ethics.scores.ethical.toFixed(
                              1,
                            )}
                            %
                          </TableCell>
                          <TableCell className="text-slate-300 capitalize">
                            {result.response.layer2_emotions[0]?.emotion ||
                              "N/A"}
                          </TableCell>
                          <TableCell className="text-slate-300">
                            {result.response.layer3_policing.policing_index.toFixed(
                              1,
                            )}
                            %
                          </TableCell>
                          <TableCell>
                            <span className="font-bold text-cyan-400 text-lg">
                              {combinedScore.toFixed(1)}%
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bar Chart - Ethics vs Policing vs Combined Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-8 bg-slate-900/50 border-slate-800 backdrop-blur-sm shadow-2xl">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold text-slate-100 mb-6">
                Score Comparison: Ethics, Policing & Combined
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    tick={{ fill: "#94a3b8" }}
                  />
                  <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                  />
                  <Legend wrapperStyle={{ color: "#94a3b8" }} />
                  <Bar
                    dataKey="Ethics Score"
                    fill="#10b981"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="Inverted Policing"
                    fill="#06b6d4"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="Combined Score"
                    fill="#8b5cf6"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Line Chart - Emotion Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="mb-8 bg-slate-900/50 border-slate-800 backdrop-blur-sm shadow-2xl">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold text-slate-100 mb-6">
                Aesthetic Response Comparison
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={emotionComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    tick={{ fill: "#94a3b8" }}
                  />
                  <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                  />
                  <Legend wrapperStyle={{ color: "#94a3b8" }} />
                  {results[0]?.response.layer2_emotions
                    .slice(0, 3)
                    .map((emotion, index) => {
                      const colors = ["#3b82f6", "#a855f7", "#ec4899"];
                      return (
                        <Line
                          key={emotion.emotion}
                          type="monotone"
                          dataKey={emotion.emotion}
                          stroke={colors[index]}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      );
                    })}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Best Action Summary */}
        {bestAction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-br from-emerald-900/30 via-emerald-800/20 to-teal-900/30 border-emerald-500/30 backdrop-blur-sm shadow-2xl">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-500/20 rounded-full">
                    <TrendingUp className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-emerald-300 mb-2">
                      Recommended Action
                    </h3>
                    <p className="text-lg text-slate-100 font-medium mb-4">
                      {bestAction.action}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                        <div className="text-sm text-slate-400 mb-1">
                          Ethics Score
                        </div>
                        <div className="text-2xl font-bold text-emerald-400">
                          {bestAction.response.layer1_ethics.scores.ethical.toFixed(
                            1,
                          )}
                          %
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
                        <div className="text-xs text-slate-500 mt-1">
                          Lower is better
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
                            (100 -
                              bestAction.response.layer3_policing
                                .policing_index) *
                              0.4
                          ).toFixed(1)}
                          %
                        </div>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                        <div className="text-sm text-slate-400 mb-1">
                          Primary Aesthetic
                        </div>
                        <div className="text-lg font-semibold text-blue-400 capitalize">
                          {bestAction.response.layer2_emotions[0]?.emotion ||
                            "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
