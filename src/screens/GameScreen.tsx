import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import AnswerLetter from '../components/AnswerLetter';
import VirtualKeyboard from '../components/VirtualKeyboard';
import { CryptoLevel } from '../types/game';

type GameScreenRouteProp = RouteProp<{ Game: { levels: CryptoLevel[] } }, 'Game'>;

interface Props {
  route: GameScreenRouteProp;
}

const GameScreen: React.FC<Props> = ({ route }) => {
  const { levels } = route.params;
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [discoveredLetters, setDiscoveredLetters] = useState<Record<number, string>>({});
  const [selectedCode, setSelectedCode] = useState<{type: 'main' | 'question', index?: number, codeIndex: number} | null>(null);
  const [wrongSelection, setWrongSelection] = useState<{type: 'main' | 'question', index?: number, codeIndex: number} | null>(null);
  const [attempts, setAttempts] = useState(3); // 3 попытки на уровень

  const [userAnswers, setUserAnswers] = useState<{
    mainPhrase: string[];
    questions: Record<number, string[]>;
  }>({
    mainPhrase: Array(levels[0].encodedPhrase.length).fill(''),
    questions: {}
  });

  const currentLevel = levels[currentLevelIndex];

  const getAttemptsColor = () => {
    if (attempts === 3) return '#059669'; // зеленый
    if (attempts === 2) return '#d97706'; // оранжевый
    if (attempts === 1) return '#dc2626'; // красный
    return '#6b7280'; // серый
  };

  const getAttemptsText = () => {
    if (attempts === 3) return '🟢🟢🟢';
    if (attempts === 2) return '🟢🟢⚫';
    if (attempts === 1) return '🟢⚫⚫';
    return '⚫⚫⚫';
  };

  // Инициализируем ответы для вопросов
  React.useEffect(() => {
    const initialQuestions: Record<number, string[]> = {};
    currentLevel.questions.forEach(question => {
      initialQuestions[question.id] = Array(question.answer.length).fill('');
    });
    setUserAnswers(prev => ({
      ...prev,
      questions: initialQuestions
    }));
    setAttempts(3); // Сбрасываем попытки при смене уровня
  }, [currentLevelIndex]);

  const handleLetterPress = (type: 'main' | 'question', index: number | undefined, codeIndex: number) => {
    setSelectedCode({ type, index, codeIndex });
  };

  const handleKeyboardLetterPress = async (letter: string) => {
    if (!selectedCode) return;

    const { type, index, codeIndex } = selectedCode;
    let code: number;
    let correctLetter: string;

    if (type === 'main') {
      code = currentLevel.encodedPhrase[codeIndex];
      correctLetter = currentLevel.mainPhrase[codeIndex];
    } else {
      const question = currentLevel.questions.find(q => q.id === index);
      if (!question) return;
      code = question.encodedAnswer[codeIndex];
      correctLetter = question.answer[codeIndex];
    }

    // Проверяем правильность
    if (letter === correctLetter) {
      // Правильно - обновляем ответ и discoveredLetters
      if (type === 'main') {
        const newMainPhrase = [...userAnswers.mainPhrase];
        newMainPhrase[codeIndex] = letter;
        setUserAnswers(prev => ({
          ...prev,
          mainPhrase: newMainPhrase
        }));
      } else {
        const newQuestionAnswers = { ...userAnswers.questions };
        newQuestionAnswers[index!] = [...newQuestionAnswers[index!]];
        newQuestionAnswers[index!][codeIndex] = letter;
        setUserAnswers(prev => ({
          ...prev,
          questions: newQuestionAnswers
        }));
      }

      setDiscoveredLetters(prev => ({
        ...prev,
        [code]: letter
      }));

      setSelectedCode(null);

    } else {
      // Неправильно - анимация ошибки и минус попытка
      setWrongSelection(selectedCode);
      const newAttempts = attempts - 1;
      setAttempts(newAttempts);

      // Анимация ошибки на 1 секунду
      setTimeout(() => {
        setWrongSelection(null);
        setSelectedCode(null);
      }, 1000);

      // Проверяем кончились ли попытки
      if (newAttempts === 0) {
        setTimeout(() => {
          Alert.alert(
            'Спроб не залишилось!',
            'Починаємо рівень знову.',
            [{ text: 'OK', onPress: resetLevel }]
          );
        }, 1200);
      }
    }
  };

  const resetLevel = () => {
    setDiscoveredLetters({});
    setUserAnswers({
      mainPhrase: Array(currentLevel.encodedPhrase.length).fill(''),
      questions: Object.fromEntries(
        currentLevel.questions.map(q => [q.id, Array(q.answer.length).fill('')])
      )
    });
    setAttempts(3);
    setSelectedCode(null);
    setWrongSelection(null);
  };

  const isLevelSolved = currentLevel.encodedPhrase.every(
    (code, index) => userAnswers.mainPhrase[index] === currentLevel.mainPhrase[index]
  );

  const isQuestionSolved = (questionId: number) => {
    const question = currentLevel.questions.find(q => q.id === questionId);
    if (!question) return false;

    return question.encodedAnswer.every(
      (code, index) => userAnswers.questions[questionId]?.[index] === question.answer[index]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Заголовок уровня */}
        <View style={styles.header}>
          <Text style={styles.topic}>{currentLevel.topic}</Text>
          <Text style={styles.levelInfo}>Рівень {currentLevel.id}</Text>

          <View style={styles.attemptsContainer}>
            <Text style={styles.attemptsIcons}>{getAttemptsText()}</Text>
            <Text style={[styles.attemptsText, { color: getAttemptsColor() }]}>
              {attempts} спроб{attempts === 1 ? 'а' : 'и'}
            </Text>
          </View>
        </View>

        {/* Основная зашифрованная фраза */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Головна фраза:</Text>
          <View style={styles.phraseContainer}>
            {currentLevel.encodedPhrase.map((code, index) => (
              <AnswerLetter
                key={index}
                code={code}
                letter={userAnswers.mainPhrase[index]}
                isSelected={selectedCode?.type === 'main' && selectedCode.codeIndex === index}
                isWrong={wrongSelection?.type === 'main' && wrongSelection.codeIndex === index}
                isSolved={userAnswers.mainPhrase[index] === currentLevel.mainPhrase[index]}
                onPress={() => handleLetterPress('main', undefined, index)}
              />
            ))}
          </View>
        </View>

        {/* Все вопросы списком */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Питання-підказки:</Text>
          {currentLevel.questions.map((question, questionIndex) => (
            <View key={question.id} style={styles.questionBlock}>
              <Text style={styles.questionText}>
                {questionIndex + 1}. {question.question}
              </Text>
              <View style={styles.answerContainer}>
                {question.encodedAnswer.map((code, letterIndex) => (
                  <AnswerLetter
                    key={letterIndex}
                    code={code}
                    letter={userAnswers.questions[question.id]?.[letterIndex] || ''}
                    isSelected={selectedCode?.type === 'question' &&
                      selectedCode.index === question.id &&
                      selectedCode.codeIndex === letterIndex}
                    isWrong={wrongSelection?.type === 'question' &&
                      wrongSelection.index === question.id &&
                      wrongSelection.codeIndex === letterIndex}
                    isSolved={isQuestionSolved(question.id)}
                    onPress={() => handleLetterPress('question', question.id, letterIndex)}
                  />
                ))}
              </View>
              {isQuestionSolved(question.id) && (
                <Text style={styles.solvedText}>✓ Розв'язано</Text>
              )}
            </View>
          ))}
        </View>

        {/* Прогресс */}
        <View style={styles.progressSection}>
          <Text style={styles.progressText}>
            Знайдено літер: {Object.keys(discoveredLetters).length}
          </Text>
          {isLevelSolved && (
            <Text style={styles.successText}>Рівень пройдено! 🎉</Text>
          )}
        </View>
      </ScrollView>

      {/* Виртуальная клавиатура */}
      <VirtualKeyboard
        onLetterPress={handleKeyboardLetterPress}
        level={currentLevel}
        discoveredLetters={discoveredLetters}
        disabled={wrongSelection !== null} // Блокируем клавиатуру во время анимации ошибки
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  topic: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 5,
  },
  levelInfo: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 10,
  },
  attemptsContainer: {
    alignItems: 'center',
  },
  attemptsIcons: {
    fontSize: 20,
    marginBottom: 2,
  },
  attemptsText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 15,
  },
  phraseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  questionBlock: {
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  questionText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 12,
    lineHeight: 22,
  },
  answerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  solvedText: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 10,
  },
  successText: {
    fontSize: 18,
    color: '#10b981',
    fontWeight: '600',
  },
});

export default GameScreen;