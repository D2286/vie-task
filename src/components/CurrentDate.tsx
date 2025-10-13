// src/components/CurrentDate.tsx
import React from "react";

const CurrentDate: React.FC = () => {
  const today = new Date();

  // Formato en español
  const formattedDate = today.toLocaleDateString("es-ES", {
    weekday: "long", // día de la semana
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div style={{ marginBottom: "20px", fontSize: "18px", fontWeight: "bold" }}>
      📅 Hoy es {formattedDate}
    </div>
  );
};

export default CurrentDate;
