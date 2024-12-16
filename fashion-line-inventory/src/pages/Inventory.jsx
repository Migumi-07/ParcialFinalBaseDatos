// src/pages/Inventory

import React, { useState, useEffect } from "react";
import CatalogList from "../components/CatalogList"; 

import ProductList from "../components/ProductList"; 

import Header from "../components/Header";
import { useLocation } from "react-router-dom";
import "../css/Inventory.css";
const Inventory = () => {
  const location = useLocation();
  const isAddProducts = location.pathname === "/Management";
  const isInventory = location.pathname === "/Inventory";
  const [refresh, setRefresh] = useState(false); 

  const handleSave = () => {
    setRefresh(!refresh); 
  };

  return (
    <>
      <Header />
      <nav
        className={`managementHeader ${
          isInventory ? "managementHeaderInventory" : ""
        }`}
      >
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
                  isInventory ? "optionListProductL" : ""
                }`}
              >
                <a href="/inventory">Lista de productos</a>
              </li>

              <li className="optionsItem"></li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="inventoryMainContainer">
        <div className="inventoryContainer">
          <h1>Lista de productos destacados </h1>
          <div className="produtListInventory">
            <ProductList refresh={refresh} />
          </div>

          <div className="inventoryContainer">
            <h1>Catálogo</h1>
            <div className="catalogListInventory">
              <CatalogList refresh={refresh} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Inventory;
