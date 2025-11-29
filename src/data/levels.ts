import { CryptoLevel } from '../types/game';
import {LevelDifficulty} from "../enums/game";

export const levels: CryptoLevel[] = [
  {
    id: 1,
    mainPhrase: "УКРАЇНА",
    encodedPhrase: [1, 2, 3, 4, 5, 6, 4], // У=1, К=2, Р=3, А=4, Ї=5, Н=6
    letterMapping: {
      "У": 1, "К": 2, "Р": 3, "А": 4, "Ї": 5, "Н": 6
    },
    questions: [
      {
        id: 1,
        question: "Столиця України",
        answer: "КИЇВ",
        encodedAnswer: [2, 7, 5, 8] // К=2, И=7, Ї=5, В=8
      },
      {
        id: 2,
        question: "Найбільше озеро України",
        answer: "ЯЛПУГ",
        encodedAnswer: [9, 10, 11, 1, 12] // Я=9, Л=10, П=11, У=1, Г=12
      }
    ],
    topic: "Географія України",
    difficulty: LevelDifficulty.Easy
  },
  {
    id: 2,
    mainPhrase: "КИЇВ",
    encodedPhrase: [2, 7, 5, 8], // К=2, И=7, Ї=5, В=8
    letterMapping: {
      "К": 2, "И": 7, "Ї": 5, "В": 8
    },
    questions: [
      {
        id: 1,
        question: "Засновники Києва",
        answer: "КИЙ",
        encodedAnswer: [2, 7, 13] // К=2, И=7, Й=13
      },
      {
        id: 2,
        question: "Ріка в Києві",
        answer: "ДНІПРО",
        encodedAnswer: [14, 6, 5, 11, 3, 4] // Д=14, Н=6, І=5, П=11, Р=3, О=4
      }
    ],
    topic: "Столиця",
    difficulty: LevelDifficulty.Easy
  }
];