import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.text}>¡Bienvenido a tu Página Principal!</h2> {/* Añade style={styles.text} */}
      <p style={styles.text}>Este es el contenido simple de tu Home, renderizado directamente.</p> {/* Añade style={styles.text} */}
      <p style={styles.text}>Aquí es donde irán las funciones principales de tu aplicación.</p> {/* Añade style={styles.text} */}
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    border: '1px solid #007bff',
    borderRadius: '10px',
    maxWidth: '600px',
    margin: '50px auto',
    backgroundColor: '#eaf4ff', // Fondo azul muy claro
    textAlign: 'center' as 'center',
    boxShadow: '0 4px 15px rgba(0, 123, 255, 0.2)',
  },
  text: { // ¡Nuevo estilo para el texto!
    color: '#333', // Color gris oscuro, fácil de leer
  },
};

export default HomePage;