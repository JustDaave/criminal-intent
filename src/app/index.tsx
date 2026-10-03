import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import CrimeRow from "@/components/CrimeRow";
import AppButton from "@/components/AppButton";
import { useTheme } from "@/context/ThemeContext";
import { Crime } from "@/types/crime";
import { getCrimes } from "@/utils/storage";

export default function Index() {
  const { theme } = useTheme();
  const [crimes, setCrimes] = useState<Crime[]>([]);
  const [error, setError] = useState("");

  const loadCrimes = useCallback(async () => {
    try {
      setCrimes(await getCrimes());
      setError("");
    } catch {
      setError("Could not load your crimes. Please try again.");
    }
  }, []);

  useFocusEffect(useCallback(() => { loadCrimes(); }, [loadCrimes]));

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {error ? (
        <View style={styles.empty}>
          <Text style={[styles.message, { color: theme.text }]}>{error}</Text>
          <AppButton title="TRY AGAIN" onPress={loadCrimes} />
        </View>
      ) : (
        <FlatList data={crimes} keyExtractor={(item) => item.id} extraData={theme}
          contentContainerStyle={styles.list} renderItem={({ item }) => <CrimeRow crime={item} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={[styles.heading, { color: theme.text }]}>No crimes yet</Text>
              <Text style={[styles.message, { color: theme.muted }]}>Tap + to record a criminal activity.</Text>
            </View>
          } />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingTop: 4, paddingBottom: 32 },
  empty: { padding: 32, alignItems: "center", gap: 12, marginTop: 64 },
  heading: { fontSize: 22, fontWeight: "bold" },
  message: { fontSize: 16, textAlign: "center", lineHeight: 24 },
});
