import {
  router,
  Stack,
  useLocalSearchParams,
} from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  loadIngredients,
  loadRecipes,
  saveRecipes,
} from '../data/storage';

import { Ingredient, Recipe } from '../data/types';

import { useEffect, useState } from 'react';

export default function RecipeScreen() {

  const { recipeId } =
    useLocalSearchParams<{
      recipeId?: string;
  }>();

  const isEditing =
    typeof recipeId === 'string' &&
    recipeId.length > 0;

  const [name, setName] = useState('');

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const [ingredientPortions, setIngredientPortions] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    const loadData = async () => {
      const savedIngredients =
        await loadIngredients();

      setIngredients(savedIngredients);

      if (isEditing) {
        const savedRecipes =
          await loadRecipes();

        const recipeToEdit =
          savedRecipes.find(
            (recipe) =>
              recipe.id === recipeId
          );

        if (recipeToEdit) {
          setName(recipeToEdit.name);

          const savedPortions: {
            [key: string]: number;
          } = {};

          recipeToEdit.ingredients.forEach(
            (ingredient) => {
              savedPortions[
                ingredient.ingredientId
              ] = ingredient.portions;
            }
          );

          setIngredientPortions(
            savedPortions
          );
        }
      }
    };

    loadData();
  }, [recipeId, isEditing]);

  const changeIngredientPortions = (
    ingredientId: string,
    amount: number
  ) => {
    setIngredientPortions((current) => {
      const currentValue = current[ingredientId] ?? 0;
      const newValue = Math.max(0, currentValue + amount);

      return {
        ...current,
        [ingredientId]: newValue,
      };
    });
  };

  const saveRecipe = async () => {
    if (name.trim() === '') {
      return;
    }

    const recipeIngredients =
      Object.entries(ingredientPortions)
        .filter(([_, portions]) => portions > 0)
        .map(([ingredientId, portions]) => ({
          ingredientId,
          portions,
        }));

    const existingRecipes =
      await loadRecipes();

    if (isEditing) {
      const updatedRecipes =
        existingRecipes.map((recipe) =>
          recipe.id === recipeId
            ? {
                ...recipe,
                name: name.trim(),
                ingredients:
                  recipeIngredients,
              }
            : recipe
        );

      await saveRecipes(
        updatedRecipes
      );
    } else {
      const newRecipe: Recipe = {
        id: Date.now().toString(),
        name: name.trim(),
        ingredients:
          recipeIngredients,
      };

      await saveRecipes([
        ...existingRecipes,
        newRecipe,
      ]);
    }

    router.back();
  };

  return (

    <>
    <Stack.Screen
      options={{
        title: isEditing
          ? 'Modifier la recette'
          : 'Nouvelle recette',
      }}
    />

    <View style={styles.container}>
      <Text style={styles.title}>
        {isEditing
          ? 'Modifier la recette'
          : 'Nouvelle recette'}
      </Text>

      <Text style={styles.label}>Nom de la recette</Text>

      <TextInput
        style={styles.input}
        placeholder="Ex : Carbonara"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Ingrédients</Text>

      <ScrollView
        style={styles.ingredientsList}
        keyboardShouldPersistTaps="handled"
      >
        {ingredients.map((ingredient) => {
          const portions = ingredientPortions[ingredient.id] ?? 0;
          const selected = portions > 0;

          return (
            <View
              key={ingredient.id}
              style={[
                styles.ingredient,
                selected && styles.ingredientSelected,
              ]}
            >
              <Pressable
                style={styles.ingredientInfo}
                onPress={() =>
                  changeIngredientPortions(
                    ingredient.id,
                    selected ? -portions : 1
                  )
                }
              >
                <View
                  style={[
                    styles.checkbox,
                    selected && styles.checkboxSelected,
                  ]}
                >
                  {selected && <Text style={styles.check}>✓</Text>}
                </View>

                <Text style={styles.ingredientName}>
                  {ingredient.name}
                </Text>
              </Pressable>

              {selected && (
                <View style={styles.counter}>
                  <Pressable
                    style={styles.counterButton}
                    onPress={() =>
                      changeIngredientPortions(ingredient.id, -1)
                    }
                  >
                    <Text style={styles.counterButtonText}>−</Text>
                  </Pressable>

                  <Text style={styles.counterValue}>
                    {portions}
                  </Text>

                  <Pressable
                    style={styles.counterButton}
                    onPress={() =>
                      changeIngredientPortions(ingredient.id, 1)
                    }
                  >
                    <Text style={styles.counterButtonText}>+</Text>
                  </Pressable>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      <Pressable
        style={styles.saveButton}
        onPress={saveRecipe}
      >
        <Text style={styles.saveButtonText}>
          Enregistrer la recette
        </Text>
      </Pressable>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F5',
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1F2A1F',
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2A1F',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E5DE',
    borderRadius: 16,
    height: 54,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
  },

  ingredientsList: {
    flex: 1,
  },

  ingredient: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E4E8E1',
  },

  ingredientSelected: {
    borderColor: '#B8D4B9',
    backgroundColor: '#F1F7F1',
  },

  ingredientInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#C8CEC8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
  },

  checkboxSelected: {
    backgroundColor: '#2F7D32',
    borderColor: '#2F7D32',
  },

  check: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },

  ingredientName: {
    flex: 1,
    fontSize: 17,
    color: '#1F2A1F',
    fontWeight: '600',
  },

  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  counterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2EA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  counterButtonText: {
    fontSize: 22,
    color: '#2F7D32',
  },

  counterValue: {
    minWidth: 24,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2A1F',
  },

  saveButton: {
    backgroundColor: '#2F7D32',
    padding: 17,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 12,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});