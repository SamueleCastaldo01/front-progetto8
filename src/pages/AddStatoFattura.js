import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


export function AddStatoFattura() {
    const navigate = useNavigate();


    const [statoFattura, setStatoFattura] = useState('');

    const token = localStorage.getItem('authToken');

    const handleReset = () => {

    };

    const successAddFattura = () => {
        alert('Fattura aggiunta con successo!');
    };

    const notifyErrorAddFattura = (message) => {
        alert(message);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const statoFatturaData = {
            stato: statoFattura,
        };

        try {
            const response = await fetch('http://localhost:3001/stato-fatture', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(statoFatturaData),
            });

            if (response.ok) {
                const data = await response.json();
                successAddFattura();
                handleReset();
                navigate('/aggiungifatture');
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
            <div className='container-fluid' style={{marginBottom : "400px"}}>
                <h2 className='titlePage'>Aggiungi Stato fattura</h2>

                <form onSubmit={handleSubmit}>
                <div className='row'>
                    <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                        <TextField className='w-100' required label="Stato Fattura" variant="outlined" color='tertiary' value={statoFattura}  onChange={(e) => setStatoFattura(e.target.value)}  />
                    </div>
                </div>
                <Button className='mt-4' type="submit" variant="contained">Aggiungi Stato Fattura</Button>
            </form>
             

     
            </div>
        </motion.div>
    );
}
