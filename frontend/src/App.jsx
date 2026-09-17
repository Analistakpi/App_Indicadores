import { useState } from "react";
import Login     from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [datos, setDatos] = useState(null);

  return datos
    ? <Dashboard datos={datos} onVolver={() => setDatos(null)} />
    : <Login     onResultado={setDatos} />;
}