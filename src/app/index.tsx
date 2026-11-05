import { Task, TaskItem } from "@/components/TaskItem";
import { Colors, useColors } from "@/constants/colors";
import * as Notifications from "expo-notifications";
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

type Filter = "all" | "active" | "done";

const FILTER_LABELS: Record<Filter, string> = {
  all: "Alla",
  active: "Aktiva",
  done: "Klara",
};

const EMPTY_MESSAGES: Record<Filter, string> = {
  all: "Inga uppgifter än. Lägg till en ny uppgift!",
  active: "Inget kvar att göra 🎉",
  done: "Inga klara uppgifter än. Bocka av en uppgift så hamnar den här.",
};

export default function Index() {
  const [text, setText] = useState("");
  const [tasklist, setTasklist] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const colors = useColors();
  const styles = createStyles(colors);

  const visibleTasks = tasklist.filter((task) => {
    if (filter === "active") {
      return !task.done;
    } else if (filter === "done") {
      return task.done;
    }
    return true;
  });

  useEffect(() => {
    const requestNotificationPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.warn("Notification permissions not granted");
      }
    };

    requestNotificationPermission();
  }, []);

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

  // Cancel notification when task is marked as done or deleted
  const cancelReminder = async (task: Task) => {
    if (!task.notificationId) {
      return;
    }
    try {
      await Notifications.cancelScheduledNotificationAsync(task.notificationId);
    } catch (error) {
      console.warn("Failed to cancel reminder:", error);
    }
  };

  const toggleTask = (id: string) => {
    const taskToToggle = tasklist.find((task) => task.id === id);
    const isBecomingDone = taskToToggle !== undefined && !taskToToggle.done;

    if (isBecomingDone) {
      cancelReminder(taskToToggle);
    }

    const updatedTasks = tasklist.map((task) => {
      if (task.id !== id) {
        return task;
      }
      if (isBecomingDone) {
        return {
          ...task,
          done: true,
          reminderAt: undefined,
          notificationId: undefined,
        };
      }
      return { ...task, done: false };
    });
    setTasklist(updatedTasks);
  };

  const editTask = (id: string, newTitle: string) => {
    const updatedTasks = tasklist.map((task) =>
      task.id === id ? { ...task, title: newTitle } : task,
    );
    setTasklist(updatedTasks);
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasklist.find((task) => task.id === id);
    if (taskToDelete) {
      cancelReminder(taskToDelete);
    }
    const updatedTasks = tasklist.filter((task) => task.id !== id);
    setTasklist(updatedTasks);
  };

  const setReminder = async (id: string, date: Date) => {
    const taskIndex = tasklist.findIndex((task) => task.id === id);
    if (taskIndex === -1) return;

    // Cancel existing notification if it exists
    const existingNotificationId = tasklist[taskIndex].notificationId;
    if (existingNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(
        existingNotificationId,
      );
    }

    // Schedule new notification
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Påminnelse",
        body: `Det är dags att göra: ${tasklist[taskIndex].title}`,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date,
      },
    });

    // Update task with reminder and notification ID
    setTasklist((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, reminderAt: date.toISOString(), notificationId }
          : task,
      ),
    );
  };

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      style={styles.screen}
      contentContainerStyle={styles.list}
      data={visibleTasks}
      ListEmptyComponent={() => (
        <Text style={styles.emptyText}>{EMPTY_MESSAGES[filter]}</Text>
      )}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TaskItem
          task={item}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={editTask}
          onSetReminder={setReminder}
        />
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
              {tasklist.filter((task) => task.done).length} av {tasklist.length}{" "}
              klara
            </Text>
          )}

          <View style={styles.filterRow}>
            {(Object.keys(FILTER_LABELS) as Filter[]).map((value) => (
              <Pressable
                key={value}
                style={[
                  styles.filterButton,
                  filter === value && styles.filterButtonActive,
                ]}
                onPress={() => setFilter(value)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filter === value && styles.filterButtonTextActive,
                  ]}
                >
                  {FILTER_LABELS[value]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      }
    />
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
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
    filterRow: {
      flexDirection: "row",
      gap: 8,
      marginTop: 12,
    },
    filterButton: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: 12,
      alignItems: "center",
      backgroundColor: colors.surface,
    },
    filterButtonActive: {
      backgroundColor: colors.primary,
    },
    filterButtonText: {
      color: colors.text,
    },
    filterButtonTextActive: {
      color: colors.onPrimary,
      fontWeight: "bold",
    },
  });
