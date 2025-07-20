import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'; // Importa AMBAS funciones
import { auth } from '../firebase/config'; // Asegúrate de que la ruta sea correcta

const AuthForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  // Nuevo estado: true para modo inicio de sesión, false para modo registro
  const [isLoginMode, setIsLoginMode] = useState(true); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (isLoginMode) { // Si estamos en modo de inicio de sesión
        await signInWithEmailAndPassword(auth, email, password);
        console.log('Usuario ha iniciado sesión con éxito.');
        setSuccess('¡Inicio de sesión exitoso!');
      } else { // Si estamos en modo de registro
        await createUserWithEmailAndPassword(auth, email, password);
        console.log('Usuario registrado con éxito.');
        setSuccess('¡Registro exitoso! Ya estás autenticado.');
      }
      setEmail('');
      setPassword('');
    } catch (err: any) {
      console.error('Error de autenticación:', err.message);
      // Manejo de errores específicos
      if (err.code === 'auth/email-already-in-use') {
        setError('El correo electrónico ya está en uso. Usa "Iniciar Sesión" o cambia de correo.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Formato de correo electrónico inválido.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña es demasiado débil (mínimo 6 caracteres).');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Correo electrónico o contraseña incorrectos.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Demasiados intentos fallidos. Inténtalo de nuevo más tarde.');
      }
      else {
        setError(`Error: ${err.message}`);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2>{isLoginMode ? 'Iniciar Sesión' : 'Registrarse'}</h2> {/* Título dinámico */}
      
      {/* Mensaje de bienvenida/instrucción */}
      {!success && !error && (
        <p style={{ color: 'gray', fontSize: '0.9em', marginBottom: '15px' }}>
          {isLoginMode ? 'Ingresa tus credenciales.' : 'Regístrate para crear una cuenta nueva.'}
        </p>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div>
          <label htmlFor="email" style={styles.label}>Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div>
          <label htmlFor="password" style={styles.label}>Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        
        {/* Botón principal (submit) */}
        <button type="submit" style={styles.button}>
          {isLoginMode ? 'Iniciar Sesión' : 'Registrarse'} {/* Texto dinámico */}
        </button>
      </form>

      {/* Mensajes de éxito o error */}
      {success && <p style={styles.successMessage}>{success}</p>}
      {error && <p style={styles.errorMessage}>{error}</p>}

      {/* Botón para alternar entre modos */}
      <button 
        type="button" // IMPORTANTE: type="button" para que no envíe el formulario
        onClick={() => {
          setIsLoginMode(prevMode => !prevMode); // Alterna el modo
          setError(null); // Limpia mensajes al cambiar de modo
          setSuccess(null);
          setEmail('');
          setPassword('');
        }} 
        style={{ ...styles.button, backgroundColor: '#6c757d', marginTop: '10px' }} // Estilo diferente
      >
        {isLoginMode ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Iniciar Sesión'}
      </button>
    </div>
  );
};

// Estilos (mantienen los de SignUp, puedes ajustarlos)
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

export default AuthForm;