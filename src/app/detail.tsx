import { useEffect, useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { randomUUID } from "expo-crypto";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { useHeaderHeight } from "expo-router/react-navigation";
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppButton from "@/components/AppButton";
import DatePickerModal from "@/components/DatePickerModal";
import { useTheme } from "@/context/ThemeContext";
import { Crime } from "@/types/crime";
import { getCrime, saveCrime } from "@/utils/storage";
import { storePhoto } from "@/utils/photo";

export default function Detail() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const [crime, setCrime] = useState<Crime | null>(null);
  const [loadError, setLoadError] = useState("");
  const [message, setMessage] = useState("");
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadCrime() {
      try {
        const saved = id ? await getCrime(id) : undefined;
        if (!active) return;
        if (id && !saved) {
          setLoadError("This crime could not be found.");
          return;
        }
        setCrime(saved ?? { id: randomUUID(), title: "", details: "", date: new Date().toISOString(), solved: false, photo: null });
        setLoadError("");
      } catch {
        if (active) setLoadError("Could not load this crime. Go back and try again.");
      }
    }
    loadCrime();
    return () => { active = false; };
  }, [id]);

  function updateCrime(changes: Partial<Crime>) {
    setCrime((current) => current ? { ...current, ...changes } : current);
    setMessage("");
  }

  async function pickPhoto() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.7, base64: Platform.OS === "web" });
      if (!result.canceled) {
        const photo = result.assets[0];
        const uri = Platform.OS === "web" && photo.base64 ? `data:${photo.mimeType || "image/jpeg"};base64,${photo.base64}` : photo.uri;
        updateCrime({ photo: uri });
      }
    } catch {
      setMessage("Could not select a photo. Please try again.");
    }
  }

  async function save() {
    if (!crime || saving) return;
    if (!crime.title.trim()) {
      setMessage("Please enter a title before saving.");
      return;
    }
    setSaving(true);
    try {
      const saved = { ...crime, title: crime.title.trim(), photo: crime.photo ? storePhoto(crime.photo) : null };
      await saveCrime(saved);
      setCrime(saved);
      setMessage("Crime saved successfully.");
    } catch {
      setMessage("Could not save the crime. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!crime) return <View style={[styles.container, { backgroundColor: theme.background }]}><Text style={{ padding: 24, color: theme.text }}>{loadError || "Loading…"}</Text></View>;

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: theme.background }]} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={headerHeight}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.form, { paddingBottom: insets.bottom + 32 }]}>
        <View style={styles.topRow}>
          <View style={styles.photoColumn}>
            {crime.photo ? <Image source={{ uri: crime.photo }} accessibilityLabel="Crime photo" style={styles.photo} /> : <View style={[styles.photo, { backgroundColor: theme.surface }]} />}
            <Pressable accessibilityRole="button" accessibilityLabel="Choose crime photo from library" onPress={pickPhoto}
              style={({ pressed }) => [styles.camera, { backgroundColor: theme.surface, opacity: pressed ? 0.6 : 1 }]}>
              <MaterialCommunityIcons name="camera" size={30} color={theme.text} />
            </Pressable>
          </View>
          <View style={styles.titleColumn}>
            <Text style={[styles.title, { color: theme.text }]}>Title</Text>
            <TextInput accessibilityLabel="Crime title" placeholder="Title" placeholderTextColor={theme.muted} value={crime.title} onChangeText={(title) => updateCrime({ title })}
              style={[styles.titleInput, { color: theme.text, borderColor: theme.border }]} />
          </View>
        </View>
        <Text style={[styles.label, { color: theme.text }]}>Details</Text>
        <TextInput accessibilityLabel="Crime details" multiline textAlignVertical="top" placeholder="What happened?" placeholderTextColor={theme.muted}
          value={crime.details} onChangeText={(details) => updateCrime({ details })}
          style={[styles.details, { color: theme.text, borderColor: theme.border }]} />
        <AppButton title={new Date(crime.date).toDateString().toUpperCase()} onPress={() => setDatePickerOpen(true)} />
        <Pressable accessibilityRole="checkbox" accessibilityLabel="Solved" accessibilityState={{ checked: crime.solved }} onPress={() => updateCrime({ solved: !crime.solved })} style={styles.solved}>
          <MaterialCommunityIcons name={crime.solved ? "checkbox-marked" : "checkbox-blank-outline"} size={28} color={crime.solved ? theme.primary : theme.muted} />
          <Text style={[styles.solvedText, { color: theme.text }]}>Solved</Text>
        </Pressable>
        <AppButton title={saving ? "SAVING…" : "SAVE"} onPress={save} disabled={saving} />
        {message ? <Text accessibilityLiveRegion="polite" style={[styles.message, { color: theme.text }]}>{message}</Text> : null}
      </ScrollView>
      {datePickerOpen && <DatePickerModal date={crime.date} onClose={() => setDatePickerOpen(false)} onSelect={(date) => { updateCrime({ date }); setDatePickerOpen(false); }} />}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  form: { padding: 16, gap: 16, width: "100%", maxWidth: 640, alignSelf: "center" },
  topRow: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 20 },
  photoColumn: { width: "28%", gap: 8 },
  photo: { width: "100%", aspectRatio: 1 },
  camera: { minHeight: 44, alignItems: "center", justifyContent: "center", borderRadius: 4 },
  titleColumn: { flex: 1 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 12 },
  titleInput: { fontSize: 18, minHeight: 48, borderBottomWidth: 1, paddingHorizontal: 4 },
  label: { fontSize: 20, fontWeight: "bold" },
  details: { minHeight: 120, borderWidth: 1, padding: 12, fontSize: 16 },
  solved: { minHeight: 44, flexDirection: "row", alignItems: "center", gap: 8 },
  solvedText: { fontSize: 18 },
  message: { fontSize: 16, lineHeight: 24 },
});
