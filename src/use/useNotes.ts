// src/use/useNotes.ts (Contenido Completo y Final)
import { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '../firebase/config';
import { useAuth } from './useAuth'; 
import { 
  collection, 
  query, 
  where, // Necesario para filtrar por usuario
  orderBy, // Necesario para ordenar por fecha y marca de tiempo
  onSnapshot, // Necesario para la conexión en tiempo real
  addDoc, 
  serverTimestamp,
  QueryDocumentSnapshot,
  deleteDoc, // Necesario para eliminar
  doc, // Necesario para referenciar el documento a eliminar
} from 'firebase/firestore';

// Define la estructura de datos que se guarda en la base de datos (DB)
export interface Transaction {
  id?: string;
  name: string;
  amount: number;
  operation: "add" | "sub";
  date: string; // YYYY-MM-DD
  createdAt: any; // Usaremos 'any' (o Timestamp) de Firebase
  userId?: string; // Incluido para la base de datos
}

// Define la estructura de datos para el Front-End (FE) incluyendo el valor calculado
export interface GraphTransaction extends Transaction {
  value: number; // Saldo acumulado (calculado localmente)
  label: string; // Para el gráfico (generalmente la fecha)
}

// Interfaz que define los datos mínimos necesarios para añadir una transacción
interface TransactionData {
    name: string;
    amount: number;
    operation: "add" | "sub";
    date: string;
}


export function useNotes() {
  const { user } = useAuth(); // Obtiene el usuario autenticado
  const [dbTransactions, setDbTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // -------------------------------------------------------------------
  // A. FUNCIÓN PARA AÑADIR UNA TRANSACCIÓN
  // -------------------------------------------------------------------
  const addTransaction = useCallback(async (data: TransactionData) => {
    if (!user) {
      console.error("No user authenticated to add transaction.");
      return;
    }
    
    // El 'userId' es crucial para las reglas de seguridad y la consulta de datos
    const fullData: Omit<Transaction, 'id'> = { 
      ...data,
      userId: user.uid,
      createdAt: serverTimestamp(),
    };

    try {
      // 1. Añade el documento a la colección 'transactions'
      await addDoc(collection(db, 'transactions'), fullData);
      console.log("✅ Transacción añadida con éxito.");
    } catch (e) {
      console.error("❌ Error al añadir transacción:", e);
    }
  }, [user]); // Dependencia: Se recrea si el usuario cambia

  // -------------------------------------------------------------------
  // B. FUNCIÓN PARA ELIMINAR UNA TRANSACCIÓN
  // -------------------------------------------------------------------
  const deleteTransaction = useCallback(async (id: string) => {
      if (!user) return;

      try {
          // 1. Obtiene la referencia al documento
          const docRef = doc(db, 'transactions', id);
          
          // 2. Elimina el documento
          await deleteDoc(docRef);
          console.log(`✅ Transacción con ID ${id} eliminada con éxito.`);
      } catch (e) {
          console.error("❌ Error al eliminar la transacción (Revisa reglas de seguridad):", e);
      }
  }, [user]);

  // -------------------------------------------------------------------
  // C. EFECTO DE LECTURA DE DATOS (ON SNAPSHOT - CLAVE DE LA CONEXIÓN)
  // -------------------------------------------------------------------
  useEffect(() => {
    if (!user) {
      setDbTransactions([]); // Limpia si no hay usuario
      setLoading(false);
      return;
    }

    setLoading(true);

    // 1. Crea la consulta para obtener SOLO las transacciones de este usuario
    const transactionsCollectionRef = collection(db, 'transactions');
    
    // ⭐ ESTA ES LA CONSULTA QUE REQUIERE EL ÍNDICE COMPUESTO ⭐
    const q = query(
      transactionsCollectionRef,
      where("userId", "==", user.uid), 
      orderBy('date', 'asc'), // Ordena por fecha
      orderBy('createdAt', 'asc') // Ordena por marca de tiempo para el orden final
    );

    // 2. Suscripción en tiempo real a la base de datos
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newTransactions: Transaction[] = [];
      snapshot.forEach((doc: QueryDocumentSnapshot) => {
        // Mapea los datos del documento incluyendo el ID
        newTransactions.push({
          id: doc.id,
          ...doc.data() as Omit<Transaction, 'id'>
        });
      });
      
      setDbTransactions(newTransactions);
      setLoading(false);
    }, (error) => {
      console.error("❌ Error al escuchar transacciones (onSnapshot):", error);
      // Muestra el error de índice que debes crear en la consola de Firebase
      console.log(error); 
      setLoading(false);
    });

    // Función de limpieza para cancelar la suscripción
    return () => unsubscribe();
  }, [user]); // Se ejecuta cada vez que el estado de autenticación cambia

  // -------------------------------------------------------------------
  // D. CÁLCULO DE SALDO ACUMULADO Y FORMATO DE DATOS
  // -------------------------------------------------------------------
  const { transactions, currentBalance } = useMemo(() => {
    let balance = 0;
    const formattedTransactions: GraphTransaction[] = [];

    // 1. Calcula el saldo y formatea para el gráfico/lista
    for (const t of dbTransactions) {
      const amount = t.operation === 'add' ? t.amount : -t.amount;
      balance += amount;

      formattedTransactions.push({
        ...t,
        value: balance,
        label: t.date, // Usamos la fecha como etiqueta para el gráfico
      });
    }

    // 2. Redondea el saldo actual para evitar errores de coma flotante
    const finalBalance = parseFloat(balance.toFixed(2));

    return { 
      transactions: formattedTransactions, 
      currentBalance: finalBalance 
    };
  }, [dbTransactions]); // Se recalcula cuando los datos crudos cambian

  // -------------------------------------------------------------------
  // E. DEVOLUCIÓN DE VALORES Y FUNCIONES
  // -------------------------------------------------------------------
  return { 
    transactions, // Datos de transacciones con saldo acumulado
    currentBalance, // Saldo actual
    loading, // Estado de carga
    addTransaction, // Función para añadir
    deleteTransaction, // Función para eliminar
  };
}