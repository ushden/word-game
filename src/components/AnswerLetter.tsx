import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface AnswerLetterProps {
  code: number;
  letter: string;
  isSelected: boolean;
  isWrong: boolean; // Новый проп для ошибки
  isSolved: boolean;
  onPress: () => void;
}

const AnswerLetter: React.FC<AnswerLetterProps> = ({
                                                     code,
                                                     letter,
                                                     isSelected,
                                                     isWrong,
                                                     isSolved,
                                                     onPress
                                                   }) => {
  return (
    <TouchableOpacity
      style={[
        styles.answerLetter,
        isSelected && styles.answerLetterSelected,
        isSolved && styles.answerLetterSolved,
        isWrong && styles.answerLetterWrong // Стиль для ошибки
      ]}
      onPress={onPress}
      disabled={isSolved || isWrong} // Блокируем во время анимации ошибки
    >
      <Text style={styles.letterCode}>{code}</Text>
      <Text style={styles.letterValue}>
        {isSolved ? letter : (letter || '?')}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  answerLetter: {
    width: 50,
    height: 70,
    margin: 5,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    padding: 5,
  },
  answerLetterSelected: {
    borderColor: '#4f46e5',
    backgroundColor: '#e0e7ff',
    transform: [{ scale: 1.05 }],
  },
  answerLetterSolved: {
    backgroundColor: '#d1fae5',
    borderColor: '#10b981',
  },
  answerLetterWrong: {
    backgroundColor: '#fef2f2',
    borderColor: '#ef4444',
    transform: [{ scale: 0.95 }],
  },
  letterCode: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  letterValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
});

export default AnswerLetter;