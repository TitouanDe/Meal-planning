import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import {
  loadRecipes,
  saveRecipes,
} from '../data/storage';

import { Recipe } from '../data/types';

export default function HomeScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const [portions, setPortions] = useState<{
    [key: string]: number;
  }>({});

  useFocusEffect(
    useCallback(() => {
      const loadSavedRecipes = async () => {
        const savedRecipes = await loadRecipes();
        setRecipes(savedRecipes);
      };

      loadSavedRecipes();
    }, [])
  );

  const changePortions = (
    recipeId: string,
    amount: number
  ) => {
    setPortions((current) => {
      const currentValue = current[recipeId] ?? 0;

      const newValue = Math.max(
        0,
        currentValue + amount
      );

      return {
        ...current,
        [recipeId]: newValue,
      };
    });
  };

  const deleteRecipe = async (recipeId: string) => {
    const updatedRecipes = recipes.filter(
      (recipe) => recipe.id !== recipeId
    );

    setRecipes(updatedRecipes);

    await saveRecipes(updatedRecipes);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Meal Planning
      </Text>

      <Text style={styles.subtitle}>
        Mes recettes
      </Text>

      <ScrollView style={styles.list}>
        {recipes.length === 0 && (
          <Text style={styles.emptyText}>
            Aucune recette pour le moment.
          </Text>
        )}

        {recipes.map((recipe) => {
          const recipePortions =
            portions[recipe.id] ?? 0;

          return (
            <View
              key={recipe.id}
              style={styles.recipeCard}
            >
              <View>
                <Text style={styles.recipeName}>
                  {recipe.name}
                </Text>

                {recipePortions > 0 && (
                  <Text style={styles.portionText}>
                    {recipePortions} portion
                    {recipePortions > 1
                      ? 's'
                      : ''}
                  </Text>
                )}
              </View>

              <View style={styles.rightSection}>
                <View style={styles.counter}>
                  <Pressable
                    style={styles.counterButton}
                    onPress={() =>
                      changePortions(
                        recipe.id,
                        -1
                      )
                    }
                  >
                    <Text
                      style={
                        styles.counterButtonText
                      }
                    >
                      −
                    </Text>
                  </Pressable>

                  <Text style={styles.counterValue}>
                    {recipePortions}
                  </Text>

                  <Pressable
                    style={styles.counterButton}
                    onPress={() =>
                      changePortions(
                        recipe.id,
                        1
                      )
                    }
                  >
                    <Text
                      style={
                        styles.counterButtonText
                      }
                    >
                      +
                    </Text>
                  </Pressable>
                </View>

                <Pressable
                  onPress={() =>
                    deleteRecipe(recipe.id)
                  }
                >
                  <Text style={styles.deleteText}>
                    🗑️
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View>
        <Pressable
          style={styles.ingredientButton}
          onPress={() =>
            router.push('/ingredients')
          }
        >
          <Text style={styles.ingredientButtonText}>
            🥕 Mes ingrédients
          </Text>
        </Pressable>

        <Pressable
          style={styles.addButton}
          onPress={() =>
            router.push('/recipe')
          }
        >
          <Text style={styles.addButtonText}>
            + Nouvelle recette
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    paddingTop: 70,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 20,
    color: '#666',
    marginBottom: 24,
  },

  list: {
    flex: 1,
  },

  recipeCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  recipeName: {
    fontSize: 18,
    fontWeight: '600',
  },

  portionText: {
    marginTop: 5,
    color: '#666',
  },

  rightSection: {
    alignItems: 'center',
    gap: 8,
  },

  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  counterButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },

  counterButtonText: {
    fontSize: 24,
  },

  counterValue: {
    fontSize: 18,
    fontWeight: '600',
    minWidth: 20,
    textAlign: 'center',
  },

  deleteText: {
    fontSize: 20,
  },

  emptyText: {
    textAlign: 'center',
    color: '#777',
    fontSize: 16,
    marginTop: 40,
  },

  ingredientButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
  },

  ingredientButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },

  addButton: {
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});