import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FixedSizeList as List } from "react-window";

const makeHugeArray = () =>
  new Array(3000).fill(0).map((_, i) => ({
    id: i,
    text: "Item " + i + " " + new Array(100).fill("x").join(""),
  }));

const worker = new Worker("worker.js");
worker.postMessage(null);
worker.onmessage = (e) => setHeavyData(e.data);

function blockCPU(ms = 120) {
  const start = performance.now();
  while (performance.now() - start < ms) {
    // busy loop
  }
}

const Row = React.memo(({ index, style, data }) => {
  const row = data[index];
  const computed = row.text.split("").reverse().join("");
  return (
    <div style={style}>
      <strong>{row.id}</strong> – {computed.substring(0, 60)}
    </div>
  );
});

// export default function HeavyComponent() { //
// Duplicated default exports will throw errors //
export function HeavyComponent() {
  // const items = makeHugeArray(); //
  // Heavy operations should be cached //
  const items = useMemo(() => makeHugeArray(), []);

  const [input, setInput] = useState("");

  // const derivedValue = items.map((i) => Math.random()).join("-"); //
  // Heavy operations should be cached //
  const derivedValue = useMemo(() => items.map(() => Math.random()).join("-"), [items]);

  // No need to block CPU in useEffect anymore //
  // Seems that no other logic depends on an useEffect? //
  // since we useMemo on item //

  return (
    <div style={{ border: "2px solid red", padding: 16, marginTop: 32 }}>
      <h2>HeavyComponent (Intentionally Slow)</h2>
      <p>
        This component simulates slow business logic, excessive rendering, and heavy object creation.
      </p>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type here (will lag!)"
      />

      <List height={300} itemCount={items.length} itemSize={40} itemData={items}>
        {Row}
      </List>

      <p style={{ marginTop: 16 }}>
        Derived: <strong>{derivedValue.slice(0, 100)}</strong>
      </p>
    </div>
  );
}

export default function SlowStudentDashboard() {
  const [inputValue, setInputValue] = useState('');
  const [count, setCount] = useState(0);

  const expensiveCalculation = () => {
    console.log('Running expensive calculation...');
    let result = 0;
    for (let i = 0; i < 500000000; i++) {
      result += Math.random();
    }
    return result;
  };
  
  // const heavyData = expensiveCalculation(); //
  // Heavy operations should be cached //
  const heavyData = useMemo(() => expensiveCalculation(), []);
  
  // Move the unstable porp input outside and useMemo and useCallback //
  const config = useMemo(() => ({ theme: 'dark', value: heavyData }), [heavyData]);
  const handleUpdate = useCallback(() => console.log('Chart updated'), []);

  return (
    <div className="dashboard-container">
      <h1>Performance Audit Dashboard</h1>
      <div className="hero-section">
        <img
		  src="/hero.webp"
		  alt="Large Hero Asset"
		  width={1200}
		  height={600}
		  loading="eager"
		/>
      </div>

      <div className="controls">
        <h2>Interactivity Test</h2>
        <input 
          type="text" 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          placeholder="Type here to feel the lag..." 
        />
        
        <button onClick={() => setCount(count + 1)}>
          Re-render App (Count: {count})
        </button>
      </div>

      <div className="analytics">
		<HeavyAnalyticsChart config={config} onUpdate={handleUpdate} />
      </div>
    </div>
  );
}
