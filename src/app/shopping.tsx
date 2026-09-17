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
    loadCheckedItems,
    loadIngredients,
    loadRecipes,
    loadSelectedRecipes,
    saveCheckedItems,
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

  const [checkedItems, setCheckedItems] = useState<
  string[]
  >([]);

  useFocusEffect(
    useCallback(() => {
      const generateShoppingList = async () => {
        const recipes: Recipe[] = await loadRecipes();
        const ingredients: Ingredient[] =
          await loadIngredients();

        const selectedRecipes =
            await loadSelectedRecipes();

        const savedCheckedItems =
            await loadCheckedItems();

        setCheckedItems(savedCheckedItems);

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

  const toggleChecked = async (
    ingredientId: string
  ) => {
    const isChecked =
        checkedItems.includes(ingredientId);

    let updatedCheckedItems: string[];

    if (isChecked) {
        updatedCheckedItems =
            checkedItems.filter(
                (id) => id !== ingredientId
            );
    } else {
        updatedCheckedItems = [
        ...checkedItems,
        ingredientId,
        ];
    }

    setCheckedItems(updatedCheckedItems);

    await saveCheckedItems(
        updatedCheckedItems
    );
  };

  const clearCheckedItems = async () => {
    setCheckedItems([]);

    await saveCheckedItems([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        🛒 Liste de courses
      </Text>

      <Pressable
            style={styles.clearButton}
            onPress={clearCheckedItems}
        >
            <Text style={styles.clearButtonText}>
                ↻ Réinitialiser les achats
            </Text>
        </Pressable>

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
            <Pressable
            style={styles.checkbox}
            onPress={() =>
                toggleChecked(item.ingredientId)
            }
            >
            <Text style={styles.checkboxText}>
                {checkedItems.includes(
                item.ingredientId
                )
                ? '☑'
                : '☐'}
            </Text>
            </Pressable>

            <Text
            style={[
                styles.ingredientName,
                checkedItems.includes(
                item.ingredientId
                ) && styles.checkedText,
            ]}
            >
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

  checkedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },

  clearButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },

  clearButtonText: {
    fontSize: 15,
    color: '#555',
  },

});