import {
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
    saveIngredients,
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
    backgroundColor: '#fff',
    padding: 24,
    paddingTop: 70,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },

  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },

  addButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addButtonText: {
    color: '#fff',
    fontSize: 28,
  },

  list: {
    flex: 1,
  },

  ingredientCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },

  ingredientName: {
    fontSize: 17,
  },

  emptyText: {
    textAlign: 'center',
    color: '#777',
    fontSize: 16,
    marginTop: 40,
  },
});