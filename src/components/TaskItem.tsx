import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";

import { Colors, useColors } from "@/constants/colors";
import { useState } from "react";

export type Task = {
  id: string;
  title: string;
  done: boolean;
  reminderAt?: string; // Optional ISO date string for reminder
  notificationId?: string; // Optional notification ID for canceling
};

export function TaskItem({
  task,
  onToggle,
  onDelete,
  onEdit,
}: {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const colors = useColors();
  const styles = createStyles(colors);

  const save = () => {
    if (draft.trim() === "") {
      setDraft(task.title); // Revert to original title if empty
    } else {
      onEdit(task.id, draft.trim());
    }
    setIsEditing(false);
  };

  return (
    <ReanimatedSwipeable
      containerStyle={styles.card}
      renderRightActions={() => (
        <Pressable
          style={styles.deleteButton}
          onPress={() => onDelete(task.id)}
        >
          <Text style={styles.deleteText}>Ta bort</Text>
        </Pressable>
      )}
    >
      <View style={styles.row}>
        <Pressable
          style={styles.textArea}
          onPress={() => onToggle(task.id)}
          onLongPress={() => setIsEditing(true)}
        >
          <View style={[styles.circle, task.done && styles.circleDone]} />
          {isEditing ? (
            <TextInput
              style={styles.text}
              value={draft}
              onChangeText={setDraft}
              autoFocus
              onSubmitEditing={save}
              onBlur={save}
            />
          ) : (
            <Text style={[styles.text, task.done && styles.doneTask]}>
              {task.title}
            </Text>
          )}
        </Pressable>
      </View>
    </ReanimatedSwipeable>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
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
