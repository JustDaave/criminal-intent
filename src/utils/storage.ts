import "expo-sqlite/localStorage/install";
import { Crime } from "@/types/crime";

const CRIMES_KEY = "criminal-intent-crimes";
const THEME_KEY = "criminal-intent-theme";

export async function getCrimes(): Promise<Crime[]> {
  const saved = localStorage.getItem(CRIMES_KEY);
  return saved ? JSON.parse(saved) : [];
}

export async function getCrime(id: string) {
  const crimes = await getCrimes();
  return crimes.find((crime) => crime.id === id);
}

// Only the Save button calls this. Form changes stay in component state.
export async function saveCrime(crime: Crime) {
  const crimes = await getCrimes();
  const index = crimes.findIndex((item) => item.id === crime.id);
  if (index === -1) crimes.push(crime);
  else crimes[index] = crime;
  localStorage.setItem(CRIMES_KEY, JSON.stringify(crimes));
}

export async function getSavedTheme() {
  return localStorage.getItem(THEME_KEY);
}

export function saveTheme(name: string) {
  localStorage.setItem(THEME_KEY, name);
}
