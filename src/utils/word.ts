import {QuestionType} from "../enums/game";
import {CryptoLevel} from "../types/game";

export const getWordBoundaries = (encodedArray: (number | null)[]): number[][] => {
  const boundaries: number[][] = [];
  let start = 0;

  for (let i = 0; i <= encodedArray.length; i++) {
    if (i === encodedArray.length || encodedArray[i] === null) {
      if (start < i) {
        boundaries.push([start, i - 1]);
      }
      start = i + 1;
    }
  }

  return boundaries;
};

export const getSelectedWordIndices = (
  selectedCode: { type: QuestionType, index?: number, codeIndex: number } | null = null,
  currentLevel: CryptoLevel,
): { main: number[], questions: Record<number, number[]> } => {
  if (!selectedCode) return {main: [], questions: {}};

  const {type, index, codeIndex} = selectedCode;
  let encodedArray: (number | null)[];

  if (type === QuestionType.Main) {
    encodedArray = currentLevel.encodedPhrase;
    const boundaries = getWordBoundaries(encodedArray);
    const wordBoundary = boundaries.find(([start, end]) =>
      codeIndex >= start && codeIndex <= end
    );

    return {
      main: wordBoundary ? Array.from(
        {length: wordBoundary[1] - wordBoundary[0] + 1},
        (_, i) => wordBoundary[0] + i
      ) : [codeIndex],
      questions: {}
    };
  } else {
    const question = currentLevel.questions.find(q => q.id === index);
    if (!question) return {main: [], questions: {}};

    encodedArray = question.encodedAnswer;
    const boundaries = getWordBoundaries(encodedArray);
    const wordBoundary = boundaries.find(([start, end]) =>
      codeIndex >= start && codeIndex <= end
    );

    const questionIndices = wordBoundary ? Array.from(
      {length: wordBoundary[1] - wordBoundary[0] + 1},
      (_, i) => wordBoundary[0] + i
    ) : [codeIndex];

    return {
      main: [],
      questions: {[index as number]: questionIndices}
    };
  }
};