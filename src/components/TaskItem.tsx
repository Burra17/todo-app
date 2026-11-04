import { Pressable, StyleSheet, Text, View } from "react-native";

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
    <View style={styles.row}>
      <Pressable style={styles.textArea} onPress={() => onToggle(task.id)}>
        <Text style={task.done ? styles.doneTask : undefined}>
          {task.title}
        </Text>
      </Pressable>
      <Pressable onPress={() => onDelete(task.id)}>
        <Text style={styles.deleteText}>Ta bort</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  textArea: {
    flex: 1,
  },
  doneTask: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  deleteText: {
    marginLeft: 10,
    color: "red",
    fontWeight: "bold",
  },
});
