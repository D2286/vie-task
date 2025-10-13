// src/App.tsx
// ⭐ MODIFICADO: Ya NO necesitamos importar useState ni useEffect, ya que están en useAuth.
import AuthForm from './components/AuthForm.tsx';
//import SignUp from './components/SignUp';       // Importamos el componente de registro
import HomePage from './components/HomePage';   // Importamos el componente de la página principal (simplificado)
import { auth } from './firebase/config';     // Importamos la instancia de autenticación de Firebase
import { type User, onAuthStateChanged, signOut } from 'firebase/auth'; // Mantener 'signOut'
// ⭐ NUEVO: Importamos nuestro custom hook
import { useAuth } from "./use/useAuth"; 

function App() {
  // 1. Estados de la aplicación para manejar la autenticación
  // ⭐ MODIFICADO: Usamos el custom hook para obtener 'user' y 'loading'.
  const { user, loading } = useAuth();
  
  // 2. useEffect: ELIMINADO. Ahora está en useAuth.ts
  // ... (Se eliminó el bloque de useEffect aquí)

  // 3. Función para manejar el cierre de sesión (se mantiene igual)
  const handleLogout = async () => {
    try {
      await signOut(auth); // Llama a la función de Firebase para cerrar la sesión activa del usuario.
      console.log('Sesión cerrada con éxito'); // Mensaje en consola.
    } catch (error: any) {
      console.error('Error al cerrar sesión:', error.message); // Muestra errores en consola.
    }
  };

  // 4. Pantalla de carga inicial (se mantiene igual)
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
      <h1>Vie-task</h1>

      {user ? (
        // *******************************************************************
        // CONDICIÓN: SI 'user' TIENE UN VALOR (NO es null)
        // *******************************************************************
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', maxWidth: '600px', margin: '20px auto', backgroundColor: '#f9f9f9' }}>
          <HomePage /> {/* Renderizamos el componente de la página principal (simplificado) */}
          <p>Estás autenticado como: <strong>{user.email}</strong></p> {/* Mostramos el email del usuario logueado */}
          {/* <p>Tu ID de usuario (UID) es: {user.uid}</p> */}
          <button onClick={handleLogout} style={styles.button}>Cerrar Sesión</button> {/* Botón para cerrar sesión */}
        </div>
      ) : (
        // *******************************************************************
        // CONDICIÓN: SI 'user' ES NULL
        // *******************************************************************
        <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto' }}>
          <AuthForm /> {/* Renderizamos el formulario de registro */}
        </div>
      )}
    </div>
  );
}

// 6. Estilos para el botón de cerrar sesión (se mantiene igual)
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