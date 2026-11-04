import { Pressable, StyleSheet, Text, View } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";

import { colors } from "@/constants/colors";

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
          <Text style={[styles.text, task.done && styles.doneTask]}>
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
    backgroundColor: colors.surface,
  },
  textArea: {
    flex: 1,
  },
  text: {
    color: colors.text,
  },
  doneTask: {
    textDecorationLine: "line-through",
    color: colors.textMuted,
  },
  deleteButton: {
    backgroundColor: colors.danger,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  deleteText: {
    color: colors.onPrimary,
    fontWeight: "bold",
  },
});
