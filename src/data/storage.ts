import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from './types';

const RECIPES_KEY = '@meal_planning_recipes';

export async function saveRecipes(recipes: Recipe[]) {
  await AsyncStorage.setItem(
    RECIPES_KEY,
    JSON.stringify(recipes)
  );
}

export async function loadRecipes(): Promise<Recipe[]> {
  const data = await AsyncStorage.getItem(RECIPES_KEY);

  if (!data) {
    return [];
  }

  return JSON.parse(data);
}

export async function clearRecipes() {
  await AsyncStorage.removeItem(RECIPES_KEY);
}