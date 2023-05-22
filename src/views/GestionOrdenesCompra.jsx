// import { useSelector } from "react-redux";

import Button from '@mui/material/Button';

import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import '../css/Tabla.css';

import Grid from '@mui/material/Grid'; // Grid version 1
import "../css/TestView.css"
import "../css/GestionOtView.css"
import { collection, query, doc, updateDoc, onSnapshot } from "firebase/firestore";

import { db } from "../firebase/firebase-config"
import { useState, useEffect } from "react";
import { blue, pink,deepPurple, yellow, cyan} from '@mui/material/colors';

import { useNavigate } from 'react-router-dom';
import CalculateIcon from '@mui/icons-material/Calculate';
import { useParams } from "react-router-dom";
import TarjetaGestionar from '../components/TarjetaGestionar';
import React from 'react';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
export default function GestionOrdenescView() {
    const [accesorios, setAccesorios] = useState([]);
    // const [tiempo,setTiempo]= useState(0);
    const [ordenFirebase, setOrdenFirebase] = useState({
        situacion: '',
        indice: '',
        accesorios: [],  
        codigo: '',
        id: '',
    });

    const navigate = useNavigate();
    let params = useParams();


    const navegarView = (ruta) => {
        navigate(`/${params.uid}/${ruta}`);
    }

    const cancelar = () => {
        navegarView('ordenes/gestion');
    };
    
    const calculadora = (data) => {
        navegarView('ordenes/gestion/gestionordencompra/calculadoraproduccion');
    }


    const getData = async () => {
        const reference = query(collection(db, "usuarios"));

        // onSnapshot(doc(db, "ordenescompra", `${currentOrden.id}`), (doc) => {
        //     setOrdenFirebase(doc.data());
        // });

    onSnapshot(doc(db, "informacion", "parametros"), (doc) => {
      setAccesorios(doc.data().accesorios)
    });


    };
    

    useEffect(() => {
        getData();
    }, [])

    return (
        <>
            <div className="container-test-2">
                <Grid container spacing={{ xs: 3 }} >
                <Grid item xs={6} sm={6} md={3}>
                            <Button variant="outlined"
                              sx={{height:"100%"}}
                                fullWidth
                                color='rojo'
                                startIcon={<ArrowBackIcon sx={{ fontSize: 90 }} />}
                                onClick={() => { cancelar() }} >
                                SALIR</Button>
                        </Grid>
                 
                        <Grid item xs={6} sm={6} md={3}>
                            <Button variant="outlined"
                                className="boton-gestiont"
                                endIcon={<CalculateIcon sx={{ fontSize: 90 }} />}
                                onClick={() => { calculadora() }}
                                 >Calculadora</Button>

                        </Grid>
                        <Grid item xs={6} sm={6} md={3}>
                            <Button variant="outlined"
                                className="boton-gestiont"
                                endIcon={<CalculateIcon sx={{ fontSize: 90 }} />}
                                onClick={() => { calculadora() }}
                                 >Galvanizado</Button>

                        </Grid>
                   
                    <Grid item xs={12} sm={6} md={3}>
                        <Grid container spacing={{ xs: 1, md: 4 }}>
                        <Grid item xs={12} sm={12} md={12}>

<TarjetaGestionar
    icon={<CoPresentIcon />}
    headerColor={"#fff"}
    avatarColor={pink[700]}
    title={'Producción'}
    value={90}
/>

</Grid>
<Grid item xs={12} sm={12} md={12}>

<TarjetaGestionar
    icon={<CoPresentIcon />}
    headerColor={"#fff"}
    avatarColor={pink[700]}
    title={'Galvanizado'}
    value={30}
/>

</Grid>

<Grid item xs={12} sm={12} md={12}>

<TarjetaGestionar
    icon={<CoPresentIcon />}
    headerColor={"#fff"}
    avatarColor={pink[700]}
    title={'PESO QQ'}
    value={20.83}
/>

</Grid>

<Grid item xs={12} sm={12} md={12}>

<TarjetaGestionar
    icon={<CoPresentIcon />}
    headerColor={"#fff"}
    avatarColor={pink[700]}
    title={'PNC'}
    value={'0.62%'}
/>

</Grid>

                        </Grid>
                    </Grid>

                    <Grid item xs={12} sm={6} md={9}>
                        <Grid container spacing={{ xs: 3, md: 4 }}>

                            <Grid item xs={12} sm={12} md={12}>
                            {/* <Table className='table table-ligh table-hover'>
                    <Thead>
                      <Tr>
                            <Th>N° Pieza</Th>
                            <Th>Nombre</Th>
                            <Th>Orden</Th>
                            <Th>Faltan</Th>
                            <Th>Stock</Th>
                            <Th>% Produccion</Th>
                            <Th>Galvanizado F</Th>
                            <Th>% Galvanizado</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {currentOrden.map((dato, index) => (
                        <Tr key={index}>
                          <Td>{index + 1}</Td>
                          <Td>{dato.numero}</Td>
                          <Td>{dato.nombre}</Td>
                          <Td>{dato.cantidad}</Td>
                          <Td>0</Td>
                          <Td>0</Td>
                          <Td>0</Td>
                          <Td>0</Td>
                          
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>                                  */}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </>
    );

}