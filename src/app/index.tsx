import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Stack } from "expo-router";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";

// Sample crimes for now. Local storage will be added later.
const crimes = [
  { id: "1", title: "Criminal Activity 4", date: "2025-01-30T13:13:43.639Z", solved: true },
  { id: "2", title: "Criminal Activity 2", date: "2025-01-24T21:44:40.415Z", solved: false },
  { id: "3", title: "Criminal Activity 1", date: "2025-01-03T02:14:54.649Z", solved: false },
  { id: "4", title: "Testing", date: "2025-02-18T22:05:05.951Z", solved: true },
  { id: "5", title: "Criminal Activity 3", date: "2024-11-09T13:52:11.246Z", solved: true },
  { id: "6", title: "New 2~!", date: "2025-02-18T21:59:04.778Z", solved: true },
  { id: "7", title: "New!", date: "2025-02-18T21:58:44.900Z", solved: false },
  { id: "8", title: "Criminal Activity 5", date: "2025-01-11T16:59:08.202Z", solved: true },
];

export default function Index() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Criminal Intent",
          headerStyle: { backgroundColor: "#710ca8" },
          headerTintColor: "white",
          headerTitleStyle: { fontWeight: "bold" },
          headerTitleAlign: "left",
          headerRight: () => (
            <View style={styles.headerButtons}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Add crime"
                style={styles.headerButton}
                onPress={() => Alert.alert("New Crime", "The detail screen will be added later.")}
              >
                <Text style={styles.plus}>+</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Settings"
                style={styles.headerButton}
                onPress={() => Alert.alert("Settings", "The settings screen will be added later.")}
              >
                <Text style={styles.settings}>⚙</Text>
              </Pressable>
            </View>
          ),
        }}
      />
      <FlatList
        data={crimes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${item.title}, ${item.solved ? "solved" : "unsolved"}`}
            onPress={() => Alert.alert(item.title, "The detail screen will be added later.")}
            style={({ pressed }) => [styles.row, pressed && styles.pressedRow]}
          >
            <View style={styles.crimeInfo}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            {item.solved && (
              <MaterialCommunityIcons
                name="handcuffs"
                size={28}
                color="#111"
                style={styles.handcuffs}
                accessibilityLabel="Solved"
              />
            )}
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  headerButtons: { flexDirection: "row", alignItems: "center" },
  headerButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  plus: { color: "white", fontSize: 36, fontWeight: "300" },
  settings: { color: "white", fontSize: 25 },
  list: { paddingTop: 4, paddingBottom: 24 },
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 16 },
  pressedRow: { backgroundColor: "#e4e4e4" },
  crimeInfo: { flex: 1 },
  title: { fontSize: 20, fontWeight: "bold", color: "#111", marginBottom: 8 },
  date: { fontSize: 15, color: "#111" },
  handcuffs: { marginLeft: 12 },
});
