import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";

import { Colors, useColors } from "@/constants/colors";
import {
  formatReminder,
  nextAt,
  secondsFromNow,
  tomorrowAt,
} from "@/utils/dates";
import { useState } from "react";

export type Task = {
  id: string;
  title: string;
  done: boolean;
  // Optional so tasks saved before reminders existed are still valid.
  // A string, not a Date: JSON.parse doesn't turn ISO strings back into Dates.
  reminderAt?: string;
  // Needed to cancel the scheduled notification later
  notificationId?: string;
};

export function TaskItem({
  task,
  onToggle,
  onDelete,
  onEdit,
  onSetReminder,
}: {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
  onSetReminder: (id: string, date: Date) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const colors = useColors();
  const styles = createStyles(colors);

  const save = () => {
    if (draft.trim() === "") {
      // Keep the old title, and reset the draft so the next edit isn't empty
      setDraft(task.title);
    } else {
      onEdit(task.id, draft.trim());
    }
    setIsEditing(false);
  };

  const openReminderMenu = () => {
    Alert.alert("Påminn mig", task.title, [
      {
        text: "Om 1 timme",
        onPress: () => onSetReminder(task.id, secondsFromNow(60 * 60)),
      },
      {
        text: "Ikväll 18:00",
        onPress: () => onSetReminder(task.id, nextAt(18)),
      },
      {
        text: "Imorgon 09:00",
        onPress: () => onSetReminder(task.id, tomorrowAt(9)),
      },
      { text: "Avbryt", style: "cancel" },
    ]);
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
          <View style={styles.content}>
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
            {task.reminderAt && (
              <Text style={styles.reminder}>
                🔔 {formatReminder(task.reminderAt)}
              </Text>
            )}
          </View>
        </Pressable>
        {!task.done && (
          <Pressable
            style={styles.bellButton}
            onPress={openReminderMenu}
            hitSlop={8}
          >
            <Text style={styles.bell}>🔔</Text>
          </Pressable>
        )}
      </View>
    </ReanimatedSwipeable>
  );
}

// A function so the styles follow the current light/dark palette
const createStyles = (colors: Colors) =>
  StyleSheet.create({
    // Set on the swipeable container (not the row) so the red delete
    // action behind the row also gets rounded corners
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
    content: {
      flex: 1,
    },
    text: {
      fontSize: 16,
      color: colors.text,
    },
    reminder: {
      marginTop: 2,
      fontSize: 13,
      color: colors.textMuted,
    },
    bellButton: {
      marginLeft: 12,
    },
    bell: {
      fontSize: 18,
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
