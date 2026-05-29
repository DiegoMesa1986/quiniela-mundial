import { useEffect, useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import {
  container,
  card,
  input,
  button,
  grid3,
  gridMatches,
  matchCard,
  scoreInput,
  scoreContainer
} from "./styles";

// ✅ PARTIDOS (usa tus 72 aquí)
const matches = [
  { "id": 1, "group": "A", "date": "11 Jun 2026", "stadium": "Estadio Ciudad de México (Azteca)", "a": "México", "b": "Sudáfrica" },
  { "id": 2, "group": "A", "date": "11 Jun 2026", "stadium": "Estadio Guadalajara (Akron)", "a": "Corea del Sur", "b": "República Checa" },
  { "id": 3, "group": "B", "date": "12 Jun 2026", "stadium": "Estadio Toronto (BMO Field)", "a": "Canadá", "b": "Bosnia y Herzegovina" },
  { "id": 4, "group": "D", "date": "12 Jun 2026", "stadium": "Estadio Los Ángeles (SoFi Stadium)", "a": "Estados Unidos", "b": "Paraguay" },
  { "id": 5, "group": "B", "date": "13 Jun 2026", "stadium": "Estadio Bahía de San Francisco", "a": "Catar", "b": "Suiza" },
  { "id": 6, "group": "C", "date": "13 Jun 2026", "stadium": "Estadio Nueva York / Nueva Jersey", "a": "Brasil", "b": "Marruecos" },
  { "id": 7, "group": "C", "date": "13 Jun 2026", "stadium": "Estadio Boston (Gillette Stadium)", "a": "Haití", "b": "Escocia" },
  { "id": 8, "group": "D", "date": "13 Jun 2026", "stadium": "Estadio BC Place Vancouver", "a": "Australia", "b": "Turquía" },
  { "id": 9, "group": "E", "date": "14 Jun 2026", "stadium": "Estadio Houston (NRG Stadium)", "a": "Alemania", "b": "Curazao" },
  { "id": 10, "group": "F", "date": "14 Jun 2026", "stadium": "Estadio Dallas (AT&T Stadium)", "a": "Países Bajos", "b": "Japón" },
  { "id": 11, "group": "E", "date": "14 Jun 2026", "stadium": "Estadio Filadelfia", "a": "Costa de Marfil", "b": "Ecuador" },
  { "id": 12, "group": "F", "date": "14 Jun 2026", "stadium": "Estadio Monterrey (BBVA)", "a": "Suecia", "b": "Túnez" },
  { "id": 13, "group": "H", "date": "15 Jun 2026", "stadium": "Estadio Atlanta (Mercedes-Benz)", "a": "España", "b": "Cabo Verde" },
  { "id": 14, "group": "G", "date": "15 Jun 2026", "stadium": "Estadio de Seattle (Lumen Field)", "a": "Bélgica", "b": "Egipto" },
  { "id": 15, "group": "H", "date": "15 Jun 2026", "stadium": "Estadio Miami (Hard Rock)", "a": "Arabia Saudita", "b": "Uruguay" },
  { "id": 16, "group": "G", "date": "15 Jun 2026", "stadium": "Estadio Los Ángeles (SoFi Stadium)", "a": "RI de Irán", "b": "Nueva Zelanda" },
  { "id": 17, "group": "I", "date": "16 Jun 2026", "stadium": "Estadio Nueva York / Nueva Jersey", "a": "Francia", "b": "Senegal" },
  { "id": 18, "group": "I", "date": "16 Jun 2026", "stadium": "Estadio Boston (Gillette Stadium)", "a": "Irak", "b": "Noruega" },
  { "id": 19, "group": "J", "date": "16 Jun 2026", "stadium": "Estadio Kansas City (Arrowhead)", "a": "Argentina", "b": "Argelia" },
  { "id": 20, "group": "J", "date": "16 Jun 2026", "stadium": "Estadio Bahía de San Francisco", "a": "Austria", "b": "Jordania" },
  { "id": 21, "group": "K", "date": "17 Jun 2026", "stadium": "Estadio Houston (NRG Stadium)", "a": "Portugal", "b": "RD Congo" },
  { "id": 22, "group": "L", "date": "17 Jun 2026", "stadium": "Estadio Dallas (AT&T Stadium)", "a": "Inglaterra", "b": "Croacia" },
  { "id": 23, "group": "L", "date": "17 Jun 2026", "stadium": "Estadio Toronto (BMO Field)", "a": "Ghana", "b": "Panamá" },
  { "id": 24, "group": "K", "date": "17 Jun 2026", "stadium": "Estadio Ciudad de México (Azteca)", "a": "Uzbekistán", "b": "Colombia" },
  { "id": 25, "group": "A", "date": "18 Jun 2026", "stadium": "Estadio Atlanta (Mercedes-Benz)", "a": "República Checa", "b": "Sudáfrica" },
  { "id": 26, "group": "B", "date": "18 Jun 2026", "stadium": "Estadio Los Ángeles (SoFi Stadium)", "a": "Suiza", "b": "Bosnia y Herzegovina" },
  { "id": 27, "group": "B", "date": "18 Jun 2026", "stadium": "Estadio BC Place Vancouver", "a": "Canadá", "b": "Catar" },
  { "id": 28, "group": "A", "date": "18 Jun 2026", "stadium": "Estadio Guadalajara (Akron)", "a": "México", "b": "Corea del Sur" },
  { "id": 29, "group": "D", "date": "19 Jun 2026", "stadium": "Estadio de Seattle (Lumen Field)", "a": "Estados Unidos", "b": "Australia" },
  { "id": 30, "group": "C", "date": "19 Jun 2026", "stadium": "Estadio Boston (Gillette Stadium)", "a": "Escocia", "b": "Marruecos" },
  { "id": 31, "group": "C", "date": "19 Jun 2026", "stadium": "Estadio Filadelfia", "a": "Brasil", "b": "Haití" },
  { "id": 32, "group": "D", "date": "19 Jun 2026", "stadium": "Estadio Bahía de San Francisco", "a": "Turquía", "b": "Paraguay" },
  { "id": 33, "group": "F", "date": "20 Jun 2026", "stadium": "Estadio Houston (NRG Stadium)", "a": "Países Bajos", "b": "Suecia" },
  { "id": 34, "group": "E", "date": "20 Jun 2026", "stadium": "Estadio Toronto (BMO Field)", "a": "Alemania", "b": "Costa de Marfil" },
  { "id": 35, "group": "E", "date": "20 Jun 2026", "stadium": "Estadio Kansas City (Arrowhead)", "a": "Ecuador", "b": "Curazao" },
  { "id": 36, "group": "F", "date": "20 Jun 2026", "stadium": "Estadio Monterrey (BBVA)", "a": "Túnez", "b": "Japón" },
  { "id": 37, "group": "H", "date": "21 Jun 2026", "stadium": "Estadio Atlanta (Mercedes-Benz)", "a": "España", "b": "Arabia Saudita" },
  { "id": 38, "group": "G", "date": "21 Jun 2026", "stadium": "Estadio Los Ángeles (SoFi Stadium)", "a": "Bélgica", "b": "RI de Irán" },
  { "id": 39, "group": "H", "date": "21 Jun 2026", "stadium": "Estadio Miami (Hard Rock)", "a": "Uruguay", "b": "Cabo Verde" },
  { "id": 40, "group": "G", "date": "21 Jun 2026", "stadium": "Estadio BC Place Vancouver", "a": "Nueva Zelanda", "b": "Egipto" },
  { "id": 41, "group": "J", "date": "22 Jun 2026", "stadium": "Estadio Dallas (AT&T Stadium)", "a": "Argentina", "b": "Austria" },
  { "id": 42, "group": "I", "date": "22 Jun 2026", "stadium": "Estadio Filadelfia", "a": "Francia", "b": "Irak" },
  { "id": 43, "group": "I", "date": "22 Jun 2026", "stadium": "Estadio Nueva York / Nueva Jersey", "a": "Noruega", "b": "Senegal" },
  { "id": 44, "group": "J", "date": "22 Jun 2026", "stadium": "Estadio Bahía de San Francisco", "a": "Jordania", "b": "Argelia" },
  { "id": 45, "group": "K", "date": "23 Jun 2026", "stadium": "Estadio Houston (NRG Stadium)", "a": "Portugal", "b": "Uzbekistán" },
  { "id": 46, "group": "L", "date": "23 Jun 2026", "stadium": "Estadio Boston (Gillette Stadium)", "a": "Inglaterra", "b": "Ghana" },
  { "id": 47, "group": "L", "date": "23 Jun 2026", "stadium": "Estadio Toronto (BMO Field)", "a": "Panamá", "b": "Croacia" },
  { "id": 48, "group": "K", "date": "23 Jun 2026", "stadium": "Estadio Guadalajara (Akron)", "a": "Colombia", "b": "RD Congo" },
  { "id": 49, "group": "C", "date": "24 Jun 2026", "stadium": "Estadio Miami (Hard Rock)", "a": "Escocia", "b": "Brasil" },
  { "id": 50, "group": "C", "date": "24 Jun 2026", "stadium": "Estadio Atlanta (Mercedes-Benz)", "a": "Marruecos", "b": "Haití" },
  { "id": 51, "group": "B", "date": "24 Jun 2026", "stadium": "Estadio BC Place Vancouver", "a": "Suiza", "b": "Canadá" },
  { "id": 52, "group": "B", "date": "24 Jun 2026", "stadium": "Estadio de Seattle (Lumen Field)", "a": "Bosnia y Herzegovina", "b": "Catar" },
  { "id": 53, "group": "A", "date": "24 Jun 2026", "stadium": "Estadio Ciudad de México (Azteca)", "a": "República Checa", "b": "México" },
  { "id": 54, "group": "A", "date": "24 Jun 2026", "stadium": "Estadio Monterrey (BBVA)", "a": "Sudáfrica", "b": "Corea del Sur" },
  { "id": 55, "group": "E", "date": "25 Jun 2026", "stadium": "Estadio Filadelfia", "a": "Curazao", "b": "Costa de Marfil" },
  { "id": 56, "group": "E", "date": "25 Jun 2026", "stadium": "Estadio Nueva York / Nueva Jersey", "a": "Ecuador", "b": "Alemania" },
  { "id": 57, "group": "F", "date": "25 Jun 2026", "stadium": "Estadio Dallas (AT&T Stadium)", "a": "Japón", "b": "Suecia" },
  { "id": 58, "group": "F", "date": "25 Jun 2026", "stadium": "Estadio Kansas City (Arrowhead)", "a": "Túnez", "b": "Países Bajos" },
  { "id": 59, "group": "D", "date": "25 Jun 2026", "stadium": "Estadio Los Ángeles (SoFi Stadium)", "a": "Turquía", "b": "Estados Unidos" },
  { "id": 60, "group": "D", "date": "25 Jun 2026", "stadium": "Estadio Bahía de San Francisco", "a": "Paraguay", "b": "Australia" },
  { "id": 61, "group": "I", "date": "26 Jun 2026", "stadium": "Estadio Boston (Gillette Stadium)", "a": "Noruega", "b": "Francia" },
  { "id": 62, "group": "I", "date": "26 Jun 2026", "stadium": "Estadio Toronto (BMO Field)", "a": "Senegal", "b": "Irak" },
  { "id": 63, "group": "H", "date": "26 Jun 2026", "stadium": "Estadio Houston (NRG Stadium)", "a": "Cabo Verde", "b": "Arabia Saudita" },
  { "id": 64, "group": "H", "date": "26 Jun 2026", "stadium": "Estadio Guadalajara (Akron)", "a": "Uruguay", "b": "España" },
  { "id": 65, "group": "G", "date": "26 Jun 2026", "stadium": "Estadio de Seattle (Lumen Field)", "a": "Egipto", "b": "RI de Irán" },
  { "id": 66, "group": "G", "date": "26 Jun 2026", "stadium": "Estadio BC Place Vancouver", "a": "Nueva Zelanda", "b": "Bélgica" },
  { "id": 67, "group": "L", "date": "27 Jun 2026", "stadium": "Estadio Nueva York / Nueva Jersey", "a": "Panamá", "b": "Inglaterra" },
  { "id": 68, "group": "L", "date": "27 Jun 2026", "stadium": "Estadio Filadelfia", "a": "Croacia", "b": "Ghana" },
  { "id": 69, "group": "K", "date": "27 Jun 2026", "stadium": "Estadio Miami (Hard Rock)", "a": "Colombia", "b": "Portugal" },
  { "id": 70, "group": "K", "date": "27 Jun 2026", "stadium": "Estadio Atlanta (Mercedes-Benz)", "a": "RD Congo", "b": "Uzbekistán" },
  { "id": 71, "group": "J", "date": "27 Jun 2026", "stadium": "Estadio Kansas City (Arrowhead)", "a": "Argelia", "b": "Austria" },
  { "id": 72, "group": "J", "date": "27 Jun 2026", "stadium": "Estadio Dallas (AT&T Stadium)", "a": "Jordania", "b": "Argentina" },
];


// ✅ RESULTADOS REALES
const results = {
  1: { a: 2, b: 1 },
  2: { a: 1, b: 1 },
  3: { a: 0, b: 1 }
};

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bet, setBet] = useState("");
  const [predictions, setPredictions] = useState({});
  const [participants, setParticipants] = useState([]);
  const [groupFilter, setGroupFilter] = useState("A");

  // ✅ GUARDAR PREDICCIÓN 
  const handleChange = (matchId, team, value) => {
    setPredictions((prev) => ({
      ...prev,
      [matchId]: {
        ...(prev[matchId] || {}),
        [team]: value
      }
    }));
  };

  // ✅ CALCULAR PUNTOS
  const calculateScore = (pred) => {
    let total = 0;
    let exact = 0;
    let winner = 0;

    Object.keys(pred).forEach((id) => {
      const p = pred[id];
      const r = results[id];

      if (!p || !r) return;

      if (p.a === r.a && p.b === r.b) {
        total += 3;
        exact += 1;
      } else if (
        (p.a > p.b && r.a > r.b) ||
        (p.a < p.b && r.a < r.b) ||
        (p.a === p.b && r.a === r.b)
      ) {
        total += 1;
        winner += 1;
      }
    });

    return { total, exact, winner };
  };

  // ✅ GUARDAR
  const handleSave = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) return alert("Nombre requerido");
    if (!emailRegex.test(email)) return alert("Correo inválido");

    for (let m of matches) {
      const p = predictions[m.id];
      if (!p || p.a === "" || p.b === "") {
        return alert("Completa todos los partidos");
      }
    }

    const scoreData = calculateScore(predictions);

    const snapshot = await getDocs(collection(db, "predictions"));
    const exists = snapshot.docs.some(
      (d) => d.data().email === email
    );

    if (exists) return alert("Correo ya registrado");

    await addDoc(collection(db, "predictions"), {
      name,
      email,
      bet: Number(bet),
      predictions,
      score: scoreData.total,
      exact: scoreData.exact,
      winner: scoreData.winner
    });

    alert("✅ Guardado!");

    setName("");
    setEmail("");
    setBet("");
    setPredictions({});

    loadParticipants();
  };

  // ✅ CARGAR RANKING
  const loadParticipants = async () => {
    const data = await getDocs(collection(db, "predictions"));
    setParticipants(data.docs.map((doc) => doc.data()));
  };

  useEffect(() => {
    loadParticipants();
  }, []);

  // ✅ FILTRO POR GRUPO
  const filteredMatches = matches.filter(
    (m) => m.group === groupFilter
  );

  return (
    <div style={container}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 15px" }}>

        <h1 style={{
          textAlign: "center",
          marginBottom: "25px",
          color: "#06080a",        // ✅ texto oscuro (visible)
          fontSize: "30px",
          fontWeight: "bold",
          letterSpacing: "0.5px"
        }}>
          🏆 Chicken Mundial 2026
        </h1>

        {/* FORM */}
        <div style={card}>
          <h3 style={{ marginBottom: "15px" }}>
            Información del participante
          </h3>
          <div style={grid3}>
            <input style={input} placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} />
            <input style={input} placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} />
            <input style={input} placeholder="Apuesta propuesta" value={bet} onChange={e => setBet(e.target.value)} />
          </div>
        </div>

        {/* PRONÓSTICOS */}
        <div style={card}>
          <h3>Pronósticos</h3>

          {/* ✅ TABS */}
          
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
          gap: "8px",
          marginBottom: "20px",
          borderBottom: "2px solid #e5e7eb",
          overflowX: "auto",
          width: "100%"
        }}>
           
          {["A","B","C","D","E","F","G","H","I","J","K","L"].map((g) => (
          <button
            key={g}
            onClick={() => setGroupFilter(g)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              background: groupFilter === g ? "#2563eb" : "#f9fafb",
              color: groupFilter === g ? "#fff" : "#111",
              cursor: "pointer",
              fontWeight: "600",
              width: "100%",     // ✅ importante
              fontSize: "13px"
            }}
          >
            Grupo {g}
          </button>

          ))}

          </div>

          {/* MATCHES */}
          <div style={gridMatches}>
          {filteredMatches.map((m) => (
            <div key={m.id} style={matchCard}>

              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                Grupo {m.group} · {m.date}
              </div>

              <strong style={{ margin: "6px 0" }}>
                {m.a} vs {m.b}
              </strong>

              <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                {m.stadium}
              </div>

              <div style={scoreContainer}>
                <input
                  style={scoreInput}
                  type="number"
                  value={predictions[m.id]?.a || ""}
                  onChange={(e) =>
                    handleChange(m.id, "a", e.target.value === "" ? "" : Number(e.target.value))
                  }
                />

                -

                <input
                  style={scoreInput}
                  type="number"
                  value={predictions[m.id]?.b || ""}
                  onChange={(e) =>
                    handleChange(m.id, "b", e.target.value === "" ? "" : Number(e.target.value))
                  }
                />
              </div>

            </div>
          ))}
        </div>


          <br />

          <div style={{ textAlign: "center" }}>
            <button style={button} onClick={handleSave}>
              Guardar Pronóstico
            </button>
          </div>
        </div>

        {/* RANKING */}
        <div style={card}>
          <h3>🏆 Ranking</h3>

          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Participante</th>
                <th>Total</th>
                <th>Exactos</th>
                <th>Ganador</th>
              </tr>
            </thead>
            <tbody>
              {participants
                .sort((a, b) => b.score - a.score)
                .map((p, i) => (
                  <tr key={i}>
                    <td>
                      {i === 0 && "🥇"}
                      {i === 1 && "🥈"}
                      {i === 2 && "🥉"}
                      {i > 2 && i + 1}
                    </td>
                    <td>{p.name}</td>
                    <td>{p.score}</td>
                    <td>{p.exact}</td>
                    <td>{p.winner}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default App;