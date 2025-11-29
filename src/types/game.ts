import {LevelDifficulty, QuestionType} from "../enums/game";

export interface CryptoLevel {
  id: number;
  mainPhrase: string;
  encodedPhrase: (number | null)[];
  letterMapping: Record<string, number>;
  questions: CryptoQuestion[];
  topic: string;
  difficulty: LevelDifficulty;
}

export interface CryptoQuestion {
  id: number;
  question: string;
  answer: string;
  encodedAnswer: (number | null)[];
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
  attempts: number;
}

export interface GameState {
  selectedCode: { type: QuestionType, index?: number, codeIndex: number } | null;
  wrongSelection: { type: QuestionType, index?: number, codeIndex: number } | null;
}