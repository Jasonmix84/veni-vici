import React from "react";

function BanChip({ value, onRemove }) {
  return (
    <span
      className="ban-chip"
      title="Remove"
      onClick={() => onRemove(value)}
      style={{ cursor: "pointer" }}
    >
      {value} <span className="ban-chip-x">&times;</span>
    </span>
  );
}

export default BanChip;