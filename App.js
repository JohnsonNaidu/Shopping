import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, AuthContext } from './screens/AuthContext';
import AddProduct from './screens/AddProduct';
import ProductList from './screens/ProductList';
import UpdateProduct from './screens/UpdateProduct';
import ProductDetail from './screens/ProductDetail';
import LoginScreen from './screens/LoginScreen';
import { StatusBar, ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <AuthContext.Consumer>
          {({ isLoggedIn, isLoading }) => {
            if (isLoading) {
              return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator size="large" color="#0000ff" />
                </View>
              );
            }

            return (
              <Stack.Navigator
                initialRouteName={isLoggedIn ? 'ProductList' : 'LoginScreen'} // Set the initial route dynamically
              >
                {isLoggedIn ? (
                  <>
                    <Stack.Screen
                      name="ProductList"
                      component={ProductList}
                      options={{ title: 'Products', headerTitleAlign: 'center' }}
                    />
                    <Stack.Screen
                      name="AddProduct"
                      component={AddProduct}
                      options={{ title: 'Add Product', headerTitleAlign: 'center' }}
                    />
                    <Stack.Screen
                      name="UpdateProduct"
                      component={UpdateProduct}
                      options={{ title: 'Update Product', headerTitleAlign: 'center' }}
                    />
                    <Stack.Screen
                      name="ProductDetail"
                      component={ProductDetail}
                      options={{ title: 'Product Details', headerTitleAlign: 'center' }}
                    />
                  </>
                ) : (
                  <Stack.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                    options={{ title: 'Login', headerTitleAlign: 'center' }}
                  />
                )}
              </Stack.Navigator>
            );
          }}
        </AuthContext.Consumer>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
