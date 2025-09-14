import React from "react";
import "../styles/HomePage.css";
import Notes from "./Notes.tsx";

const HomePage: React.FC = () => {
  return (
    <div className="home-container">
      <h2 className="home-title">¡Bienvenido!</h2>
      <p className="home-text">
        Aquí podrás guardar tus anotaciones personales.
      </p>

      <Notes />
    </div>
  );
};

export default HomePage;
