import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import {
    loadIngredients,
    loadRecipes,
    loadSelectedRecipes,
} from '../data/storage';

import {
    Ingredient,
    Recipe,
} from '../data/types';

type ShoppingItem = {
  ingredientId: string;
  name: string;
  portions: number;
};

export default function ShoppingScreen() {
  const [shoppingList, setShoppingList] = useState<
    ShoppingItem[]
  >([]);

  useFocusEffect(
    useCallback(() => {
      const generateShoppingList = async () => {
        const recipes: Recipe[] = await loadRecipes();
        const ingredients: Ingredient[] =
          await loadIngredients();

        const selectedRecipes =
            await loadSelectedRecipes();

        const totals: {
          [key: string]: number;
        } = {};

        selectedRecipes.forEach(
        (selectedRecipe) => {
            const recipe = recipes.find(
            (item) =>
                item.id === selectedRecipe.recipeId
            );

            if (!recipe) {
            return;
            }

            recipe.ingredients.forEach(
            (recipeIngredient) => {
                const quantity =
                recipeIngredient.portions *
                selectedRecipe.portions;

                totals[recipeIngredient.ingredientId] =
                (totals[
                    recipeIngredient.ingredientId
                ] ?? 0) + quantity;
            }
            );
        }
        );

        const list: ShoppingItem[] = Object.entries(
          totals
        ).map(([ingredientId, portions]) => {
          const ingredient = ingredients.find(
            (item) => item.id === ingredientId
          );

          return {
            ingredientId,
            name:
              ingredient?.name ??
              'Ingrédient inconnu',
            portions,
          };
        });

        setShoppingList(list);
      };

      generateShoppingList();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        🛒 Liste de courses
      </Text>

      <ScrollView style={styles.list}>
        {shoppingList.length === 0 && (
          <Text style={styles.emptyText}>
            Ta liste de courses est vide.
          </Text>
        )}

        {shoppingList.map((item) => (
          <View
            key={item.ingredientId}
            style={styles.item}
          >
            <Pressable style={styles.checkbox}>
              <Text style={styles.checkboxText}>
                ☐
              </Text>
            </Pressable>

            <Text style={styles.ingredientName}>
              {item.name}
            </Text>

            <Text style={styles.portions}>
              {item.portions} portion
              {item.portions > 1 ? 's' : ''}
            </Text>
          </View>
        ))}
      </ScrollView>
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
    marginBottom: 24,
  },

  list: {
    flex: 1,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },

  checkbox: {
    marginRight: 12,
  },

  checkboxText: {
    fontSize: 24,
  },

  ingredientName: {
    flex: 1,
    fontSize: 17,
  },

  portions: {
    color: '#666',
    fontSize: 15,
  },

  emptyText: {
    textAlign: 'center',
    color: '#777',
    fontSize: 16,
    marginTop: 40,
  },
});