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
  {"partido": 1, "fecha": "11 Jun 2026", "fase": "Fase de Grupos", "grupo": "A", "equipo_1": "México", "equipo_2": "Sudáfrica", "estadio": "Estadio Ciudad de México (Azteca)", "ciudad": "Ciudad de México"},
  {"partido": 2, "fecha": "11 Jun 2026", "fase": "Fase de Grupos", "grupo": "A", "equipo_1": "Corea del Sur", "equipo_2": "República Checa", "estadio": "Estadio Guadalajara (Akron)", "ciudad": "Guadalajara"},
  {"partido": 3, "fecha": "12 Jun 2026", "fase": "Fase de Grupos", "grupo": "B", "equipo_1": "Canadá", "equipo_2": "Bosnia y Herzegovina", "estadio": "Estadio Toronto (BMO Field)", "ciudad": "Toronto"},
  {"partido": 4, "fecha": "12 Jun 2026", "fase": "Fase de Grupos", "grupo": "D", "equipo_1": "Estados Unidos", "equipo_2": "Paraguay", "estadio": "Estadio Los Ángeles (SoFi Stadium)", "ciudad": "Los Ángeles"},
  {"partido": 5, "fecha": "13 Jun 2026", "fase": "Fase de Grupos", "grupo": "B", "equipo_1": "Catar", "equipo_2": "Suiza", "estadio": "Estadio Bahía de San Francisco", "ciudad": "San Francisco Area"},
  {"partido": 6, "fecha": "13 Jun 2026", "fase": "Fase de Grupos", "grupo": "C", "equipo_1": "Brasil", "equipo_2": "Marruecos", "estadio": "Estadio Nueva York / Nueva Jersey", "ciudad": "East Rutherford"},
  {"partido": 7, "fecha": "13 Jun 2026", "fase": "Fase de Grupos", "grupo": "C", "equipo_1": "Haití", "equipo_2": "Escocia", "estadio": "Estadio Boston (Gillette Stadium)", "ciudad": "Boston"},
  {"partido": 8, "fecha": "13 Jun 2026", "fase": "Fase de Grupos", "grupo": "D", "equipo_1": "Australia", "equipo_2": "Turquía", "estadio": "Estadio BC Place Vancouver", "ciudad": "Vancouver"},
  {"partido": 9, "fecha": "14 Jun 2026", "fase": "Fase de Grupos", "grupo": "E", "equipo_1": "Alemania", "equipo_2": "Curazao", "estadio": "Estadio Houston (NRG Stadium)", "ciudad": "Houston"},
  {"partido": 10, "fecha": "14 Jun 2026", "fase": "Fase de Grupos", "grupo": "F", "equipo_1": "Países Bajos", "equipo_2": "Japón", "estadio": "Estadio Dallas (AT&T Stadium)", "ciudad": "Dallas"},
  {"partido": 11, "fecha": "14 Jun 2026", "fase": "Fase de Grupos", "grupo": "E", "equipo_1": "Costa de Marfil", "equipo_2": "Ecuador", "estadio": "Estadio Filadelfia", "ciudad": "Filadelfia"},
  {"partido": 12, "fecha": "14 Jun 2026", "fase": "Fase de Grupos", "grupo": "F", "equipo_1": "Suecia", "equipo_2": "Túnez", "estadio": "Estadio Monterrey (BBVA)", "ciudad": "Monterrey"},
  {"partido": 13, "fecha": "15 Jun 2026", "fase": "Fase de Grupos", "grupo": "H", "equipo_1": "España", "equipo_2": "Cabo Verde", "estadio": "Estadio Atlanta (Mercedes-Benz)", "ciudad": "Atlanta"},
  {"partido": 14, "fecha": "15 Jun 2026", "fase": "Fase de Grupos", "grupo": "G", "equipo_1": "Bélgica", "equipo_2": "Egipto", "estadio": "Estadio de Seattle (Lumen Field)", "ciudad": "Seattle"},
  {"partido": 15, "fecha": "15 Jun 2026", "fase": "Fase de Grupos", "grupo": "H", "equipo_1": "Arabia Saudita", "equipo_2": "Uruguay", "estadio": "Estadio Miami (Hard Rock)", "ciudad": "Miami"},
  {"partido": 16, "fecha": "15 Jun 2026", "fase": "Fase de Grupos", "grupo": "G", "equipo_1": "RI de Irán", "equipo_2": "Nueva Zelanda", "estadio": "Estadio Los Ángeles (SoFi Stadium)", "ciudad": "Los Ángeles"},
  {"partido": 17, "fecha": "16 Jun 2026", "fase": "Fase de Grupos", "grupo": "I", "equipo_1": "Francia", "equipo_2": "Senegal", "estadio": "Estadio Nueva York / Nueva Jersey", "ciudad": "East Rutherford"},
  {"partido": 18, "fecha": "16 Jun 2026", "fase": "Fase de Grupos", "grupo": "I", "equipo_1": "Irak", "equipo_2": "Noruega", "estadio": "Estadio Boston (Gillette Stadium)", "ciudad": "Boston"},
  {"partido": 19, "fecha": "16 Jun 2026", "fase": "Fase de Grupos", "grupo": "J", "equipo_1": "Argentina", "equipo_2": "Argelia", "estadio": "Estadio Kansas City (Arrowhead)", "ciudad": "Kansas City"},
  {"partido": 20, "fecha": "16 Jun 2026", "fase": "Fase de Grupos", "grupo": "J", "equipo_1": "Austria", "equipo_2": "Jordania", "estadio": "Estadio Bahía de San Francisco", "ciudad": "San Francisco Area"},
  {"partido": 21, "fecha": "17 Jun 2026", "fase": "Fase de Grupos", "grupo": "K", "equipo_1": "Portugal", "equipo_2": "RD Congo", "estadio": "Estadio Houston (NRG Stadium)", "ciudad": "Houston"},
  {"partido": 22, "fecha": "17 Jun 2026", "fase": "Fase de Grupos", "grupo": "L", "equipo_1": "Inglaterra", "equipo_2": "Croacia", "estadio": "Estadio Dallas (AT&T Stadium)", "ciudad": "Dallas"},
  {"partido": 23, "fecha": "17 Jun 2026", "fase": "Fase de Grupos", "grupo": "L", "equipo_1": "Ghana", "equipo_2": "Panamá", "estadio": "Estadio Toronto (BMO Field)", "ciudad": "Toronto"},
  {"partido": 24, "fecha": "17 Jun 2026", "fase": "Fase de Grupos", "grupo": "K", "equipo_1": "Uzbekistán", "equipo_2": "Colombia", "estadio": "Estadio Ciudad de México (Azteca)", "ciudad": "Ciudad de México"},
  {"partido": 25, "fecha": "18 Jun 2026", "fase": "Fase de Grupos", "grupo": "A", "equipo_1": "República Checa", "equipo_2": "Sudáfrica", "estadio": "Estadio Atlanta (Mercedes-Benz)", "ciudad": "Atlanta"},
  {"partido": 26, "fecha": "18 Jun 2026", "fase": "Fase de Grupos", "grupo": "B", "equipo_1": "Suiza", "equipo_2": "Bosnia y Herzegovina", "estadio": "Estadio Los Ángeles (SoFi Stadium)", "ciudad": "Los Ángeles"},
  {"partido": 27, "fecha": "18 Jun 2026", "fase": "Fase de Grupos", "grupo": "B", "equipo_1": "Canadá", "equipo_2": "Catar", "estadio": "Estadio BC Place Vancouver", "ciudad": "Vancouver"},
  {"partido": 28, "fecha": "18 Jun 2026", "fase": "Fase de Grupos", "grupo": "A", "equipo_1": "México", "equipo_2": "Corea del Sur", "estadio": "Estadio Guadalajara (Akron)", "ciudad": "Guadalajara"},
  {"partido": 29, "fecha": "19 Jun 2026", "fase": "Fase de Grupos", "grupo": "D", "equipo_1": "Estados Unidos", "equipo_2": "Australia", "estadio": "Estadio de Seattle (Lumen Field)", "ciudad": "Seattle"},
  {"partido": 30, "fecha": "19 Jun 2026", "fase": "Fase de Grupos", "grupo": "C", "equipo_1": "Escocia", "equipo_2": "Marruecos", "estadio": "Estadio Boston (Gillette Stadium)", "ciudad": "Boston"},
  {"partido": 31, "fecha": "19 Jun 2026", "fase": "Fase de Grupos", "grupo": "C", "equipo_1": "Brasil", "equipo_2": "Haití", "estadio": "Estadio Filadelfia", "ciudad": "Filadelfia"},
  {"partido": 32, "fecha": "19 Jun 2026", "fase": "Fase de Grupos", "grupo": "D", "equipo_1": "Turquía", "equipo_2": "Paraguay", "estadio": "Estadio Bahía de San Francisco", "ciudad": "San Francisco Area"},
  {"partido": 33, "fecha": "20 Jun 2026", "fase": "Fase de Grupos", "grupo": "F", "equipo_1": "Países Bajos", "equipo_2": "Suecia", "estadio": "Estadio Houston (NRG Stadium)", "ciudad": "Houston"},
  {"partido": 34, "fecha": "20 Jun 2026", "fase": "Fase de Grupos", "grupo": "E", "equipo_1": "Alemania", "equipo_2": "Costa de Marfil", "estadio": "Estadio Toronto (BMO Field)", "ciudad": "Toronto"},
  {"partido": 35, "fecha": "20 Jun 2026", "fase": "Fase de Grupos", "grupo": "E", "equipo_1": "Ecuador", "equipo_2": "Curazao", "estadio": "Estadio Kansas City (Arrowhead)", "ciudad": "Kansas City"},
  {"partido": 36, "fecha": "20 Jun 2026", "fase": "Fase de Grupos", "grupo": "F", "equipo_1": "Túnez", "equipo_2": "Japón", "estadio": "Estadio Monterrey (BBVA)", "ciudad": "Monterrey"},
  {"partido": 37, "fecha": "21 Jun 2026", "fase": "Fase de Grupos", "grupo": "H", "equipo_1": "España", "equipo_2": "Arabia Saudita", "estadio": "Estadio Atlanta (Mercedes-Benz)", "ciudad": "Atlanta"},
  {"partido": 38, "fecha": "21 Jun 2026", "fase": "Fase de Grupos", "grupo": "G", "equipo_1": "Bélgica", "equipo_2": "RI de Irán", "estadio": "Estadio Los Ángeles (SoFi Stadium)", "ciudad": "Los Ángeles"},
  {"partido": 39, "fecha": "21 Jun 2026", "fase": "Fase de Grupos", "grupo": "H", "equipo_1": "Uruguay", "equipo_2": "Cabo Verde", "estadio": "Estadio Miami (Hard Rock)", "ciudad": "Miami"},
  {"partido": 40, "fecha": "21 Jun 2026", "fase": "Fase de Grupos", "grupo": "G", "equipo_1": "Nueva Zelanda", "equipo_2": "Egipto", "estadio": "Estadio BC Place Vancouver", "ciudad": "Vancouver"},
  {"partido": 41, "fecha": "22 Jun 2026", "fase": "Fase de Grupos", "grupo": "J", "equipo_1": "Argentina", "equipo_2": "Austria", "estadio": "Estadio Dallas (AT&T Stadium)", "ciudad": "Dallas"},
  {"partido": 42, "fecha": "22 Jun 2026", "fase": "Fase de Grupos", "grupo": "I", "equipo_1": "Francia", "equipo_2": "Irak", "estadio": "Estadio Filadelfia", "ciudad": "Filadelfia"},
  {"partido": 43, "fecha": "22 Jun 2026", "fase": "Fase de Grupos", "grupo": "I", "equipo_1": "Noruega", "equipo_2": "Senegal", "estadio": "Estadio Nueva York / Nueva Jersey", "ciudad": "East Rutherford"},
  {"partido": 44, "fecha": "22 Jun 2026", "fase": "Fase de Grupos", "grupo": "J", "equipo_1": "Jordania", "equipo_2": "Argelia", "estadio": "Estadio Bahía de San Francisco", "ciudad": "San Francisco Area"},
  {"partido": 45, "fecha": "23 Jun 2026", "fase": "Fase de Grupos", "grupo": "K", "equipo_1": "Portugal", "equipo_2": "Uzbekistán", "estadio": "Estadio Houston (NRG Stadium)", "ciudad": "Houston"},
  {"partido": 46, "fecha": "23 Jun 2026", "fase": "Fase de Grupos", "grupo": "L", "equipo_1": "Inglaterra", "equipo_2": "Ghana", "estadio": "Estadio Boston (Gillette Stadium)", "ciudad": "Boston"},
  {"partido": 47, "fecha": "23 Jun 2026", "fase": "Fase de Grupos", "grupo": "L", "equipo_1": "Panamá", "equipo_2": "Croacia", "estadio": "Estadio Toronto (BMO Field)", "ciudad": "Toronto"},
  {"partido": 48, "fecha": "23 Jun 2026", "fase": "Fase de Grupos", "grupo": "K", "equipo_1": "Colombia", "equipo_2": "RD Congo", "estadio": "Estadio Guadalajara (Akron)", "ciudad": "Guadalajara"},
  {"partido": 49, "fecha": "24 Jun 2026", "fase": "Fase de Grupos", "grupo": "C", "equipo_1": "Escocia", "equipo_2": "Brasil", "estadio": "Estadio Miami (Hard Rock)", "ciudad": "Miami"},
  {"partido": 50, "fecha": "24 Jun 2026", "fase": "Fase de Grupos", "grupo": "C", "equipo_1": "Marruecos", "equipo_2": "Haití", "estadio": "Estadio Atlanta (Mercedes-Benz)", "ciudad": "Atlanta"},
  {"partido": 51, "fecha": "24 Jun 2026", "fase": "Fase de Grupos", "grupo": "B", "equipo_1": "Suiza", "equipo_2": "Canadá", "estadio": "Estadio BC Place Vancouver", "ciudad": "Vancouver"},
  {"partido": 52, "fecha": "24 Jun 2026", "fase": "Fase de Grupos", "grupo": "B", "equipo_1": "Bosnia y Herzegovina", "equipo_2": "Catar", "estadio": "Estadio de Seattle (Lumen Field)", "ciudad": "Seattle"},
  {"partido": 53, "fecha": "24 Jun 2026", "fase": "Fase de Grupos", "grupo": "A", "equipo_1": "República Checa", "equipo_2": "México", "estadio": "Estadio Ciudad de México (Azteca)", "ciudad": "Ciudad de México"},
  {"partido": 54, "fecha": "24 Jun 2026", "fase": "Fase de Grupos", "grupo": "A", "equipo_1": "Sudáfrica", "equipo_2": "Corea del Sur", "estadio": "Estadio Monterrey (BBVA)", "ciudad": "Monterrey"},
  {"partido": 55, "fecha": "25 Jun 2026", "fase": "Fase de Grupos", "grupo": "E", "equipo_1": "Curazao", "equipo_2": "Costa de Marfil", "estadio": "Estadio Filadelfia", "ciudad": "Filadelfia"},
  {"partido": 56, "fecha": "25 Jun 2026", "fase": "Fase de Grupos", "grupo": "E", "equipo_1": "Ecuador", "equipo_2": "Alemania", "estadio": "Estadio Nueva York / Nueva Jersey", "ciudad": "East Rutherford"},
  {"partido": 57, "fecha": "25 Jun 2026", "fase": "Fase de Grupos", "grupo": "F", "equipo_1": "Japón", "equipo_2": "Suecia", "estadio": "Estadio Dallas (AT&T Stadium)", "ciudad": "Dallas"},
  {"partido": 58, "fecha": "25 Jun 2026", "fase": "Fase de Grupos", "grupo": "F", "equipo_1": "Túnez", "equipo_2": "Países Bajos", "estadio": "Estadio Kansas City (Arrowhead)", "ciudad": "Kansas City"},
  {"partido": 59, "fecha": "25 Jun 2026", "fase": "Fase de Grupos", "grupo": "D", "equipo_1": "Turquía", "equipo_2": "Estados Unidos", "estadio": "Estadio Los Ángeles (SoFi Stadium)", "ciudad": "Los Ángeles"},
  {"partido": 60, "fecha": "25 Jun 2026", "fase": "Fase de Grupos", "grupo": "D", "equipo_1": "Paraguay", "equipo_2": "Australia", "estadio": "Estadio Bahía de San Francisco", "ciudad": "San Francisco Area"},
  {"partido": 61, "fecha": "26 Jun 2026", "fase": "Fase de Grupos", "grupo": "I", "equipo_1": "Noruega", "equipo_2": "Francia", "estadio": "Estadio Boston (Gillette Stadium)", "ciudad": "Boston"},
  {"partido": 62, "fecha": "26 Jun 2026", "fase": "Fase de Grupos", "grupo": "I", "equipo_1": "Senegal", "equipo_2": "Irak", "estadio": "Estadio Toronto (BMO Field)", "ciudad": "Toronto"},
  {"partido": 63, "fecha": "26 Jun 2026", "fase": "Fase de Grupos", "grupo": "H", "equipo_1": "Cabo Verde", "equipo_2": "Arabia Saudita", "estadio": "Estadio Houston (NRG Stadium)", "ciudad": "Houston"},
  {"partido": 64, "fecha": "26 Jun 2026", "fase": "Fase de Grupos", "grupo": "H", "equipo_1": "Uruguay", "equipo_2": "España", "estadio": "Estadio Guadalajara (Akron)", "ciudad": "Guadalajara"},
  {"partido": 65, "fecha": "26 Jun 2026", "fase": "Fase de Grupos", "grupo": "G", "equipo_1": "Egipto", "equipo_2": "RI de Irán", "estadio": "Estadio de Seattle (Lumen Field)", "ciudad": "Seattle"},
  {"partido": 66, "fecha": "26 Jun 2026", "fase": "Fase de Grupos", "grupo": "G", "equipo_1": "Nueva Zelanda", "equipo_2": "Bélgica", "estadio": "Estadio BC Place Vancouver", "ciudad": "Vancouver"},
  {"partido": 67, "fecha": "27 Jun 2026", "fase": "Fase de Grupos", "grupo": "L", "equipo_1": "Panamá", "equipo_2": "Inglaterra", "estadio": "Estadio Nueva York / Nueva Jersey", "ciudad": "East Rutherford"},
  {"partido": 68, "fecha": "27 Jun 2026", "fase": "Fase de Grupos", "grupo": "L", "equipo_1": "Croacia", "equipo_2": "Ghana", "estadio": "Estadio Filadelfia", "ciudad": "Filadelfia"},
  {"partido": 69, "fecha": "27 Jun 2026", "fase": "Fase de Grupos", "grupo": "K", "equipo_1": "Colombia", "equipo_2": "Portugal", "estadio": "Estadio Miami (Hard Rock)", "ciudad": "Miami"},
  {"partido": 70, "fecha": "27 Jun 2026", "fase": "Fase de Grupos", "grupo": "K", "equipo_1": "RD Congo", "equipo_2": "Uzbekistán", "estadio": "Estadio Atlanta (Mercedes-Benz)", "ciudad": "Atlanta"},
  {"partido": 71, "fecha": "27 Jun 2026", "fase": "Fase de Grupos", "grupo": "J", "equipo_1": "Argelia", "equipo_2": "Austria", "estadio": "Estadio Kansas City (Arrowhead)", "ciudad": "Kansas City"},
  {"partido": 72, "fecha": "27 Jun 2026", "fase": "Fase de Grupos", "grupo": "J", "equipo_1": "Jordania", "equipo_2": "Argentina", "estadio": "Estadio Dallas (AT&T Stadium)", "ciudad": "Dallas"}
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