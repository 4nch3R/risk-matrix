// Your entire Operational Risk Matrix React component
// (This is exactly the same code that was generated in the canvas)

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

const PROB_OPTIONS = [
  { value: 1, label: "Rare (1)" },
  { value: 2, label: "Unlikely (2)" },
  { value: 3, label: "Possible (3)" },
  { value: 4, label: "Likely (4)" },
  { value: 5, label: "Almost Certain (5)" },
];

const CONS_OPTIONS = [
  { value: 1, label: "Negligible (1)" },
  { value: 2, label: "Minor (2)" },
  { value: 3, label: "Moderate (3)" },
  { value: 4, label: "Major (4)" },
  { value: 5, label: "Catastrophic (5)" },
];

const DEFAULT_THRESHOLDS = {
  low: 4,
  medium: 9,
  high: 14,
  critical: 25,
};

function mapScoreToCategory(score, thresholds = DEFAULT_THRESHOLDS) {
  if (score <= thresholds.low) return "Low";
  if (score <= thresholds.medium) return "Medium";
  if (score <= thresholds.high) return "High";
  return "Critical";
}

function categoryColor(category) {
  switch (category) {
    case "Low":
      return "bg-green-200";
    case "Medium":
      return "bg-yellow-200";
    case "High":
      return "bg-orange-300";
    case "Critical":
      return "bg-red-300";
    default:
      return "bg-gray-100";
  }
}

function OperationalRiskMatrix() {
  const [factors, setFactors] = useState([]);
  const [newName, setNewName] = useState("");
  const [newProb, setNewProb] = useState(3);
  const [newCons, setNewCons] = useState(3);
  const [thresholds, setThresholds] = useState(DEFAULT_THRESHOLDS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("orm_factors_v1");
      if (raw) setFactors(JSON.parse(raw));

      const th = localStorage.getItem("orm_thresholds_v1");
      if (th) setThresholds(JSON.parse(th));
    } catch (e) {}
  }, []);

  useEffect(() => {
    localStorage.setItem("orm_factors_v1", JSON.stringify(factors));
  }, [factors]);

  useEffect(() => {
    localStorage.setItem("orm_thresholds_v1", JSON.stringify(thresholds));
  }, [thresholds]);

  function computeScore(prob, cons) {
    return Number(prob) * Number(cons);
  }

  function addFactor() {
    if (!newName.trim()) return;
    const f = {
      id: Date.now() + Math.random(),
      name: newName.trim(),
      prob: Number(newProb),
      cons: Number(newCons),
    };
    setFactors([...factors, f]);
    setNewName("");
    setNewProb(3);
    setNewCons(3);
  }

  function deleteFactor(id) {
    setFactors(factors.filter((f) => f.id !== id));
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Operational Risk Matrix</h1>

      <div className="mt-4">
        <input
          className="border p-2"
          placeholder="Factor name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />

        <select
          className="border p-2 ml-2"
          value={newProb}
          onChange={(e) => setNewProb(e.target.value)}
        >
          {PROB_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <select
          className="border p-2 ml-2"
          value={newCons}
          onChange={(e) => setNewCons(e.target.value)}
        >
          {CONS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <button className="ml-2 bg-blue-600 text-white p-2" onClick={addFactor}>
          Add
        </button>
      </div>

      <div className="mt-4">
        {factors.map((f) => (
          <div key={f.id} className="border p-2 flex justify-between mb-2">
            <div>
              <strong>{f.name}</strong>  
              <br />
              Prob: {f.prob} | Cons: {f.cons} | Score: {computeScore(f.prob, f.cons)}
            </div>

            <button
              className="bg-red-500 text-white px-2"
              onClick={() => deleteFactor(f.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Mount the app into index.html
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<OperationalRiskMatrix />);
