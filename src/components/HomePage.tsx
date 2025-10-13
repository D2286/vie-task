import React from "react";
import "../styles/HomePage.css";
import Notes from "./Notes";
import CurrentDate from "./CurrentDate"; // 👈 importar el nuevo componente

const HomePage: React.FC = () => {
  return (
    <div className="home-container">
      <h2 className="home-title">¡Bienvenido!</h2>
      <CurrentDate /> {/* 👈 aquí lo mostramos */}

      <Notes />
    </div>
  );
};

export default HomePage;
