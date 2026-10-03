import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import AppButton from "./AppButton";

type Props = { date: string; onSelect: (date: string) => void; onClose: () => void };

export default function DatePickerModal({ date, onSelect, onClose }: Props) {
  const { theme } = useTheme();
  const [selected, setSelected] = useState(new Date(date));
  const [month, setMonth] = useState(new Date(selected.getFullYear(), selected.getMonth(), 1));
  const firstDay = month.getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = Array.from({ length: Math.ceil((firstDay + daysInMonth) / 7) * 7 }, (_, index) => {
    const day = index - firstDay + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });

  function moveMonth(amount: number) {
    setMonth(new Date(month.getFullYear(), month.getMonth() + amount, 1));
  }

  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View accessibilityViewIsModal style={[styles.card, { backgroundColor: theme.background }]}>
          <Text style={[styles.title, { color: theme.text }]}>Pick a Date</Text>
          <View style={styles.monthRow}>
            <Pressable accessibilityRole="button" accessibilityLabel="Previous month" onPress={() => moveMonth(-1)} style={styles.arrow}>
              <Text style={[styles.arrowText, { color: theme.text }]}>‹</Text>
            </Pressable>
            <Text accessibilityLiveRegion="polite" style={[styles.month, { color: theme.text }]}>
              {month.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Next month" onPress={() => moveMonth(1)} style={styles.arrow}>
              <Text style={[styles.arrowText, { color: theme.text }]}>›</Text>
            </Pressable>
          </View>
          <View style={styles.grid}>
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <View key={`weekday-${index}`} style={styles.cell}><Text style={{ color: theme.muted }}>{day}</Text></View>
            ))}
            {cells.map((day, index) => {
              const active = day === selected.getDate() && month.getMonth() === selected.getMonth() && month.getFullYear() === selected.getFullYear();
              return (
                <Pressable key={index} disabled={!day} accessibilityRole="button" accessibilityState={{ selected: active }}
                  accessibilityLabel={day ? new Date(month.getFullYear(), month.getMonth(), day).toDateString() : undefined}
                  onPress={() => day && setSelected(new Date(month.getFullYear(), month.getMonth(), day, 12))}
                  style={[styles.cell, active && { backgroundColor: theme.primary, borderRadius: 6 }]}>
                  <Text style={{ color: active ? "#ffffff" : theme.text }}>{day}</Text>
                </Pressable>
              );
            })}
          </View>
          <AppButton title="SET DATE" onPress={() => onSelect(selected.toISOString())} />
          <Pressable accessibilityRole="button" onPress={onClose} style={styles.cancel}><Text style={{ color: theme.text }}>CANCEL</Text></Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "center", alignItems: "center", padding: 20 },
  card: { width: "100%", maxWidth: 380, borderRadius: 12, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  monthRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  month: { fontSize: 17, fontWeight: "600" },
  arrow: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  arrowText: { fontSize: 30 },
  grid: { flexDirection: "row", flexWrap: "wrap", marginVertical: 12 },
  cell: { width: "14.285714%", minHeight: 44, alignItems: "center", justifyContent: "center" },
  cancel: { minHeight: 44, alignItems: "center", justifyContent: "center", marginTop: 8 },
});
