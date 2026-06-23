import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
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

// ✅ PARTIDOS
const matches = [
  { "id": 1, "group": "A", "date": "11 Jun 2026", "stadium": "Estadio Ciudad de México", "a": "México", "b": "Sudáfrica" },
  { "id": 2, "group": "A", "date": "11 Jun 2026", "stadium": "Estadio Guadalajara", "a": "Corea del Sur", "b": "República Checa" },
  { "id": 3, "group": "B", "date": "12 Jun 2026", "stadium": "Estadio Toronto", "a": "Canadá", "b": "Bosnia y Herzegovina" },
  { "id": 4, "group": "D", "date": "12 Jun 2026", "stadium": "Estadio Los Angeles", "a": "Estados Unidos", "b": "Paraguay" },
  { "id": 5, "group": "B", "date": "13 Jun 2026", "stadium": "Estadio Bahía de San Francisco", "a": "Catar", "b": "Suiza" },
  { "id": 6, "group": "C", "date": "13 Jun 2026", "stadium": "Estadio Nueva York / Nueva Jersey", "a": "Brasil", "b": "Marruecos" },
  { "id": 7, "group": "C", "date": "13 Jun 2026", "stadium": "Estadio Boston", "a": "Haití", "b": "Escocia" },
  { "id": 8, "group": "D", "date": "13 Jun 2026", "stadium": "Estadio BC Place Vancouver", "a": "Australia","b": "Turquía" },
  { "id": 9, "group": "E", "date": "14 Jun 2026", "stadium": "Estadio Houston", "a": "Alemania", "b": "Curazao" },
  { "id" :10, "group": "F" , "date" : "14 Jun 2026" ,"stadium": "Estadio Dallas", "a": "Países Bajos","b":"Japón" },
  { "id": 11, "group": "E", "date": "14 Jun 2026", "stadium": "Estadio Filadelfia", "a": "Costa de Marfil", "b": "Ecuador" },
  { "id": 12, "group": "F", "date": "14 Jun 2026", "stadium": "Estadio Monterrey", "a": "Suecia", "b": "Túnez" },
  { "id": 13, "group": "H", "date": "15 Jun 2026", "stadium": "Estadio Atlanta", "a": "España", "b": "Cabo Verde" },
  { "id": 14, "group": "G", "date": "15 Jun 2026", "stadium": "Estadio de Seattle", "a": "Bélgica", "b": "Egipto" },
  { "id": 15, "group": "H", "date": "15 Jun 2026", "stadium": "Estadio Miami", "a": "Arabia Saudita", "b": "Uruguay" },
  { "id": 16, "group": "G", "date": "15 Jun 2026", "stadium": "Estadio Los Ángeles", "a": "RI de Irán", "b": "Nueva Zelanda" },
  { "id": 17, "group": "I", "date": "16 Jun 2026", "stadium": "Estadio Nueva York / Nueva Jersey", "a": "Francia", "b": "Senegal" },
  { "id": 18, "group": "I", "date": "16 Jun 2026", "stadium": "Estadio Boston", "a": "Irak", "b": "Noruega" },
  { "id": 19, "group": "J", "date": "16 Jun 2026", "stadium": "Estadio Kansas City", "a": "Argentina", "b": "Argelia" },
  { "id": 20, "group": "J", "date": "16 Jun 2026", "stadium": "Estadio Bahía de San Francisco", "a": "Austria", "b": "Jordania" },
  { "id": 21, "group": "K", "date": "17 Jun 2026", "stadium": "Estadio Houston", "a": "Portugal", "b": "RD Congo" },
  { "id": 22, "group": "L", "date": "17 Jun 2026", "stadium": "Estadio Dallas", "a": "Inglaterra", "b": "Croacia" },
  { "id": 23, "group": "L", "date": "17 Jun 2026", "stadium": "Estadio Toronto", "a": "Ghana", "b": "Panamá" },
  { "id": 24, "group": "K", "date": "17 Jun 2026", "stadium": "Estadio Ciudad de México", "a": "Uzbekistán", "b": "Colombia" },
  { "id": 25, "group": "A", "date": "18 Jun 2026", "stadium": "Estadio Atlanta", "a": "República Checa", "b": "Sudáfrica" },
  { "id": 26, "group": "B", "date": "18 Jun 2026", "stadium": "Estadio Los Ángeles", "a": "Suiza", "b": "Bosnia y Herzegovina" },
  { "id": 27, "group": "B", "date": "18 Jun 2026", "stadium": "Estadio BC Place Vancouver", "a": "Canadá", "b": "Catar" },
  { "id": 28, "group": "A", "date": "18 Jun 2026", "stadium": "Estadio Guadalajara", "a": "México", "b": "Corea del Sur" },
  { "id": 29, "group": "D", "date": "19 Jun 2026", "stadium": "Estadio de Seattle", "a": "Estados Unidos", "b": "Australia" },
  { "id": 30, "group": "C", "date": "19 Jun 2026", "stadium": "Estadio Boston", "a": "Escocia", "b": "Marruecos" },
  { "id": 31, "group": "C", "date": "19 Jun 2026", "stadium": "Estadio Filadelfia", "a": "Brasil", "b": "Haití" },
  { "id": 32, "group": "D", "date": "19 Jun 2026", "stadium": "Estadio Bahía de San Francisco", "a": "Turquía", "b": "Paraguay" },
  { "id": 33, "group": "F", "date": "20 Jun 2026", "stadium": "Estadio Houston", "a": "Países Bajos", "b": "Suecia" },
  { "id": 34, "group": "E", "date": "20 Jun 2026", "stadium": "Estadio Toronto", "a": "Alemania", "b": "Costa de Marfil" },
  { "id": 35, "group": "E", "date": "20 Jun 2026", "stadium": "Estadio Kansas City", "a": "Ecuador", "b": "Curazao" },
  { "id": 36, "group": "F", "date": "20 Jun 2026", "stadium": "Estadio Monterrey", "a": "Túnez", "b": "Japón" },
  { "id": 37, "group": "H", "date": "21 Jun 2026", "stadium": "Estadio Atlanta", "a": "España", "b": "Arabia Saudita" },
  { "id": 38, "group": "G", "date": "21 Jun 2026", "stadium": "Estadio Los Ángeles", "a": "Bélgica", "b": "RI de Irán" },
  { "id": 39, "group": "H", "date": "21 Jun 2026", "stadium": "Estadio Miami", "a": "Uruguay", "b": "Cabo Verde" },
  { "id": 40, "group": "G", "date": "21 Jun 2026", "stadium": "Estadio BC Place Vancouver", "a": "Nueva Zelanda", "b": "Egipto" },
  { "id": 41, "group": "J", "date": "22 Jun 2026", "stadium": "Estadio Dallas", "a": "Argentina", "b": "Austria" },
  { "id": 42, "group": "I", "date": "22 Jun 2026", "stadium": "Estadio Filadelfia", "a": "Francia", "b": "Irak" },
  { "id": 43, "group": "I", "date": "22 Jun 2026", "stadium": "Estadio Nueva York / Nueva Jersey", "a": "Noruega", "b": "Senegal" },
  { "id": 44, "group": "J", "date": "22 Jun 2026", "stadium": "Estadio Bahía de San Francisco", "a": "Jordania", "b": "Argelia" },
  { "id": 45, "group": "K", "date": "23 Jun 2026", "stadium": "Estadio Houston", "a": "Portugal", "b": "Uzbekistán" },
  { "id": 46, "group": "L", "date": "23 Jun 2026", "stadium": "Estadio Boston", "a": "Inglaterra", "b": "Ghana" },
  { "id": 47, "group": "L", "date": "23 Jun 2026", "stadium": "Estadio Toronto", "a": "Panamá", "b": "Croacia" },
  { "id": 48, "group": "K", "date": "23 Jun 2026", "stadium": "Estadio Guadalajara", "a": "Colombia", "b": "RD Congo" },
  { "id": 49, "group": "C", "date": "24 Jun 2026", "stadium": "Estadio Miami", "a": "Escocia", "b": "Brasil" },
  { "id": 50, "group": "C", "date": "24 Jun 2026", "stadium": "Estadio Atlanta", "a": "Marruecos", "b": "Haití" },
  { "id": 51, "group": "B", "date": "24 Jun 2026", "stadium": "Estadio BC Place Vancouver", "a": "Suiza", "b": "Canadá" },
  { "id": 52, "group": "B", "date": "24 Jun 2026", "stadium": "Estadio de Seattle", "a": "Bosnia y Herzegovina", "b": "Catar" },
  { "id": 53, "group": "A", "date": "24 Jun 2026", "stadium": "Estadio Ciudad de México", "a": "República Checa", "b": "México" },
  { "id": 54, "group": "A", "date": "24 Jun 2026", "stadium": "Estadio Monterrey", "a": "Sudáfrica", "b": "Corea del Sur" },
  { "id": 55, "group": "E", "date": "25 Jun 2026", "stadium": "Estadio Filadelfia", "a": "Curazao", "b": "Costa de Marfil" },
  { "id": 56, "group": "E", "date": "25 Jun 2026", "stadium": "Estadio Nueva York / Nueva Jersey", "a": "Ecuador", "b": "Alemania" },
  { "id": 57, "group": "F", "date": "25 Jun 2026", "stadium": "Estadio Dallas", "a": "Japón", "b": "Suecia" },
  { "id": 58, "group": "F", "date": "25 Jun 2026", "stadium": "Estadio Kansas City", "a": "Túnez", "b": "Países Bajos" },
  { "id": 59, "group": "D", "date": "25 Jun 2026", "stadium": "Estadio Los Ángeles", "a": "Turquía", "b": "Estados Unidos" },
  { "id": 60, "group": "D", "date": "25 Jun 2026", "stadium": "Estadio Bahía de San Francisco", "a": "Paraguay", "b": "Australia" },
  { "id": 61, "group": "I", "date": "26 Jun 2026", "stadium": "Estadio Boston", "a": "Noruega", "b": "Francia" },
  { "id": 62, "group": "I", "date": "26 Jun 2026", "stadium": "Estadio Toronto", "a": "Senegal", "b": "Irak" },
  { "id": 63, "group": "H", "date": "26 Jun 2026", "stadium": "Estadio Houston", "a": "Cabo Verde", "b": "Arabia Saudita" },
  { "id": 64, "group": "H", "date": "26 Jun 2026", "stadium": "Estadio Guadalajara", "a": "Uruguay", "b": "España" },
  { "id": 65, "group": "G", "date": "26 Jun 2026", "stadium": "Estadio de Seattle", "a": "Egipto", "b": "RI de Irán" },
  { "id": 66, "group": "G", "date": "26 Jun 2026", "stadium": "Estadio BC Place Vancouver", "a": "Nueva Zelanda", "b": "Bélgica" },
  { "id": 67, "group": "L", "date": "27 Jun 2026", "stadium": "Estadio Nueva York / Nueva Jersey", "a": "Panamá", "b": "Inglaterra" },
  { "id": 68, "group": "L", "date": "27 Jun 2026", "stadium": "Estadio Filadelfia", "a": "Croacia", "b": "Ghana" },
  { "id": 69, "group": "K", "date": "27 Jun 2026", "stadium": "Estadio Miami", "a": "Colombia", "b": "Portugal" },
  { "id": 70, "group": "K", "date": "27 Jun 2026", "stadium": "Estadio Atlanta", "a": "RD Congo", "b": "Uzbekistán" },
  { "id": 71, "group": "J", "date": "27 Jun 2026", "stadium": "Estadio Kansas City", "a": "Argelia", "b": "Austria" },
  { "id": 72, "group": "J", "date": "27 Jun 2026", "stadium": "Estadio Dallas", "a": "Jordania", "b": "Argentina" }
];


// ✅ RESULTADOS REALES
const results = {
  1: { a: 2, b: 0 },
  2: { a: 2, b: 1 },
  3: { a: 1, b: 1 },
  4: { a: 4, b: 1 },
  5: { a: 1, b: 1 },
  6: { a: 1, b: 1 },
  7: { a: 0, b: 1 },
  8: { a: 2, b: 0 },
  9: { a: 7, b: 1 },
  10: { a: 2, b: 2 },
  11: { a: 1, b: 0 },
  12: { a: 5, b: 1 },
  13: { a: 0, b: 0 },
  14: { a: 1, b: 1 },
  15: { a: 1, b: 1 },
  16: { a: 2, b: 2 },
  17: { a: 3, b: 1 },
  18: { a: 1, b: 4 },
  19: { a: 3, b: 0 },
  20: { a: 3, b: 1 },
  21: { a: 1, b: 1 },
  22: { a: 4, b: 2 },
  23: { a: 1, b: 0 },
  24: { a: 1, b: 3 }, 
  25: { a: 1, b: 1 },
  26: { a: 4, b: 1 },
  27: { a: 6, b: 0 },
  28: { a: 1, b: 0 },
  29: { a: 2, b: 0 },
  30: { a: 0, b: 1 },
  31: { a: 3, b: 0 },
  32: { a: 0, b: 1 },
  33: { a: 5, b: 1 },
  34: { a: 2, b: 1 },
  35: { a: 0, b: 0 },
  36: { a: 0, b: 4 },
  37: { a: 4, b: 0 },
  38: { a: 0, b: 0 },
  39: { a: 2, b: 2 },
  40: { a: 1, b: 3 },
  41: { a: 2, b: 0 },
  42: { a: 3, b: 0 },
  43: { a: 3, b: 2 },
  44: { a: 1, b: 2 },
  45: { a: 2, b: 0 },
  // 46: { a: 0, b: 0 },
  // 47: { a: 0, b: 0 },
  // 48: { a: 0, b: 0 },
  // 49: { a: 0, b: 0 },
  // 50: { a: 0, b: 0 },
  // 51: { a: 0, b: 0 },
  // 52: { a: 0, b: 0 },
  // 53: { a: 0, b: 0 },
  // 54: { a: 0, b: 0 },
  // 55: { a: 0, b: 0 },
  // 56: { a: 0, b: 0 },
  // 57: { a: 0, b: 0 },
  // 58: { a: 0, b: 0 },
  // 59: { a: 0, b: 0 },
  // 60: { a: 0, b: 0 },
  // 61: { a: 0, b: 0 },
  // 62: { a: 0, b: 0 },
  // 63: { a: 0, b: 0 },
  // 64: { a: 0, b: 0 },
  // 65: { a: 0, b: 0 },
  // 66: { a: 0, b: 0 },
  // 67: { a: 0, b: 0 },
  // 68: { a: 0, b: 0 },
  // 69: { a: 0, b: 0 },
  // 70: { a: 0, b: 0 },
  // 71: { a: 0, b: 0 },
  // 72: { a: 0, b: 0 },
};

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bet, setBet] = useState("");
  const [predictions, setPredictions] = useState({});
  const [participants, setParticipants] = useState([]);
  const [groupFilter, setGroupFilter] = useState("A");
  
      const calculateGroupTable = (group) => {
          const groupMatches = matches.filter((m) => m.group === group);

          const teams = {};

          groupMatches.forEach((m) => {
            const r = results[m.id];
            if (!r) return;

            const { a, b } = r;

            if (!teams[m.a]) teams[m.a] = { pts: 0, gf: 0, gc: 0 };
            if (!teams[m.b]) teams[m.b] = { pts: 0, gf: 0, gc: 0 };

            teams[m.a].gf += a;
            teams[m.a].gc += b;

            teams[m.b].gf += b;
            teams[m.b].gc += a;

            if (a > b) {
              teams[m.a].pts += 3;
            } else if (a < b) {
              teams[m.b].pts += 3;
            } else {
              teams[m.a].pts += 1;
              teams[m.b].pts += 1;
            }
          });

          return Object.entries(teams)
            .map(([team, data]) => ({
              team,
              pts: data.pts,
              gf: data.gf,
              gc: data.gc,
              dg: data.gf - data.gc
            }))
            .sort((a, b) =>
              b.pts - a.pts || b.dg - a.dg || b.gf - a.gf
            );
        };


  const normalizeScore = (value) => {
    if (value === "") return "";

    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) return "";

    return Math.min(15, Math.max(0, Math.trunc(numericValue)));
  };

  // ✅ GUARDAR PREDICCIÓN 
  const handleChange = (matchId, team, value) => {
    const normalizedValue = normalizeScore(value);

    setPredictions((prev) => ({
      ...prev,
      [matchId]: {
        ...(prev[matchId] || {}),
        [team]: normalizedValue
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

    const deadline = new Date("2026-06-11T00:00:00");

if (new Date() > deadline) {
  alert("Ya no se permiten cambios después del inicio del torneo");
  return;
}

    const snapshot = await getDocs(collection(db, "predictions"));
    const exists = snapshot.docs.some(
      (d) => d.data().email === email
    );

    if (exists) return alert("Correo ya registrado");

    await addDoc(collection(db, "predictions"), {
            name,
            email,
            /* bet: Number(bet), */
            predictions, 
            score: scoreData.total,
            exact: scoreData.exact,
            winner: scoreData.winner
          });


    alert("✅ Guardado!");

    setName("");
    setEmail("");
    /* setBet(""); */
    setPredictions({});

    loadParticipants();
  };

  // Descargar mi pronóstico (según el correo actual)
  const downloadMyPredictionExcel = () => {
    if (!email) return alert("Ingresa tu correo para descargar tu pronóstico");

    const participant = participants.find((p) => p.email === email);
    if (!participant) return alert("No se encontró el pronóstico para este correo");

    const preds = participant.predictions || {};
    const data = Object.keys(preds).map((id) => {
      const m = matches.find((mm) => Number(mm.id) === Number(id));
      const p = preds[id] || {};
        const official = results[Number(id)];
      return {
          Id: id,
        Partido: m ? `${m.a} vs ${m.b}` : `Partido ${id}`,
        EquipoA: m?.a || "Equipo A",
        EquipoB: m?.b || "Equipo B",
        PredA: p.a ?? "",
        PredB: p.b ?? "",
          ResultadoA: official?.a ?? "",
          ResultadoB: official?.b ?? "",
      };
    });

    if (data.length === 0) return alert("No hay pronósticos para descargar");

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "MiPronostico");
    XLSX.writeFile(workbook, `pronostico_${participant.name || 'usuario'}.xlsx`);
  };

  // ✅ CARGAR RANKING
  const loadParticipants = async () => {
    const data = await getDocs(collection(db, "predictions"));
    setParticipants(data.docs.map((doc) => doc.data()));
  };

  useEffect(() => {
    const data = {
      name,
      email,
      /* bet, */
      predictions
    };

    localStorage.setItem(
      "quiniela_mundial_2026",
      JSON.stringify(data)
    );
  }, [name, email, bet, predictions]);

  useEffect(() => {
    const savedData = localStorage.getItem("quiniela_mundial_2026");

    if (savedData) {
      const data = JSON.parse(savedData);

      setName(data.name || "");
      setEmail(data.email || "");
      /* setBet(data.bet || ""); */
      setPredictions(data.predictions || {});
    }
  }, []);
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
          color: "#06080a",        
          fontSize: "30px",
          fontWeight: "bold",
          letterSpacing: "0.5px"
        }}>
          🏆 Chicken Mundial 2026
        </h1>

        {/* FORM */}
        <div style={card}>
          {/* REGLAS */}
        <div style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "20px",
            textAlign: "left",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
            }}>
          <h3 style={{ marginBottom: "10px" }}>📋 Reglas</h3>

          <p><strong>1. Participantes Inscritos:</strong> El período de inscripción ha finalizado y los participantes registrados serán los únicos habilitados para competir durante la fase de grupos.</p>

          <p><strong>2. Pronósticos:</strong> Cada participante registró previamente el marcador pronosticado para todos los partidos de la fase de grupos.</p>

          <p><strong>3. Sistema de Puntuación:</strong></p>
          <ul style={{ marginLeft: "20px" }}>
          <li>Resultado exacto: <strong>3 puntos</strong></li>
          <li>Acierta ganador/empate: <strong>1 punto</strong></li>
          <li>Incorrecto: <strong>0 puntos</strong></li>
          </ul>

          <p><strong>4. Apuesta Oficial:</strong> Luego de consolidar las propuestas de los participantes, se definió una apuesta oficial de $50.000 por participante.</p>
          <p><strong>5. Recaudo de la Apuesta:</strong> Se encuentra en discusión la modalidad de recaudo. Las opciones propuestas son:
                    • Realizar la consignación de la apuesta antes del inicio de la competencia.
                    • Realizar el pago una vez finalizada la fase de grupos, efectuando la transferencia directamente a los ganadores.</p>
          <p><strong>6. Premiación:</strong> La distribución de premios se realizará con base en la clasificación final obtenida al cierre de la fase de grupos, según las condiciones que se acuerden entre los participantes.</p>
          <p><strong>7. Continuidad del Juego:</strong> Finalizada la fase de grupos, se evaluará la continuidad de la Chicken Mundialista para las fases eliminatorias, manteniendo la misma dinámica de participación y puntuación.</p>
        </div>
          <h3 style={{ marginBottom: "15px" }}>
            Información del participante
          </h3>
          <div style={grid3}>
            {/* <input style={input} placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} /> */}
            <input style={input} placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} />
            {/* <input style={input} placeholder="Apuesta propuesta" value={bet} onChange={e => setBet(e.target.value)} /> */}
          </div>
                      <button
              onClick={downloadMyPredictionExcel}
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                marginTop: "10px"
              }}
            >
              📥 Descargar mi pronóstico
            </button>
        </div>

        {/* PRONÓSTICOS */}
        <div style={card}>
          <h3>Resultados Oficiales</h3>

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
              width: "100%",   
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
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px"
                }}>
                  <span style={{
                    background: "#1c263b",
                    color: "#fff",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    fontSize: "18px",
                    minWidth: "40px",
                    textAlign: "center"
                  }}>
                    {results[String(m.id)]?.a ?? "-"}
                  </span>

                  <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                    -
                  </span>

                  <span style={{
                    background: "#1c263b",
                    color: "#fff",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    fontSize: "18px",
                    minWidth: "40px",
                    textAlign: "center"
                  }}>
                    {results[String(m.id)]?.b ?? "-"}
                  </span>
                </div>
              </div>

            </div>

            
          ))}

          <div style={card}>
             
            <h3 style={{ textAlign: "center", marginTop: "20px" }}>
              📊 Tabla de posiciones - Grupo {groupFilter}
            </h3>

            <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
              <table style={{
                width: "100%",
                maxWidth: "600px",
                textAlign: "center",
                borderCollapse: "collapse",
                marginTop: "10px"
              }}>
                <thead style={{ background: "#f3f4f6" }}>
                  <tr>
                    <th style={{ padding: "10px" }}>Equipo</th>
                    <th style={{ padding: "10px" }}>PTS</th>
                    <th style={{ padding: "10px" }}>GF</th>
                    <th style={{ padding: "10px" }}>GC</th>
                    <th style={{ padding: "10px" }}>DG</th>
                  </tr>
                </thead>

                <tbody>
                  {calculateGroupTable(groupFilter).map((t, i) => (
                    <tr
                      key={i}
                      style={{
                        background: i < 2 ? "#dcfce7" : "transparent",
                        borderBottom: "1px solid #e5e7eb"
                      }}
                    >
                      <td style={{ padding: "10px", fontWeight: "bold" }}>{t.team}</td>
                      <td style={{ padding: "10px" }}>{t.pts}</td>
                      <td style={{ padding: "10px" }}>{t.gf}</td>
                      <td style={{ padding: "10px" }}>{t.gc}</td>
                      <td style={{ padding: "10px" }}>
                        {t.dg > 0 ? `+${t.dg}` : t.dg}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div> 


          <br />

          {/* <div style={{ textAlign: "center" }}>
            <button style={button} onClick={handleSave}>
              Guardar Pronóstico
            </button>
          </div>  */}
        </div>


        {/* RANKING */}
        <div style={card}>
          <h3>🏆 Ranking</h3>

          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "10px"
          }}>
          </div>

          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "10px"
          }}>
          </div>
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
              {[...participants]
                  .map((p) => {
                    const scoreData = calculateScore(p.predictions);

                    return {
                      ...p,
                      score: scoreData.total,
                      exact: scoreData.exact,
                      winner: scoreData.winner
                    };
                  })
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
{/*                     <td>
                      {new Intl.NumberFormat('es-CO', {
                       style: 'currency',
                       currency: 'COP',
                       minimumFractionDigits: 0,
                       maximumFractionDigits: 0,
                      }).format(p.bet)}
                    </td> */}
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
    </div>
  );
}

export default App;