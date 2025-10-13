import React, { useState } from "react";
import "../styles/ExtraNote.css";

interface ExtraNoteProps {
  onSave: (detalle: string, total: number) => void;
}

export default function ExtraNote({ onSave }: ExtraNoteProps) {
  const [detallePrincipal, setDetallePrincipal] = useState("");
  const [rows, setRows] = useState([{ detalle: "", valor: "" }]);

  const handleDetallePrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetallePrincipal(e.target.value);
  };

  const handleRowChange = (index: number, field: "detalle" | "valor", value: string) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const addRow = () => {
    setRows([...rows, { detalle: "", valor: "" }]);
  };

  const total = rows.reduce((acc, row) => acc + (parseFloat(row.valor) || 0), 0);

  return (
    <div className="extra-container">
      <div className="detalle-principal">
        <label>Detalle principal:</label>
        <input
          type="text"
          value={detallePrincipal}
          onChange={handleDetallePrincipalChange}
          placeholder="Ingrese el detalle principal"
        />
      </div>

      {rows.map((row, index) => (
        <div key={index} className="extra-row">
          <input
            type="text"
            placeholder="Detalle"
            value={row.detalle}
            onChange={(e) => handleRowChange(index, "detalle", e.target.value)}
          />
          <input
            type="number"
            placeholder="Valor"
            value={row.valor}
            onChange={(e) => handleRowChange(index, "valor", e.target.value)}
          />
        </div>
      ))}

      <div className="extra-footer">
        <button onClick={addRow}>➕ Agregar</button>
        <span className="extra-total">Total: {total}</span>
      </div>

      {/* Botón Guardar */}
      <div style={{ marginTop: "15px", textAlign: "right" }}>
        <button
          onClick={() => {
            onSave(detallePrincipal, total);
            setDetallePrincipal("");
            setRows([{ detalle: "", valor: "" }]); // limpiar después de guardar
          }}
          style={{ backgroundColor: "#007bff" }}
        >
          💾 Guardar
        </button>
      </div>
    </div>
  );
}
