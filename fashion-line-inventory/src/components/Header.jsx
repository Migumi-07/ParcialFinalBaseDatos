// Header.js

import React, { useState, useEffect, useRef } from "react";
import { FaBell } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { GrSearchAdvanced } from "react-icons/gr";
import { useLocation } from "react-router-dom";
import "../css/Header.css"; 

function Header() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const searchInputRef = useRef(null);

  // Función para obtener las notificaciones
  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notifications");
      const data = await response.json();
      setNotifications(data.reverse());
    } catch (error) {
      console.error("Error al obtener las notificaciones:", error);
    }
  };

  // Función para manejar la búsqueda
  const handleSearch = async (query) => {
    try {
      if (query.trim() === "") {
        setSearchResults([]);
        return;
      }

      const productResponse = await fetch(
        `http://localhost:5000/api/products/search?q=${query}`
      );
      const productData = await productResponse.json();

      const catalogResponse = await fetch(
        `http://localhost:5000/api/catalogs/search?q=${query}`
      );
      const catalogData = await catalogResponse.json();

      setSearchResults({
        products: productData,
        catalogs: catalogData,
      });
    } catch (error) {
      console.error("Error en la búsqueda:", error);
    }
  };

  // Hook de efecto para obtener las notificaciones
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000); // Polling para obtener nuevas notificaciones cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  const location = useLocation();
  const isHome = location.pathname === "/";
  const isManagement =
    location.pathname === "/Management" || location.pathname === "/Inventory";
  const isInventory = location.pathname === "/Inventory";

  // Mostrar u ocultar el dropdown
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  // Eliminar una notificación individual
  const deleteNotification = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("No se pudo eliminar la notificación");
      fetchNotifications(); 
    } catch (error) {
      console.error("Error al eliminar la notificación:", error);
    }
  };

  // Eliminar todas las notificaciones
  const deleteAllNotifications = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notifications", {
        method: "DELETE",
      });
      if (!response.ok)
        throw new Error("No se pudieron eliminar todas las notificaciones");
      fetchNotifications(); 
    } catch (error) {
      console.error("Error al eliminar todas las notificaciones:", error);
    }
  };

  // Función para mostrar u ocultar el campo de búsqueda
  const handleSearchToggle = () => {
    setShowSearchInput((prev) => !prev);
    if (!showSearchInput && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <nav
      className={`nav ${isHome ? "headerNav" : ""} ${
        isInventory ? "headerNav" : ""
      }`}
    >
      <div className="headerContainer">
        <div className="logo">{/* Logo y enlaces */}</div>
        <div className="optionsContainer">
          <ul className="optionsList">
            <li className={`optionsItem ${isHome ? "optionListHome" : ""}`}>
              <a href="/">Inicio</a>
            </li>
            <li
              className={`optionsItem ${
                isManagement ? "optionListManagement" : ""
              }`}
            >
              <a href="/Management">Gestión</a>
            </li>

            {/* Contenedor de notificaciones */}
            <div className="header-notifications">
              <div className="bell-container" onClick={toggleDropdown}>
                <FaBell className="notification-bell" />
                {notifications.length > 0 && (
                  <div className="notification-count">
                    {notifications.length}
                  </div>
                )}
              </div>

              {showDropdown && notifications.length > 0 && (
                <div className="notifications-dropdown">
                  <button
                    className="delete-all-btn"
                    onClick={deleteAllNotifications}
                  >
                    Eliminar todas
                  </button>

                  {notifications.map((notification) => (
                    <div key={notification._id} className="notification-item">
                      {(notification.productImage ||
                        notification.catalogImage) && (
                        <img
                          src={
                            notification.productImage ||
                            notification.catalogImage
                          }
                          alt="Imagen del producto o catálogo"
                          className="notification-image"
                        />
                      )}
                      <a href="/Inventory">{notification.message}</a>
                      <button
                        className="delete-notification-btn"
                        onClick={() => deleteNotification(notification._id)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Campo de búsqueda */}
            <div className="search-container">
              <GrSearchAdvanced
                className="search-icon"
                onClick={handleSearchToggle}
              />
              {showSearchInput && (
                <input
                  ref={searchInputRef}
                  type="text"
                  className="search-input"
                  placeholder="Buscar..."
                  onBlur={() => setShowSearchInput(false)}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              )}
            </div>

            {/* Mostrar los resultados de búsqueda */}
            {searchResults.products && (
              <div className="search-results">
                <h3>Productos</h3>
                {searchResults.products.length > 0 ? (
                  searchResults.products.map((product) => (
                    <div key={product._id}>{product.name}</div>
                  ))
                ) : (
                  <div>No se encontraron productos</div>
                )}
              </div>
            )}

            {searchResults.catalogs && (
              <div className="search-results">
                <h3>Catálogos</h3>
                {searchResults.catalogs.length > 0 ? (
                  searchResults.catalogs.map((catalog) => (
                    <div key={catalog._id}>{catalog.name}</div>
                  ))
                ) : (
                  <div>No se encontraron catálogos</div>
                )}
              </div>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
