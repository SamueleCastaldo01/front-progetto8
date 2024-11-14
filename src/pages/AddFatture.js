import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControl, InputLabel, MenuItem, Select, Collapse, Typography, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import moment from 'moment';
import { notifyErrorAddCliente, notifyErrorAddUsername, successAddCliente } from '../components/Notify';
import Autocomplete from '@mui/material/Autocomplete';

export function AddFatture() {
    const navigate = useNavigate();
    const [statiFattura, setStatiFattura] = useState([]);
    const [isLoadingStatoFattura, setIsLoadingStatoFattura] = useState(true);
    const [idCliente, setIdCliente] = useState('');
    const [data, setData] = useState('');
    const [importo, setImporto] = useState('');
    const [numero, setNumero] = useState('');
    const [idStatoFattura, setIdStatoFattura] = useState('');
    const [showOptionalFields, setShowOptionalFields] = useState(false);
    const token = localStorage.getItem('authToken');


    const fetchStatiFattura = async () => {
        try {
            const response = await fetch('http://localhost:3001/stato-fatture', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Usa il token per l'autenticazione
              }
            });
        
            if (!response.ok) {
              throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            setStatiFattura(data);
            setIsLoadingStatoFattura(false);
          } catch (error) {
            console.error("Error fetching invoice data:", error);
          }
    }

    useEffect(() => {
        fetchStatiFattura();
    },[])

    const handleChangeAutocomplete = (event, newValue) => {
        if (newValue) {
            setIdStatoFattura(newValue.id); // Imposta lo stato con l'ID selezionato
        } else {
            setIdStatoFattura(null); // Reset se non è selezionato nulla
        }
      };

    const handleReset = () => {
        setIdCliente("");
        setData("");
        setImporto("");
        setNumero("");
        setIdStatoFattura("");
    };

    const successAddFattura = () => {
        alert('Fattura aggiunta con successo!');
    };

    const notifyErrorAddFattura = (message) => {
        alert(message);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const fatturaData = {
            id_cliente: idCliente,
            data: data,
            importo: importo,
            numero: numero,
            id_stato_fattura: idStatoFattura,
        };

        try {
            const response = await fetch('http://localhost:3001/fatture', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(fatturaData),
            });

            if (response.ok) {
                const data = await response.json();
                successAddFattura();
                handleReset();
                navigate('/fattura-list');
            } else {
                const error = await response.json();
                notifyErrorAddFattura(error.message || 'Errore durante l\'aggiunta della fattura.');
            }
        } catch (error) {
            notifyErrorAddFattura('Errore di rete. Riprova più tardi.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
        >
            <div className='container-fluid'>
                <h2 className='titlePage'>Aggiungi una Fattura</h2>

                <form onSubmit={handleSubmit}>
                    <div className='row'>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' required label="ID Cliente" variant="outlined" color='tertiary' value={idCliente} onChange={(e) => setIdCliente(e.target.value)} />
                        </div>

                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' required type="date" label="Data" variant="outlined" color='tertiary' value={data} onChange={(e) => setData(e.target.value)} InputLabelProps={{ shrink: true }} />
                        </div>

                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' required type="number" label="Importo" variant="outlined" color='tertiary' value={importo} onChange={(e) => setImporto(e.target.value)} />
                        </div>

                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' required type="number" label="Numero Fattura" variant="outlined" color='tertiary' value={numero} onChange={(e) => setNumero(e.target.value)} />
                        </div>

                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            {isLoadingStatoFattura ? 
                            <CircularProgress />
                            :
                            <Autocomplete
                            disablePortal
                            options={statiFattura}
                            getOptionLabel={(option) => option.nomeStato} // Visualizza nomeStato nell'elenco
                            sx={{ width: 300 }}
                            onChange={handleChangeAutocomplete} // Gestisci selezione
                            renderInput={(params) => <TextField {...params} label="Stato Fattura" />}
                            />
                            }
                      
                        </div>

                        <div className='mt-4 col-lg-12'>
                            <Typography
                                variant="h6"
                                onClick={() => setShowOptionalFields(!showOptionalFields)}
                                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            >
                                Campi Facoltativi
                                {showOptionalFields ?
                                    <ExpandMoreIcon style={{ marginLeft: '8px', transform: 'rotate(180deg)' }} /> :
                                    <ExpandMoreIcon style={{ marginLeft: '8px' }} />
                                }
                            </Typography>
                            <Collapse in={showOptionalFields}>
                               
                            </Collapse>
                        </div>
                    </div>
                    <Button className='mt-4' type="submit" variant="contained">Aggiungi Fattura</Button>
                </form>
            </div>
        </motion.div>
    );
}
