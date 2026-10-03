import { useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeName, themes, useTheme } from "@/context/ThemeContext";

export default function Settings() {
  const { name, theme, changeTheme } = useTheme();
  const [error, setError] = useState("");
  const insets = useSafeAreaInsets();

  function pickTheme(next: ThemeName) {
    try {
      changeTheme(next);
      setError("");
    } catch {
      setError("Could not save your theme. Please try again.");
    }
  }

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 32 }]}>
      <View style={styles.options}>
        <Text style={[styles.title, { color: theme.text }]}>Pick a Theme</Text>
        {(Object.keys(themes) as ThemeName[]).map((option) => (
          <Pressable key={option} accessibilityRole="button" accessibilityState={{ selected: name === option }}
            onPress={() => pickTheme(option)}
            style={({ pressed }) => [styles.option, { backgroundColor: theme.surface, borderColor: name === option ? theme.primary : theme.border, opacity: pressed ? 0.7 : 1 }]}>
            <View style={[styles.swatch, { backgroundColor: themes[option].header, borderColor: theme.border }]} />
            <Text style={[styles.label, { color: theme.text }]}>{option}</Text>
            {name === option && <MaterialCommunityIcons name="check" color={theme.text} size={24} />}
          </Pressable>
        ))}
        {error ? <Text accessibilityLiveRegion="polite" style={{ color: theme.text }}>{error}</Text> : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: 32 },
  options: { width: "100%", maxWidth: 480, alignSelf: "center", gap: 18 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 8 },
  option: { flexDirection: "row", alignItems: "center", minHeight: 56, padding: 16, borderRadius: 8, borderWidth: 1 },
  label: { flex: 1, fontSize: 20 },
  swatch: { width: 22, height: 22, borderRadius: 11, borderWidth: 1, marginRight: 16 },
});
