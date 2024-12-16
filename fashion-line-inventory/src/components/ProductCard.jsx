// src/components/ProductCard.js

import React, { useState, useEffect } from "react";
import "../css/ProductCard.css";
import { useLocation } from "react-router-dom";

const ProductCard = ({ product, onDelete, onSave, onBuy }) => {
  const [isEditing, setIsEditing] = useState(false); 
  const [editedProduct, setEditedProduct] = useState({ ...product }); 
  const [imagePreview, setImagePreview] = useState(product.imageUrl); 

  const location = useLocation(); 

  // useEffect para actualizar la vista previa de la imagen cuando el URL cambia
  useEffect(() => {
    setImagePreview(editedProduct.imageUrl);
  }, [editedProduct.imageUrl]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProduct({ ...product }); 
    setImagePreview(product.imageUrl); 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); 
        setEditedProduct({
          ...editedProduct,
          imageUrl: reader.result, 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      await onSave(editedProduct); 
      setIsEditing(false); 
    } catch (error) {
      console.error("Error al guardar el producto", error);
    }
  };

  const handleImageDelete = () => {
    setImagePreview(""); // Eliminar la imagen
    setEditedProduct({ ...editedProduct, imageUrl: "" });
  };

  // Función para formatear el precio con separador de miles (solo para visualización)
  const formatPrice = (price) => {
    if (!price) return price;
    return parseFloat(price).toLocaleString("es-ES");
  };

  const handleBuy = () => {
    if (product.quantity > 0) {
      onBuy(product._id); 
    } else {
      alert("Stock no disponible");
    }
  };
  return (
    <div className={`product-card ${isEditing ? "expanded" : ""}`}>
      <div className="image-container">
        <img src={imagePreview} alt={product.name} className="product-image" />
        {isEditing && imagePreview && (
          <button
            className="image-delete-button"
            onClick={handleImageDelete} 
          >
            X
          </button>
        )}
        <input
          id="image-input"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
      </div>
      <div className="product-details">
        {isEditing ? (
          // Modo de edición
          <form
            className="edit-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <input
              type="text"
              name="description"
              value={editedProduct.description}
              onChange={handleChange}
              placeholder="Descripción"
              required
            />
            <input
              type="text"
              name="name"
              value={editedProduct.name}
              onChange={handleChange}
              placeholder="Nombre"
              required
            />
            <input
              type="number"
              name="price"
              value={editedProduct.price}
              onChange={handleChange}
              placeholder="Precio"
              required
            />
            <input
              type="number"
              name="quantity"
              value={editedProduct.quantity}
              onChange={handleChange}
              placeholder="Cantidad"
              required
            />
            <input
              type="text"
              name="size"
              value={editedProduct.size}
              onChange={handleChange}
              placeholder="Talla"
            />
            <input
              type="text"
              name="imageUrl"
              value={editedProduct.imageUrl}
              onChange={handleChange}
              placeholder="URL de imagen"
            />
          </form>
        ) : (
          // Modo de visualización
          <>
            <p className="product-description">{product.description}</p>
            <h3 className="product-title">{product.name}</h3>
            <p className="product-price">${formatPrice(product.price)}</p>{" "}
            <p className="product-stock">Stock: {product.quantity}</p>
            <p className="product-stock">Talla/s: {product.size}</p>
          </>
        )}
      </div>
      <div className="product-actions">
        {location.pathname === "/" && (
          <button className="buy-button" onClick={handleBuy}>
            Comprar
          </button>
        )}
        {location.pathname !== "/" && ( // Solo mostrar las opciones de editar y eliminar si no estamos en la página principal
          <>
            {isEditing ? (
              <div>
                <button className="save-button" onClick={handleSave}>
                  Guardar
                </button>
                <button className="cancel-button" onClick={handleCancel}>
                  Cancelar
                </button>
              </div>
            ) : (
              <div>
                <button className="edit-button" onClick={handleEdit}>
                  Editar
                </button>
                <button
                  className="delete-button"
                  onClick={() => onDelete(product._id)}
                >
                  Eliminar
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
