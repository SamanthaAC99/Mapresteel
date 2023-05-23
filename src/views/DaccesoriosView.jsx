import React, { useState, useEffect } from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { db } from "../firebase/firebase-config";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import Swal from 'sweetalert2';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import {  doc, onSnapshot, updateDoc } from "firebase/firestore";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {
    Modal,
    ModalHeader,
    ModalBody,
    FormGroup,
    ModalFooter,
  } from "reactstrap";
export default function DaccesoriosView() {
  const [accesorios, setAccesorios] = useState([])
  const navigate = useNavigate();
  let params = useParams();
  const [codigo, setCodigo] = useState("")
  const [nombre, setNombre] = useState("")
  const [numero, setNumero] = useState("")
  const [peso, setPeso] = useState("")
  const [tiempo, setTiempo] = useState("")
  const [piezas_kg, setPiezas_kg] = useState("")
  const [cantidad_orden, setCantidad_orden] = useState(0)
  const [faltan_produccion, setFaltan_produccion] = useState(0)
  const [elaborados_produccion, setElaborados_produccion] = useState(0)
  const [porcentaje_produccion, setPorcentaje_produccion] = useState(0)
  const [cantidad_galvanizado, setCantidad_galvanizado] = useState(0)
  const [faltan_galvanizado, setFaltan_galvanizado] = useState(0)
  const [elaborados_galvanizado, setElaborados_galvanizado] = useState(0)
  const [porcentaje_galvanizado, setPorcentaje_galvanizado] = useState(0)
  const [porcentaje_totalP, setPorcentaje_totalP] = useState(0)
  const [porcentaje_totalG, setPorcentaje_totalG] = useState(0)
  const [situacion, setSituacion] = useState("Activo")
  const [stock, setStock] = useState(0)
  const [deshabilitar,setDeshabilitar] = useState(false);
  const [modalEditar,setModalEditar] = useState(false);
  const [currentEquipo,setCurrentEquipo] = useState({})
  const getData = () => {
      onSnapshot(doc(db, "informacion", "parametros"), (doc) => {
        setAccesorios(doc.data().accesorios)
      });
  }
  const eliminarItem = async(_data) =>{
      Swal.fire({
          title: 'Quieres Eliminar este Responsable?',
          showCancelButton: true,
          confirmButtonText: 'Si',
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
              let aux = accesorios
              let items_filtrados = aux.filter(item => item.nombre !== _data.nombre)
              updateData(items_filtrados)
            Swal.fire('Equipo Eliminado!', '', 'success')
          } 
        })
     
  }
  const updateData = async(_data)=>{
      const ref = doc(db, "informacion", "parametros");
      await updateDoc(ref, {
          accesorios: _data
      });
  }
  const abrirModalEditar = (_data) =>{
      setNombre(_data.nombre)
      setCodigo(_data.codigo)
      setNumero(_data.numero)
      setPeso(_data.peso)
      setTiempo(_data.tiempo)
      setCantidad_galvanizado(_data.cantidad_galvanizado)
      setFaltan_galvanizado(_data.faltan_galvanizado)
      setElaborados_galvanizado(_data.elaborados_galvanizado)
        setPorcentaje_galvanizado(_data.porcentaje_galvanizado)
          setPorcentaje_totalG(_data.porcentaje_totalG)
            setCantidad_orden(_data.cantidad_orden)
                  setFaltan_produccion(_data.faltan_produccion)
                    setElaborados_produccion(_data.elaborados_produccion)
                      setPorcentaje_produccion(_data.porcentaje_produccion)
                        setPorcentaje_totalP(_data.porcentaje_totalP)
                        setSituacion(_data.situacion)
                        setModalEditar(true)
  }




  const limpiarDatos = ()=>{
      setNombre("");
      setCodigo("");
      setNumero("");
      setPeso("");
      setTiempo("");
      setPiezas_kg("")
  }
  const navegarView = (ruta) => {
    navigate(`/${params.uid}/${ruta}`);
}

  const salir = () => {
    navegarView('ordenes/produccion');
};
  // const actualizarEquipo = () =>{
  //     let aux = accesorios
      
  //     let temp = aux.map(item =>{
  //         if(item.nombre === currentEquipo.nombre){
  //             item.nombre = nombre.toUpperCase()
  //             item.codigo = codigo,
  //             item.numero = numero,
  //             item.peso = peso,
  //             item.tiempo = tiempo
  //         }
  //         return item
  //     })
  //     updateData(temp);
  //     limpiarDatos();
  //     setModalEditar(false)
  // }
  const agregarItem = async () => {
    setDeshabilitar(true);
      let aux = JSON.parse(JSON.stringify(accesorios))
      let temp = JSON.parse(JSON.stringify(accesorios))
      let numCode
      if (nombre !== "") {
          let check1 = aux.find(item => item.codigo === codigo)
          let check2 = aux.find(item => item.nombre === nombre)
          let check3 = aux.find(item => item.numero === numero)
          let check4 = aux.find(item => item.peso === peso)
          let check5 = aux.find(item => item.tiempo === tiempo)
          let check6 = aux.find(item => item.piezas_kg === piezas_kg)
          let check7 = aux.find(item => item.cantidad_orden === cantidad_orden)
          let check8 = aux.find(item => item.faltan_produccion === faltan_produccion)
          let check9 = aux.find(item => item.elaborados_produccion === elaborados_produccion)
          let check10 = aux.find(item => item.porcentaje_produccion === porcentaje_produccion)
          let check11 = aux.find(item => item.cantidad_galvanizado === cantidad_galvanizado)
          let check12 = aux.find(item => item.faltan_galvanizado === faltan_galvanizado)
          let check13 = aux.find(item => item.elaborados_galvanizado === elaborados_galvanizado)
          let check14 = aux.find(item => item.porcentaje_galvanizado === porcentaje_galvanizado)
          let check15 = aux.find(item => item.porcentaje_totalP === porcentaje_totalP)
          let check16 = aux.find(item => item.porcentaje_totalG === porcentaje_totalG)
          let check17 = aux.find(item => item.situacion === "Activo")
          let check18 = aux.find(item => item.stock === stock)
          if (check1 === undefined && check2 === undefined) {
            let ordenados = aux.sort((a, b) => parseInt(b.codigo) - parseInt(a.codigo));
            if(ordenados.length === 0){
              numCode = 1
            }else{
                numCode = parseInt(ordenados[0].codigo) +1
            }
            let newItem = {
                codigo: codigo,
                nombre: nombre.trim().toUpperCase(),
                numero: numero,
                peso: peso,
                tiempo: tiempo,
                piezas_kg:piezas_kg,
                cantidad_orden:cantidad_orden,
                faltan_produccion:faltan_produccion,
                elaborados_produccion:elaborados_produccion,
                porcentaje_produccion:porcentaje_produccion,
                cantidad_galvanizado:cantidad_galvanizado,
                faltan_galvanizado:faltan_galvanizado,
                elaborados_galvanizado:elaborados_galvanizado,
                porcentaje_galvanizado:porcentaje_galvanizado,
                porcentaje_totalP:porcentaje_totalP,
                porcentaje_totalG:porcentaje_totalG,
                situacion:situacion,
                stock:stock
                
            }
            
            temp.push(newItem)
            temp.sort((a, b) => parseInt(a.codigo) - parseInt(b.codigo));
              const ref = doc(db, "informacion", "parametros");
              await updateDoc(ref, {
                  accesorios: temp
              });
              limpiarDatos();
          } else {
              Swal.fire({
                  icon: 'warning',
                  title: 'Equipo ya declarado',
                  text: 'Lo siento ya existe ese equipo',
              })
          }
      } else {
          Swal.fire({
              icon: 'error',
              title: 'Faltan Campos',
              text: 'Llene todos los campos',
          })
      }
      setDeshabilitar(false);

  }
  useEffect(() => {
      getData();

  }, [])

    return(
      <>
      <Container>

          <Grid container spacing={{ xs: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid item xs={12} md={12}>
          <Typography component="div" variant="h4" className="princicrear" >
        CREAR PIEZA
      </Typography>
      </Grid>
          <Grid item xs={12} md={2}>
              <Button variant="outlined"
                sx={{height:"100%"}}
                                    className="boton-salir"
                                    fullWidth
                                    endIcon={<ReplyAllIcon sx={{ fontSize: 90 }} />}
                                    onClick={() => { salir() }}
                                >Regresar</Button>
              </Grid>
              <Grid item xs={12} md={10}> </Grid>
              <Grid item xs={12} md={1.71}>
                  <TextField id="outlined-basic" inputProps={{ style: { textTransform: "uppercase" } }} value={numero} error={false} fullWidth label="Número" variant="outlined" onChange={(event) => { setNumero(event.target.value) }} />
              </Grid>
              <Grid item xs={12} md={1.71}>
                  <TextField id="outlined-basic" inputProps={{ style: { textTransform: "uppercase" } }} value={nombre} error={false} fullWidth label="Nombre" variant="outlined" onChange={(event) => { setNombre(event.target.value) }} />
              </Grid>
              <Grid item xs={12} md={1.71}>
                  <TextField id="outlined-basic" inputProps={{ style: { textTransform: "uppercase" } }} value={codigo} error={false} fullWidth label="Código" variant="outlined" onChange={(event) => { setCodigo(event.target.value) }} />
              </Grid>
              <Grid item xs={12} md={1.71}>
                  <TextField id="outlined-basic" inputProps={{ style: { textTransform: "uppercase" } }} value={peso} error={false} fullWidth label="Peso" variant="outlined" onChange={(event) => { setPeso(event.target.value) }} />
              </Grid>
              <Grid item xs={12} md={1.71}>
                  <TextField id="outlined-basic" inputProps={{ style: { textTransform: "uppercase" } }} value={tiempo} error={false} fullWidth label="Tiempo" variant="outlined" onChange={(event) => { setTiempo(event.target.value) }} />
              </Grid>
              <Grid item xs={12} md={1.71}>
                  <TextField id="outlined-basic" inputProps={{ style: { textTransform: "uppercase" } }} value={piezas_kg} error={false} fullWidth label="#Piezas x Kg" variant="outlined" onChange={(event) => { setPiezas_kg(event.target.value) }} />
              </Grid>
              {/* <Grid item xs={12} md={2}>
                  <TextField id="outlined-basic" value={codigo} fullWidth label="Código" type="number" variant="outlined" onChange={(event) => { setCodigo(event.target.value) }} />
              </Grid> */}
              <Grid item xs={12} md={1.71}>
                  <Button variant="contained" sx={{ height: "100%", width: "100%" }} onClick={agregarItem}>Agregar Accesorio</Button>
              </Grid>
              <Grid item xs={12} md={12}>
                <div style={{height:500,overflow:"scroll"}}>
                  <Table className='table table-ligh table-hover'>
                      <Thead>
                          <Tr>
                              <Th>Número</Th>
                              <Th>Nombre</Th>
                              <Th>Código</Th>
                              <Th>Peso</Th>
                              <Th># Piezas</Th>
                              <Th>Tiempo</Th>
                              <Th>Acciones</Th>
                          </Tr>
                      </Thead>

                      <Tbody>
                          {accesorios.map((dato, index) => (
                              <Tr key={index}>
                                  <Td>{dato.numero}</Td>
                                  <Td>{dato.nombre}</Td>
                                  <Td>{dato.codigo}</Td>
                                  <Td>{dato.peso}</Td>
                                  <Td>{dato.piezas_kg}</Td>
                                  <Td>{dato.tiempo}</Td>
                                  <Td>
                                      <Button onClick={()=>{eliminarItem(dato)}} >Eliminar</Button>
                                      {/* <Button onClick={()=>{abrirModalEditar(dato)}} >Editar</Button> */}
                                  </Td>
                              </Tr>
                          ))}
                      </Tbody>
                  </Table>
                </div>
              </Grid>
          </Grid>
      </Container>

      <Modal isOpen={modalEditar}>
  <ModalHeader>
    <div><h3>Editar Accesorio</h3></div>
  </ModalHeader>
  <ModalBody>
    <FormGroup>
      <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
                  <TextField id="outlined-basic" value={nombre} inputProps={{ style: { textTransform: "uppercase" } }} error={false} fullWidth label="Nombre del Equipo" variant="outlined" onChange={(event) => { setNombre(event.target.value) }} />
              </Grid>
              {/* <Grid item xs={12} md={12}>
                  <TextField id="outlined-basic" value={codigo} fullWidth label="Codigo" type="number" variant="outlined" onChange={(event) => { setCodigo(event.target.value) }} />
              </Grid> */}
      </Grid>
    </FormGroup>
  </ModalBody>

  <ModalFooter>
    {/* <Button
      variant="outlined"
      className="boton-modal2"
      onClick={()=>{actualizarEquipo()}}
    >
      Aceptar
    </Button> */}

    <Button
      variant="contained"
      className="boton-modal"
      onClick={()=>{
          setModalEditar(false)
          limpiarDatos()
      }}      
    >
      Cancelar
    </Button>
  </ModalFooter>
</Modal>
<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={deshabilitar}>
                <CircularProgress color="inherit" />
            </Backdrop>
  </>
    )
}