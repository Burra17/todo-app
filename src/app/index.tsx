import { Task, TaskItem } from "@/components/TaskItem";
import { colors } from "@/constants/colors";
import { Storage } from "expo-sqlite/kv-store";
import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Index() {
  const [text, setText] = useState("");
  const [tasklist, setTasklist] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await Storage.getItem("tasks");
        if (storedTasks) {
          setTasklist(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.warn("Failed to load tasks:", error);
      }
      setIsLoaded(true);
    };

    loadTasks();
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    Storage.setItem("tasks", JSON.stringify(tasklist)).catch((error) =>
      console.warn("Failed to save tasks:", error),
    );
  }, [tasklist, isLoaded]);

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

  const deleteTask = (id: string) => {
    const updatedTasks = tasklist.filter((task) => task.id !== id);
    setTasklist(updatedTasks);
  };

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      style={styles.screen}
      contentContainerStyle={styles.list}
      data={tasklist}
      ListEmptyComponent={() => (
        <Text style={styles.emptyText}>
          Inga uppgifter än. Lägg till en ny uppgift!
        </Text>
      )}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TaskItem task={item} onToggle={toggleTask} onDelete={deleteTask} />
      )}
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Lägg till en ny uppgift..."
              value={text}
              onChangeText={setText}
              onSubmitEditing={addTask}
              returnKeyType="done"
            />
            <Pressable style={styles.button} onPress={addTask}>
              <Text style={styles.buttonText}>Lägg till</Text>
            </Pressable>
          </View>

          {tasklist.length > 0 && (
            <Text style={styles.counter}>
              {tasklist.filter((task) => task.done).length} av{" "}
              {tasklist.length} klara
            </Text>
          )}
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
  },
  list: {
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: "center",
  },
  counter: {
    marginTop: 12,
    color: colors.textMuted,
  },
  buttonText: {
    color: colors.onPrimary,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: colors.textMuted,
  },
});
