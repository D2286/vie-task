// src/components/Notes.tsx
import { useState } from "react";
import NoteChart from "./NoteChart";
import "../styles/Notes.css";

interface DataPoint {
  label: string;
  value: number; // saldo acumulado
  name: string;
  amount: number; // valor de la operación
  operation: "add" | "sub"; // tipo de operación
}

const daysOfWeek = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

export default function Notes() {
  const [graphData, setGraphData] = useState<DataPoint[]>([]);
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);
  const [amount, setAmount] = useState<number | "">("");
  const [name, setName] = useState<string>("");

  const updateDayValue = (operation: "add" | "sub") => {
    if (amount === "") return;

    setGraphData((prev) => {
      const lastValue = prev.length > 0 ? prev[prev.length - 1].value : 0;
      const newValue =
        operation === "add"
          ? lastValue + Number(amount)
          : lastValue - Number(amount);

      return [
        ...prev,
        {
          label: selectedDay,
          value: newValue,
          name: name || "Sin nombre",
          amount: Number(amount),
          operation,
        },
      ];
    });

    setAmount("");
    setName("");
  };

  // saldo actual
  const currentBalance =
    graphData.length > 0 ? graphData[graphData.length - 1].value : 0;

  return (
    <div className="notes-container">
      <h2>Registro de Notas</h2>

      {/* Formulario */}
      <div className="notes-form">
        <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
          {daysOfWeek.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Nombre del registro"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Cantidad"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value === "" ? "" : Number(e.target.value))
          }
        />

        <button className="add" onClick={() => updateDayValue("add")}>
          ➕ Sumar
        </button>
        <button className="sub" onClick={() => updateDayValue("sub")}>
          ➖ Restar
        </button>
      </div>

      {/* Gráfico */}
      <div className="notes-chart">
        <NoteChart graphData={graphData} />
      </div>

      {/* Historial con operaciones */}
      <div className="notes-history">
        <div className="history-header">
          <h3>Historial</h3>
          <p>
            <strong>Saldo actual:</strong>{" "}
            <span
              style={{ color: currentBalance >= 0 ? "green" : "red" }}
            >
              {currentBalance}
            </span>
          </p>
        </div>
        <ul>
          {graphData.map((entry, index) => (
            <li key={index}>
              <strong>{entry.label}</strong> - {entry.name}: {entry.amount}{" "}
              {entry.operation === "add" ? "(+)" : "(-)"} →{" "}
              <em>Saldo: {entry.value}</em>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
