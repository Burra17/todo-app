import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Task = {
  id: string;
  title: string;
  done: boolean;
};

export default function Index() {
  const [text, setText] = useState("");
  const [tasklist, setTasklist] = useState<Task[]>([]);

  const addTask = () => {
    if (text.trim() === "") {
      return;
    }

    const newTask: Task = {
      id: Math.random().toString(),
      title: text,
      done: false,
    };
    setTasklist([...tasklist, newTask]);
    setText("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Lägg till en ny uppgift..."
        value={text}
        onChangeText={setText}
      />
      <Pressable onPress={addTask}>
        <Text>lägg till</Text>
      </Pressable>

      <Text>Antal uppgifter: {tasklist.length}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
