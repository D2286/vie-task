import React, { useState } from 'react';
import { auth } from '../firebase/config';  
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { createUserProfile } from '../services/authService.ts'; // ✅ IMPORTACIÓN CORRECTA

const AuthForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isRegistering) {
        // 🔹 Registro
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // 🔹 Guardar perfil en Firestore
        await createUserProfile(userCredential.user.uid, {
          email,
          createdAt: new Date(),
        });

        console.log('Usuario registrado y perfil creado:', userCredential.user);
      } else {
        // 🔹 Login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Usuario logueado:', userCredential.user);
      }
    } catch (error) {
      console.error('Error en autenticación:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {isRegistering ? 'Registrar' : 'Entrar'}
        </button>
      </form>
      <p
        onClick={() => setIsRegistering(!isRegistering)}
        className="text-blue-500 mt-4 text-center cursor-pointer"
      >
        {isRegistering
          ? '¿Ya tienes cuenta? Inicia sesión'
          : '¿No tienes cuenta? Regístrate'}
      </p>
    </div>
  );
};

export default AuthForm;
