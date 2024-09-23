import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProductList = ({ route, navigation }) => {
  const [apiProducts, setApiProducts] = useState([]);
  const [userAddedProducts, setUserAddedProducts] = useState([]);

  // Fetch products from the API
  useEffect(() => {
    axios.get('https://fakestoreapi.com/products')
      .then(response => {
        setApiProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  // Handle newly added products
  useEffect(() => {
    if (route.params?.newProduct) {
      const newProduct = route.params.newProduct;
      setUserAddedProducts(prevProducts => [newProduct, ...prevProducts]);
    }
  }, [route.params?.newProduct]);

  useEffect(() => {
    if (route.params?.updatedProduct) {
      const updatedProduct = route.params.updatedProduct;
      // Update the product list with the updated product
      setUserAddedProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === updatedProduct.id ? updatedProduct : product
        )
      );
    }
  }, [route.params?.updatedProduct]);


   // Function to handle product deletion
  const handleDeleteProduct = (productId) => {
    setUserAddedProducts(prevProducts =>
      prevProducts.filter(product => product.id !== productId)
    );
    setApiProducts(prevProducts =>
      prevProducts.filter(product => product.id !== productId)
    );
  };

  // Handle product update
  const handleUpdateProduct = (updatedProduct) => {
    setUserAddedProducts(prevProducts =>
      prevProducts.map(product => 
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  // Combine API products with user-added products
  const combinedProducts = [...userAddedProducts, ...apiProducts];

  const renderProduct = ({ item }) => (
    <View style={styles.productContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', {
        product: item,
        handleDelete: handleDeleteProduct,
        setUpdatedProduct: handleUpdateProduct,
      })}>
        <Image
          source={{ uri: item.image }}
          style={styles.productImage}
        />
      </TouchableOpacity>
      <View style={styles.productDetails}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
    <FlatList
  data={combinedProducts}
  renderItem={renderProduct}
  keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
/>


    {/* Add icon button */}
    <TouchableOpacity
      style={styles.addButton}
      onPress={() => navigation.navigate('AddProduct')}
    >
      <Icon name="add" size={30} color="#fff" />
    </TouchableOpacity>
  </View>
);
};

const styles = StyleSheet.create({
  productContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
    backgroundColor: 'white',
  },
  productImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: 'green',
    marginTop: 5,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#007bff',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
});

export default ProductList;