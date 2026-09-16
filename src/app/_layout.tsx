import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Meal Planning',
        }}
      />

      <Stack.Screen
        name="recipe"
        options={{
          title: 'Nouvelle recette',
        }}
      />
    </Stack>
  );
}