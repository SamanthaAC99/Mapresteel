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


export default function OC() {
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
    navegarView('home');
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
    if (asunto !== '') {
    let orden = {
        fecha: fechaHoy,
        indice: Date.now(),
        cedula: currentUser.indentification,
        verificacion: false,
        asunto:asunto.toUpperCase(),
        estado: "Pendiente", // valores iniciados por defecto
        prioridad: "Pendiente", // valores iniciados por defecto
        play: false, // valores iniciados por defecto
        pause: true,// valores iniciados por defecto
        id: id_formateada,
        correo: currentUser.email,
        piezas: [],
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
            ORDEN DE COMPRA
          </Typography>
        </Grid>
      </Grid>

      {/* INICIO CONTENEDOR */}

      <div className="container">
        <div className="column">
          <div className="col-sm-12">
            <div className="col-sm-12">
              <div className="panels">
                <label className="d-flex p-2">
                  <b> N° Orden: {parseInt(cantidad) + 1}</b>

                </label>
              </div>
            </div>
            <div className="panel">
              <div className="row">
                <div className="col-md-12">
                  <div className="panelt2">
                    <Grid container spacing={4}>
                      {/* <Grid item xs={12}>
                        <TextField value={cedula} color={cedula !== '' ? "gris" : "oficial"} fullWidth label="CÉDULA SOLICITANTE" type="number" onChange={(e) => setCedula(e.target.value)} />
                      </Grid> */}
                      <Grid item xs={12}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={asunto} color={asunto !== '' ? "gris" : "oficial"} fullWidth label="N° ORDEN" type="text" onChange={(e) => setAsunto(e.target.value)} />
                      </Grid>

                      <Grid item xs={4}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={pieza1} fullWidth label="Pieza #1" type="text" onChange={(e) => setPieza1(e.target.value)} />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={pieza2} fullWidth label="Pieza #2" type="text" onChange={(e) => setPieza2(e.target.value)} />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField inputProps={{ style: { textTransform: "uppercase", maxLength: 30 } }} value={pieza3} fullWidth label="Pieza #3" type="text" onChange={(e) => setPieza3(e.target.value)} />
                      </Grid>
                
                      <Grid item xs={12}>
                        <Stack direction="row" spacing={2} alignitems="center" justifyContent="center" >

                          <Button variant="outlined" color="cancelarcp" startIcon={<DeleteIcon />} onClick={regresar}>
                            Cancelar</Button>
                          <Button variant="contained" color="enviarcp"  endIcon={<SendIcon />} onClick={enviardatos}>
                            Enviar</Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </div>
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

