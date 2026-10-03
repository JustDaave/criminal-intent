import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Crime } from "@/types/crime";

export default function CrimeRow({ crime }: { crime: Crime }) {
  const { theme } = useTheme();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${crime.title}, ${crime.solved ? "solved" : "unsolved"}`}
      onPress={() => router.push({ pathname: "/detail", params: { id: crime.id } })}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: theme.surface }]}>
      <View style={styles.info}>
        <Text style={[styles.title, { color: theme.text }]}>{crime.title}</Text>
        <Text style={[styles.date, { color: theme.muted }]}>{crime.date}</Text>
      </View>
      {crime.solved && <MaterialCommunityIcons name="handcuffs" size={28} color={theme.text} style={styles.icon} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 18 },
  info: { flex: 1 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  date: { fontSize: 14 },
  icon: { marginLeft: 12 },
});
