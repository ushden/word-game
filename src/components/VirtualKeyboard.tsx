import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getRelevantLetters } from "../utils";

interface VirtualKeyboardProps {
  onLetterPress: (letter: string) => void;
  level: any;
  discoveredLetters: Record<number, string>;
  disabled?: boolean;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onLetterPress,
  level,
  discoveredLetters,
  disabled = false,
}) => {
  const relevantLetters = getRelevantLetters(level);

  return (
    <View style={[styles.keyboard, disabled && styles.keyboardDisabled]}>
      <Text style={styles.keyboardTitle}>Оберіть літеру:</Text>

      <View style={styles.keyboardGrid}>
        {relevantLetters.map((letter) => {
          const isDiscovered =
            Object.values(discoveredLetters).includes(letter);

          return (
            <TouchableOpacity
              key={letter}
              style={[
                styles.keyButton,
                isDiscovered && styles.keyButtonDiscovered,
                disabled && styles.keyButtonDisabled,
              ]}
              onPress={() => !disabled && onLetterPress(letter)}
              disabled={disabled}
            >
              <Text
                style={[styles.keyText, disabled && styles.keyTextDisabled]}
              >
                {letter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  keyboard: {
    marginTop: "auto",
    backgroundColor: "#f1f5f9",
    padding: 20,
    borderRadius: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  keyboardTitle: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
    color: "#475569",
    fontWeight: "600",
  },
  keyboardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 15,
  },
  keyButton: {
    width: 44,
    height: 44,
    margin: 4,
    backgroundColor: "white",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  keyButtonDiscovered: {
    backgroundColor: "#e0e7ff",
    borderColor: "#4f46e5",
    transform: [{ scale: 0.95 }],
  },
  keyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  keyboardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
    padding: 12,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#475569",
  },
  keyboardDisabled: {
    opacity: 0.6,
  },
  keyButtonDisabled: {
    backgroundColor: "#f1f5f9",
  },
  keyTextDisabled: {
    color: "#94a3b8",
  },
});

export default VirtualKeyboard;
