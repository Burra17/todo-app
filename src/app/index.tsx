import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput } from "react-native";

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
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.list}
      data={tasklist}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Text>{item.title}</Text>}
      ListHeaderComponent={
        <>
          <TextInput
            style={styles.input}
            placeholder="Lägg till en ny uppgift..."
            value={text}
            onChangeText={setText}
          />
          <Pressable style={styles.button} onPress={addTask}>
            <Text style={styles.buttonText}>Lägg till</Text>
          </Pressable>

          <Text>Antal uppgifter: {tasklist.length}</Text>
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
  },
  button: {
    backgroundColor: "#208AEF",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
