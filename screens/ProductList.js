import React, { useEffect, useState ,useContext } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, TextInput ,Modal } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ProductContext } from './ProductContext'; // Import the ProductContext

const ProductList = ({ route, navigation }) => {
  const { products, setAndSortProducts } = useContext(ProductContext); // Use context
  const [apiProducts, setApiProducts] = useState([]);
  const [userAddedProducts, setUserAddedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // State for the filter modal

   // Fetch products from the API
   useEffect(() => {
    axios.get('https://fakestoreapi.com/products')
      .then(response => {
        setApiProducts(response.data);
        setAndSortProducts([...userAddedProducts, ...response.data]); // Set sorted products
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
      setAndSortProducts([newProduct, ...userAddedProducts, ...apiProducts]); // Update products with the new one
    }
  }, [route.params?.newProduct]);

  useEffect(() => {
    if (route.params?.updatedProduct) {
      const updatedProduct = route.params.updatedProduct;
      setUserAddedProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === updatedProduct.id ? updatedProduct : product
        )
      );
      setAndSortProducts([...userAddedProducts, ...apiProducts]); // Update products with the updated one
    }
  }, [route.params?.updatedProduct]);

  useEffect(() => {
    setAndSortProducts([...userAddedProducts, ...apiProducts]);
  }, [userAddedProducts, apiProducts]);  // Only run when userAddedProducts or apiProducts changes
  

  // Update filteredProducts whenever searchQuery or products change
  useEffect(() => {
    if (searchQuery) {
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products); // Use sorted products from the context
    }
  }, [searchQuery, products]);


  // Combine API products with user-added products
  const combinedProducts = [...userAddedProducts, ...apiProducts];

  // Update filteredProducts whenever searchQuery or combinedProducts change
  useEffect(() => {
    if (searchQuery) {
      // Filter the products based on searchQuery
      const filtered = combinedProducts.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      // If no search query, show all products
      setFilteredProducts(combinedProducts);
    }
  }, [searchQuery, apiProducts, userAddedProducts]);

  const handleDeleteProduct = (productId) => {
    // Update user-added products and API products without calling setAndSortProducts immediately
    setUserAddedProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
    setApiProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
  };
  
   // Handle product update
   const handleUpdateProduct = (updatedProduct) => {
    setUserAddedProducts(prevProducts =>
      prevProducts.map(product => 
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  // Function to handle sorting
  const handleSort = (type) => {
    setModalVisible(false); // Close the modal after selection
    setAndSortProducts([...userAddedProducts, ...apiProducts], type); // Pass sorting type to context function
  };

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
      {/* Search Bar with Filter Icon */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={20} color="black" style={styles.searchIcon} />
          <TextInput
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icon name="tune" size={25} color="black" style={styles.filterIcon} />
        </TouchableOpacity>
      </View>

      {/* Sort Menu Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort Products</Text>
            <TouchableOpacity onPress={() => handleSort('name')} style={styles.modalOption}>
              <Text>Sort by Name</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSort('priceLowToHigh')} style={styles.modalOption}>
              <Text>Sort by Price (Low to High)</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSort('priceHighToLow')} style={styles.modalOption}>
              <Text>Sort by Price (High to Low)</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
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
    marginHorizontal: 10,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
  },
  filterIcon: {
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalCloseButton: {
    marginTop: 15,
    paddingVertical: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#fff',
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