import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useEffect, useState } from 'react';
import {
  loadIngredients,
  loadRecipes,
  saveIngredients,
  saveRecipes,
} from '../data/storage';

import { Ingredient } from '../data/types';

export default function IngredientsScreen() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    const loadSavedIngredients = async () => {
      const savedIngredients = await loadIngredients();
      setIngredients(savedIngredients);
    };

    loadSavedIngredients();
  }, []);

  const addIngredient = async () => {
    const trimmedName = name.trim();

    if (trimmedName === '') {
      return;
    }

    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: trimmedName,
    };

    const updatedIngredients = [
      ...ingredients,
      newIngredient,
    ];

    setIngredients(updatedIngredients);
    await saveIngredients(updatedIngredients);

    setName('');
  };

  const deleteIngredient = (ingredientId: string) => {
    Alert.alert(
      'Supprimer l’ingrédient',
      'Cet ingrédient sera aussi retiré des recettes qui l’utilisent.',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            const updatedIngredients =
              ingredients.filter(
                (ingredient) =>
                  ingredient.id !== ingredientId
              );

            setIngredients(updatedIngredients);

            await saveIngredients(
              updatedIngredients
            );

            const recipes =
              await loadRecipes();

            const updatedRecipes =
              recipes.map((recipe) => ({
                ...recipe,
                ingredients:
                  recipe.ingredients.filter(
                    (ingredient) =>
                      ingredient.ingredientId !==
                      ingredientId
                  ),
              }));

            await saveRecipes(updatedRecipes);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Mes ingrédients
      </Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ex : Tomates"
          value={name}
          onChangeText={setName}
        />

        <Pressable
          style={styles.addButton}
          onPress={addIngredient}
        >
          <Text style={styles.addButtonText}>
            +
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.list}>
        {ingredients.map((ingredient) => (
          <View
            key={ingredient.id}
            style={styles.ingredientCard}
          >
            <Text style={styles.ingredientName}>
              {ingredient.name}
            </Text>

            <Pressable
              onPress={() =>
                deleteIngredient(ingredient.id)
              }
            >
              <Text style={styles.deleteText}>
                🗑️
              </Text>
            </Pressable>
          </View>
        ))}

        {ingredients.length === 0 && (
          <Text style={styles.emptyText}>
            Aucun ingrédient pour le moment.
          </Text>
        )}
      </ScrollView>
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
    fontSize: 30,
    fontWeight: '800',
    color: '#1F2A1F',
    marginBottom: 20,
  },

  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    height: 54,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E5DE',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
  },

  addButton: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#2F7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '400',
  },

  list: {
    flex: 1,
  },

  ingredientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E4E8E1',
  },

  ingredientName: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2A1F',
  },

  deleteText: {
    fontSize: 20,
    marginLeft: 12,
  },

  emptyText: {
    textAlign: 'center',
    color: '#7A827A',
    fontSize: 16,
    marginTop: 40,
  },
});