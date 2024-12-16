//src/pages/Management

import React, { useState, useEffect } from "react";
import CatalogList from "../components/CatalogList";
import CatalogForm from "../components/CatalogForm";
import ProductList from "../components/ProductList";
import ProductForm from "../components/ProductForm";
import Header from "../components/Header";
import { useLocation } from "react-router-dom";
import "../css/Home.css";
const Management = () => {
  const location = useLocation();
  const isAddProducts = location.pathname === "/Management";
  const isProductList = location.pathname === "/Inventory";
  const [refresh, setRefresh] = useState(false);

  const handleSave = () => {
    setRefresh(!refresh);
  };

  return (
    <>
      <Header />
      <nav className="managementHeader">
        <div className="headerContainer">
          <div className="optionsContainer">
            <ul className="optionsList">
              <li
                className={`optionsItem ${
                  isAddProducts ? "optionListAddP" : ""
                }`}
              >
                <a href="/Management">Agregar productos</a>
              </li>
              <li
                className={`optionsItem ${
                  isProductList ? "optionListProductL" : ""
                }`}
              >
                <a href="/Inventory">Lista de productos</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div>
        <div className="managementParentcontainer">
          <div className="managementContainer">
            <ProductForm onSave={handleSave} />{" "}
            <CatalogForm onSave={handleSave} />{" "}
          </div>
        </div>
      </div>
    </>
  );
};

export default Management;
