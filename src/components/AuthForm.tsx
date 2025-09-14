import { useState } from "react";
import { auth } from "../firebase/config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import "../styles/AuthForm.css"; // Asegúrate de tener este archivo CSS para los estilos

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("✅ Usuario logueado");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("✅ Usuario registrado");
      }
    } catch (error) {
      console.error("❌ Error en auth:", error);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">{isLogin ? "Iniciar Sesión" : "Registrarse"}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
          required
        />
        <button type="submit" className="auth-button">
          {isLogin ? "Entrar" : "Registrarse"}
        </button>
      </form>
      <p className="auth-switch">
        {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
        <span onClick={() => setIsLogin(!isLogin)} className="auth-link">
          {isLogin ? "Regístrate" : "Inicia sesión"}
        </span>
      </p>
    </div>
  );
}