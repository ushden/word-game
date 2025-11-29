import { CryptoLevel } from "../types/game";
import { LevelDifficulty } from "../enums/game";

export const levels: CryptoLevel[] = [
  {
    id: 1,
    mainPhrase: "УКРАЇНА ПЕРЕМОЖЕ",
    encodedPhrase: [1, 2, 3, 4, 5, 6, 4, null, 7, 8, 3, 8, 9, 10, 8, 11],
    letterMapping: {
      У: 1,
      К: 2,
      Р: 3,
      А: 4,
      Ї: 5,
      Н: 6,
      П: 7,
      Е: 8,
      М: 9,
      О: 10,
      Ж: 11,
      В: 12,
      И: 13,
    },
    questions: [
      {
        id: 1,
        question: "Столиця України",
        answer: "КИЇВ",
        encodedAnswer: [2, 13, 5, 12],
      },
      {
        id: 2,
        question: "Найбільше озеро України",
        answer: "ЯЛПУГ",
        encodedAnswer: [14, 15, 7, 1, 16],
      },
    ],
    topic: "Географія України",
    difficulty: LevelDifficulty.Easy,
  },
  {
    id: 2,
    mainPhrase: "КИЇВ",
    encodedPhrase: [2, 7, 5, 8],
    letterMapping: {
      К: 2,
      И: 7,
      Ї: 5,
      В: 8,
    },
    questions: [
      {
        id: 1,
        question: "Засновники Києва",
        answer: "КИЙ",
        encodedAnswer: [2, 7, 13],
      },
      {
        id: 2,
        question: "Ріка в Києві",
        answer: "ДНІПРО",
        encodedAnswer: [14, 6, 5, 11, 3, 4],
      },
    ],
    topic: "Столиця",
    difficulty: LevelDifficulty.Easy,
  },
];
