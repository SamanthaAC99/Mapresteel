import React from "react";
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';  //permite obtener dato de una vista o orden a travez de una url
import { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import { doc, getDoc, updateDoc} from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TarjetaDashboard from "../components/TarjetaDashBoard";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { pink, cyan, lightGreen, orange } from '@mui/material/colors';
import '../css/EncargadoView.css'
import {
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
} from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
export default function GestionInformeAvance() {
  let { id } = useParams();
  const [ordenesCompra, setOrdenesCompra] = useState([]);
  const [orden, setOrden] = useState([]);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalProduccion, setModalProduccion] = useState(false);
  const [modalGalvanizado, setModalGalvanizado] = useState(false);
  const [nombre, setNombre] = useState("");
  const [faltaProducir, setFaltaProducir] = useState(0);
  const [faltaGalvanizar, setFaltaGalvanizar] = useState(0)
  const [accesorioEspecifico, setAccesorioEspecifico] = useState([]);
  const [elaboradasProduccion, setElaboradasProduccion] = useState("");
  const [elaboradasCajas, setElaboradasCajas] = useState(0);
  const [elaboradasKg, setElaboradasKg] = useState(0);
  const [pieza, setPieza] = useState(0);
  const [pieza2, setPieza2] = useState(0);
  const [falta, setFalta] = useState(0);
  const [faltantesActualizada, setFaltantesActualizada] = useState("");
  const [elaboradas2, setElaboradas2] = useState(0);
  const [elaboradasGalvanizadas, setElaboradasGalvanizadas] = useState("");
  const [calculoAcc,setCalculoAcc] = useState({stock:0,porcentaje_produccion:0,elaborados_produccion:0,faltan_produccion:0})
  const [aceptarCalculo,setAceptarCalculo] = useState(false)

  const getData = async () => {
    const docRef = doc(db, "ordenescompra", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setOrden(docSnap.data())
      setOrdenesCompra(docSnap.data().accesorios)
      console.log("oc", ordenesCompra)
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }

  }


  const filterStateActivas = (state) => {
    if (state.situacion === "Activo") {
        return state;
    } else {
        return
    }
}

const filterStateProducidas = (state) => {
  if (state.situacion === "Producido") {
      return state;
  } else {
      return
  }
}

  const abrirModalEditar = (_data) => {
    setAccesorioEspecifico(_data)
    setNombre(ordenesCompra.nombre)
    console.log("Nombre", nombre)
    setModalEditar(true)
  }

  const abrirModalProducción = (_data) => {
    setAccesorioEspecifico(_data)
    console.log(_data)
    setModalProduccion(true)
  }

  const abrirModalGalvanizado = (_data) => {
    setModalGalvanizado(true)
  }

  const actualizarCarga = async (_data) => { 
    let varible_accesorios=JSON.parse(JSON.stringify(ordenesCompra))
    let especifico_accesorios=JSON.parse(JSON.stringify(accesorioEspecifico))
    especifico_accesorios["faltan_produccion"]=faltaProducir
    especifico_accesorios["faltan_galvanizado"]=faltaGalvanizar
    let almacenar_datos=varible_accesorios.map(item => {
      if (item.numero===especifico_accesorios.numero){
        return especifico_accesorios
      } else {
        return item
      }
    })
    setModalEditar(false)
    setOrdenesCompra(almacenar_datos)
    setCalculoAcc({stock:0,porcentaje_produccion:0,elaborados_produccion:0,faltan_produccion:0})
    // const washingtonRef = doc(db, "ordenescompra", id);
    // await updateDoc(washingtonRef, {
    //   accesorios: almacenar_datos
    // });

 }



 const actualizarProduccion = async (_data) => { 


  let cajas =(parseInt(elaboradasCajas)*12.5) // calculamos cantidad de cajas 

  var peso_total = parseFloat(cajas) + parseFloat(elaboradasKg);


  let acc =JSON.parse(JSON.stringify(accesorioEspecifico))
  let piezas_totales = parseFloat(acc.piezas_kg) * peso_total
  acc["elaborados_produccion"] = piezas_totales

  let faltantes_aux = parseInt(acc.faltan_produccion )
  if(faltantes_aux<= piezas_totales){
    let faltan_aux = piezas_totales - faltantes_aux

    acc['faltan_produccion'] = 0
    acc['porcentaje_produccion'] = 100
    acc['stock'] = faltan_aux
    acc['situacion'] = "Producido"
  }else{
    let faltan_aux = faltantes_aux - piezas_totales 
    let porcentaje = ((parseInt(acc.cantidad_orden) - faltan_aux )/parseInt(acc.cantidad_orden))*100
    acc['porcentaje_produccion'] = porcentaje

    acc['faltan_produccion'] = faltan_aux
    acc['stock'] = 0
  }
  setCalculoAcc(acc)
  setAceptarCalculo(false)
  console.log(acc)

}


const actualizarFaltantes = async () => { 
  let varible_accesorios=JSON.parse(JSON.stringify(ordenesCompra))
  let calc=JSON.parse(JSON.stringify(calculoAcc))
    let almacenar_datos=varible_accesorios.map(item => {
     if (item.numero===calc.numero){
       return calc
     } else {
       return item
     }
   })
   setOrdenesCompra(almacenar_datos)
   setAceptarCalculo(true)
   setModalProduccion(false)
//  const washingtonRef = doc(db, "ordenescompra", id);
//  await updateDoc(washingtonRef, {
//    accesorios: almacenar_datos
//  });
}

const actualizarGalvanizado = async (_data) => { 
  let varible_accesorios=JSON.parse(JSON.stringify(ordenesCompra))
  let especifico_accesorios=JSON.parse(JSON.stringify(accesorioEspecifico))
  setPieza(especifico_accesorios)
  console.log("eg",elaboradasGalvanizadas)
especifico_accesorios["faltan_galvanizado"]=restaFaltantes
especifico_accesorios["elaborados_galvanizado"]=elaboradasGalvanizadas
setFalta(pieza.faltan_galvanizado)
var restaFaltantes= (falta-elaboradasGalvanizadas)
console.log(restaFaltantes)
  let almacenar_datos=varible_accesorios.map(item => {
    if (item.numero===especifico_accesorios.numero){
      return especifico_accesorios
    } else {
      return item
    }
  })
  setOrdenesCompra(almacenar_datos)
const washingtonRef = doc(db, "ordenescompra", id);
await updateDoc(washingtonRef, {
  accesorios: almacenar_datos
});
}




  useEffect(() => {
    console.log(id);
    getData();
  }, [])

  return (
    <>
      <div className="container-test">
        <Grid container spacing={{ xs: 1, md: 4 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid item xs={12} sm={6} md={3}>
            <div className="card13" >
              {
                <div className="header-ev">
                     <h5 className="titulo-ev">Información Orden  </h5>
                </div>
              }
              {
                <div className="card-body12 small">
                  <div className="alinearforms">
                  <div className="alinear15">
                  <h1 className='texticone mx-4'>N° Orden:</h1>
                      <h1 className='texticone mx-4'>{orden.codigo} </h1>
                      <h1 className='texticone mx-4'>Entrega:</h1>
                      <h1 className='texticone mx-4'>{orden.fecha} </h1>
                      </div>

                  </div>

                </div>
              }
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={9}>
          <Grid container spacing={{ xs: 1, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid item xs={4} sm={6} md={2.4} >
                                <TarjetaDashboard
                                    icon={<PlayArrowIcon />}
                                    headerColor={"#ADCF9F"}
                                    avatarColor={lightGreen[700]}
                                    title={'Produccion'}
                                    value={"90%"}
                                    // value={ctdActivas}
                                />
                            </Grid>
                            <Grid item xs={4} sm={6} md={2.4} >
                                <TarjetaDashboard
                                    icon={<PendingActionsIcon />}
                                    headerColor={"#F7A76C"}
                                    avatarColor={orange[700]}
                                    title={'Galvanizado'}
                                    // value={ctdPendientes}
                                />
                            </Grid>
                            <Grid item xs={4} sm={6} md={2.4} >
                                <TarjetaDashboard
                                    icon={<AssignmentTurnedInIcon />}
                                    headerColor={"#E4AEC5"}
                                    avatarColor={pink[700]}
                                    title={'Peso Orden'}
                                    // value={ctdSolventadas}
                                />
                            </Grid>
                            <Grid item xs={4} sm={6} md={2.4} >
                                <TarjetaDashboard
                                    icon={<AssignmentTurnedInIcon />}
                                    headerColor={"#E4AEC5"}
                                    avatarColor={pink[700]}
                                    title={'Tiempo Producción'}
                                    // value={ctdSolventadas}
                                />
                            </Grid>
                            <Grid item xs={4} sm={6} md={2.4} >
                                <TarjetaDashboard
                                    icon={<AssignmentTurnedInIcon />}
                                    headerColor={"#E4AEC5"}
                                    avatarColor={pink[700]}
                                    title={'Tiempo Galvanizado'}
                                    // value={ctdSolventadas}
                                />
                            </Grid>
          </Grid>
          </Grid>
            {/* empieza la tarjeta    de la tabla  pendientes  */}
            <Grid item xs={12} sm={6} md={6}>
            <div className="card13" >
            {
                                <div className="header-ev">
                                    <h5 className="titulo-ev">Piezas Pendientes</h5>

                                    <Avatar sx={{ bgcolor: orange[700] }} >
                                        <WorkHistoryIcon />

                                    </Avatar>

                                </div>
                            }
                            {
                               <div className="card-body12-tabla small" style={{ height: 350, overflow: "scroll" }}>
                                 <div>
                                 <Table className='table table-light table-hover'>
          <Thead>
            <Tr>
              {/* <Th className="t-encargados">#</Th> */}
              <Th className="t-encargados">N° Pieza</Th>
              <Th className="t-encargados">Orden</Th>
              <Th className="t-encargados">Faltan</Th>
              <Th className="t-encargados">Stock</Th>
              <Th className="t-encargados">% Produccion</Th>
              {/* <Th className="t-encargados">Galvanizado F</Th>
              <Th className="t-encargados">% Galvanizado</Th> */}
              <Th className="t-encargados">Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {ordenesCompra.filter(filterStateActivas).map((dato, index) => (
              <Tr key={index}>
                {/* <Td className="t-encargados">{index + 1}</Td> */}
                <Td className="t-encargados">{dato.numero}</Td>
                <Td className="t-encargados">{dato.cantidad_orden}</Td>
                <Td className="t-encargados">{dato.faltan_produccion}</Td>
                <Td className="t-encargados">{dato.stock}</Td>
                <Td className="t-encargados">{dato.porcentaje_produccion}</Td>
                {/* <Td className="t-encargados">{dato.galvanizado}</Td>
                <Td className="t-encargados">{dato.porcentajeg}</Td> */}
                <Td>
                  <Stack direction="row" spacing={2} alignitems="center" justifyContent="center" >
                    <Button variant='contained' onClick={() => { abrirModalEditar(dato) }} color='dark'>Cargar</Button>
                    <Button variant='contained' onClick={() => { abrirModalProducción(dato) }} color='dark'>Producción</Button>
                    {/* <Button variant='contained' onClick={() => { abrirModalGalvanizado(dato) }} color='dark'>Galvanizado</Button> */}
                  </Stack>
                </Td>

              </Tr>
            ))}
          </Tbody>
        </Table>
                                 </div>
                                 </div>
                               }
            </div>
            <Modal isOpen={modalEditar}>
        <ModalHeader>
          <div><h3>Cargar Orden</h3></div>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <TextField id="outlined-basic" inputProps={{ style: { textTransform: "uppercase" } }} value={faltaProducir} error={false} fullWidth label="Faltan Produccion" variant="outlined" type="number" onChange={(event) => { setFaltaProducir(event.target.value) }} />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField id="outlined-basic" inputProps={{ style: { textTransform: "uppercase" } }} value={faltaGalvanizar} error={false} fullWidth label="Faltan Galvanizado" variant="outlined" type="number"  onChange={(event) => { setFaltaGalvanizar(event.target.value) }} />
              </Grid>
            </Grid>
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outlined"
            className="boton-modal2"
          onClick={()=>{actualizarCarga()}}
          >
            Aceptar
          </Button>

          <Button
            variant="contained"
            className="boton-modal"
            onClick={() => {
              setModalEditar(false)
            }}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>


      <Modal isOpen={modalProduccion}>
        <ModalHeader>
          <div><h3>Cargar Produccion de pieza - {accesorioEspecifico.numero}</h3></div>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField id="outlined-basic" type="number" inputProps={{ style: { textTransform: "uppercase" } }} value={elaboradasCajas} error={false} fullWidth label="Cajas" variant="outlined" onChange={(event) => { setElaboradasCajas(event.target.value) }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField id="outlined-basic" type="number" inputProps={{ style: { textTransform: "uppercase" } }} value={elaboradasKg} error={false} fullWidth label="Kg Extras" variant="outlined" onChange={(event) => { setElaboradasKg(event.target.value) }} />
              </Grid>
              <Grid item xs={12} md={12}>
                <div>
                  <h5>Calculos Generados</h5>
                  <p><strong>stock actual calculado:  </strong>{calculoAcc.stock}</p> 
                  <p><strong>porcentaje de produccion: </strong> {calculoAcc.porcentaje_produccion}</p> 
                  <p><strong>piezas generadas: </strong>{calculoAcc.elaborados_produccion}</p> 
                  <p><strong>faltan: </strong>{calculoAcc.faltan_produccion}</p>

                </div>
              </Grid>
            </Grid>
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outlined"
            className="boton-modal2"
            onClick={()=>{actualizarProduccion()}}
          >
            Calcular
          </Button>
          <Button
            variant="outlined"
            className="boton-modal2"
            disabled={aceptarCalculo}
            onClick={()=>{actualizarFaltantes()}}
          >
            Aceptar
          </Button>
          <Button
            variant="contained"
            className="boton-modal"
            onClick={() => {
              setModalProduccion(false)
              setAceptarCalculo(true)
              setCalculoAcc({stock:0,porcentaje_produccion:0,elaborados_produccion:0,faltan_produccion:0})
            }}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
            <div className="card13" >
            {
                                <div className="header-ev">

                                    <h5 className="titulo-ev">Piezas Enviadas</h5>
                                    <Avatar sx={{ bgcolor: lightGreen[500] }} >
                                        <DoneAllIcon />
                                    </Avatar>

                                </div>
                            }
                            
                            {
                              <div className="card-body12-tabla small" style={{ height: 350, overflow: "scroll" }}>
                              <div >
                              <Table className='table table-light table-hover'>
          <Thead>
            <Tr>
              {/* <Th className="t-encargados">#</Th> */}
              <Th className="t-encargados">N° Pieza</Th>
              <Th className="t-encargados">Orden</Th>
              <Th className="t-encargados">Faltan</Th>
              <Th className="t-encargados">% Galvanizado</Th>
              <Th className="t-encargados">Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {ordenesCompra.filter(filterStateProducidas).map((dato, index) => (
              <Tr key={index}>
                {/* <Td className="t-encargados">{index + 1}</Td> */}
                <Td className="t-encargados">{dato.numero}</Td>
                <Td className="t-encargados">{dato.cantidad_galvanizado}</Td>
                <Td className="t-encargados">{dato.faltan_galvanizado}</Td>
                <Td className="t-encargados">{dato.porcentaje_galvanizado}</Td>
                <Td>
                  <Stack direction="row" spacing={2} alignitems="center" justifyContent="center" >
                    <Button variant='contained' onClick={() => { abrirModalGalvanizado(dato) }} color='dark'>Galvanizado</Button>
                  </Stack>
                </Td>

              </Tr>
            ))}
          </Tbody>
        </Table>
                              </div>
                              </div>
                               }
            </div>
            <Modal isOpen={modalGalvanizado}>
        <ModalHeader>
          <div><h3>Cargar Produccion</h3></div>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <TextField id="outlined-basic" inputProps={{ style: { textTransform: "uppercase" } }} value={elaboradasGalvanizadas} error={false} fullWidth label="Cantidad de Piezas" variant="outlined" onChange={(event) => { setElaboradasGalvanizadas(event.target.value) }} />
              </Grid>
            </Grid>
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outlined"
            className="boton-modal2"
            onClick={()=>{actualizarGalvanizado()}}
          >
            Aceptar
          </Button>

          <Button
            variant="contained"
            className="boton-modal"
            onClick={() => {
              setModalGalvanizado(false)
            }}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
            </Grid>
        </Grid>
      </div>
    

     
    </>
  );
}