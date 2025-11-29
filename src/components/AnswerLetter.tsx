import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface AnswerLetterProps {
  code: number | null;
  letter: string;
  isSelected: boolean;
  isWordSelected: boolean;
  isWrong: boolean;
  isSolved: boolean;
  onPress: () => void;
  isSpace?: boolean;
}

const AnswerLetter: React.FC<AnswerLetterProps> = ({
  code,
  letter,
  isSelected,
  isWordSelected,
  isWrong,
  isSolved,
  onPress,
  isSpace = false,
}) => {
  if (isSpace || code === null) {
    return (
      <View style={[styles.space, isWordSelected && styles.spaceWordSelected]}>
        <Text style={styles.spaceText}> </Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.answerLetter,
        isWordSelected && styles.answerLetterWordSelected,
        isSelected && styles.answerLetterSelected,
        isSolved && styles.answerLetterSolved,
        isWrong && styles.answerLetterWrong,
      ]}
      onPress={onPress}
      disabled={isSolved || isWrong}>
      <Text style={styles.letterValue}>{isSolved ? letter : letter || '?'}</Text>
      <Text style={styles.letterCode}>{code}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  answerLetter: {
    width: 50,
    height: 70,
    margin: 2,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    padding: 5,
  },
  answerLetterWordSelected: {
    backgroundColor: '#f0f9ff',
    borderColor: '#bae6fd',
  },
  answerLetterSelected: {
    borderColor: '#4f46e5',
    backgroundColor: '#e0e7ff',
    transform: [{scale: 1.05}],
  },
  answerLetterSolved: {
    backgroundColor: '#d1fae5',
    borderColor: '#10b981',
  },
  answerLetterWrong: {
    backgroundColor: '#fef2f2',
    borderColor: '#ef4444',
    transform: [{scale: 0.95}],
  },
  space: {
    width: 30,
    height: 70,
    margin: 2,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  spaceWordSelected: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    opacity: 0.8,
  },
  spaceText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: 'bold',
  },
  letterCode: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  letterValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    borderTopColor: 'black',
  },
});

export default AnswerLetter;
