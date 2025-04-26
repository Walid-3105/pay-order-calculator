import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [x, setX] = useState("");
  const [result, setResult] = useState(null);
  const [withTax, setWithTax] = useState(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null);
      });
    }
  };

  const calculate = (value) => {
    const numX = parseInt(value);
    if (isNaN(numX)) {
      setResult("Please Enter a Valid Number");
      setWithTax(null);
    } else {
      const calculation = {
        Stamp: Math.abs(numX * 15 - 100),
        Ragi: numX * 10 + 388,
        "Sub Ragi": numX * 30,
        "Festival Tax": numX * 20,
        "Sub total": numX * 75 + 520,
      };

      // Apply tax to specific fields
      const withTaxCalculation = Object.keys(calculation).reduce((acc, key) => {
        if (["Stamp", "Ragi", "Sub Ragi", "Festival Tax"].includes(key)) {
          acc[key] =
            calculation[key] +
            (calculation[key] > 100000
              ? 115
              : calculation[key] > 1000
              ? 58
              : 23);
        } else {
          acc[key] = calculation[key]; // No tax applied to Sub total
        }
        return acc;
      }, {});

      setResult(calculation);
      setWithTax(withTaxCalculation);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="card w-96 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-3">
          PO Calculation
        </h2>

        <label className="block text-sm font-semibold mb-1">
          Enter the value of X:
        </label>
        <input
          type="number"
          className="input input-bordered w-full"
          placeholder="Enter a number..."
          value={x}
          onChange={(e) => {
            setX(e.target.value);
            calculate(e.target.value);
          }}
        />

        <div className="mt-4 p-4 border border-blue-500 rounded-lg bg-blue-50">
          <h3 className="text-lg font-bold text-blue-700">Result</h3>
          <p className="text-gray-700 font-mono">
            {result
              ? typeof result === "string"
                ? result
                : Object.entries(result).map(([key, value]) => (
                    <span key={key}>
                      <strong>{key}:</strong> {value}
                      <br />
                    </span>
                  ))
              : "Waiting for input..."}
          </p>
        </div>

        {withTax && (
          <div className="mt-4 p-4 border border-green-500 rounded-lg bg-green-50">
            <h3 className="text-lg font-bold text-green-700">With Tax</h3>
            <p className="text-gray-700 font-mono">
              {Object.entries(withTax).map(([key, value]) => (
                <span key={key}>
                  <strong>{key}:</strong> {value}
                  <br />
                </span>
              ))}
            </p>
          </div>
        )}

        <p className="mt-3 text-xs text-gray-500">Made by SA Al Walid.</p>
        {/* 👇 This Install Button */}
        {deferredPrompt && (
          <button
            onClick={handleInstall}
            style={{
              padding: "10px 20px",
              backgroundColor: "#000000",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              marginTop: "20px",
              cursor: "pointer",
            }}
          >
            Install App
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
