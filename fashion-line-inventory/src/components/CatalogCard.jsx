//components/CatalogCard

import React, { useState, useEffect } from "react";
import "../css/ProductCard.css";
import { useLocation } from 'react-router-dom';

const CatalogCard = ({ catalog, onDelete, onSave, onBuy }) => {
  const [isEditing, setIsEditing] = useState(false); // Estado para manejar el modo de edición
  const [editedCatalog, setEditedCatalog] = useState({ ...catalog }); // Estado para manejar los cambios
  const [imagePreview, setImagePreview] = useState(catalog.imageUrl); // Estado para mostrar la imagen seleccionada
  const location = useLocation();

  // useEffect para actualizar la vista previa de la imagen cuando el URL cambia
  useEffect(() => {
    setImagePreview(editedCatalog.imageUrl);
  }, [editedCatalog.imageUrl]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedCatalog({ ...catalog }); 
    setImagePreview(catalog.imageUrl);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCatalog({
      ...editedCatalog,
      [name]: value,
    });
  };

 

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); 
        setEditedCatalog({
          ...editedCatalog,
          imageUrl: reader.result, 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      await onSave(editedCatalog); 
      setIsEditing(false); 
    } catch (error) {
      console.error("Error al guardar el producto", error);
    }
  };

  const handleImageDelete = () => {
    setImagePreview(""); 
    setEditedCatalog({ ...editedCatalog, imageUrl: "" }); 
  };

  const handleBuy = () => {
    if (catalog.quantity > 0) {
      onBuy(catalog._id); 
    } else {
      alert("Stock no disponible");
    }
  };

  return (
    <div className={`catalog-card ${isEditing ? "expanded" : ""}`}>
      <div className="image-container">
        <img
          src={imagePreview}
          alt={catalog.name}
          className="product-image"
          onClick={() => document.getElementById("image-input").click()} 
        />
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
              name="name"
              value={editedCatalog.name}
              onChange={handleChange}
              placeholder="Nombre"
              required
            />
            <input
              type="text"
              name="description"
              value={editedCatalog.description}
              onChange={handleChange}
              placeholder="Descripción"
              required
            />
            <input
              type="number"
              name="price"
              value={editedCatalog.price}
              onChange={handleChange}
              placeholder="Precio"
              required
            />
            <input
              type="number"
              name="quantity"
              value={editedCatalog.quantity}
              onChange={handleChange}
              placeholder="Cantidad"
              required
            />
            <input
              type="text"
              name="size"
              value={editedCatalog.size}
              onChange={handleChange}
              placeholder="Talla"
            />
            <input
              type="text"
              name="imageUrl"
              value={editedCatalog.imageUrl}
              onChange={handleChange}
              placeholder="URL de imagen"
            />
          </form>
        ) : (
          // Modo de visualización
          <>
            <h3 className="product-title">{catalog.name}</h3>
            <p className="product-description">{catalog.description}</p>
            <p className="product-price">${catalog.price}</p>
            <p className="product-stock">Stock: {catalog.quantity}</p>
            <p className="product-stock">Talla: {catalog.size}</p>{" "}
           
          </>
        )}
      </div>
      <div className="product-actions">
      {location.pathname === "/" && (
          <button className="buy-button" onClick={handleBuy}>
            Comprar
          </button>
        )}
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
              onClick={() => onDelete(catalog._id)}
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogCard;
