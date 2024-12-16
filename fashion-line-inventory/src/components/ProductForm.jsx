//src//components/ProductForm

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axios";

const ProductForm = ({ onSave }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    imageUrl: "",
    size: "",
  });
  const [imagePreview, setImagePreview] = useState(null); // Estado para la vista previa de la imagen cargada
  const [imageInput, setImageInput] = useState(null); // Para controlar el input de la imagen
  const [isImageDeleted, setIsImageDeleted] = useState(false); // Estado para saber si la imagen ha sido eliminada

  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        try {
          const response = await axios.get(`/products/${id}`);
          setProduct(response.data);
          setImagePreview(response.data.imageUrl); 
        } catch (error) {
          console.error("Error al cargar el producto", error);
        }
      }
    };
    loadProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); 
      };
      reader.readAsDataURL(file); 
      setProduct({
        ...product,
        imageUrl: file.name, 
      });
      setIsImageDeleted(false);
    }
  };

  const handleImageDelete = () => {
    // Eliminar la imagen actual y permitir la carga de una nueva
    setImagePreview(null);
    setProduct({
      ...product,
      imageUrl: "", 
    });
    setIsImageDeleted(true); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (product._id) {
        await axios.put(`/products/${product._id}`, product);
      } else {
        await axios.post("/products", product);
      }
      onSave(); 
      navigate("/"); 
    } catch (error) {
      console.error("Error al guardar el producto", error);
    }
  };

  return (
    <div className="formContainer">
      <div className="formTitle">
        <h1>Gestión de Destacados</h1>
      </div>
      <div className="editFormContainer">
        <form onSubmit={handleSubmit} className="edit-form">
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Nombre"
            required
          />
          <input
            type="text"
            name="description"
            value={product.description}
            onChange={handleChange}
            placeholder="Descripción"
            required
          />
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            placeholder="Precio"
            required
          />
          <input
            type="number"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
            placeholder="Cantidad"
            required
          />

          <input
            type="text"
            name="size"
            value={product.size}
            onChange={handleChange}
            placeholder="Talla"
            required
          />

          {/* Campo para editar la URL de la imagen */}

          <input
            type="text"
            name="imageUrl"
            value={product.imageUrl}
            onChange={handleChange}
            placeholder="URL de imagen"
          />

          {/* Imagen actual y campo para cargar nueva imagen */}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }} 
              ref={(input) => setImageInput(input)}
            />
            <button className="actionButton" type="submit">
              {product._id ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
