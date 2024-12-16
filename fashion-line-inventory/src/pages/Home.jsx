//src/pages/Home
import React, { useState } from "react";
import ProductList from "../components/ProductList"; 
import CatalogList from "../components/CatalogList";
import Header from "../components/Header";
import Footer from "../components/Footer";
import model1 from "../img/imgCat1.png";
import "../css/Home.css";
const Product = () => {
  const [refresh] = useState(false); 

  return (
    <>
      <div>
        <Header />

        <section className="mainSection">
          <img className="mainSectionBackground" src="" alt="" />

          <h1 className="mainTitle">Migumie’s</h1>
          <p className="mainSlogan">“A veces uno piensa que tin, pero tan”</p>
        </section>

        <div className="rectTop">
          <div className="redRec"></div>
          <h2 className="fT1">Lo más top 🔥</h2>
          <ProductList refresh={refresh} />
          <div className="rectBot"></div>
      
        </div>
        <section className="catalog">
          <h2 className="catalogSectionTitle">Catálogo</h2>
        </section>

        <section className="catSect">
          <div className="topModelContainer">
            <div className="topModel">
              <div className="topModelTextSpace">
                <h2>Deslumbra tu pasado</h2>
                <p className="topModelDes">¡Compra ya!</p>
              </div>
            </div>
            <img className="model1" src={model1} alt="" />

            <div className="topModelBot"></div>
          </div>
        </section>

        <div className="cataList">
          <CatalogList refresh={refresh} />
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Product;
