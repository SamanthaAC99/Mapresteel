import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import { db } from "../firebase/firebase-config";
import { v4 as uuidv4 } from 'uuid';
import Grid from "@mui/material/Grid";
import Autocomplete from '@mui/material/Autocomplete';
import { onSnapshot, collection, query, setDoc,doc } from "firebase/firestore";
import '../css/Ordentrabajo.css';
import '../css/Presentacion.css';
import Typography from '@mui/material/Typography';
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import { useSelector } from "react-redux";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


export default function CalculadoraProduccion() {
  const navigate = useNavigate();
  let params = useParams();
  const [cedula, setCedula] = useState('');
  const [asunto,setAsunto] = useState('');
  const [pieza1,setPieza1] = useState('');
  const [pieza2,setPieza2] = useState('');
  const [pieza3,setPieza3] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [descripcion,setDescripcion] = useState('');
  const [problematica, setProblematica] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [deshabilitar,setDeshabilitar] = useState(false);
  const [cantidad, setCantidad] = useState(0);
  const [reloadAuto,setReloadAuto] = useState(false);
  const [departamentos,setDepartamentos] = useState([])
  const currentUser = useSelector(state => state.auths);

  const getData =  () => {
    const q = query(collection(db, "ordenescompra"));
     onSnapshot(q, (querySnapshot) => {
      const ordenes = [];
      querySnapshot.forEach((doc) => {
        ordenes.push(doc.data());
      });
      setCantidad(ordenes.length)
    });
    onSnapshot(doc(db, "informacion", "parametros"), (doc) => {

      setDepartamentos(doc.data().departamentos)

    });



  }

  const navegarView = (ruta) => {
    navigate(`/${params.uid}/${ruta}`);
  }


  const regresar = () => {
    navegarView('ordenes/gestion/gestionordencompra');
  };


  const enviardatos = () => {
    setDeshabilitar(true);
    let obserAux = "" 
    let fechaHoy = new Date().toLocaleString("en-US");
    let aux = uuidv4()
    let id_formateada = aux.slice(0,13)
    if (observaciones === ""){
        obserAux = "Ninguna"
    }else{
      obserAux = observaciones
    }
    if (departamento !== '' && descripcion !== '' && problematica !== '') {
    let orden = {
        fecha: fechaHoy,
        indice: Date.now(),
        cedula: currentUser.indentification,
        departamento: departamento,
        descripcion: descripcion.toUpperCase(),
        problematica: problematica.toUpperCase(),
        observaciones: obserAux.toUpperCase(),
        verificacion: false,
        asunto:asunto.toUpperCase(),
        estado: "Pendiente", // valores iniciados por defecto
        prioridad: "Pendiente", // valores iniciados por defecto
        tipotrabajo: "Pendiente", // valores iniciados por defecto
        tecnicos: [],  // valores iniciados por defecto
        encargado: {}, // valores iniciados por defecto
        play: false, // valores iniciados por defecto
        pause: true,// valores iniciados por defecto
        id: id_formateada,
        correo: currentUser.email,
        mparada: [],
        tiempos: [],
        reporte: false,
        reporteId: [],
        razonp: "",
        horat: "",
        tiempot: "",
        tipo: "",

      }

      sendFirestore(orden);
    } else {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Faltan Campos',
        text: "¡Por favor complete toda la información!",
        showConfirmButton: false,
        timer: 2000
      })
      setDeshabilitar(false);
    };
    
  };

  const sendFirestore = async (_orden) => {
    try {
      console.log(_orden)
      //await addDoc(collection(db, "ordenes"), _orden);
      // console.log("Document written with ID: ", docRef.id);
      // const washingtonRef = doc(db, "ordenes", docRef.id);
      // await updateDoc(washingtonRef, {
      //   id: docRef.id
      // });

      await setDoc(doc(db, "ordenescompra", _orden.id), _orden);
      setDeshabilitar(false);
      Swal.fire({
        icon: 'success',
        title: '¡Orden envida con éxito!',
        showConfirmButton: false,
        timer: 1500
      })
      limpiarCampos();
   
    } catch (e) {
      setDeshabilitar(false);
      console.error("Error adding document: ", e);
      Swal.fire({
        icon: 'error',
        title: 'Orden No Generado',
        text: 'Error de conexion!',
        footer: '<a href="">Click Aqui Para Notificar tu Error?</a>'
      })
    }
  };

  const limpiarCampos = () =>{
    setReloadAuto(!reloadAuto);
    setCedula("");    
    setDescripcion("");
    setProblematica("");
    setObservaciones("");
    setAsunto("");
    setPieza1('');
    setPieza2('');
    setPieza3('');
    setDepartamento("");
  }

  useEffect(() => {
    getData();
  }, [])



  return (
    <>


      {/* NOMBRE VISTA */}
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography component="div" variant="h4" className="princi3" >
            PRODUCCION
          </Typography>
        </Grid>
      </Grid>

      {/* INICIO CONTENEDOR */}

      <div className="container">
     
              <div className="row">
                <div className="col-md-6">
                  <div className="panelt">
                  <Grid container spacing={2}>
                        {/* EMPIEZA PIEZA */}
                      <Grid item xs={2}>
                       Pieza #1
                      </Grid>
                      <Grid item xs={3}>
                      <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="C.12.5 Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Extras Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={0.5}>
                      =
                      </Grid>
                      <Grid item xs={3.5}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Cantidad" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                     {/* TERMINA PIEZA */}

                       {/* EMPIEZA PIEZA */}
                       <Grid item xs={2}>
                       Pieza #2
                      </Grid>
                      <Grid item xs={3}>
                      <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="C.12.5 Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Extras Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={0.5}>
                      =
                      </Grid>
                      <Grid item xs={3.5}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Cantidad" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                     {/* TERMINA PIEZA */}

                       {/* EMPIEZA PIEZA */}
                       <Grid item xs={2}>
                       Pieza #3
                      </Grid>
                      <Grid item xs={3}>
                      <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="C.12.5 Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Extras Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={0.5}>
                      =
                      </Grid>
                      <Grid item xs={3.5}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Cantidad" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                     {/* TERMINA PIEZA */}

                       {/* EMPIEZA PIEZA */}
                       <Grid item xs={2}>
                       Pieza #4
                      </Grid>
                      <Grid item xs={3}>
                      <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="C.12.5 Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Extras Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={0.5}>
                      =
                      </Grid>
                      <Grid item xs={3.5}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Cantidad" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                     {/* TERMINA PIEZA */}

                       {/* EMPIEZA PIEZA */}
                       <Grid item xs={2}>
                       Pieza #6
                      </Grid>
                      <Grid item xs={3}>
                      <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="C.12.5 Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Extras Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={0.5}>
                      =
                      </Grid>
                      <Grid item xs={3.5}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Cantidad" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                     {/* TERMINA PIEZA */}

                       {/* EMPIEZA PIEZA */}
                       <Grid item xs={2}>
                       Pieza #7
                      </Grid>
                      <Grid item xs={3}>
                      <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="C.12.5 Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Extras Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={0.5}>
                      =
                      </Grid>
                      <Grid item xs={3.5}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Cantidad" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                     {/* TERMINA PIEZA */}

                       {/* EMPIEZA PIEZA */}
                       <Grid item xs={2}>
                       Pieza #8
                      </Grid>
                      <Grid item xs={3}>
                      <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="C.12.5 Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Extras Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={0.5}>
                      =
                      </Grid>
                      <Grid item xs={3.5}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Cantidad" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                     {/* TERMINA PIEZA */}

                       {/* EMPIEZA PIEZA */}
                       <Grid item xs={2}>
                       Pieza #9
                      </Grid>
                      <Grid item xs={3}>
                      <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="C.12.5 Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Extras Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={0.5}>
                      =
                      </Grid>
                      <Grid item xs={3.5}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Cantidad" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                     {/* TERMINA PIEZA */}

                       {/* EMPIEZA PIEZA */}
                       <Grid item xs={2}>
                       Pieza #10
                      </Grid>
                      <Grid item xs={3}>
                      <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="C.12.5 Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Extras Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={0.5}>
                      =
                      </Grid>
                      <Grid item xs={3.5}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Cantidad" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                     {/* TERMINA PIEZA */}

                       {/* EMPIEZA PIEZA */}
                       <Grid item xs={2}>
                       Pieza #11
                      </Grid>
                      <Grid item xs={3}>
                      <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="C.12.5 Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Extras Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={0.5}>
                      =
                      </Grid>
                      <Grid item xs={3.5}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Cantidad" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                     {/* TERMINA PIEZA */}

                       {/* EMPIEZA PIEZA */}
                       <Grid item xs={2}>
                       Pieza #12
                      </Grid>
                      <Grid item xs={3}>
                      <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="C.12.5 Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Extras Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={0.5}>
                      =
                      </Grid>
                      <Grid item xs={3.5}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Cantidad" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                     {/* TERMINA PIEZA */}

                       {/* EMPIEZA PIEZA */}
                       <Grid item xs={2}>
                       Pieza #13
                      </Grid>
                      <Grid item xs={3}>
                      <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="C.12.5 Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Extras Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={0.5}>
                      =
                      </Grid>
                      <Grid item xs={3.5}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Cantidad" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                     {/* TERMINA PIEZA */}

                       {/* EMPIEZA PIEZA */}
                       <Grid item xs={2}>
                       Pieza #14
                      </Grid>
                      <Grid item xs={3}>
                      <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="C.12.5 Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Extras Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={0.5}>
                      =
                      </Grid>
                      <Grid item xs={3.5}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Cantidad" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                     {/* TERMINA PIEZA */}
                        {/* EMPIEZA PIEZA */}
                        <Grid item xs={2}>
                       Pieza #15
                      </Grid>
                      <Grid item xs={3}>
                      <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="C.12.5 Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Extras Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={0.5}>
                      =
                      </Grid>
                      <Grid item xs={3.5}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Cantidad" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                     {/* TERMINA PIEZA */}

                      
                    </Grid>
                  </div>
                </div>

                {/* PANEL 2 */}
                <div className="col-md-6">
                  <div className="panelt">
                    <Grid container spacing={2}>
                         {/* EMPIEZA PIEZA */}
                       <Grid item xs={2}>
                       Pieza #21
                      </Grid>
                      <Grid item xs={3}>
                      <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="C.12.5 Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Extras Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={0.5}>
                      =
                      </Grid>
                      <Grid item xs={3.5}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Cantidad" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                     {/* TERMINA PIEZA */}
                       {/* EMPIEZA PIEZA */}
                       <Grid item xs={2}>
                       Pieza #22
                      </Grid>
                      <Grid item xs={3}>
                      <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="C.12.5 Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Extras Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={0.5}>
                      =
                      </Grid>
                      <Grid item xs={3.5}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Cantidad" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                     {/* TERMINA PIEZA */}

                       {/* EMPIEZA PIEZA */}
                       <Grid item xs={2}>
                       Pieza #23
                      </Grid>
                      <Grid item xs={3}>
                      <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="C.12.5 Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Extras Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={0.5}>
                      =
                      </Grid>
                      <Grid item xs={3.5}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Cantidad" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                     {/* TERMINA PIEZA */}

                       {/* EMPIEZA PIEZA */}
                       <Grid item xs={2}>
                       Pieza #24
                      </Grid>
                      <Grid item xs={3}>
                      <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="C.12.5 Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Extras Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={0.5}>
                      =
                      </Grid>
                      <Grid item xs={3.5}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Cantidad" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                     {/* TERMINA PIEZA */}

                       {/* EMPIEZA PIEZA */}
                       <Grid item xs={2}>
                       Pieza #25
                      </Grid>
                      <Grid item xs={3}>
                      <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="C.12.5 Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Extras Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={0.5}>
                      =
                      </Grid>
                      <Grid item xs={3.5}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Cantidad" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                     {/* TERMINA PIEZA */}

                       {/* EMPIEZA PIEZA */}
                       <Grid item xs={2}>
                       Pieza #26
                      </Grid>
                      <Grid item xs={3}>
                      <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="C.12.5 Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Extras Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={0.5}>
                      =
                      </Grid>
                      <Grid item xs={3.5}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Cantidad" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                     {/* TERMINA PIEZA */}

                       {/* EMPIEZA PIEZA */}
                       <Grid item xs={2}>
                       Pieza #27
                      </Grid>
                      <Grid item xs={3}>
                      <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="C.12.5 Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Extras Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={0.5}>
                      =
                      </Grid>
                      <Grid item xs={3.5}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Cantidad" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                     {/* TERMINA PIEZA */}

                       {/* EMPIEZA PIEZA */}
                       <Grid item xs={2}>
                       Pieza #28
                      </Grid>
                      <Grid item xs={3}>
                      <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="C.12.5 Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Extras Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={0.5}>
                      =
                      </Grid>
                      <Grid item xs={3.5}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Cantidad" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                     {/* TERMINA PIEZA */}

                       {/* EMPIEZA PIEZA */}
                       <Grid item xs={2}>
                       Pieza #29
                      </Grid>
                      <Grid item xs={3}>
                      <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="C.12.5 Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Extras Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={0.5}>
                      =
                      </Grid>
                      <Grid item xs={3.5}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Cantidad" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                     {/* TERMINA PIEZA */}

                       {/* EMPIEZA PIEZA */}
                       <Grid item xs={2}>
                       Pieza #30
                      </Grid>
                      <Grid item xs={3}>
                      <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="C.12.5 Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Extras Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={0.5}>
                      =
                      </Grid>
                      <Grid item xs={3.5}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Cantidad" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                     {/* TERMINA PIEZA */}

                       {/* EMPIEZA PIEZA */}
                       <Grid item xs={2}>
                       Pieza #31
                      </Grid>
                      <Grid item xs={3}>
                      <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="C.12.5 Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Extras Kg" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={0.5}>
                      =
                      </Grid>
                      <Grid item xs={3.5}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Cantidad" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                     {/* TERMINA PIEZA */}

                       {/* EMPIEZA BUJES */}
                      <Grid item xs={4}>
                      <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Buje 9/16" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={4}>
                      <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Buje 3/4" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                      <Grid item xs={4}>
                      <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={descripcion} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="Buje 3/8" type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                      </Grid>
                     {/* TERMINA PIEZA */}
                      
                     <Grid item xs={12}>
                        <Stack direction="row" spacing={2} alignitems="center" justifyContent="center" >

                          <Button variant="outlined" color="cancelarcp" startIcon={<DeleteIcon />} onClick={regresar}>
                            Cancelar</Button>
                            <Button variant="outlined" color="cancelarcp" startIcon={<DeleteIcon />} onClick={regresar}>
                            Calcular</Button>
                          <Button variant="contained" color="enviarcp"  endIcon={<SendIcon />} onClick={enviardatos}>
                            Actualizar</Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </div>
          
           
      </div>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={deshabilitar}>
                <CircularProgress color="inherit" />
            </Backdrop>
    </>
  );
}
