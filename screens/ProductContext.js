import React, { createContext, useState } from 'react';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState('none'); // Default sort order is 'none'

  // Function to set products and sort only if a sortType is provided
  const setAndSortProducts = (unsortedProducts, sortType = null) => {
    let sortedProducts = [...unsortedProducts];
    
    if (sortType === 'name') {
      sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortType === 'priceLowToHigh') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortType === 'priceHighToLow') {
      sortedProducts.sort((a, b) => b.price - a.price);
    }

    setProducts(sortedProducts);
  };

  return (
    <ProductContext.Provider value={{ products, setAndSortProducts, sortOrder, setSortOrder }}>
      {children}
    </ProductContext.Provider>
  );
};
