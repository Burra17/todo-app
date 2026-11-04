import { Pressable, StyleSheet, Text } from "react-native";

export type Task = {
  id: string;
  title: string;
  done: boolean;
};

export function TaskItem({
  task,
  onToggle,
}: {
  task: Task;
  onToggle: (id: string) => void;
}) {
  return (
    <Pressable style={styles.row} onPress={() => onToggle(task.id)}>
      <Text style={task.done ? styles.doneTask : undefined}>{task.title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 12,
  },
  doneTask: {
    textDecorationLine: "line-through",
    color: "#999",
  },
});
