// src/firebase/config.ts

// Importa las funciones necesarias del SDK de Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Necesario para la autenticación
import { getFirestore } from 'firebase/firestore'; // Necesario para la base de datos

// Tu objeto de configuración de Firebase (ahora usando variables de entorno)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  // measurementId: "G-WDPDD6GEFZ" // Esta línea también puede eliminarse si no usas Analytics
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta los servicios de Firebase que vas a usar en tu aplicación
export const auth = getAuth(app); // Ahora puedes usar 'auth' en tus componentes
export const db = getFirestore(app); // Ahora puedes usar 'db' en tus componentes

// Si necesitas la instancia de la aplicación en algún lugar (aunque para auth y db no es estrictamente necesario ya que los exportas), puedes exportarla
export default app;
