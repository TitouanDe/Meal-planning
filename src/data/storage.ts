import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ingredient, Recipe } from './types';

const RECIPES_KEY = '@meal_planning_recipes';
const INGREDIENTS_KEY = '@meal_planning_ingredients';

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

export async function saveIngredients(
  ingredients: Ingredient[]
) {
  await AsyncStorage.setItem(
    INGREDIENTS_KEY,
    JSON.stringify(ingredients)
  );
}

export async function loadIngredients(): Promise<Ingredient[]> {
  const data = await AsyncStorage.getItem(INGREDIENTS_KEY);

  if (!data) {
    return [];
  }

  return JSON.parse(data);
}