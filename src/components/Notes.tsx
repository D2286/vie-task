// src/components/Notes.tsx (Completo y Corregido)
import React, { useState } from "react";
import NoteChart from "./NoteChart";
import ExtraNote from "./ExtraNote";
import { useNotes, type Transaction } from "../use/useNotes"; 
import { useAuth } from "../use/useAuth";
import "../styles/Notes.css"; 

// FUNCIÓN DE AYUDA: Corrige el desfase de zona horaria
const getLocalISODate = (): string => {
    const date = new Date();
    // Ajusta la hora local para obtener la fecha ISO correcta
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().split('T')[0];
};

export default function Notes() {
  const { 
    transactions: graphData, 
    addTransaction, 
    deleteTransaction, 
    loading: loadingTransactions,
    currentBalance 
  } = useNotes();
  const { user } = useAuth();
  
  const [selectedDate, setSelectedDate] = useState<string>(getLocalISODate()); 
  const [amount, setAmount] = useState<string>(""); 
  const [name, setName] = useState<string>("");
  const [showChart, setShowChart] = useState(false);
  const [showExtra, setShowExtra] = useState(false);

  // ⭐ CORRECCIÓN CLAVE 1: Lógica para Sumar/Restar
  const updateDayValue = (operation: "add" | "sub") => {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0 || !selectedDate) {
      console.warn("Valor inválido o fecha no seleccionada. Operación cancelada.");
      return; 
    }

    // ⭐ Calculamos el nombre fuera de la llamada para evitar el TypeError
    // Si 'name' está vacío, usamos 'Ingreso' o 'Gasto'.
    const transactionName = name || (operation === 'add' ? "Ingreso" : "Gasto");

    addTransaction({
      name: transactionName, // Ya es un string definido
      amount: numAmount, 
      operation,
      date: selectedDate, 
    });

    setAmount("");
    setName("");
  };

  // ⭐ CORRECCIÓN CLAVE 2: Lógica para Nota Extra
  const handleSaveExtra = (detallePrincipal: string, total: number) => {
    if (!selectedDate || total <= 0) {
      console.warn("Fecha no seleccionada o total de nota extra inválido.");
      return;
    }

    // ⭐ Aseguramos que el nombre tenga un valor predeterminado si 'detallePrincipal' está vacío
    const transactionName = detallePrincipal || "Nota Extra (Gasto)";

    addTransaction({
      name: transactionName, // Ya es un string definido
      amount: total,
      operation: "sub", 
      date: selectedDate,
    });
    
    setShowExtra(false);
  };
  
  // FUNCIÓN PARA ELIMINAR
  const handleDelete = (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta transacción? El saldo se recalculará.")) {
      deleteTransaction(id);
    }
  };

  // Manejo de la carga
  if (!user || loadingTransactions) {
    return (
      <div className="notes-container" style={{ textAlign: 'center', padding: '50px' }}>
        <p style={{ color: '#f0f0f0' }}>{user ? "Cargando transacciones..." : ""}</p>
      </div>
    );
  }

  return (
    <div className="notes-container">
      <h3>Gestión de Notas</h3>
    
      {/* Saldo Actual Destacado */}
      <div className="current-balance">
        Saldo Actual: 
        <strong 
          style={{ 
            color: currentBalance > 0 
                ? 'lightgreen' 
                : (currentBalance < 0 ? 'red' : '#f0f0f0') 
          }}
        >
          ${currentBalance.toFixed(2)}
        </strong> 
      </div>

      {/* ----------------- FORMULARIO DE ENTRADA ----------------- */}
      <div className="notes-form">
        
        <div>
          <label htmlFor="date-input">📅 Fecha:</label>
          <input
            id="date-input"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="name-input">Nombre:</label>
          <input
            id="name-input"
            type="text"
            placeholder="Nombre de la operación"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="amount-input">Valor:</label>
          <input
            id="amount-input"
            type="number"
            placeholder="Monto"
            value={amount}
            onChange={(e) => setAmount(e.target.value)} 
          />
        </div>

        <div className="notes-buttons">
          <button onClick={() => updateDayValue("add")}>➕ Sumar</button>
          <button onClick={() => updateDayValue("sub")}>➖ Restar</button>
        </div>
      </div>
      
      {/* ----------------- GRÁFICO ----------------- */}
      <button onClick={() => setShowChart(!showChart)}>
        {showChart ? "Ocultar Gráfico" : "Mostrar Gráfico"}
      </button>

      {showChart && (
        <div className="notes-chart">
          <NoteChart graphData={graphData} />
        </div>
      )}
      
      {/* ----------------- AGREGAR EXTRA ----------------- */}
      <button onClick={() => setShowExtra(!showExtra)}>
        {showExtra ? "Ocultar Extra" : "➕ Agregar Extra"}
      </button>

      {showExtra && <ExtraNote onSave={handleSaveExtra} />}

      {/* ----------------- REGISTROS/HISTORIAL ----------------- */}
      <div className="extras-list">
        <h4>📋 Registros:</h4>
        <ul>
          {graphData.map((item, index) => {
            if (!item.id) return null; 

            const isAdd = item.operation === "add";
            const sign = isAdd ? "+" : "-";
            const amountClass = isAdd ? "add" : "sub";
            const transactionClass = isAdd ? "transaction-add" : "transaction-sub";

            return (
              <li key={item.id} className={transactionClass}>
                <div className="transaction-details">
                  <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                  <div style={{ fontSize: '0.9em', color: '#777' }}>📅 {item.date}</div>
                </div>
                
                <div className={`transaction-amount ${amountClass}`}>
                  <span style={{ fontSize: '1.1em' }}>
                    {sign}{item.amount.toFixed(2)}
                  </span>
                  <div style={{ fontSize: '0.8em', color: '#aaa', fontWeight: 'normal' }}>
                    Saldo: {item.value.toFixed(2)}
                  </div>
                </div>
                
                {/* BOTÓN DE ELIMINACIÓN */}
                <button 
                  className="delete-button" 
                  onClick={() => handleDelete(item.id!)}
                >
                  X
                </button>
              </li>
            );
          }).reverse() 
          }
        </ul>
      </div>
    </div>
  );
}