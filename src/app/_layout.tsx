import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import HeaderButtons from "@/components/HeaderButtons";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

export default function RootLayout() {
  return <ThemeProvider><Navigation /></ThemeProvider>;
}

function Navigation() {
  const { theme } = useTheme();
  return (
    <>
      <StatusBar style={theme.dark || theme.headerText === "#ffffff" ? "light" : "dark"} />
      <Stack screenOptions={{
        title: "Criminal Intent",
        headerStyle: { backgroundColor: theme.header },
        headerTintColor: theme.headerText,
        headerTitleStyle: { fontWeight: "bold" },
        headerTitleAlign: "left",
        contentStyle: { backgroundColor: theme.background },
      }}>
        <Stack.Screen name="index" options={{ headerRight: () => <HeaderButtons showAdd /> }} />
        <Stack.Screen name="detail" options={{ headerRight: () => <HeaderButtons /> }} />
        <Stack.Screen name="settings" />
      </Stack>
    </>
  );
}
