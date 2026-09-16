import { router } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { loadRecipes, saveRecipes } from '../data/storage';
import { Recipe } from '../data/types';

import { useState } from 'react';
import { initialIngredients } from '../data/initialData';

export default function RecipeScreen() {
  const [name, setName] = useState('');

  const [ingredientPortions, setIngredientPortions] = useState<{
    [key: string]: number;
  }>({});

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

    const ingredients = Object.entries(ingredientPortions)
      .filter(([_, portions]) => portions > 0)
      .map(([ingredientId, portions]) => ({
        ingredientId,
        portions,
    }));

    const newRecipe: Recipe = {
      id: Date.now().toString(),
      name: name.trim(),
      ingredients,
    };

    const existingRecipes = await loadRecipes();

    await saveRecipes([
      ...existingRecipes,
      newRecipe,
    ]);

    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nouvelle recette</Text>

      <Text style={styles.label}>Nom de la recette</Text>

      <TextInput
        style={styles.input}
        placeholder="Ex : Carbonara"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Ingrédients</Text>

      <ScrollView style={styles.ingredientsList}>
        {initialIngredients.map((ingredient) => {
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    paddingTop: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 24,
  },

  ingredientsList: {
    flex: 1,
  },

  ingredient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    marginBottom: 8,
  },

  ingredientSelected: {
    borderColor: '#333',
  },

  ingredientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 6,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxSelected: {
    backgroundColor: '#333',
    borderColor: '#333',
  },

  check: {
    color: '#fff',
    fontWeight: 'bold',
  },

  ingredientName: {
    fontSize: 16,
  },

  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  counterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },

  counterButtonText: {
    fontSize: 20,
  },

  counterValue: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 18,
    textAlign: 'center',
  },

  saveButton: {
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 16,
  },

  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});