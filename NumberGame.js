import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export default function NumberGame() {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    generateNumbers();
  }, []);

  function generateNumbers() {
    const n1 = Math.floor(Math.random() * 100);
    const n2 = Math.floor(Math.random() * 100);
    setNum1(n1);
    setNum2(n2);
  }

  async function saveScore(finalScore) {
    try {
      await addDoc(collection(db, "scores"), {
        score: finalScore,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error al guardar la puntuación: ", error);
    }
  }

  function checkAnswer(selected, other) {
    if (selected > other) {
      setScore(score + 1);
      generateNumbers();
    } else {
      Alert.alert("Juego terminado!", `Puntuación: ${score}`);
      saveScore(score);
      setScore(0);
      generateNumbers();
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Juego de Números</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#3B82F6' }]}
          onPress={() => checkAnswer(num1, num2)}
        >
          <Text style={styles.buttonText}>{num1}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#EF4444' }]}
          onPress={() => checkAnswer(num2, num1)}
        >
          <Text style={styles.buttonText}>{num2}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.score}>Puntuación: {score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  buttonsContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  button: {
    padding: 24,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 24,
  },
  score: {
    fontSize: 18,
  },
});
