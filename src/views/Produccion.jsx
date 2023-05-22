import '../css/Tabla.css'
import '../css/Ordentrabajo.css';
import '../css/Presentacion.css';
import '../css/InventarioView.css';
import Typography from '@mui/material/Typography';
import React, { useEffect, useRef, useState } from "react";
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import { setOrdenState } from '../features/ordenes/ordenSlice';
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { collection, setDoc, query, doc, deleteDoc, onSnapshot, updateDoc } from "firebase/firestore";
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import Grid from "@mui/material/Grid";
import TextField from '@mui/material/TextField';
import * as XLSX from 'xlsx';
import { db, storage } from "../firebase/firebase-config";
import { teal, deepOrange } from '@mui/material/colors';
import Autocomplete from '@mui/material/Autocomplete';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Backdrop from '@mui/material/Backdrop';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import ExtensionIcon from '@mui/icons-material/Extension';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { setEquipoState } from '../features/inventario/inventarioSlice';
import Person2Icon from '@mui/icons-material/Person2';
import Swal from 'sweetalert2';
import '../css/Inventario.css';
import { useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import {
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
} from "reactstrap";
import { v4 as uuidv4 } from 'uuid';
import Stack from '@mui/material/Stack';
import { useDispatch } from "react-redux";


export default function Produccionview() {
  let params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [modalActualizar, setModalactualizar] = useState(false);
  const [modalAccesorios, setModalAccesorios] = useState(false);
  const [reloadAuto, setReloadAuto] = useState(false);
  const [modalInsertar, setModalinsertar] = useState(false);
  const [modalInformacion, setModalinformacion] = useState(false);
  const [equipo, setEquipo] = useState('');
  const [acc1, setAcc1] = useState({});
  const [propietario, setPropietario] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [serie, setSerie] = useState('');
  const [tipo, setTipo] = useState('');
  const [seguro, setSeguro] = useState('');
  const [file, setFile] = useState(null);
  const [equipos, setEquipos] = useState([]);
  const [eimportancia, setEimportancia] = useState([]);
  const [deshabilitar, setDeshabilitar] = useState(false);
  //variables de declaracion de accesorios
  const [accesorios, setAccesorios] = useState([]);
  const [accesoriosEquipo, setAccesoriosEquipo] = useState([]);
  // variables con los equipos declarados y filtros
  const equipos_totales = useRef([])
  const equiposFiltro = useRef("")
  const [codigosFiltrados, setCodigosFiltrados] = useState([])
  const [codigoSeleccionado,setCodigoSeleccionado] = useState("")
  const [reset,setReset] = useState(false);
  //variables de declaracion de equipo

  const [tipoEquipo, setTipoEquipo] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [ubicacion, setUbicacion] = useState({})
  const [responsables, setResponsables] = useState([]);
  const [responsable, setResponsable] = useState({});
  const [departamentos, setDepartamentos] = useState([]);
  const [propietarios, setPropietarios] = useState([]);

  const [departamento, setDepartamento] = useState({});
  const [currentEquipo, setCurrentEquipo] = useState(initialData);

  const [cantidadpieza,setCantidadpieza] = useState(0)


  const getData = async () => {
    const reference = query(collection(db, "ordenescompra"));
    onSnapshot(reference, (querySnapshot) => {
      setData(
        querySnapshot.docs.map((doc) => ({ ...doc.data() }))
      );
      equipos_totales.current = querySnapshot.docs.map((doc) => ({ ...doc.data() }))
    });

    onSnapshot(doc(db, "informacion", "parametros"), (doc) => {
      setTipoEquipo(doc.data().tequipo)
      setEquipos(doc.data().equipos)
      setDepartamentos(doc.data().departamentos)
      setUbicaciones(doc.data().ubicaciones)
      setResponsables(doc.data().responsables)
      setAccesorios(doc.data().accesorios)
      setPropietarios(doc.data().propietarios)
    });

  }


  //metodos para gestionar los equipos activos de los que ya no estan operativos

  const DardeBaja = (_data) => {
    Swal.fire({
      title: "Dar equipo de Baja",
      text: "¿Estás Seguro que deseas dar de baja al equipo?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí'
    }).then((result) => {
      if (result.isConfirmed) {
        const ref = doc(db, "ingreso", `${_data.id}`);
        updateDoc(ref, {
          situacion: "Inactivo",
        });

        Swal.fire(
          'Equipo dado de baja!',
          '',
          'success'
        )

      }
    })
  }

  const FilterBySituacion = (_item) => {
    if (_item.situacion === "Activo") {
      return _item
    } else {
      return null
    }
  }
  //metodos para subir imagenes
  const sendStorage = async (id) => {
    const storageRef = ref(storage, `inventario/${id}`);
    try {
      let url2 = await uploadBytes(storageRef, file).then((snapshot) => {
        let url = getDownloadURL(storageRef).then((downloadURL) => {
          console.log('File available at', downloadURL);
          return downloadURL;
        });
        return url
      });
      return url2
    } catch (error) {
      return no_img
    }

  };

  const buscarImagen = (e) => {
    if (e.target.files[0] !== undefined) {
      setFile(e.target.files[0]);
      console.log(e.target.files[0]);
    } else {
      console.log('no hay archivo');
    }
  };
  const mostrarModalActualizar = (_dato) => {
    console.log(_dato)
    setCurrentEquipo(_dato);
    setEimportancia(_dato.importancia)
    setModelo(_dato.modelo)
    setMarca(_dato.marca)
    setSerie(_dato.serie)
    setPropietario(_dato.propietario)
    setModalactualizar(true);
    setSeguro({ label: 'ASEGURADO', value: true })
    //setSeguro(_dato.seguro ?   {label:'Asegurado',value:true}: { label: 'Sin seguro',value:false})
  };

  const mostrarModalAccesorios = (_data) => {
    setCurrentEquipo(_data)
    setAccesoriosEquipo(_data.accesorios)
    setModalAccesorios(true);
  };
  const limpiarCampos = () => {
    setEimportancia("")
    setModelo("")
    setMarca("")
    setSerie("")
    setPropietario("")
  }


  const mostrarModalInformacion = (_dato) => {
    setCurrentEquipo(_dato)
    setAccesoriosEquipo(_dato.accesorios)
    setModalinformacion(true);
  };

  const cerrarModalInformacion = () => {
    setModalinformacion(false);
  };

  const cerrarModalActualizar = () => {
    setModalactualizar(false);
  };

  const cerrarModalAccesorios = () => {
    setModalAccesorios(false);
  };


  const mostrarModalInsertar = () => {
    setModalinsertar(true);
  };

  const cerrarModalInsertar = () => {
    setModalinsertar(false);
  };





  const eliminar = (dato) => {
    Swal.fire({
      title: "Eliminar Equipo",
      text: "¿Estás Seguro que deseas Eliminar al equipo?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(doc(db, "ordenescompra", `${dato.id}`));
        Swal.fire(
          'Equipo dado de baja!',
          '',
          'success'
        )

      }
    })

  };

  const sendFirestore = (_newEquipo) => {

    try {
      setDoc(doc(db, "ordenescompra", `${_newEquipo.id}`), _newEquipo);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const IngresarEquipo = async () => {
    Swal.fire(
      'Equipo Registrado',
      '',
      'success'
    )
    setDeshabilitar(true)
    let code = generateCodigo()
    var valorNuevo = {
      //valores iniciales por defecto
      id: uuidv4(),
      indice: Date.now(),
      situacion: "Activo",
      //valores que cambiaran en el futuro
      accesorios: [],
      codigo: marca,
      fecha:modelo

    }
    if (file === null) {
      valorNuevo.img = no_img
    } else {
      let url = await sendStorage(valorNuevo.id)
      console.log(url)
      valorNuevo.img = url
    }

    sendFirestore(valorNuevo)
    setModalinsertar(false);
    setDeshabilitar(false)
  }
  const generateCodigo = () => {
    let index = "1"
    let codigo = ubicacion.codigo + "-" + departamento.codigo + "-" + responsable.codigo + "-" + tipo.codigo + "-" + equipo.codigo + "-" + index + "-00"
    return codigo
  }





  const ActualizarEquipo = async () => {

    const ref = doc(db, "ordenescompra", `${currentEquipo.id}`);
    if (file === null) {
      await updateDoc(ref, {
        marca: marca,
        modelo: modelo,
        serie: serie,
        propietario: propietario,
        seguro: seguro.value,
        importancia: eimportancia,
      });
    } else {

      let url = await sendStorage(currentEquipo.id)
      await updateDoc(ref, {
        marca: marca,
        modelo: modelo,
        serie: serie,
        propietario: propietario,
        seguro: seguro.value,
        importancia: eimportancia,
        img: url
      });
    }
    Swal.fire(
      "¡Datos Actualizados!",
      '',
      'success'
    )
    setFile(null)
    setModalactualizar(false)

    limpiarCampos();

  }


  const hojavida = (data) => {
    dispatch(setEquipoState(data))
    navigate('hojadevida')
  }
  const agregarAccesorio = () => {
    let accesorios_declarados = currentEquipo.accesorios
    let varible_ejemplo=JSON.parse(JSON.stringify(acc1)) // Esto se usa para hacer una copia del objeto
    varible_ejemplo["cantidad_orden"]=cantidadpieza
    accesorios_declarados.push(varible_ejemplo)
    console.log(accesorios_declarados)
    setAccesoriosEquipo(accesorios_declarados)
    const ref = doc(db, "ordenescompra", `${currentEquipo.id}`);
    updateDoc(ref, {
      accesorios: accesorios_declarados,
    });
    setReloadAuto(!reloadAuto)
    Swal.fire({
      icon: 'success',
      title: '¡Pieza Agregada!',
      showConfirmButton: false,
      timer: 1500
    })
    setCantidadpieza(0)
  }

  const accesorio = (_accesorio) => {
    setAcc1(_accesorio)
  }
  const almacenarOdenStore = (data) => {
    navigate(`gestionar/${data.id}`);
    console.log (data)
}


  const navegarView = (ruta) => {
    navigate(`/${params.uid}/${ruta}`);
  }
  const quitarAccesorio = (_acc) => {
    let aux = accesoriosEquipo.filter(item => item.nombre !== _acc.nombre)
    const ref = doc(db, "ordenescompra", `${currentEquipo.id}`);
    updateDoc(ref, {
      accesorios: aux,
    });
    setAccesoriosEquipo(aux)
  }
  const filtrarInventario= ()=>{
    let aux = JSON.parse(JSON.stringify(equipos_totales.current))
    let filtrados = aux.filter(filterByNombre).filter(filterByCodigo)
    setData(filtrados)
    setCodigoSeleccionado("")
    equiposFiltro.current = ""
    setReset(!reset)
  }
  const filterByNombre = (_equipo)=>{
    if(equiposFiltro.current !== ""){
      if(_equipo.equipo === equiposFiltro.current){
        return _equipo
      }else{
        return null
      }
    }else{
      return _equipo
    }
  }
  const filterByCodigo = (_equipo)=>{
    if(codigoSeleccionado !== ""){
      if(_equipo.codigo === codigoSeleccionado){
        return _equipo
      }else{
        return null
      }
    }else{
      return _equipo
    }
  }
  const traerCodigos = (value) => {
    let codigos_equipos = equipos_totales.current.filter(item => item.equipo === value.nombre)
    let codigos_fifltrados = codigos_equipos.map(item => (item.codigo))
    setCodigosFiltrados(codigos_fifltrados)
    equiposFiltro.current = value.nombre
  }
  const crearExcel = () => {
    console.log("hola mundo");
    console.log(data)
    const myHeader = ["equipo", "codigo", "marca", "modelo"];
    const worksheet = XLSX.utils.json_to_sheet(data.filter(FilterBySituacion), { header: myHeader });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(worksheet, [["Equipo", "Código", "Marca", "Modelo"]], { origin: "A1" });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");
    worksheet["!cols"] = [{ wch: 50 }, { wch: 30 }, { wch: 30 }];
    XLSX.writeFile(workbook, "Equipos.xlsx", { compression: true });
  }

  useEffect(() => {
    getData();

  }, [])



  return (
    <>
      <Typography component="div" variant="h4" className="princi3" >
     PRODUCCION
      </Typography>
      <Container>

        <Grid container spacing={{ xs: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {/* <Grid item xs={12} sm={12} md={3}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              key={reset}
              options={equipos}
              getOptionLabel={(option) => {
                return option.nombre;
              }}
              // isOptionEqualToValue={(option, value) => option.nombre === value.nombre}
              onChange={(event, newvalue) => traerCodigos(newvalue)}
              renderInput={(params) => <TextField {...params}  label="Equipos" type="text" />}
            />
          </Grid> */}
          {/* <Grid item xs={12} sm={12} md={3}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              key={reset}
              options={codigosFiltrados}
              onChange={(event, newvalue) => setCodigoSeleccionado(newvalue)}
              renderInput={(params) => <TextField {...params}  label="Codigo" type="text" />}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={3}>

            <Button 
              variant="contained"
              fullWidth
              sx={{height:"100%"}}
              color='azul1'
              endIcon={<FilterAltIcon sx={{ fontSize: 90 }} />}
              onClick={filtrarInventario}
              
            >Filtrar</Button>

          </Grid>
          <Grid item xs={12} sm={12} md={3}>

            <Button variant="contained"
              color='verde2'
              sx={{height:"100%"}}
              fullWidth
              endIcon={<CalendarMonthIcon sx={{ fontSize: 90 }} />}
              onClick={crearExcel}
            >Generar EXCEL</Button>

          </Grid> */}


          <Grid item xs={12} sm={12} md={3}>
            <Button variant="contained"
              color='azul1'
              fullWidth
              onClick={() => mostrarModalInsertar()}>Ingresar Orden</Button>
          </Grid>


{/* <Grid item xs={12} sm={12} md={3}>
            <Button variant="outlined"
              fullWidth
              endIcon={<DomainAddIcon sx={{ fontSize: 90 }} />}
              onClick={() => navegarView("inventario/invequipos/declarar_piezas")}
            >
              Crear Piezas
            </Button>
          </Grid> */}
          <Grid item xs={12} sm={12} md={3}>
            <Button variant="outlined"
           fullWidth
              endIcon={<ExtensionIcon sx={{ fontSize: 90 }} />}
              onClick={() => navegarView("inventario/invequipos/declarar_accesorios")}
            >
              Crear Pieza
            </Button>
          </Grid>
        </Grid>

        <br />
        <div style={{ height: 350, overflow: "scroll" }}>
          <Table className='table table-ligh table-hover'>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>N° Orden</Th>
                <Th>Piezas</Th>
                <Th>Acciones</Th>
                <Th>Gestión</Th>
              </Tr>
            </Thead>

            <Tbody>
              {data.filter(FilterBySituacion).map((dato, index) => (
                <Tr key={dato.indice}>
                  <Td>{index + 1}</Td>
                  <Td>{dato.codigo}</Td>
                  <Td>
                    <Button variant='contained' color='dark' onClick={() => mostrarModalAccesorios(dato)}>Piezas</Button>
                  </Td>
                  <Td>
                    <Stack direction="row" spacing={2} alignitems="center" justifyContent="center" >
                      {/* <Button variant="contained" color='warning' onClick={() => mostrarModalActualizar(dato)}>Editar</Button> */}
                      <Button variant="contained" color='rojo' onClick={() => eliminar(dato)}>Eliminar</Button>
                      {/* <Button variant="contained" color='morado' onClick={() => { DardeBaja(dato) }} >Dar Baja</Button> */}
                    </Stack>
                  </Td>
                  <Td>
                    <Button aria-label="delete" sx={{ color: teal[200] }} onClick={() => { almacenarOdenStore(dato) }}>Gestión</Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      </Container>

      <Modal isOpen={modalInformacion}>

        <ModalHeader>
          <div><h1>Información Equipo</h1></div>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Grid container spacing={2}>

              <Grid item xs={12} md={12}>
                <div className="i-informacion">
                  <strong style={{ marginRight: 4 }}>Código Orden:</strong><p style={{ margin: 0 }}>{currentEquipo.codigo}</p>
                </div>
              </Grid>
              <Grid item xs={12} md={12}>
                <div style={{ overflow: "scroll", height: "150px" }}>
                  <Table className='table table-ligh table-hover'>
                    <Thead>
                      <Tr>
                        <Th>#</Th>
                        <Th>Código</Th>
                        <Th>Accesorio</Th>
                      </Tr>
                    </Thead>

                    <Tbody>
                      {accesoriosEquipo.map((dato, index) => (
                        <Tr key={index}>
                          <Td>{index + 1}</Td>
                          <Td>{dato.codigo}</Td>
                          <Td>{dato.nombre}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </div>
              </Grid>
            </Grid>
            {/* <Grid className="fila" item xs={12}>
              {/* <label className="archivo">
                                    Archivo:
                                </label> */}
              {/* <a
                component="button"
                variant="body2"
                href={currentEquipo.img}
                target="_blank"
                rel="noreferrer"
              >
                Visualizar Fotografía
              </a>
            </Grid > */} 
          </FormGroup>

        </ModalBody>
        <ModalFooter>
          <Button
            variant="contained"
            className="boton-modal2"
            onClick={() => cerrarModalInformacion()}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalActualizar}>
        <ModalHeader>
          <div><h3>Editar Registro</h3></div>
        </ModalHeader>
        <ModalBody>
          <Grid container spacing={2}>

            <Grid item xs={6}>
              <TextField fullWidth inputProps={{ style: { textTransform: "uppercase" } }} label="Marca" value={marca} onChange={(e) => setMarca(e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Serie" value={serie} onChange={(e) => setSerie(e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              {/* <TextField fullWidth inputProps={{ style: { textTransform: "uppercase" } }} label="Propietario" value={propietario} type="int" onChange={(e) => setPropietario(e.target.value)} /> */}
              <Autocomplete
                disableClearable
                id="combo-box-demo"
                defaultValue={propietario}
                options={propietarios}
                getOptionLabel={(option) => {
                  return option.nombre;
                }}
                onChange={(event, newvalue) => setPropietario(newvalue)}
                renderInput={(params) => <TextField {...params} fullWidth label="Propietarios" type="text" />}
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                value={seguro}
                options={tseguro}
                isOptionEqualToValue={(option, value) => option.label === value.label}
                getOptionLabel={(option) => option.label}
                onChange={(event, newvalue) => setSeguro(newvalue)}
                renderInput={(params) => <TextField {...params} fullWidth label="Seguro" type="text" />}
              />
            </Grid>

            <Grid item xs={12}>
              <b>Importancia:    </b>
              <RadioGroup
                row
                aria-labelledby="demo-radio-buttons-group-label"
                onChange={(event, newValue) => { setEimportancia(newValue) }}
                value={eimportancia}
                name="radio-buttons-group"
              >
                <FormControlLabel value="Prioritario" control={<Radio />} label="Prioritario" />
                <FormControlLabel value="Normal" control={<Radio />} label="Normal" />
              </RadioGroup>
            </Grid>
            <Grid item xs={12}>
              <div >
                <label className="form-label">Actualizar Fotografía</label>
                <input className="form-control" style={{ margin: 0 }} onChange={buscarImagen} type="file" id="formFile" />
              </div>
            </Grid>
          </Grid>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outlined"
            className="boton-modal2"
            onClick={() => ActualizarEquipo()}
          >
            Editar
          </Button>
          <Button
            variant="contained"
            className="boton-modal"
            onClick={() => cerrarModalActualizar()}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      <Modal className="{width:0px}" isOpen={modalInsertar}>
        <ModalHeader>
          <div><h3>Ingresar Nueva Orden </h3></div>
        </ModalHeader>
        <ModalBody>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth inputProps={{ style: { textTransform: "uppercase" } }} label="N° Orden" type="int" onChange={(e) => setMarca(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth inputProps={{ style: { textTransform: "uppercase" } }} label="Fecha de Entrega" type="int" onChange={(e) => setModelo(e.target.value)} />
            </Grid>
      
            </Grid>

        </ModalBody>

        <ModalFooter>
          <Button
            variant="outlined"
            className="boton-modal2"
            onClick={() => IngresarEquipo()}
          >
            Insertar
          </Button>
          <Button
            variant="contained"
            className="boton-modal"
            onClick={() => cerrarModalInsertar()}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>


      <Modal isOpen={modalAccesorios}>
        <ModalHeader>
          <div><h3>Piezas</h3></div>
        </ModalHeader>
        <ModalBody>

          <Grid container spacing={2}>
            <Grid item xs={12}>

              <Autocomplete
                disableClearable
                id="combo-box-demo"
                options={accesorios}
                key={reloadAuto}
                isOptionEqualToValue={(option, value) => option.nombre === value.nombre}
                getOptionLabel={(option) => option.nombre}
                onChange={(event, newValue) => { accesorio(newValue) }}
                renderInput={(params) => <TextField {...params} fullWidth label="Piezas" type="text" />}
              />
            </Grid>

            <Grid item xs={12}>
            <TextField id="outlined-basic" inputProps={{ style: { textTransform: "uppercase" } }} value={cantidadpieza} type="number" fullWidth label="Cantidad" variant="outlined" onChange={(event) => { setCantidadpieza(event.target.value) }}/>
            </Grid>

            <Grid item xs={12} >
              <Button
                variant="contained"
                fullWidth
                onClick={() => agregarAccesorio()}
              >
                AGREGAR PIEZA
              </Button>
            </Grid>
            <Grid item xs={12} >
              <div style={{ overflow: "scroll", height: "300px" }}>
                <Table className='table table-ligh table-hover'>
                  <Thead>
                    <Tr>
                      <Th>#</Th>
                      <Th>Número</Th>
                      <Th>Nombre</Th>
                      <Th>Cantidad</Th>
                      <Th>Acciones</Th>
                    </Tr>
                  </Thead>

                  <Tbody>
                    {accesoriosEquipo.map((dato, index) => (
                      <Tr key={index}>
                        <Td>{index + 1}</Td>
                        <Td>{dato.numero}</Td>
                        <Td>{dato.nombre}</Td>
                        <Td>{dato.cantidad_orden}</Td>
                        <Td>
                          <Button variant="contained" color='warning' onClick={() => { quitarAccesorio(dato) }}>
                            Quitar
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </div>
            </Grid>
          </Grid>

        </ModalBody>

        <ModalFooter>


          <Button
            variant="contained"
            onClick={() => cerrarModalAccesorios()}
          >
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={deshabilitar}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );

}



const tseguro = [
  { label: 'ASEGURADO', value: true },
  { label: 'SIN SEGURO', value: false }
]

const initialData = {
  //valores iniciales por defecto
  ubicacion: "",
  departamento: "",
  responsable: "",
  tipo_equipo: "",
  equipo: "",
  modelo: "",
  marca: "",
  serie: "",
  propietario: "",
  seguro: "",
  importancia: "",
  codigo: "",
  id: "",
  indice: "",
  accesorios: [{ codigo: 123, nombre: "pepito" }],
  mantenimientos: [],
  mtbf: "",
  mttr: "",
  img: "",
  numero_fallos: "",
  disponibilidad: "",
}

const no_img = "https://firebasestorage.googleapis.com/v0/b/app-mantenimiento-91156.appspot.com/o/inventario%2FSP.PNG?alt=media&token=835f72e6-3ddf-4e64-bd7c-b95564da4ec8"
