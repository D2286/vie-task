// src/App.tsx

import React, { useState, useEffect } from 'react'; // Necesitamos useState y useEffect de React
import SignUp from './components/SignUp';       // Importamos el componente de registro
import HomePage from './components/HomePage';   // Importamos el componente de la página principal (simplificado)
import { auth } from './firebase/config';     // Importamos la instancia de autenticación de Firebase
import { type User, onAuthStateChanged, signOut } from 'firebase/auth';

function App() {
  // 1. Estados de la aplicación para manejar la autenticación
  // 'user': Almacena la información del usuario logueado (un objeto User de Firebase) o null.
  const [user, setUser] = useState<User | null>(null);
  // 'loading': Es true mientras la aplicación está verificando el estado de autenticación inicial con Firebase.
  const [loading, setLoading] = useState(true);

  // 2. useEffect: El corazón de la gestión de la sesión con Firebase
  useEffect(() => {
    // onAuthStateChanged: Esta es una función de Firebase que configura un "escuchador".
    // Se activa cada vez que el estado de autenticación del usuario cambia (alguien inicia sesión, cierra sesión, se registra).
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Actualiza nuestro estado 'user' con la información del usuario actual (o null si no hay sesión).
      setLoading(false);    // Indicamos que la verificación inicial de la sesión ha terminado.
    });

    // Función de limpieza:
    // Esta función se ejecuta automáticamente cuando el componente 'App' se "desmonta" (se deja de mostrar).
    // Es CRUCIAL para detener el listener de onAuthStateChanged y evitar fugas de memoria o comportamientos inesperados.
    return () => unsubscribe();
  }, []); // El array vacío '[]' como segundo argumento significa que este 'useEffect' se ejecuta SOLAMENTE una vez al montar el componente 'App'.

  // 3. Función para manejar el cierre de sesión
  const handleLogout = async () => {
    try {
      await signOut(auth); // Llama a la función de Firebase para cerrar la sesión activa del usuario.
      console.log('Sesión cerrada con éxito'); // Mensaje en consola.
    } catch (error: any) {
      console.error('Error al cerrar sesión:', error.message); // Muestra errores en consola.
    }
  };

  // 4. Pantalla de carga inicial
  // Mientras 'loading' sea true (lo que significa que estamos esperando la respuesta de Firebase sobre el estado de la sesión),
  // mostramos un mensaje de carga.
  if (loading) {
    return (
      <div className="App" style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Verificando sesión...</h2>
        <p>Un momento, por favor.</p>
      </div>
    );
  }

  // 5. Renderizado Condicional Principal: Aquí 'App.tsx' decide qué mostrar
  return (
    <div className="App" style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h1>Mi Aplicación de Autenticación</h1>

      {user ? (
        // *******************************************************************
        // CONDICIÓN: SI 'user' TIENE UN VALOR (NO es null)
        // Esto significa que Firebase nos ha confirmado que hay un usuario AUTENTICADO.
        // Mostramos el contenido para usuarios logueados.
        // *******************************************************************
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', maxWidth: '600px', margin: '20px auto', backgroundColor: '#f9f9f9' }}>
          <HomePage /> {/* Renderizamos el componente de la página principal (simplificado) */}
          <p>Estás autenticado como: <strong>{user.email}</strong></p> {/* Mostramos el email del usuario logueado */}
          <p>Tu ID de usuario (UID) es: {user.uid}</p>                 {/* Mostramos el UID del usuario */}
          <button onClick={handleLogout} style={styles.button}>Cerrar Sesión</button> {/* Botón para cerrar sesión */}
        </div>
      ) : (
        // *******************************************************************
        // CONDICIÓN: SI 'user' ES NULL
        // Esto significa que NO hay un usuario autenticado.
        // Mostramos el formulario de registro.
        // *******************************************************************
        <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto' }}>
          <SignUp /> {/* Renderizamos el formulario de registro */}
        </div>
      )}
    </div>
  );
}

// 6. Estilos para el botón de cerrar sesión
// Estos estilos son específicos para el botón manejado directamente en App.tsx.
const styles = {
  button: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold' as 'bold',
    marginTop: '15px',
  },
};

export default App; // 7. Exportamos el componente App para que pueda ser usado en main.tsx