import {
  Alert,
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
  loadSelectedRecipes,
  saveRecipes,
  saveSelectedRecipes,
} from '../data/storage';

import { Recipe } from '../data/types';

export default function HomeScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const [portions, setPortions] = useState<{
    [key: string]: number;
  }>({});

  useFocusEffect(
    useCallback(() => {
      const loadSavedData = async () => {
        const savedRecipes = await loadRecipes();
        const savedSelectedRecipes =
          await loadSelectedRecipes();

        setRecipes(savedRecipes);

        const savedPortions: {
          [key: string]: number;
        } = {};

        savedSelectedRecipes.forEach((item) => {
          savedPortions[item.recipeId] = item.portions;
        });

        setPortions(savedPortions);
      };

      loadSavedData();
    }, [])
  );

  const changePortions = async (
    recipeId: string,
    amount: number
  ) => {
    setPortions((current) => {
      const currentValue = current[recipeId] ?? 0;

      const newValue = Math.max(
        0,
        currentValue + amount
      );

      const updatedPortions = {
        ...current,
        [recipeId]: newValue,
      };

      const selectedRecipes = Object.entries(
        updatedPortions
      )
        .filter(([_, portions]) => portions > 0)
        .map(([recipeId, portions]) => ({
          recipeId,
          portions,
        }));

      saveSelectedRecipes(selectedRecipes);

      return updatedPortions;
    });
  };

  const deleteRecipe = (recipeId: string) => {
    const recipe = recipes.find(
      (item) => item.id === recipeId
    );

    if (!recipe) {
      return;
    }

    Alert.alert(
      'Supprimer la recette',
      `Voulez-vous vraiment supprimer "${recipe.name}" ?`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            const updatedRecipes =
              recipes.filter(
                (item) => item.id !== recipeId
              );

            setRecipes(updatedRecipes);

            await saveRecipes(
              updatedRecipes
            );
          },
        },
      ]
    );
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
                      changePortions(recipe.id, -1)
                    }
                  >
                    <Text style={styles.counterButtonText}>
                      −
                    </Text>
                  </Pressable>

                  <Text style={styles.counterValue}>
                    {recipePortions}
                  </Text>

                  <Pressable
                    style={styles.counterButton}
                    onPress={() =>
                      changePortions(recipe.id, 1)
                    }
                  >
                    <Text style={styles.counterButtonText}>
                      +
                    </Text>
                  </Pressable>
                </View>

                <View style={styles.actionButtons}>
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: '/recipe',
                        params: {
                          recipeId: recipe.id,
                        },
                      })
                    }
                  >
                    <Text style={styles.editText}>
                      ✏️
                    </Text>
                  </Pressable>

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
            </View>
          );
        })}
      </ScrollView>

      <View>

        <Pressable
          style={styles.shoppingButton}
          onPress={() =>
            router.push('/shopping')
          }
        >
          <Text style={styles.shoppingButtonText}>
            Liste de courses
          </Text>
        </Pressable>

        <Pressable
          style={styles.ingredientButton}
          onPress={() =>
            router.push('/ingredients')
          }
        >
          <Text style={styles.ingredientButtonText}>
            Mes ingrédients
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
    backgroundColor: '#F7F8F5',
    padding: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2A1F',
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 18,
    color: '#6B746B',
    marginBottom: 20,
  },

  list: {
    flex: 1,
  },

  recipeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  recipeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2A1F',
  },

  portionText: {
    marginTop: 5,
    color: '#7A827A',
    fontSize: 14,
  },

  rightSection: {
    alignItems: 'center',
    gap: 8,
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
    color: '#2F5D34',
  },

  counterValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2A1F',
    minWidth: 20,
    textAlign: 'center',
  },

  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },

  editText: {
    fontSize: 19,
  },

  deleteText: {
    fontSize: 19,
  },

  emptyText: {
    textAlign: 'center',
    color: '#7A827A',
    fontSize: 16,
    marginTop: 50,
  },

  shoppingButton: {
    backgroundColor: '#2F7D32',
    padding: 17,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 10,
  },

  shoppingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  ingredientButton: {
    backgroundColor: '#FFFFFF',
    padding: 17,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 10,

    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },

  ingredientButtonText: {
    color: '#2F5D34',
    fontSize: 16,
    fontWeight: '700',
  },

  addButton: {
    backgroundColor: '#1F2A1F',
    padding: 17,
    borderRadius: 16,
    alignItems: 'center',
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});