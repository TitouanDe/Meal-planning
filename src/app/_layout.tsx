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

      <Stack.Screen
        name="ingredients"
        options={{
          title: 'Mes ingrédients',
        }}
      />

      <Stack.Screen
        name="shopping"
        options={{
          title: 'Liste de courses',
        }}
      />

    </Stack>
  );
}