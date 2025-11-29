import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

import AnswerLetter from '../components/AnswerLetter';
import VirtualKeyboard from '../components/VirtualKeyboard';
import {CryptoLevel} from '../types/game';
import {QuestionType} from '../enums/game';
import {findNextEmptyLetter, getSelectedWordIndices, isQuestionSolved} from '../utils';

type GameScreenRouteProp = RouteProp<{Game: {levels: CryptoLevel[]}}, 'Game'>;

interface Props {
  route: GameScreenRouteProp;
}

const GameScreen: React.FC<Props> = ({route}) => {
  const {levels} = route.params;
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [discoveredLetters, setDiscoveredLetters] = useState<Record<number, string>>({});
  const [selectedCode, setSelectedCode] = useState<{
    type: QuestionType;
    index?: number;
    codeIndex: number;
  } | null>(null);
  const [wrongSelection, setWrongSelection] = useState<{
    type: QuestionType;
    index?: number;
    codeIndex: number;
  } | null>(null);
  const [attempts, setAttempts] = useState(3);

  const [userAnswers, setUserAnswers] = useState<{
    mainPhrase: string[];
    questions: Record<number, string[]>;
  }>({
    mainPhrase: Array(levels[0].encodedPhrase.length).fill(''),
    questions: {},
  });

  const currentLevel = levels[currentLevelIndex];

  const getAttemptsColor = () => {
    if (attempts === 3) return '#059669';
    if (attempts === 2) return '#d97706';
    if (attempts === 1) return '#dc2626';
    return '#6b7280';
  };

  const getAttemptsText = () => {
    if (attempts === 3) return '🟢🟢🟢';
    if (attempts === 2) return '🟢🟢⚫';
    if (attempts === 1) return '🟢⚫⚫';
    return '⚫⚫⚫';
  };

  React.useEffect(() => {
    const initialQuestions: Record<number, string[]> = {};
    currentLevel.questions.forEach((question) => {
      initialQuestions[question.id] = Array(question.answer.length).fill('');
    });
    setUserAnswers((prev) => ({
      ...prev,
      questions: initialQuestions,
    }));
    setAttempts(3);
  }, [currentLevelIndex]);

  const handleLetterPress = (type: QuestionType, index: number | undefined, codeIndex: number) => {
    setSelectedCode({type, index, codeIndex});
  };

  const handleKeyboardLetterPress = async (letter: string) => {
    if (!selectedCode) return;

    const {type, index, codeIndex} = selectedCode;
    let code: number | null;
    let correctLetter: string;
    let encodedArray: (number | null)[];

    if (type === QuestionType.Main) {
      encodedArray = currentLevel.encodedPhrase;
      code = encodedArray[codeIndex];
      correctLetter = currentLevel.mainPhrase[codeIndex];
    } else {
      const question = currentLevel.questions.find((q) => q.id === index);
      if (!question) return;
      encodedArray = question.encodedAnswer;
      code = encodedArray[codeIndex];
      correctLetter = question.answer[codeIndex];
    }

    if (code === null) return;

    if (letter === correctLetter) {
      if (type === QuestionType.Main) {
        const newMainPhrase = [...userAnswers.mainPhrase];
        newMainPhrase[codeIndex] = letter;
        setUserAnswers((prev) => ({
          ...prev,
          mainPhrase: newMainPhrase,
        }));

        const nextIndex = findNextEmptyLetter(encodedArray, newMainPhrase, codeIndex);
        if (nextIndex !== null) {
          setSelectedCode({type: QuestionType.Main, codeIndex: nextIndex});
        } else {
          setSelectedCode(null);
        }
      } else {
        const newQuestionAnswers = {...userAnswers.questions};
        newQuestionAnswers[index!] = [...newQuestionAnswers[index!]];
        newQuestionAnswers[index!][codeIndex] = letter;
        setUserAnswers((prev) => ({
          ...prev,
          questions: newQuestionAnswers,
        }));

        const nextIndex = findNextEmptyLetter(encodedArray, newQuestionAnswers[index!], codeIndex);
        if (nextIndex !== null) {
          setSelectedCode({
            type: QuestionType.Question,
            index,
            codeIndex: nextIndex,
          });
        } else {
          setSelectedCode(null);
        }
      }

      setDiscoveredLetters((prev) => ({
        ...prev,
        [code]: letter,
      }));
    } else {
      setWrongSelection(selectedCode);
      const newAttempts = attempts - 1;
      setAttempts(newAttempts);

      setTimeout(() => {
        setWrongSelection(null);
      }, 1000);

      if (newAttempts === 0) {
        setTimeout(() => {
          Alert.alert('Спроб не залишилось!', 'Починаємо рівень знову.', [
            {text: 'OK', onPress: resetLevel},
          ]);
        }, 1200);
      }
    }
  };

  const resetLevel = () => {
    setDiscoveredLetters({});
    setUserAnswers({
      mainPhrase: Array(currentLevel.encodedPhrase.length).fill(''),
      questions: Object.fromEntries(
        currentLevel.questions.map((q) => [q.id, Array(q.answer.length).fill('')]),
      ),
    });
    setAttempts(3);
    setSelectedCode(null);
    setWrongSelection(null);
  };

  const isLevelSolved = currentLevel.encodedPhrase.every(
    (code, index) => userAnswers.mainPhrase[index] === currentLevel.mainPhrase[index],
  );

  const selectedWordIndices = getSelectedWordIndices(selectedCode, currentLevel);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.topic}>{currentLevel.topic}</Text>
        <Text style={styles.levelInfo}>Рівень {currentLevel.id}</Text>

        <View style={styles.attemptsContainer}>
          <Text style={styles.attemptsIcons}>{getAttemptsText()}</Text>
          <Text style={[styles.attemptsText, {color: getAttemptsColor()}]}>
            {attempts} спроб{attempts === 1 ? 'а' : 'и'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Головна фраза:</Text>
        <View style={styles.phraseContainer}>
          {currentLevel.encodedPhrase.map((code, index) => {
            const isWordSelected = selectedWordIndices.main.includes(index);

            return (
              <AnswerLetter
                key={index}
                code={code}
                letter={userAnswers.mainPhrase[index]}
                isSelected={
                  selectedCode?.type === QuestionType.Main && selectedCode.codeIndex === index
                }
                isWordSelected={isWordSelected}
                isWrong={
                  wrongSelection?.type === QuestionType.Main && wrongSelection.codeIndex === index
                }
                isSolved={userAnswers.mainPhrase[index] === currentLevel.mainPhrase[index]}
                onPress={() => handleLetterPress(QuestionType.Main, undefined, index)}
                isSpace={code === null}
              />
            );
          })}
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Питання-підказки:</Text>
          {currentLevel.questions.map((question, questionIndex) => (
            <View key={question.id} style={styles.questionBlock}>
              <Text style={styles.questionText}>
                {questionIndex + 1}. {question.question}
              </Text>
              <View style={styles.answerContainer}>
                {question.encodedAnswer.map((code, letterIndex) => {
                  const isWordSelected =
                    selectedWordIndices.questions[question.id]?.includes(letterIndex) || false;

                  return (
                    <AnswerLetter
                      key={letterIndex}
                      code={code}
                      letter={userAnswers.questions[question.id]?.[letterIndex] || ''}
                      isSelected={
                        selectedCode?.type === QuestionType.Question &&
                        selectedCode.index === question.id &&
                        selectedCode.codeIndex === letterIndex
                      }
                      isWordSelected={isWordSelected}
                      isWrong={
                        wrongSelection?.type === QuestionType.Question &&
                        wrongSelection.index === question.id &&
                        wrongSelection.codeIndex === letterIndex
                      }
                      isSolved={isQuestionSolved(question.id, userAnswers, currentLevel)}
                      onPress={() =>
                        handleLetterPress(QuestionType.Question, question.id, letterIndex)
                      }
                      isSpace={code === null}
                    />
                  );
                })}
              </View>
              {isQuestionSolved(question.id, userAnswers, currentLevel) && (
                <Text style={styles.solvedText}>✓ Розв'язано</Text>
              )}
            </View>
          ))}
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.progressText}>
            Знайдено літер: {Object.keys(discoveredLetters).length}
          </Text>
          {isLevelSolved && <Text style={styles.successText}>Рівень пройдено! 🎉</Text>}
        </View>
      </ScrollView>

      <VirtualKeyboard
        onLetterPress={handleKeyboardLetterPress}
        level={currentLevel}
        discoveredLetters={discoveredLetters}
        disabled={wrongSelection !== null}
      />
    </SafeAreaView>
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
