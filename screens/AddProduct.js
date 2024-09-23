import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AddProduct = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const navigation = useNavigation();

  // Validate fields
  const validateFields = () => {
    return title && price && description && category && image;
  };

  const addProduct = () => {
    const newProduct = {
      id: Date.now(),  // Adding unique ID to the product
      title,
      price: parseFloat(price),
      description,
      category,
      image,
    };

    // Navigate to ProductList with the new product
    navigation.navigate('ProductList', { newProduct });

    // Optionally make a POST request to add the product to a backend
    fetch('https://fakestoreapi.com/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    })
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(error => console.error('Error adding product:', error));
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.label}>Title:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter product title"
          value={title}
          onChangeText={(text) => setTitle(text)}
        />

        <Text style={styles.label}>Price:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter price"
          value={price}
          onChangeText={(text) => setPrice(text)}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter product description"
          value={description}
          onChangeText={(text) => setDescription(text)}
        />
        
        <Text style={styles.label}>Category:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter category"
          value={category}
          onChangeText={(text) => setCategory(text)}
        />

        <Text style={styles.label}>Image URL:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter image URL"
          value={image}
          onChangeText={(text) => setImage(text)}
        />

        {/* Conditionally render the button only when all fields are filled */}
        {validateFields() && (
          <Button title="Add Product" onPress={addProduct} />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
});

export default AddProduct;
