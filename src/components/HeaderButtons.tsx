import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";

export default function HeaderButtons({ showAdd = false }: { showAdd?: boolean }) {
  const { theme } = useTheme();
  return (
    <View style={styles.buttons}>
      {showAdd && (
        <Pressable accessibilityRole="button" accessibilityLabel="Add crime" style={styles.button} onPress={() => router.push("/detail")}>
          <MaterialCommunityIcons name="plus" size={30} color={theme.headerText} />
        </Pressable>
      )}
      <Pressable accessibilityRole="button" accessibilityLabel="Settings" style={styles.button} onPress={() => router.push("/settings")}>
        <MaterialCommunityIcons name="cog-outline" size={26} color={theme.headerText} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: { flexDirection: "row", alignItems: "center" },
  button: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
});
