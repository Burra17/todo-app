import { Pressable, StyleSheet, Text, View } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";

export type Task = {
  id: string;
  title: string;
  done: boolean;
};

export function TaskItem({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <ReanimatedSwipeable
      renderRightActions={() => (
        <Pressable style={styles.deleteButton} onPress={() => onDelete(task.id)}>
          <Text style={styles.deleteText}>Ta bort</Text>
        </Pressable>
      )}
    >
      <View style={styles.row}>
        <Pressable style={styles.textArea} onPress={() => onToggle(task.id)}>
          <Text style={task.done ? styles.doneTask : undefined}>
            {task.title}
          </Text>
        </Pressable>
      </View>
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "white",
  },
  textArea: {
    flex: 1,
  },
  doneTask: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
});
