import { Pressable, StyleSheet, Text } from "react-native";
import { useTheme } from "@/context/ThemeContext";

type Props = { title: string; onPress: () => void; disabled?: boolean };

export default function AppButton({ title, onPress, disabled = false }: Props) {
  const { theme } = useTheme();
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}
      style={({ pressed }) => [styles.button, { backgroundColor: theme.primary, opacity: disabled || pressed ? 0.6 : 1 }]}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 48, borderRadius: 4, justifyContent: "center", alignItems: "center", padding: 12 },
  text: { color: "#ffffff", fontSize: 16, fontWeight: "600", textAlign: "center" },
});
