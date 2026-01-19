export type AiResponse = {
  input_text: string;
  layer1_ethics: {
    label: string;
    scores: {
      ethical: number;
      unethical: number;
    };
  };
  layer2_emotions: Array<{
    emotion: string;
    score: number;
  }>;
  layer3_policing: {
    policing_index: number;
  };
};
