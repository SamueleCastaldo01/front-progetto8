import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { db } from '../firebase-config';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { notifyErrorAddCliente, notifyErrorAddUsername, successAddCliente } from '../components/Notify';



export function AddCliente() {
    const navigate = useNavigate();

    const [ragioneSociale, setRagioneSociale] = useState('');
    const [partitaIva, setPartitaIva] = useState('');
    const [email, setEmail] = useState('');
    const [dataInserimento, setDataInserimento] = useState('');
    const [dataUltimoContatto, setDataUltimoContatto] = useState('');
    const [fattutatoAnnuale, setFattutatoAnnuale] = useState('');
    const [pec, setPec] = useState('');
    const [telefono, setTelefono] = useState('');
    const [emailContatto, setEmailContatto] = useState('');
    const [nomeContatto, setNomeContatto] = useState('');
    const [cognomeContatto, setCognomeContatto] = useState('');
    const [telefonoContatto, setTelefonoContatto] = useState('');
    const [logoAziendale, setLogoAziendale] = useState('');
    const [idSedeLegale, setIdSedeLegale] = useState('');
    const [idSedeOperativa, setIdSedeOperativa] = useState('');

    const token = localStorage.getItem('authToken');



    const handleReset = () => {
        setRagioneSociale('');
        setPartitaIva('');
        setEmail('');
        setDataInserimento('');
        setDataUltimoContatto('');
        setFattutatoAnnuale('');
        setPec('');
        setTelefono('');
        setEmailContatto('');
        setNomeContatto('');
        setCognomeContatto('');
        setTelefonoContatto('');
        setLogoAziendale('');
        setIdSedeLegale('');
        setIdSedeOperativa('');
    };

    const capitalizeWords = (str) => {
        return str
            .toLowerCase() // Converte l'intera stringa in minuscolo
            .split(' ') // Divide la stringa in parole
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalizza la prima lettera di ogni parola
            .join(' '); // Riunisce le parole in una stringa
    };


    const handleSubmit = async (event) => {
        event.preventDefault();


        const clienteData = {
            ragioneSociale,
            partitaIva,
            email,
            dataInserimento,
            dataUltimoContatto,
            fattutatoAnnuale,
            pec,
            telefono,
            emailContatto,
            nomeContatto,
            cognomeContatto,
            telefonoContatto,
            logoAziendale,
            idSedeLegale,
            idSedeOperativa,
            createdAt: new Date().toISOString(),

        };

        try {
            const token = localStorage.getItem('authToken');
            // Effettua la richiesta fetch all'API
            const response = await fetch('http://localhost:3001/clienti', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(clienteData),
            });

            if (response.ok) {
                const data = await response.json();
                successAddCliente(); // Funzione di successo per il messaggio
                handleReset(); // Reset dei campi dopo il successo
                navigate('/cliente-list'); // Naviga alla lista dei clienti
            } else {
                const error = await response.json();
                notifyErrorAddCliente(error.message || 'Errore durante l\'aggiunta del cliente.');
            }
        } catch (error) {
            // Gestione degli errori di rete o altro
            notifyErrorAddCliente('Errore di rete. Riprova più tardi.');
        }

    };


    //  const handleGeneratePassword = () => {
    //     const length = 10;
    //     const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    //     const upperCharset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    //     const numberCharset = "0123456789";

    //     let password = "";
    //     password += upperCharset.charAt(Math.floor(Math.random() * upperCharset.length));
    //     password += numberCharset.charAt(Math.floor(Math.random() * numberCharset.length));

    //     for (let i = 2; i < length; i++) {
    //         password += charset.charAt(Math.floor(Math.random() * charset.length));
    //     }

    //     password = password.split('').sort(() => Math.random() - 0.5).join('');
    //     
    //     setPassword(password);
    // };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7}}
        >
            <div className='container-fluid '>
                <h2 className='titlePage'>Aggiungi un nuovo Cliente</h2>

                <form onSubmit={handleSubmit}>
                    <div className='row'>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' required label="Nome Contatto" variant="outlined" color='tertiary' value={nomeContatto}
                                onChange={(e) => {
                                    const formattedNome = capitalizeWords(e.target.value);
                                    setNomeContatto(formattedNome);
                                }}
                            />
                        </div>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' required label="Cognome Contatto" variant="outlined" color='tertiary' value={cognomeContatto}
                                onChange={(e) => {
                                    const formattedCognome = capitalizeWords(e.target.value);
                                    setCognomeContatto(formattedCognome);
                                }}
                            />
                        </div>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' type='number' required label="Numero di Telefono Contatto" variant="outlined" color='tertiary' value={telefonoContatto} onChange={(e) => setTelefonoContatto(e.target.value)} />
                        </div>

                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' required label="Ragione Sociale" variant="outlined" color='tertiary' value={ragioneSociale} onChange={(e) => setRagioneSociale(e.target.value.toLowerCase())} />
                        </div>
                        <div className='d-flex mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' required label="Partita IVA" variant="outlined" color='tertiary' value={partitaIva} onChange={(e) => setPartitaIva(e.target.value)} />
                        </div>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' label="Email" variant="outlined" color='tertiary' value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' type='date' label="Data di inserimento" variant="outlined" color='tertiary' value={dataInserimento} onChange={(e) => setDataInserimento(e.target.value)} InputLabelProps={{ shrink: true }} />
                        </div>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' type='date' label="Data ultimo contatto" variant="outlined" color='tertiary' value={dataUltimoContatto} onChange={(e) => setDataUltimoContatto(e.target.value)} InputLabelProps={{ shrink: true }} />
                        </div>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' type='number' required label="Fattutato Annuale" variant="outlined" color='tertiary' value={fattutatoAnnuale} onChange={(e) => setFattutatoAnnuale(e.target.value)} />
                        </div>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' label="Pec" variant="outlined" color='tertiary' value={pec} onChange={(e) => setPec(e.target.value)} />
                        </div>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' type='number' required label="Numero di Telefono" variant="outlined" color='tertiary' value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                        </div>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' label="Email Contatto" variant="outlined" color='tertiary' value={emailContatto} onChange={(e) => setEmailContatto(e.target.value)} />
                        </div>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' required label="ID Sede Legale" variant="outlined" color='tertiary' value={idSedeLegale} onChange={(e) => setIdSedeLegale(e.target.value)} />
                        </div>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' required label="ID Sede Operativa" variant="outlined" color='tertiary' value={idSedeOperativa} onChange={(e) => setIdSedeOperativa(e.target.value)} />
                        </div>

                    </div>
                    <Button className='mt-4' type="submit" variant="contained">Aggiungi Cliente </Button>
                </form>
            </div>
        </motion.div>
    );
}
