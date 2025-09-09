export type AiResponse = {
  label: "ethical" | "unethical";
  reason?: string;
  ethics_score?: number;
  probability_ethical?: number;
};
