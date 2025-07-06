
import React, { useState } from "react";

function Card({ title, value, extraClass = "" }) {
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '16px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '16px'
    }}>
      <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>{title}</h2>
      <p style={{ fontSize: '20px', color: extraClass === 'text-green-700' ? 'green' : 'black' }}>{value}</p>
    </div>
  );
}

export default function RuralEdgeDashboard() {
  const [farmBotOpen, setFarmBotOpen] = useState(false);
  const [userQuestion, setUserQuestion] = useState("");
  const [botResponse, setBotResponse] = useState("");

  const handleAskFarmBot = async () => {
    if (!userQuestion.trim()) return;
    setBotResponse("Thinking...");

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer YOUR_OPENAI_API_KEY"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: userQuestion }]
        })
      });

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        setBotResponse(data.choices[0].message.content);
      } else {
        setBotResponse("Something went wrong. Try again.");
      }
    } catch (error) {
      setBotResponse("Error contacting FarmBot. Please try again later.");
    }
  };

  return (
    <div style={{ padding: '16px', maxWidth: '400px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '16px' }}>RuralEdge</h1>
      <p style={{ textAlign: 'center', fontSize: '14px', color: '#555', marginBottom: '24px' }}>
        Central Hawke's Bay – Smart tools for busy farmers
      </p>

      <Card title="Lamb Schedule Price" value="$7.60/kg (avg)" />
      <Card title="Store Lamb Value" value="$118/head" />
      <Card title="Pasture Growth" value="+26 kgDM/ha/day" />
      <Card title="Feed Surplus Estimate" value="+2,100 kgDM" extraClass="text-green-700" />
      <Card title="Weather Alert" value="Rain expected in 48 hours – slow rotation now." />

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <button onClick={() => setFarmBotOpen(true)} style={{
          width: '100%',
          padding: '12px',
          fontSize: '16px',
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '6px'
        }}>
          Ask FarmBot
        </button>
      </div>

      {farmBotOpen && (
        <div style={{
          marginTop: '24px',
          padding: '16px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Ask FarmBot</h2>
          <input
            type="text"
            placeholder="e.g. How many lambs can I run on 10ha?"
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '8px',
              marginBottom: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
          <button onClick={handleAskFarmBot} style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px'
          }}>
            Submit
          </button>
          {botResponse && (
            <p style={{ marginTop: '16px', fontSize: '14px', whiteSpace: 'pre-wrap' }}>{botResponse}</p>
          )}
        </div>
      )}

      <footer style={{ marginTop: '32px', textAlign: 'center', fontSize: '12px', color: '#888' }}>
        © 2025 Jason Wyn-Harris
      </footer>
    </div>
  );
}
