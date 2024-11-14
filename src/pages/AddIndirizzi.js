import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { db } from "../firebase-config";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import {
  notifyErrorAddCliente,
  notifyErrorAddUsername,
  successAddCliente,
} from "../components/Notify";

export function AddIndirizzi() {
  const navigate = useNavigate();

  const [via, setVia] = useState("");
  const [civico, setCivico] = useState("");
  const [localita, setLocalita] = useState("");
  const [cap, setCap] = useState("");
  const [comune, setComune] = useState("");

  const token = localStorage.getItem("authToken");

  const handleReset = () => {
    setVia("");
    setCivico("");
    setLocalita("");
    setCap("");
    setComune("");
  };

  const capitalizeWords = (str) => {
    return str
      .toLowerCase() // Converte l'intera stringa in minuscolo
      .split(" ") // Divide la stringa in parole
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalizza la prima lettera di ogni parola
      .join(" "); // Riunisce le parole in una stringa
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const clienteData = {
      via,
      civico,
      localita,
      cap,
      comune,
      createdAt: new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem("authToken");
      // Effettua la richiesta fetch all'API
      const response = await fetch("http://localhost:3001/indirizzi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(clienteData),
      });

      if (response.ok) {
        const data = await response.json();
        successAddCliente();
        handleReset();
        navigate("/cliente-list");
      } else {
        const error = await response.json();
        notifyErrorAddCliente(
          error.message || "Errore durante l'aggiunta del cliente."
        );
      }
    } catch (error) {
      notifyErrorAddCliente("Errore di rete. Riprova più tardi.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <div className="container-fluid">
        <h2 className="titlePage">Aggiungi un nuovo indirizzo</h2>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="mt-4 col-lg-4 col-md-6 col-sm-12">
              <TextField
                className="w-100"
                required
                label="Via"
                variant="outlined"
                color="tertiary"
                value={via}
                onChange={(e) => {
                  
                  setVia(e.target.value);
                }}
              />
            </div>
            <div className="mt-4 col-lg-4 col-md-6 col-sm-12">
              <TextField
                className="w-100"
                type="number"
                required
                label="Civico"
                variant="outlined"
                color="tertiary"
                value={civico}
                onChange={(e) => setCivico(e.target.value)}
              />
            </div>
            <div className="mt-4 col-lg-4 col-md-6 col-sm-12">
              <TextField
                className="w-100"
                required
                label="Localitá"
                variant="outlined"
                color="tertiary"
                value={localita}
                onChange={(e) => {
                  setLocalita(e.target.value)
                }}
              />
            </div>

            <div className="mt-4 col-lg-4 col-md-6 col-sm-12">
              <TextField
                className="w-100"
                required
                label="Cap"
                variant="outlined"
                color="tertiary"
                value={cap}
                onChange={(e) =>
                  setCap(e.target.value)
                }
              />
            </div>
            <div className="d-flex mt-4 col-lg-4 col-md-6 col-sm-12">
              <TextField
                className="w-100"
                required
                label="Comune"
                variant="outlined"
                color="tertiary"
                value={comune}
                onChange={(e) => setComune(e.target.value)}
              />
            </div>
          </div>
          <Button className="mt-4" type="submit" variant="contained">
            Aggiungi Indirizzo
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
