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
  { id: 1, group: "Grupo A", date: "11 Jun 2026", stadium: "Estadio Ciudad de México (Azteca)", a: "México", b: "Sudáfrica" },
  { id: 2, group: "Grupo A", date: "11 Jun 2026", stadium: "Estadio Guadalajara (Akron)", a: "Corea del Sur", b: "República Checa" },
  { id: 3, group: "Grupo B", date: "12 Jun 2026", stadium: "Estadio Toronto (BMO Field)", a: "Canadá", b: "Bosnia y Herzegovina" },
  { id: 4, group: "Grupo D", date: "12 Jun 2026", stadium: "Estadio Los Ángeles (SoFi Stadium)", a: "Estados Unidos", b: "Paraguay" },
  { id: 5, group: "Grupo B", date: "13 Jun 2026", stadium: "Estadio Bahía de San Francisco", a: "Catar", b: "Suiza" },
  { id: 6, group: "Grupo C", date: "13 Jun 2026", stadium: "Estadio Nueva York / Nueva Jersey", a: "Brasil", b: "Marruecos" },
  { id: 7, group: "Grupo C", date: "13 Jun 2026", stadium: "Estadio Boston (Gillette Stadium)", a: "Haití", b: "Escocia" },
  { id: 8, group: "Grupo D", date: "13 Jun 2026", stadium: "Estadio BC Place Vancouver", a: "Australia", b: "Turquía" },
  { id: 9, group: "Grupo E", date: "14 Jun 2026", stadium: "Estadio Houston (NRG Stadium)", a: "Alemania", b: "Curazao" },
  { id: 10, group: "Grupo F", date: "14 Jun 2026", stadium: "Estadio Dallas (AT&T Stadium)", a: "Países Bajos", b: "Japón" },
  { id: 11, group: "Grupo E", date: "14 Jun 2026", stadium: "Estadio Filadelfia", a: "Costa de Marfil", b: "Ecuador" },
  { id: 12, group: "Grupo F", date: "14 Jun 2026", stadium: "Estadio Monterrey (BBVA)", a: "Suecia", b: "Túnez" },
  { id: 13, group: "Grupo H", date: "15 Jun 2026", stadium: "Estadio Atlanta", a: "Inglaterra", b: "Ghana" },
  { id: 14, group: "Grupo G", date: "15 Jun 2026", stadium: "Estadio Miami", a: "Argentina", b: "Irán" },
  { id: 15, group: "Grupo G", date: "15 Jun 2026", stadium: "Estadio Orlando", a: "Senegal", b: "Polonia" },
  { id: 16, group: "Grupo H", date: "15 Jun 2026", stadium: "Estadio Seattle", a: "Dinamarca", b: "Chile" },
  { id: 17, group: "Grupo I", date: "16 Jun 2026", stadium: "Estadio Kansas City", a: "España", b: "Egipto" },
  { id: 18, group: "Grupo I", date: "16 Jun 2026", stadium: "Estadio México", a: "Perú", b: "Grecia" },
  { id: 19, group: "Grupo J", date: "16 Jun 2026", stadium: "Estadio Vancouver", a: "Francia", b: "Panamá" },
  { id: 20, group: "Grupo J", date: "16 Jun 2026", stadium: "Estadio Boston", a: "Serbia", b: "Australia" },
  { id: 21, group: "Grupo K", date: "17 Jun 2026", stadium: "Estadio Guadalajara", a: "Colombia", b: "Uzbekistán" },
  { id: 22, group: "Grupo K", date: "17 Jun 2026", stadium: "Estadio Los Ángeles", a: "Corea del Norte", b: "Nigeria" },
  { id: 23, group: "Grupo L", date: "17 Jun 2026", stadium: "Estadio Houston", a: "Uruguay", b: "Arabia Saudita" },
  { id: 24, group: "Grupo L", date: "17 Jun 2026", stadium: "Estadio Dallas", a: "Croacia", b: "Canadá" },
  { id: 25, group: "Grupo A", date: "18 Jun 2026", stadium: "Estadio Azteca", a: "México", b: "Corea del Sur" },
  { id: 26, group: "Grupo A", date: "18 Jun 2026", stadium: "Estadio Guadalajara", a: "República Checa", b: "Sudáfrica" },
  { id: 27, group: "Grupo B", date: "19 Jun 2026", stadium: "Estadio Toronto", a: "Canadá", b: "Suiza" },
  { id: 28, group: "Grupo B", date: "19 Jun 2026", stadium: "Estadio San Francisco", a: "Bosnia y Herzegovina", b: "Catar" },
  { id: 29, group: "Grupo C", date: "19 Jun 2026", stadium: "Estadio Nueva York", a: "Brasil", b: "Escocia" },
  { id: 30, group: "Grupo C", date: "19 Jun 2026", stadium: "Estadio Boston", a: "Marruecos", b: "Haití" },
  { id: 31, group: "Grupo D", date: "20 Jun 2026", stadium: "Estadio Los Ángeles", a: "Estados Unidos", b: "Turquía" },
  { id: 32, group: "Grupo D", date: "20 Jun 2026", stadium: "Estadio Vancouver", a: "Paraguay", b: "Australia" },
  { id: 33, group: "Grupo E", date: "20 Jun 2026", stadium: "Estadio Houston", a: "Alemania", b: "Ecuador" },
  { id: 34, group: "Grupo E", date: "20 Jun 2026", stadium: "Estadio Filadelfia", a: "Costa de Marfil", b: "Curazao" },
  { id: 35, group: "Grupo F", date: "21 Jun 2026", stadium: "Estadio Dallas", a: "Países Bajos", b: "Túnez" },
  { id: 36, group: "Grupo F", date: "21 Jun 2026", stadium: "Estadio Monterrey", a: "Japón", b: "Suecia" },
  { id: 37, group: "Grupo G", date: "21 Jun 2026", stadium: "Estadio Miami", a: "Argentina", b: "Polonia" },
  { id: 38, group: "Grupo G", date: "21 Jun 2026", stadium: "Estadio Orlando", a: "Irán", b: "Senegal" },
  { id: 39, group: "Grupo H", date: "22 Jun 2026", stadium: "Estadio Atlanta", a: "Inglaterra", b: "Chile" },
  { id: 40, group: "Grupo H", date: "22 Jun 2026", stadium: "Estadio Seattle", a: "Ghana", b: "Dinamarca" },
  { id: 41, group: "Grupo I", date: "22 Jun 2026", stadium: "Estadio Kansas", a: "España", b: "Grecia" },
  { id: 42, group: "Grupo I", date: "22 Jun 2026", stadium: "Estadio México", a: "Egipto", b: "Perú" },
  { id: 43, group: "Grupo J", date: "23 Jun 2026", stadium: "Estadio Vancouver", a: "Francia", b: "Australia" },
  { id: 44, group: "Grupo J", date: "23 Jun 2026", stadium: "Estadio Boston", a: "Panamá", b: "Serbia" },
  { id: 45, group: "Grupo K", date: "23 Jun 2026", stadium: "Estadio Guadalajara", a: "Colombia", b: "Nigeria" },
  { id: 46, group: "Grupo K", date: "23 Jun 2026", stadium: "Estadio LA", a: "Uzbekistán", b: "Corea del Norte" },
  { id: 47, group: "Grupo L", date: "24 Jun 2026", stadium: "Estadio Houston", a: "Uruguay", b: "Canadá" },
  { id: 48, group: "Grupo L", date: "24 Jun 2026", stadium: "Estadio Dallas", a: "Arabia Saudita", b: "Croacia" },
  { id: 49, group: "Grupo A", date: "25 Jun 2026", stadium: "Estadio México", a: "México", b: "República Checa" },
  { id: 50, group: "Grupo A", date: "25 Jun 2026", stadium: "Estadio Guadalajara", a: "Sudáfrica", b: "Corea del Sur" },
  { id: 51, group: "Grupo B", date: "24 Jun 2026", stadium: "Estadio BC Place Vancouver", a: "Suiza", b: "Canadá" },
  { id: 52, group: "Grupo B", date: "24 Jun 2026", stadium: "Estadio de Seattle (Lumen Field)", a: "Bosnia y Herzegovina", b: "Catar" },
  { id: 53, group: "Grupo A", date: "24 Jun 2026", stadium: "Estadio Ciudad de México (Azteca)", a: "República Checa", b: "México" },
  { id: 54, group: "Grupo A", date: "24 Jun 2026", stadium: "Estadio Monterrey (BBVA)", a: "Sudáfrica", b: "Corea del Sur" },
  { id: 55, group: "Grupo E", date: "25 Jun 2026", stadium: "Estadio Filadelfia", a: "Curazao", b: "Costa de Marfil" },
  { id: 56, group: "Grupo E", date: "25 Jun 2026", stadium: "Estadio Nueva York / Nueva Jersey", a: "Ecuador", b: "Alemania" },
  { id: 57, group: "Grupo F", date: "25 Jun 2026", stadium: "Estadio Dallas (AT&T Stadium)", a: "Japón", b: "Suecia" },
  { id: 58, group: "Grupo F", date: "25 Jun 2026", stadium: "Estadio Kansas City (Arrowhead)", a: "Túnez", b: "Países Bajos" },
  { id: 59, group: "Grupo D", date: "25 Jun 2026", stadium: "Estadio Los Ángeles (SoFi Stadium)", a: "Turquía", b: "Estados Unidos" },
  { id: 60, group: "Grupo D", date: "25 Jun 2026", stadium: "Estadio Bahía de San Francisco", a: "Paraguay", b: "Australia" },
  { id: 61, group: "Grupo I", date: "26 Jun 2026", stadium: "Estadio Boston (Gillette Stadium)", a: "Noruega", b: "Francia" },
  { id： 62, group："Grupo I", date："26 Jun 2026", stadium："Estadio Toronto (BMO Field)", a："Senegal", b："Irak" },
  { id： 63, group："Grupo H", date："26 Jun 2026", stadium："Estadio Houston (NRG Stadium)", a："Cabo Verde", b："Arabia Saudita" },
  { id： 64, group："Grupo H", date："26 Jun 2026", stadium："Estadio Guadalajara (Akron)", a："Uruguay", b："España" },
  { id: 65, group: "Grupo G", date: "26 Jun 2026", stadium: "Estadio de Seattle (Lumen Field)", a: "Egipto", b: "RI de Irán" },
  { id: 66, group: "Grupo G", date: "26 Jun 2026", stadium: "Estadio BC Place Vancouver", a: "Nueva Zelanda", b: "Bélgica" },
  { id: 67, group: "Grupo L", date: "27 Jun 2026", stadium: "Estadio Nueva York / Nueva Jersey", a: "Panamá", b: "Inglaterra" },
  { id: 68, group: "Grupo L", date: "27 Jun 2026", stadium: "Estadio Filadelfia", a: "Croacia", b: "Ghana" },
  { id: 69, group: "Grupo K", date: "27 Jun 2026", stadium: "Estadio Miami (Hard Rock)", a: "Colombia", b: "Portugal" },
  { id: 70, group: "Grupo K", date: "27 Jun 2026", stadium: "Estadio Atlanta (Mercedes-Benz)", a: "RD Congo", b: "Uzbekistán" },
  { id: 71, group: "Grupo J", date: "27 Jun 2026", stadium: "Estadio Kansas City (Arrowhead)", a: "Argelia", b： "Austria" },
  { id： 72, group："Grupo J", date："27 Jun 2026", stadium："Estadio Dallas (AT&T Stadium)", a："Jordania", b："Argentina" }
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
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        <h1 style={{
          textAlign: "center",
          marginBottom: "25px",
          color: "#06080a",        
          fontSize: "30px",
          fontWeight: "bold",
          letterSpacing: "0.5px"
        }}>
          🏆 Chicken Mundialista 2026
        </h1>

        {/* FORM */}
        <div style={card}>
          <div style={grid3}>
            <input style={input} placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} />
            <input style={input} placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} />
            <input style={input} placeholder="Apuesta" value={bet} onChange={e => setBet(e.target.value)} />
          </div>
        </div>

        {/* PRONÓSTICOS */}
        <div style={card}>
          <h3>Pronósticos</h3>

          {/* ✅ TABS */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)", // 🔥 6 por fila
            gap: "10px",
            marginBottom: "20px",
            width: "100%"
            }}>


            {["Grupo A","Grupo B","Grupo C","Grupo D","Grupo E","Grupo F","Grupo G","Grupo H","Grupo I","Grupo J","Grupo K","Grupo L"].map((g) => (
              <button
                key={g}
                onClick={() => setGroupFilter(g)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  background: groupFilter === g ? "#2b7cff" : "#fff",
                  color: groupFilter === g ? "#fff" : "#000",
                  cursor: "pointer"
                }}
              >
                {g}
              </button>
            ))}
          </div>

          {/* MATCHES */}
          <div style={gridMatches}>
            {filteredMatches.map((m) => (
              <div key={m.id} style={matchCard}>
                <small>Grupo {m.group} · {m.date}</small>
                <strong>{m.a} vs {m.b}</strong>
                <small>{m.stadium}</small>

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
                <th>Jugador</th>
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