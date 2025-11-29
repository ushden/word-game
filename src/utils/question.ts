import { CryptoLevel } from "../types/game";

export const isQuestionSolved = (
  questionId: number,
  userAnswers: { mainPhrase: string[]; questions: Record<number, string[]> },
  currentLevel: CryptoLevel,
) => {
  const question = currentLevel.questions.find((q) => q.id === questionId);
  if (!question) return false;

  return question.encodedAnswer.every(
    (code, index) =>
      userAnswers.questions[questionId]?.[index] === question.answer[index],
  );
};
