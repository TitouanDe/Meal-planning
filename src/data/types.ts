export type Ingredient = {
  id: string;
  name: string;
};

export type RecipeIngredient = {
  ingredientId: string;
  portions: number;
};

export type Recipe = {
  id: string;
  name: string;
  ingredients: RecipeIngredient[];
};

export type SelectedRecipe = {
  recipeId: string;
  portions: number;
};