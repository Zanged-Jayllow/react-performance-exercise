import React, { useState, useEffect, useMemo, useCallback } from "react";

const makeHugeArray = () =>
  new Array(3000).fill(0).map((_, i) => ({
    id: i,
    text: "Item " + i + " " + new Array(100).fill("x").join(""),
  }));

function blockCPU(ms = 120) {
  const start = performance.now();
  while (performance.now() - start < ms) {
    // busy loop
  }
}

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

  useEffect(() => {
    blockCPU(150); 
  }, [items]); 

  return (
    <div style={{ border: "2px solid red", padding: 16, marginTop: 32 }}>
      <h2>HeavyComponent (Intentionally Slow)</h2>
      <p>
        This component simulates slow business logic, excessive rendering, and heavy object creation.
      </p>

      <input
        value={input}
        onChange={(e) => {
          blockCPU(80); // ❌ heavy validation
          setInput(e.target.value);
        }}
        placeholder="Type here (will lag!)"
      />

      <div style={{ height: 300, overflowY: "scroll", border: "1px solid #ccc", marginTop: 16 }}>
        {items.map((row, i) => {
          const computed = row.text
            .split("")
            .reverse()
            .join(""); 

          return (
            <div
              key={i}
              style={{
                padding: 8,
                borderBottom: "1px solid #eee",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <strong>{row.id}</strong> – {computed.substring(0, 60)}
              </div>

              <button
                onClick={() => {
                  blockCPU(200); // ❌ long main thread block
                  alert("Blocked UI thread for 200ms!");
                }}
              >
                Slow Btn
              </button>
            </div>
          );
        })}
      </div>

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

  return (
    <div className="dashboard-container">
      <h1>Performance Audit Dashboard</h1>
      <div className="hero-section">
        <img 
          src="https://via.placeholder.com/1200x600.png" 
          alt="Large Hero Asset" 
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
        <HeavyAnalyticsChart 
          config={{ theme: 'dark', value: heavyData }} 
          onUpdate={() => console.log('Chart updated')} 
        />
      </div>
    </div>
  );
}
