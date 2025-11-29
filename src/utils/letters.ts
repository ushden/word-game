// Украинский алфавит
export const UKRAINIAN_ALPHABET = "АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ";

// Получить уникальные буквы из всего уровня (основная фраза + все вопросы)
export const getRelevantLetters = (level: any): string[] => {
  const allLetters: string[] = [];

  // Буквы из основной фразы
  allLetters.push(...level.mainPhrase.split(''));

  // Буквы из всех вопросов
  level.questions.forEach((question: any) => {
    allLetters.push(...question.answer.split(''));
  });

  // Убираем дубликаты и сортируем
  const uniqueLetters = Array.from(new Set(allLetters))
    .filter(letter => letter !== ' ') // Убираем пробелы
    .sort();

  return uniqueLetters;
};

// Проверяем уникальность кодов в уровне
export const validateLevelCodes = (level: any): boolean => {
  const allCodes: number[] = [];

  // Собираем все коды из основного слова
  level.encodedPhrase.forEach((code: number) => allCodes.push(code));

  // Собираем все коды из вопросов
  level.questions.forEach((question: any) => {
    question.encodedAnswer.forEach((code: number) => allCodes.push(code));
  });

  // Проверяем уникальность
  const uniqueCodes = new Set(allCodes);
  return uniqueCodes.size === allCodes.length;
};

// Проверяем, является ли буква украинской
export const isUkrainianLetter = (letter: string): boolean => {
  return UKRAINIAN_ALPHABET.includes(letter);
};

// Получить код для буквы из маппинга уровня
export const getCodeForLetter = (level: any, letter: string): number | null => {
  return level.letterMapping[letter] || null;
};

// Получить букву для кода из discoveredLetters
export const getLetterForCode = (discoveredLetters: Record<number, string>, code: number): string | null => {
  return discoveredLetters[code] || null;
};