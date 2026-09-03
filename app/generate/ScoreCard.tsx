export function ScoreCard({
    isCorrect,
    score,
    feedback,
  }: {
    isCorrect: boolean;
    score: number;
    feedback: string;
  }) {
    return (
      <div
        role="status"
        className={`mt-2 rounded-xl border-2 p-4 transition-all ${
          isCorrect
            ? "border-green-400 bg-green-50"
            : score > 0
            ? "border-orange-400 bg-orange-50"
            : "border-red-400 bg-red-50"
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">{isCorrect ? "✅" : score > 0 ? "🟠" : "❌"}</span>
          <span className="text-lg font-bold">{score}/100</span>
        </div>
        <p className="text-sm text-gray-700">{feedback}</p>
      </div>
    );
  }