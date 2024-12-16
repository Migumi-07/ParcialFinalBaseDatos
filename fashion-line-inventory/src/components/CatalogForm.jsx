import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axios";

const CatalogForm = ({ onSave }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [catalog, setCatalog] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    size: "",
    imageUrl: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageInput, setImageInput] = useState(null);
  const [isImageDeleted, setIsImageDeleted] = useState(false);

  useEffect(() => {
    const loadCatalog = async () => {
      if (id) {
        try {
          const response = await axios.get(`/catalogs/${id}`);
          setCatalog(response.data);
          setImagePreview(response.data.imageUrl);
        } catch (error) {
          console.error("Error al cargar el producto", error);
        }
      }
    };
    loadCatalog();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCatalog({
      ...catalog,
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
      setCatalog({
        ...catalog,
        imageUrl: file.name,
      });
      setIsImageDeleted(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (catalog._id) {
        await axios.put(`/catalogs/${catalog._id}`, catalog);
      } else {
        await axios.post("/catalogs", catalog);
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
        <h1>Gestión de Catálogo</h1>
      </div>
      <div className="editFormContainer">
        <form onSubmit={handleSubmit} className="edit-form">
          <input
            type="text"
            name="name"
            value={catalog.name}
            onChange={handleChange}
            placeholder="Nombre"
            required
          />
          <input
            type="text"
            name="description"
            value={catalog.description}
            onChange={handleChange}
            placeholder="Descripción"
            required
          />
          <input
            type="number"
            name="price"
            value={catalog.price}
            onChange={handleChange}
            placeholder="Precio"
            required
          />
          <input
            type="number"
            name="quantity"
            value={catalog.quantity}
            onChange={handleChange}
            placeholder="Cantidad"
            required
          />

          <input
            type="text"
            name="size"
            value={catalog.size}
            onChange={handleChange}
            placeholder="Talla"
          />
          {/* Campo para editar la URL de la imagen */}
          <input
            type="text"
            name="imageUrl"
            value={catalog.imageUrl}
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
              {catalog._id ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CatalogForm;
