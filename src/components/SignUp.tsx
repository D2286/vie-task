import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config'; // Asegúrate de que la ruta sea correcta a tu archivo config.ts

const SignUp: React.FC = () => {
  // Estados para almacenar el correo electrónico y la contraseña
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Estados para manejar mensajes de error y éxito
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Función que se ejecuta cuando se envía el formulario de registro
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario

    // Limpia los mensajes anteriores al intentar un nuevo registro
    setError(null);
    setSuccess(null);

    try {
      // Llama a la función de Firebase para crear un nuevo usuario con correo y contraseña
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Si el registro es exitoso, imprime el usuario en consola y muestra un mensaje de éxito
      console.log('Usuario registrado con éxito:', userCredential.user);
      setSuccess('¡Registro exitoso! Ya puedes iniciar sesión.');

      // Opcional: Limpia los campos del formulario después de un registro exitoso
      setEmail('');
      setPassword('');

    } catch (error: any) { // Captura cualquier error que ocurra durante el registro
      console.error('Error al registrar:', error.message);

      // Maneja errores específicos de Firebase y muestra un mensaje amigable al usuario
      if (error.code === 'auth/email-already-in-use') {
        setError('El correo electrónico ya está en uso. Por favor, usa otro.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Formato de correo electrónico inválido.');
      } else if (error.code === 'auth/weak-password') {
        setError('La contraseña es demasiado débil. Debe tener al menos 6 caracteres.');
      } else {
        // Para cualquier otro error, muestra el mensaje general de Firebase
        setError(`Error al registrar: ${error.message}`);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSignUp} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required // Campo obligatorio
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required // Campo obligatorio
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>Registrarse</button>
      </form>

      {/* Muestra mensajes de éxito o error */}
      {success && <p style={styles.successMessage}>{success}</p>}
      {error && <p style={styles.errorMessage}>{error}</p>}
    </div>
  );
};

// Estilos básicos para el componente (puedes mover esto a un archivo CSS)
const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    textAlign: 'center' as 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    gap: '15px',
  },
  formGroup: {
    textAlign: 'left' as 'left',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold' as 'bold',
    color: '#333',
  },
  input: {
    width: 'calc(100% - 20px)',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    boxSizing: 'border-box' as 'border-box',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold' as 'bold',
    transition: 'background-color 0.2s ease',
  },
  buttonHover: { // Esto es un ejemplo, se implementaría con CSS en un archivo aparte
    backgroundColor: '#0056b3',
  },
  successMessage: {
    color: 'green',
    marginTop: '15px',
    fontWeight: 'bold' as 'bold',
  },
  errorMessage: {
    color: 'red',
    marginTop: '15px',
    fontWeight: 'bold' as 'bold',
  },
};

export default SignUp;