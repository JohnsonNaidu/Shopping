import React from 'react';
import { View, Text, Image, StyleSheet, Alert, TouchableOpacity, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProductDetail = ({ route, navigation }) => {
  const { product, handleDelete, setUpdatedProduct } = route.params;

  const handleDeleteProduct = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this product?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            handleDelete(product.id);
            navigation.navigate('ProductList');
          }
        }
      ],
      { cancelable: true }
    );
  };

  const handleUpdate = () => {
    navigation.navigate('UpdateProduct', { 
      product, 
      onUpdate: (updatedProduct) => {
        setUpdatedProduct(updatedProduct); // Update the product in the state
        navigation.navigate('ProductList', { updatedProduct }); 
      } 
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
      <Image
        source={{ uri: product.image }}
        style={styles.productImage}
      />
      <Text style={styles.productTitle}>{product.title}</Text>
      <Text style={styles.productPrice}>${product.price}</Text>
      <Text style={styles.productDescription}>{product.description}</Text>
      <Text style={styles.productCategory}>Category: {product.category}</Text>
      <View style={styles.buttonRow}>
      <TouchableOpacity onPress={handleDeleteProduct} style={styles.iconButton}>
          <Icon name="delete" size={30} color="red" />
          <Text style={styles.iconText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleUpdate} style={styles.iconButton}>
          <Icon name="update" size={30} color="blue" />
          <Text style={styles.iconText}>Update</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  productImage: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 20,
    color: 'green',
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  productCategory: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconText: {
    marginTop: 5,
    fontSize: 14,
    color: 'black',
  },
});

export default ProductDetail;
