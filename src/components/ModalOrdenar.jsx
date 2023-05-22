import React, { useEffect, useState } from "react";
import { collection, setDoc, query, doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { db, storage } from "../firebase/firebase-config"
import { Button, Container, Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, } from "reactstrap";
import Stack from '@mui/material/Stack';
import { v4 as uuidv4 } from 'uuid';
import Grid from "@mui/material/Grid";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import '../css/Tabla.css'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import '../css/Ordentrabajo.css';


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`action-tabpanel-${index}`}
            aria-labelledby={`action-tab-${index}`}
            {...other}

        >
            {value === index && <Box sx={{ p: 3, bgcolor: '#fff' }}>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `action-tab-${index}`,
        'aria-controls': `action-tabpanel-${index}`,
    };
}


export default function Tablav2() {
    const theme = useTheme();
    const [value, setValue] = useState(0);
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
    const [modalActualizar, setModalactualizar] = useState(false);
    const [modalInsertar, setModalinsertar] = useState(false);
    const [fechainicio, setFechainicio] = React.useState(new Date('2022-08-01T21:11:54'));
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState("");
    const [form, setForm] = useState({
        finicio: "",
        codigo: "",
        nombres: "",
        apellidos: "",
        ruc: "",
        fechanacimiento: "",
        contacto: "",
        correo: "",
        niveledu: "",
        titulacion: "",
        cargo: "",
        horario: "",
        capacitacioni: "",
        puesto: "",
    });
    const handleOpen = (dato) => {
        setForm(dato);
        descargararchivo(dato.nameImg);
        setOpen(true);
        console.log('hola');

    };
    const handleClose = () => {
        setOpen(false);
    }
    const handleChange5 = (e, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const buscarImagen = (e) => {
        if (e.target.files[0] !== undefined) {
            setFile(e.target.files[0]);
        } else {
            console.log('no hay archivo');
        }
    };

    const getData = async () => {
        const reference = query(collection(db, "dpersonales"));
        onSnapshot(reference, (querySnapshot) => {
            setData(
                querySnapshot.docs.map((doc) => ({ ...doc.data() }))
            );
        });

    };

    const agregardatos = async (informacion) => {
        var newperson = {};
        var val = Date.now();
        var newId = uuidv4();
        if (file === null) {
            newperson = {
                finicio: fechainicio.toDateString(),
                codigo: informacion.codigo,
                nombres: informacion.nombres,
                apellidos: informacion.apellidos,
                ruc: informacion.ruc,
                fechanacimiento: informacion.fechanacimiento,
                contacto: informacion.contacto,
                correo: informacion.correo,
                niveledu: informacion.niveledu,
                titulacion: informacion.titulacion,
                cargo: informacion.cargo,
                horario: informacion.horario,
                capacitacioni: informacion.capacitacioni,
                puesto: informacion.puesto,
                nameImg: 'SP.PNG',
                indice: val,
                id:newId,
            };
            sendFirestore(newperson);
        } else {
            newperson = {
                finicio: fechainicio.toDateString(),
                codigo: informacion.codigo,
                nombres: informacion.nombres,
                apellidos: informacion.apellidos,
                ruc: informacion.ruc,
                fechanacimiento: informacion.fechanacimiento,
                contacto: informacion.contacto,
                correo: informacion.correo,
                niveledu: informacion.niveledu,
                titulacion: informacion.titulacion,
                cargo: informacion.cargo,
                horario: informacion.horario,
                capacitacioni: informacion.capacitacioni,
                puesto: informacion.puesto,
                nameImg: newId,
                indice: val,
                id: newId,
            };
            sendFirestore(newperson);
            sendStorage(newperson.id);
        }
        setFile(null);
        cerrarModalInsertar();
    };

    const sendFirestore = (newperson) => {
        try {
            setDoc(doc(db, "dpersonales", `${newperson.id}`), newperson);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const sendStorage = (id) => {
        const storageRef = ref(storage, `dpersonales/${id}`);
        uploadBytes(storageRef, file).then((snapshot) => {
            console.log('Uploaded a blob or file!');
        });
    };

    const mostrarModalActualizar = (dato) => {
        setForm(dato);
        setModalactualizar(true);
    };

    const cerrarModalActualizar = () => {
        setModalactualizar(false);
    };

    const mostrarModalInsertar = () => {
        setModalinsertar(true);
    };

    const cerrarModalInsertar = () => {
        setModalinsertar(false);
    };



    const editar = async (dato) => {

        var arreglo = data;
        console.log(data);
        const database = doc(db, "dpersonales", dato.id);
        arreglo.map((registro) => {
            if (dato.id === registro.id) {
                registro.finicio = dato.finicio;
                registro.codigo = dato.codigo;
                registro.nombres = dato.nombres;
                registro.apellidos = dato.apellidos;
                registro.ruc = dato.ruc;
                registro.fechanacimiento = dato.fechanacimiento;
                registro.contacto = dato.contacto;
                registro.correo = dato.correo;
                registro.niveledu = dato.niveledu;
                registro.titulacion = dato.titulacion;
                registro.puesto = dato.puesto;
                registro.cargo = dato.cargo;
                registro.horario = dato.horario;
                registro.capacitacioni = dato.capacitacioni;
                return 0;

            }
            return 0;
        });
        setData(arreglo);
        await updateDoc(database, {
            finicio: dato.finicio,
            codigo: dato.codigo,
            nombres: dato.nombres,
            apellidos: dato.apellidos,
            ruc: dato.ruc,
            fechanacimiento: dato.fechanacimiento,
            contacto: dato.ruc,
            correo: dato.correo,
            niveledu: dato.niveledu,
            titulacion: dato.titulacion,
            cargo: dato.cargo,
            puesto: dato.puesto,
            horario: dato.horario,
            capacitacioni: dato.capacitacioni,
        });

        cerrarModalActualizar();
    };

    const eliminar = async (dato) => {
        var opcion = window.confirm("Estás Seguro que deseas Eliminar el elemento " + dato.id);
        if (opcion === true) {
            await deleteDoc(doc(db, "dpersonales", `${dato.id}`));
            setModalactualizar(false);
        }
    };

    const insertar = () => {
        var valorNuevo = { ...form };
        console.log(valorNuevo);
        setModalinsertar(false);
        agregardatos(valorNuevo);
    }

    const handleChange = (e) => {
        setForm(
            {
                ...form,
                [e.target.name]: e.target.value,
            },
        )
    };

    const descargararchivo = (nombre) => {
        getDownloadURL(ref(storage, `dpersonales/${nombre}`)).then((url) => {
            console.log(url);
            setUrl(url);
        })
    };
    const handleChange4 = (newValue) => {
        setFechainicio(newValue);
    };

    useEffect(() => {
        getData();
    }, [])



    return (
        <>
            <Container>
                <Typography component="div" variant="h3" className="princi" >
                    REGISTRO EMPLEADOS
                </Typography>
                <Button className="agregar" onClick={() => mostrarModalInsertar()}>Agregar Empleado</Button>
                <br />
                <Table className='table table-light table-hover'>
                    <Thead>
                        <Tr>
                            <Th>Código Empleado</Th>
                            <Th>Nombres</Th>
                            <Th>Apellidos</Th>
                            <Th>Información</Th>
                            <Th>Acciones</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data.map((dato) => (

                            <Tr key={dato.id} >
                                <Td>{dato.codigo}</Td>
                                <Td>{dato.nombres}</Td>
                                <Td>{dato.apellidos}</Td>

                                <Td>
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => { handleOpen(dato) }}>Información</button>
                                    {/* <Button onClick={()=>{handleOpen(dato)}}>Informacion</Button> */}
                                </Td>
                                <Td>
                                    <Stack direction="row" spacing={2} alignitems="center" justifyContent="center" >
                                        <button className="btn btn-outline-warning" onClick={() => mostrarModalActualizar(dato)}>Editar</button>
                                        <button className="btn btn-outline-danger" onClick={() => eliminar(dato)}>Eliminar</button>
                                        {/* <Button color="primary" onClick={() => mostrarModalActualizar(dato)}>Editar</Button>{" "}
                                    <Button color="danger" onClick={() => eliminar(dato)}>Eliminar</Button> */}
                                    </Stack>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Container>

            <Modal isOpen={modalActualizar}>
                <Container>
                    <ModalHeader>
                        <div><h3>Editar Registro</h3></div>
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Grid container spacing={4}>
                                <Grid item xs={6}>
                                    <label>
                                        Código Empleado:
                                    </label>
                                    <input
                                        className="form-control"
                                        name="codigo"
                                        type="text"
                                        onChange={handleChange}
                                        value={form.codigo}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <label>
                                        Nombres:
                                    </label>
                                    <input
                                        className="form-control"
                                        name="nombres"
                                        type="text"
                                        onChange={handleChange}
                                        value={form.nombres}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <label>
                                        Apellidos:
                                    </label>
                                    <input
                                        className="form-control"
                                        name="apellidos"
                                        type="text"
                                        onChange={handleChange}
                                        value={form.apellidos}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <label>
                                        RUC:
                                    </label>
                                    <input
                                        className="form-control"
                                        name="ruc"
                                        type="text"
                                        onChange={handleChange}
                                        value={form.ruc}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <label>
                                        Fecha de nacimiento:
                                    </label>
                                    <input
                                        className="form-control"
                                        name="fechanacimiento"
                                        type="text"
                                        onChange={handleChange}
                                        value={form.fechanacimiento}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <label>
                                        Contacto:
                                    </label>
                                    <input
                                        className="form-control"
                                        name="contacto"
                                        type="text"
                                        onChange={handleChange}
                                        value={form.contacto}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <label>
                                        Correo:
                                    </label>
                                    <input
                                        className="form-control"
                                        name="correo"
                                        type="text"
                                        onChange={handleChange}
                                        value={form.correo}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <label>
                                        Nivel Educativo:
                                    </label>
                                    <input
                                        className="form-control"
                                        name="niveledu"
                                        type="text"
                                        onChange={handleChange}
                                        value={form.niveledu}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <label>
                                        Titulación:
                                    </label>
                                    <input
                                        className="form-control"
                                        name="titulacion"
                                        type="text"
                                        onChange={handleChange}
                                        value={form.titulacion}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <label>
                                        Cargo:
                                    </label>
                                    <input
                                        className="form-control"
                                        name="cargo"
                                        type="text"
                                        onChange={handleChange}
                                        value={form.cargo}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <label>
                                        Horario:
                                    </label>
                                    <input
                                        className="form-control"
                                        name="horario"
                                        type="text"
                                        onChange={handleChange}
                                        value={form.horario}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <label>
                                        Actividades:
                                    </label>
                                    <input
                                        className="form-control"
                                        name="puesto"
                                        type="text"
                                        onChange={handleChange}
                                        value={form.puesto}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <label>
                                        Capacitación Interna:
                                    </label>
                                    <TextareaAutosize
                                        aria-label="empty textarea"
                                        name="capacitacioni"
                                        placeholder=""
                                        className="form-control"
                                        onChange={handleChange}
                                        defaultValue={form.capacitacioni}
                                    />

                                    {/* <input
              className="form-control"
              name="capacitacioni"
              type="text"
              onChange={handleChange}
              value={form.capacitacioni}
            /> */}
                                </Grid>
                            </Grid>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button className="editar" onClick={() => editar(form)}> Editar</Button>
                        <Button className="cancelar" onClick={() => cerrarModalActualizar()}>Cancelar</Button>
                    </ModalFooter>
                </Container>
            </Modal>

            <Modal isOpen={modalInsertar}>
                <Container>
                    <ModalHeader>
                        <div><h3>Insertar</h3></div>
                    </ModalHeader>

                    <ModalBody>
                        <FormGroup>
                            <Grid container spacing={4}>
                            <Grid item xs={12}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <Stack spacing={3}>
                                            <DateTimePicker
                                                label="Fecha Inicio"
                                                value={fechainicio}
                                                onChange={handleChange4}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </Stack>
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12}>
                                    <label>
                                        Horario:
                                    </label>
                                    <input
                                        className="form-control"
                                        name="horario"
                                        type="text"
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <label>
                                        Código Empleado:
                                    </label>
                                    <input
                                        className="form-control"
                                        name="codigo"
                                        type="text"
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <label>
                                        Nombres:
                                    </label>
                                    <input
                                        className="form-control"
                                        name="nombres"
                                        type="text"
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <label>
                                        Apellidos:
                                    </label>
                                    <input
                                        className="form-control"
                                        name="apellidos"
                                        type="text"
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <label>
                                        RUC:
                                    </label>
                                    <input
                                        className="form-control"
                                        name="ruc"
                                        type="text"
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <label>
                                        Fecha de Nacimiento:
                                    </label>
                                    <input
                                        className="form-control"
                                        name="fechanacimiento"
                                        type="text"
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <label>
                                        Contacto:
                                    </label>
                                    <input
                                        className="form-control"
                                        name="contacto"
                                        type="text"
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <label>
                                        Correo:
                                    </label>
                                    <input
                                        className="form-control"
                                        name="correo"
                                        type="text"
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <label>
                                        Nivel Educativo:
                                    </label>
                                    <input
                                        className="form-control"
                                        name="niveledu"
                                        type="text"
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <label>
                                        Titulación:
                                    </label>
                                    <input
                                        className="form-control"
                                        name="titulacion"
                                        type="text"
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <label>
                                        Cargo:
                                    </label>
                                    <input
                                        className="form-control"
                                        name="cargo"
                                        type="text"
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <label>
                                        Actividades:
                                    </label>
                                    <TextareaAutosize
                                        aria-label="empty textarea"
                                        name="puesto"
                                        placeholder=""
                                        className="form-control"
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <label>
                                        Capacitación Interna:
                                    </label>

                                    <TextareaAutosize
                                        aria-label="empty textarea"
                                        name="capacitacioni"
                                        placeholder=""
                                        className="form-control"
                                        onChange={handleChange}
                                    />

                                    {/* <input
              className="form-control"
              name="capacitacioni"
              type="text"
              onChange={handleChange}
            /> */}
                                </Grid>
                                <Grid item xs={12}>
                                    <div className="mb-3">
                                        <label className="form-label">Cargar Currículum</label>
                                        <input className="form-control" onChange={buscarImagen} type="file" id="formFile" />
                                    </div>
                                </Grid>
                            </Grid>

                        </FormGroup>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            className="editar"
                            onClick={() => insertar()}
                        >
                            Insertar
                        </Button>
                        <Button
                            className="cancelar"
                            onClick={() => cerrarModalInsertar()}
                        >
                            Cancelar
                        </Button>
                    </ModalFooter>
                </Container>
            </Modal>









            <Modal
                isOpen={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"

            >
                <ModalHeader>
                    <div><h1>Información</h1></div>
                </ModalHeader>
                <ModalBody>


                    <Tabs
                        value={value}
                        onChange={handleChange5}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="action tabs example"
                    >
                        <Tab label="Datos laborales" {...a11yProps(0)} />
                        <Tab label="Datos Personales" {...a11yProps(1)} />
                        <Tab label="Datos Academicos" {...a11yProps(2)} />
                    </Tabs>



                    <Box sx={{ bgcolor: "#fff" }}>
                        <SwipeableViews
                            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                            index={value}
                            onChangeIndex={handleChangeIndex}
                        >
                            <TabPanel value={value} index={0} >
                                <FormGroup>
                                    <Grid container spacing={4}>
                                        <Grid item xs={1.5}></Grid>
                                        <Grid item xs={9}>
                                            <label>
                                                Cargo:
                                            </label>

                                            <input
                                                className="form-control"
                                                readOnly
                                                type="text"
                                                value={form.cargo}
                                            />
                                        </Grid>
                                        <Grid item xs={1.5}></Grid>
                                        <Grid item xs={1.5}></Grid>
                                        <Grid item xs={9}>
                                            <label>
                                                Actividades:
                                            </label>

                                            <TextareaAutosize
                                                aria-label="empty textarea"
                                                readOnly
                                                placeholder=""
                                                className="form-control"
                                                defaultValue={form.puesto}
                                            />
                                        </Grid>
                                        <Grid item xs={1.5}></Grid>
                                        <Grid item xs={1.5}></Grid>
                                        <Grid item xs={9}>
                                            <label>
                                                Horario:
                                            </label>

                                            <input
                                                className="form-control"
                                                readOnly
                                                type="text"
                                                value={form.horario}
                                            />
                                        </Grid>
                                        <Grid item xs={1.5}></Grid>
                                        <Grid item xs={1.5}></Grid>
                                        <Grid item xs={9}>
                                            <label>
                                                Capacitación Interna:
                                            </label>

                                            <TextareaAutosize
                                                aria-label="empty textarea"
                                                readOnly
                                                placeholder=""
                                                className="form-control"
                                                defaultValue={form.capacitacioni}
                                            />
                                        </Grid>
                                        <Grid item xs={1.5}></Grid>
                                    </Grid>
                                </FormGroup>
                            </TabPanel>
                            <TabPanel value={value} index={1} >
                                <FormGroup>
                                    <Grid container spacing={4}>
                                        <Grid item xs={1.5}></Grid>
                                        <Grid item xs={9}>
                                            <label>
                                                RUC:
                                            </label>

                                            <input
                                                className="form-control"
                                                readOnly
                                                type="text"
                                                value={form.ruc}
                                            />
                                        </Grid>
                                        <Grid item xs={1.5}></Grid>
                                        <Grid item xs={1.5}></Grid>
                                        <Grid item xs={9}>
                                            <label>
                                                Fecha de Nacimiento:
                                            </label>

                                            <input
                                                className="form-control"
                                                readOnly
                                                type="text"
                                                value={form.fechanacimiento}
                                            />
                                        </Grid>
                                        <Grid item xs={1.5}></Grid>
                                        <Grid item xs={1.5}></Grid>
                                        <Grid item xs={9}>
                                            <label>
                                                Contacto:
                                            </label>

                                            <input
                                                className="form-control"
                                                readOnly
                                                type="text"
                                                value={form.contacto}
                                            />
                                        </Grid>
                                        <Grid item xs={1.5}></Grid>
                                        <Grid item xs={1.5}></Grid>
                                        <Grid item xs={9}>
                                            <label>
                                                Correo:
                                            </label>

                                            <input
                                                className="form-control"
                                                readOnly
                                                type="text"
                                                value={form.correo}
                                            />
                                        </Grid>
                                        <Grid item xs={1.5}></Grid>
                                    </Grid>
                                </FormGroup>

                            </TabPanel>
                            <TabPanel value={value} index={2} >
                                <FormGroup>
                                    <Grid container spacing={4}>
                                        <Grid item xs={1.5}></Grid>
                                        <Grid item xs={9}>
                                            <label>
                                                Nivel Educativo:
                                            </label>

                                            <input
                                                className="form-control"
                                                readOnly
                                                type="text"
                                                value={form.niveledu}
                                            />
                                        </Grid>
                                        <Grid item xs={1.5}></Grid>
                                        <Grid item xs={1.5}></Grid>
                                        <Grid item xs={9}>
                                            <label>
                                                Titulación:
                                            </label>

                                            <input
                                                className="form-control"
                                                readOnly
                                                type="text"
                                                value={form.titulacion}
                                            />
                                        </Grid>
                                        <Grid item xs={1.5}></Grid>
                                        <Grid className="fila" item xs={12}>
                                            <label className="archivo">
                                                Archivo:
                                            </label>
                                            <a
                                                component="button"
                                                variant="body2"
                                                href={url}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Visualizar Contrato
                                            </a>
                                        </Grid >
                                    </Grid>
                                </FormGroup>
                            </TabPanel>
                        </SwipeableViews>
                    </Box>

                </ModalBody>
                <ModalFooter>
                    <Button
                        className="editar"
                        onClick={() => handleClose()}
                    >
                        Salir
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );

}



