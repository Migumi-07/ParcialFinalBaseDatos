// src/components/ProductList.js

import React, { useState, useEffect } from "react";
import axios from "../axios";
import ProductCard from "./ProductCard";
import { useLocation } from "react-router-dom"; 

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filterLowStock, setFilterLowStock] = useState(false);

  const location = useLocation(); 

  const loadProducts = async () => {
    try {
      const response = await axios.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error al cargar los productos", error);
    }
  };

  const handleBuy = async (id) => {
    try {
      await axios.put(`/products/buy/${id}`); 
      loadProducts(); 
    } catch (error) {
      console.error("Error al comprar el producto", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/products/${id}`);
      loadProducts(); 
    } catch (error) {
      console.error("Error al eliminar el producto", error);
    }
  };

  const handleSave = async (updatedProduct) => {
    try {
      await axios.put(`/products/${updatedProduct._id}`, updatedProduct);
      loadProducts(); 
    } catch (error) {
      console.error("Error al actualizar el producto", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleFilterToggle = () => {
    setFilterLowStock(!filterLowStock);
  };

  // Filtra los productos si estamos en /Inventory y el filtro está activado
  const filteredProducts =
    filterLowStock && location.pathname === "/Inventory"
      ? products.filter((product) => product.quantity <= 5)
      : products;

  return (
    <div className="product-list">
      {/* Solo muestra el filtro si estamos en /Inventory */}
      {location.pathname === "/Inventory" && (
        <button className="lowStockButton" onClick={handleFilterToggle}>
          {filterLowStock
            ? "Mostrar todos"
            : "Mostrar productos con bajo stock"}
        </button>
      )}

      <div className="product-cards-container">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onDelete={handleDelete}
            onSave={handleSave} 
            onBuy={handleBuy} 
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
