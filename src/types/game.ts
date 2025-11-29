import {LevelDifficulty} from "../enums/game";

export interface CryptoLevel {
  id: number;
  mainPhrase: string;
  encodedPhrase: number[];
  letterMapping: Record<string, number>;
  questions: CryptoQuestion[];
  topic: string;
  difficulty: LevelDifficulty;
}

export interface CryptoQuestion {
  id: number;
  question: string;
  answer: string;
  encodedAnswer: number[];
  hint?: string;
}

export interface GameProgress {
  currentLevel: number;
  discoveredLetters: Record<number, string>;
  userAnswers: {
    mainPhrase: string[];
    questions: Record<number, string[]>;
  };
  score: number;
  attempts: number; // Добавляем попытки
}

export interface GameState {
  selectedCode: { type: 'main' | 'question', index?: number, codeIndex: number } | null;
  wrongSelection: { type: 'main' | 'question', index?: number, codeIndex: number } | null; // Для анимации ошибки
}