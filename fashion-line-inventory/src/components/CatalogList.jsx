import React, { useState, useEffect } from "react";
import axios from "../axios";
import ProductCard from "./ProductCard";
import { useLocation } from "react-router-dom";

const CatalogList = () => {
  const [catalogs, setCatalogs] = useState([]);
  const [isLowStock, setIsLowStock] = useState(false); 

  const location = useLocation(); 

  // Función para cargar los catálogos
  const loadCatalogs = async () => {
    try {
      const response = await axios.get("/catalogs");
      setCatalogs(response.data);
    } catch (error) {
      console.error("Error al cargar los catálogos", error);
    }
  };

  const handleBuy = async (id) => {
    try {
      await axios.put(`/catalogs/buy/${id}`); 
      loadCatalogs(); 
    } catch (error) {
      console.error("Error al comprar el producto", error);
    }
  };

  // Función para eliminar un catálogo
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/catalogs/${id}`);
      loadCatalogs(); // Recargar la lista después de eliminar
    } catch (error) {
      console.error("Error al eliminar el catálogo", error);
    }
  };

  // Función para actualizar un catálogo
  const handleSave = async (updatedCatalog) => {
    try {
      await axios.put(`/catalogs/${updatedCatalog._id}`, updatedCatalog);
      loadCatalogs(); // Recargar la lista después de actualizar
    } catch (error) {
      console.error("Error al actualizar el catálogo", error);
    }
  };

  // Función para alternar el filtro de bajo stock
  const toggleLowStockFilter = () => {
    setIsLowStock(!isLowStock);
  };

  // Filtrar los catálogos si el filtro está activado y si estamos en /Inventory
  const filteredCatalogs =
    isLowStock && location.pathname === "/Inventory"
      ? catalogs.filter((catalog) => catalog.quantity <= 5) 
      : catalogs; 

  useEffect(() => {
    loadCatalogs();
  }, []);

  return (
    <div className="product-list">

      {/* Solo muestra el filtro si estamos en /Inventory */}
      {location.pathname === "/Inventory" && (
        <button className="lowStockButton" onClick={toggleLowStockFilter}>
          {isLowStock ? "Mostrar Todos" : "Mostrar productos con bajo stock"}
        </button>
      )}

      <div className="product-cards-container">
        {filteredCatalogs.map((catalog) => (
          <ProductCard
            key={catalog._id}
            product={catalog} 
            onDelete={handleDelete}
            onSave={handleSave}
            onBuy={handleBuy}
          />
        ))}
      </div>
    </div>
  );
};

export default CatalogList;
