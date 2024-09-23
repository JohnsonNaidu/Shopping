import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

const UpdateProduct = ({ route, navigation }) => {
  const { product, onUpdate } = route.params;

  const [title, setTitle] = useState(product.title);
  const [price, setPrice] = useState(product.price.toString());
  const [description, setDescription] = useState(product.description);
  const [category, setCategory] = useState(product.category);
  const [image, setImage] = useState(product.image);

 // Check if any field has changed
 const hasChanges = () => {
  return (
    title !== product.title ||
    price !== product.price.toString() ||
    description !== product.description ||
    category !== product.category ||
    image !== product.image
  );
};

  const handleUpdate = () => {
    const updatedProduct = {
      ...product,
      title,
      price: parseFloat(price),
      description,
      category,
      image,
    };
    onUpdate(updatedProduct); // Call the onUpdate function passed from ProductDetail
    navigation.navigate('ProductList', { updatedProduct });
  };

  return (
    
    <View style={styles.container}>
      <ScrollView>
      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      <Text style={styles.label}>Price:</Text>
      <TextInput
        style={styles.input}
        value={price}
        keyboardType="numeric"
        onChangeText={setPrice}
      />
      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />
      <Text style={styles.label}>Category:</Text>
      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
      />
      <Text style={styles.label}>Image URL:</Text>
      <TextInput
        style={styles.input}
        value={image}
        onChangeText={setImage}
      />
       {/* Conditionally render the button only when all fields are filled */}
       {hasChanges() && (
      <Button title="Update" onPress={handleUpdate} />
       )}
      </ScrollView>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor:'white'
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
  },
});

export default UpdateProduct;
