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
      containerStyle={styles.card}
      renderRightActions={() => (
        <Pressable style={styles.deleteButton} onPress={() => onDelete(task.id)}>
          <Text style={styles.deleteText}>Ta bort</Text>
        </Pressable>
      )}
    >
      <View style={styles.row}>
        <Pressable style={styles.textArea} onPress={() => onToggle(task.id)}>
          <View style={[styles.circle, task.done && styles.circleDone]} />
          <Text style={[styles.text, task.done && styles.doneTask]}>
            {task.title}
          </Text>
        </Pressable>
      </View>
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
  },
  textArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 12,
  },
  circleDone: {
    backgroundColor: colors.primary,
  },
  text: {
    flex: 1,
    fontSize: 16,
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
