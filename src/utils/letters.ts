export const UKRAINIAN_ALPHABET = "АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ";

export const getRelevantLetters = (level: any): string[] => {
  const allLetters: string[] = [];

  allLetters.push(...level.mainPhrase.split(''));

  level.questions.forEach((question: any) => {
    allLetters.push(...question.answer.split(''));
  });

  return Array.from(new Set(allLetters))
    .filter(letter => letter !== ' ')
    .sort();
};

export const findNextEmptyLetter = (
  encodedArray: (number | null)[],
  userAnswers: string[],
  currentIndex: number
): number | null => {
  for (let i = currentIndex + 1; i < encodedArray.length; i++) {
    if (encodedArray[i] !== null && !userAnswers[i]) {
      return i;
    }
  }
  return null;
};

export const validateLevelCodes = (level: any): boolean => {
  const allCodes: number[] = [];

  level.encodedPhrase.forEach((code: number) => allCodes.push(code));

  level.questions.forEach((question: any) => {
    question.encodedAnswer.forEach((code: number) => allCodes.push(code));
  });

  const uniqueCodes = new Set(allCodes);
  return uniqueCodes.size === allCodes.length;
};

export const isUkrainianLetter = (letter: string): boolean => {
  return UKRAINIAN_ALPHABET.includes(letter);
};

export const getCodeForLetter = (level: any, letter: string): number | null => {
  return level.letterMapping[letter] || null;
};

export const getLetterForCode = (discoveredLetters: Record<number, string>, code: number): string | null => {
  return discoveredLetters[code] || null;
};