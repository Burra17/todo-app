import { Task, TaskItem } from "@/components/TaskItem";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput } from "react-native";

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

  const toggleTask = (id: string) => {
    const updatedTasks = tasklist.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task,
    );
    setTasklist(updatedTasks);
  };

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.list}
      data={tasklist}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TaskItem task={item} onToggle={toggleTask} />}
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
          <Text>
            Antal slutförda uppgifter:{" "}
            {tasklist.filter((task) => task.done).length}
          </Text>
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
