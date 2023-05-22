import React, { useEffect, useState } from "react";
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { collection, setDoc, query, doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import Grid from "@mui/material/Grid";
import autoTable from 'jspdf-autotable'
import { db } from "../firebase/firebase-config";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import '../css/Tabla.css';
import '../css/Presentacion.css';
import '../css/EncargadoView.css';
import PrintIcon from '@mui/icons-material/Print';
import { jsPDF } from "jspdf";
import Typography from '@mui/material/Typography';
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
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export default function Tablareporte() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [modalActualizar, setModalactualizar] = useState(false);
    const [modalInsertar, setModalinsertar] = useState(false);
    const [modalInformacion, setModalinformacion] = useState(false);
    const [value, setValue] = useState(new Date('2022-08-01T21:11:00'));
    const [value2, setValue2] = useState(new Date('2022-08-02T21:11:00'));
    const [hi, setHi] = useState(0);
    const [hf, setHf] = useState(0);
    const [mes, setMes] = useState(0);
    const [form, setForm] = useState({
        feinicio: "",
        fetermino: "",
        codigoot: "",
        cedulat: "",
        nombre: "",
        codigo: "",
        equipo: "",
        serie: "",
        estadoequipo: "",
        tipomant: "",
        // nivelalerta: "",
        falla: "",
        causas: "",
        actividades: "",
        estado: "",
        // hperdidas: "",
        repuestos: "",
        costo: "",
        observaciones1: "",
        verificador: "",
    });


    const getData = async () => {
        const reference = query(collection(db, "reportesint"));
        onSnapshot(reference, (querySnapshot) => {

            setData(
                querySnapshot.docs.map((doc) => ({ ...doc.data() }))
            );
        });
    }



    const agregardatos = (informacion) => {
        // calculamos las horas
        const horas = hf - hi
        console.log(horas)
        if (informacion.codigoot !== '' && informacion.cedulat !== '' && informacion.codigo !== '' && informacion.estadoequipo !== '' && informacion.tipomant !== '' && informacion.falla !== '') {
            var newperson = {
                feinicio: value.toLocaleString('en-US'),
                fetermino: value2.toLocaleString('en-US'),
                codigoot: informacion.codigoot,
                cedulat: informacion.cedulat,
                nombre: informacion.nombre,
                codigo: informacion.codigo,
                equipo: informacion.equipo,
                serie: informacion.serie,
                estadoequipo: informacion.estadoequipo,
                tipomant: informacion.tipomant,
                // nivelalerta: informacion.nivelalerta,
                estado: informacion.estado,
                falla: informacion.falla,
                causas: informacion.causas,
                actividades: informacion.actividades,
                mesFinal: mes,
                horasT: horas,
                repuestos: informacion.repuestos,
                costo: informacion.costo,
                observaciones1: informacion.observaciones1,
                verificador: informacion.verificador,
                id: uuidv4(),
                indice: Date.now(),
            }
            sendFirestore(newperson);
        } else {
            console.log('faltan campos');
            var opcion = window.confirm("Faltan Campos. Por favor complete toda la informacion.");
            if (opcion === true) {
                navigate('/home/reportes/reportes');
                // handleClose();
            }
        };
    };

    const sendFirestore = (newperson) => {
        try {
            setDoc(doc(db, "reportesint", `${newperson.id}`), newperson);

        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const mostrarModalActualizar = (dato) => {
        setForm(dato);
        setModalactualizar(true);
    };

    const mostrarModalInformacion = (dato) => {
        setForm(dato);
        setModalinformacion(true);
    };

    const cerrarModalInformacion = () => {
        // this.setState({ modalActualizar: false });
        setModalinformacion(false);
    };

    const cerrarModalActualizar = () => {
        // this.setState({ modalActualizar: false });
        setModalactualizar(false);
    };



    const cerrarModalInsertar = () => {
        // this.setState({ modalInsertar: false });
        setModalinsertar(false);
    };

    const editar = async (dato) => {

        var arreglo = data;
        console.log(data);
        const horas = hf - hi;
        console.log(horas);
        const database = doc(db, "reportesint", dato.id);
        arreglo.map((registro) => {
            if (dato.id === registro.id) {
                registro.feinicio = value.toLocaleString('en-US');
                registro.fetermino = value2.toLocaleString('en-US');
                registro.codigoot = dato.codigoot;
                registro.cedulat = dato.cedulat;
                registro.nombre = dato.nombre;
                registro.codigo = dato.codigo;
                registro.equipo = dato.equipo;
                registro.serie = dato.serie;
                registro.estadoequipo = dato.estadoequipo;
                registro.tipomant = dato.tipomant;
                // registro.nivelalerta = dato.nivelalerta;
                registro.estadof = dato.estadof;
                registro.falla = dato.falla;
                registro.causas = dato.causas;
                registro.actividades = dato.actividades;
                registro.mesFinal = mes;
                registro.horasT = horas;
                // registro.hperdidas = dato.hperdidas;
                registro.repuestos = dato.repuestos;
                registro.costo = dato.costo;
                registro.observaciones1 = dato.observaciones1;
                registro.verificador = dato.verificador;

                return 0;
            }
            return 0;
        });
        setData(arreglo);
        await updateDoc(database, {
            feinicio: dato.feinicio,
            fetermino: dato.fetermino,
            codigoot: dato.codigoot,
            cedulat: dato.cedulat,
            nombre: dato.nombre,
            codigo: dato.codigo,
            equipo: dato.equipo,
            estadoequipo: dato.estadoequipo,
            tipomant: dato.tipomant,
            estadof: dato.estadof,
            mesFinal: dato.mesFinal,
            horasT: dato.horasT,
            falla: dato.falla,
            causas: dato.causas,
            actividades: dato.actividades,
            // hperdidas: dato.hperdidas,
            repuestos: dato.repuestos,
            costo: dato.costo,
            observaciones1: dato.observaciones1,
            verificador: dato.verificador,
        });

        setModalactualizar(false);
    };

    const eliminar = async (dato) => {
        var opcion = window.confirm("Estás Seguro que deseas Eliminar el elemento " + dato.id);
        if (opcion === true) {
            await deleteDoc(doc(db, "reportesint", `${dato.id}`));
            setModalactualizar(false);
            const ref = doc(db, "ordenes", `${dato.OrdenId}`);
            await updateDoc(ref, {
                reporte: false,
                reporteId: ""
            });
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

    const handleChange2 = (newValue) => {
        var someDate = new Date(newValue);
        var milli = someDate.getTime();
        var hours = milli / (1000 * 3600);
        console.log(hours);
        setValue(newValue);
        setHi(hours);
    };
    const handleChange3 = (newValue) => {
        var someDate = new Date(newValue);
        var milli = someDate.getTime();
        var hours = milli / (1000 * 3600);
        var month = someDate.getMonth();
        setValue2(newValue);
        setHf(hours);
        setMes(month);
    };

    const selecMantenimiento = (e) => {
        console.log(e.target.value);
        var newForm2 = form;
        newForm2.tipomant = e.target.value;
        setForm(newForm2);
    };

    const selecEquipo = (e) => {
        console.log(e.target.value);
        var newForm2 = form;
        newForm2.equipo = e.target.value;
        setForm(newForm2);
    };

    const selecEstado = (e) => {
        console.log(e.target.value);
        var newForm2 = form;
        newForm2.estadoequipo = e.target.value;
        setForm(newForm2);
    };

    // const selecAlerta = (e) => {
    //     console.log(e.target.value);
    //     var newForm2 = form;
    //     newForm2.nivelalerta = e.target.value;
    //     setForm(newForm2);
    // };

    const generarPdf = () => {
        var doc = new jsPDF({
            orientation: "portrait",
        })
        doc.text("Hospital del Río ", 90, 10); //fontsize 15
        doc.setFontSize(12)// de aqui para abajo todo estara con fontsize 9
        doc.text("Reporte de Mantenimiento", 85, 20)
        let aux = 15
        let datos_tabla =
            [
                ["Id Reporte", form.id],
                ["Id O/T", form.OrdenId],
                ["Código Equipo", form.codigoe],
                ["Equipo", form.equipo],
                ["Técnico", form.nombreT],
                ["Estado", form.estadof],
                ["Tipo de Mantenimiento", form.tmantenimiento],
                ["Tiempo", form.tiempo],
                ["Costo", form.costo],
                ["Falla", form.falla],
                ["Causas", form.causas],
                ["Observaciones", form.observaciones]
            ]

        autoTable(doc, {
            startY: aux + 10,
            head: [['Item', 'Descripción']],
            body: datos_tabla,
        })

        doc.save(`reporte_${form.id}.pdf`);
    }

    useEffect(() => {
        getData();
    }, [])



    return (
        <>
            <Container>
                <Typography component="div" variant="h3" className="princi3" >
                    MANTENIMIENTO INTERNO
                </Typography>


                <Table className='table table-ligh table-hover'>
                    <Thead>
                        <Tr>
                            <Th>#</Th>
                            <Th>Id Reporte</Th>
                            <Th>Duración</Th>
                            <Th>Equipo</Th>
                            <Th>Código Equipo</Th>
                            {/* <Th>Acciones</Th> */}
                            <Th>Información</Th>

                        </Tr>
                    </Thead>

                    <Tbody>
                        {data.sort((a, b) => (a.indice - b.indice)).map((dato, index) => (
                            <Tr key={index} >
                                <Td>{index + 1}</Td>
                                <Td>{dato.id}</Td>
                                <Td>{dato.tiempo}</Td>
                                <Td>{dato.equipo}</Td>
                                <Td>{dato.codigoe}</Td>
                                {/* <Td>
                                    <Stack direction="row" spacing={0.5} alignitems="center" justifyContent="center" >

                                        {/* <button className="btn btn-outline-warning" onClick={() => mostrarModalActualizar(dato)}>Editar</button> */}
                                        {/* <button className="btn btn-outline-danger" onClick={() => eliminar(dato)}>Eliminar</button>
                                    </Stack> */}
                                {/* </Td>  */}
                                <Td>
                                    <IconButton aria-label="delete" color="gris" onClick={() => mostrarModalInformacion(dato)}><InfoIcon /></IconButton>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Container>

            <Modal isOpen={modalInformacion}>
                <ModalHeader>
                    <div><h1>Información Reporte</h1></div>
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <div className="name-outlined">{form.id}</div>
                            </Grid >
                            <Grid item xs={12}>
                                <label>
                                    <b>Estado:  </b>
                                    {form.estadof}
                                </label>
                            </Grid >
                            <Grid item xs={12}>
                                <label>
                                    <b>Orden de Trabajo: </b>
                                    {form.OrdenId}
                                </label>
                            </Grid>

                            <Grid item xs={12}>
                                <label>
                                    <b>Técnico: </b>
                                    {form.nombreT}
                                </label>
                            </Grid>
                            <Grid item xs={12}>
                                <label>
                                    <b>Equipo:  </b>
                                    {form.equipo}
                                </label>
                            </Grid>
                            <Grid item xs={12}>
                                <label>
                                    <b>Código Equipo:  </b>
                                    {form.codigoe}
                                </label>
                            </Grid>
                            <Grid item xs={12}>
                                <label>
                                    <b>Tipo de mantenimiento:  </b>
                                    {form.tmantenimiento}
                                </label>
                            </Grid>
                            <Grid item xs={12}>
                                <label>
                                    <b>Tiempo:  </b>
                                    {form.tiempo}
                                </label>
                            </Grid >
                            <Grid item xs={12}>
                                <label>
                                    <b>Costo:  </b>
                                    {form.costo}
                                </label>
                            </Grid>
                            <Grid item xs={12}>
                                <label>
                                    <b>Falla:  </b>
                                </label>
                                <TextareaAutosize
                                    aria-label="minimum height"
                                    minRows={2}
                                    placeholder="Falla"
                                    className="text-area-encargado"
                                    name="falla"
                                    readOnly
                                    value={form.falla} />

                            </Grid >
                            <Grid item xs={12}>
                                <label>
                                    <b>Causas:</b>
                                </label>
                                <TextareaAutosize
                                    aria-label="minimum height"
                                    minRows={2}
                                    placeholder="Causas"
                                    className="text-area-encargado"
                                    name="causas"
                                    readOnly
                                    value={form.causas} />
                            </Grid>
                            <Grid item xs={12}>
                                <label>
                                    <b>Actividades:</b>
                                </label>

                                <TextareaAutosize
                                    aria-label="minimum height"
                                    minRows={2}
                                    placeholder="Causas"
                                    className="text-area-encargado"
                                    name="actividadesR"
                                    readOnly
                                    value={form.actividadesR}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <label>
                                    <b>Repuestos:</b>
                                </label>
                                <TextareaAutosize
                                    aria-label="minimum height"
                                    minRows={2}
                                    placeholder="Repuestos"
                                    className="text-area-encargado"
                                    name="repuestos"
                                    readOnly
                                    value={form.repuestos}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <label>
                                    <b>Observaciones:</b>
                                </label>
                                <TextareaAutosize
                                    aria-label="minimum height"
                                    minRows={2}
                                    placeholder="Observaciones"
                                    className="text-area-encargado"
                                    name="observaciones"
                                    readOnly
                                    value={form.observaciones}
                                />
                            </Grid>
                        </Grid>

                    </FormGroup>

                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="contained"
                        className="boton-modal-pdf"
                        startIcon={<PrintIcon />}
                        onClick={generarPdf} >
                        Imprimir
                    </Button>
                    <Button
                        variant="outlined"
                        className="boton-modal-d"
                        onClick={() => cerrarModalInformacion()}
                    >
                        Cerrar
                    </Button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalActualizar}>
                <ModalHeader>
                    <div><h3>Editar Registro</h3></div>
                </ModalHeader>

                <ModalBody>
                    <FormGroup>
                        <label>
                            Id:
                        </label>

                        <input
                            className="form-control"
                            readOnly
                            type="text"
                            value={form.id}
                        />
                    </FormGroup>

                    <FormGroup>

                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Stack spacing={3}>
                                <DateTimePicker
                                    label="Fecha Inicio"
                                    value={value}
                                    onChange={handleChange2}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </Stack>
                        </LocalizationProvider>
                    </FormGroup>

                    <FormGroup>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Stack spacing={3}>
                                <DateTimePicker
                                    label="Fecha Termino"
                                    value={value2}
                                    onChange={handleChange3}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </Stack>
                        </LocalizationProvider>
                    </FormGroup>

                    <FormGroup>
                        <label>
                            Id Orden de Trabajo:
                        </label>
                        <input
                            className="form-control"
                            name="codigoot"
                            type="text"
                            onChange={handleChange}
                            value={form.codigoot}
                        />
                    </FormGroup>

                    <FormGroup>
                        <label>
                            CI:
                        </label>
                        <input
                            className="form-control"
                            name="cedulat"
                            type="text"
                            onChange={handleChange}
                            value={form.cedulat}
                        />
                    </FormGroup>

                    <FormGroup>
                        <label>
                            Nombre del Técnico:
                        </label>
                        <input
                            className="form-control"
                            name="nombre"
                            type="text"
                            onChange={handleChange}
                            value={form.nombre}
                        />
                    </FormGroup>

                    <FormGroup>
                        <label>
                            Código Equipo:
                        </label>
                        <input
                            className="form-control"
                            name="codigo"
                            type="text"
                            onChange={handleChange}
                            value={form.codigo}
                        />
                    </FormGroup>

                    <FormGroup>
                        <label>
                            Equipo:
                        </label>
                        <select onChange={selecEquipo} className="form-select" aria-label="Default select tipo">
                            <option selected>Equipo:</option>
                            <option value="Angiógrafo" >Angiógrafo</option>
                            <option value="Arco en C">Arco en C</option>
                            <option value="Autoclave" >Autoclave</option>
                            <option value="Balanza">Balanza</option>
                            <option value="Bomba de Infusión" >Bomba de Infusión</option>
                            <option value="Broncoscopio">Broncoscopio</option>
                            <option value="Cabina de Flujo Laminar" >Cabina de Flujo Laminar</option>
                            <option value="Central de Monitoreo">Central de Monitoreo</option>
                            <option value="Cuna de calor radiante" >Cuna de calor radiante</option>
                            <option value="Densitómetro">Densitómetro</option>
                            <option value="Desfibrilador">Desfibrilador</option>
                            <option value="Digitalizador AGFA">Digitalizador AGFA</option>
                            <option value="Doppler Fetal" >Doppler Fetal</option>
                            <option value="Electrobisturí">Electrobisturí</option>
                            <option value="Electrocardiógrafo" >Electrocardiógrafo</option>
                            <option value="Electrocauterio">Electrocauterio</option>
                            <option value="Electromiógrafo" >Electromiógrafo</option>
                            <option value="Equipo de Artroscopia">Equipo de Artroscopia</option>
                            <option value="Ecógrafo" >Ecógrafo</option>
                            <option value="Electroencefalógrafo">Electroencefalógrafo</option>
                            <option value="Equipo de Rayos X" >Equipo de Rayos X</option>
                            <option value="Equipo Ultrasonido">Equipo Ultrasonido</option>
                            <option value="Esterilizador de Peróxido" >Esterilizador de Peróxido</option>
                            <option value="Esterilizador 3M">Esterilizador 3M</option>
                            <option value="Impresora Drystar" >Impresora Drystar</option>
                            <option value="Incubadora Neonatal">Incubadora Neonatal</option>
                            <option value="Inyector" >Inyector</option>
                            <option value="Lámpara Cialíticas">Lámpara Cialíticas</option>
                            <option value="Lavadora Desinfectadora" >Lavadora Desinfectadora</option>
                            <option value="Mamógrafo">Mamógrafo</option>
                            <option value="Máquina de Anestesia">Máquina de Anestesia</option>
                            <option value="Mesa Quirúrgica">Mesa Quirúrgica</option>
                            <option value="Microscopio" >Microscopio</option>
                            <option value="Microscopio Oftalmológico">Microscopio Oftalmológico</option>
                            <option value="Monitor de Radiación" >Monitor de Radiación</option>
                            <option value="Monitor Fetal">Monitor Fetal</option>
                            <option value="Monitor Multiparámetros" >Monitor Multiparámetros</option>
                            <option value="Oftalmoscopio">Oftalmoscopio</option>
                            <option value="Portatil Rayos X" >Portatil Rayos X</option>
                            <option value="Refrigeradora">Refrigeradora</option>
                            <option value="Resonancia Magnética">Resonancia Magnética</option>
                            <option value="Tomógrafo">Tomógrafo</option>
                            <option value="Torre de Endoscopía">Torre de Endoscopía</option>
                            <option value="Torre de Laparoscopia">Torre de Laparoscopia</option>
                            <option value="Ventilador">Ventilador</option>

                        </select>
                    </FormGroup>

                    <FormGroup>
                        <label>
                            Estado:
                        </label>
                        <select onChange={selecEstado} className="form-select" aria-label="Default select tipo">
                            <option selected>Estado del reporte:</option>
                            <option value="Reparado Completamente" >Reparado Completamente</option>
                            <option value="Reparado Parcialmente">Reparado Parcialmente</option>
                            <option value="En espera de repuestos">En espera de repuestos</option>
                            <option value="Baja">Baja</option>
                        </select>
                    </FormGroup>

                    <FormGroup>
                        <label>
                            Tipo:
                        </label>
                        <select onChange={selecMantenimiento} className="form-select" aria-label="Default select tipo">
                            <option selected>T. Mantenimiento:</option>
                            <option value="Preventivo" >Preventivo</option>
                            <option value="Correctivo">Correctivo</option>
                        </select>
                    </FormGroup>
                    {/* <FormGroup>
                        <label>
                            Nivel de Alerta:
                        </label>
                        <select onChange={selecAlerta} className="form-select" aria-label="Default select tipo">
                            <option selected>Nivel de alerta:</option>
                            <option value="Funcional" >Funcional</option>
                            <option value="No Funcional">No Funcional</option>
                        </select>
                    </FormGroup> */}
                    <FormGroup>
                        <label>
                            Falla:
                        </label>
                        <TextareaAutosize
                            aria-label="empty textarea"
                            name="falla"
                            placeholder=""
                            className="form-control"
                            onChange={handleChange}
                            defaultValue={form.falla}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>
                            Causas:
                        </label>
                        <TextareaAutosize
                            aria-label="empty textarea"
                            name="causas"
                            placeholder=""
                            className="form-control"
                            onChange={handleChange}
                            defaultValue={form.causas}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>
                            Actividades:
                        </label>
                        <TextareaAutosize
                            aria-label="empty textarea"
                            name="actividades"
                            placeholder=""
                            className="form-control"
                            onChange={handleChange}
                            defaultValue={form.actividades}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>
                            Repuestos:
                        </label>
                        <TextareaAutosize
                            aria-label="empty textarea"
                            name="repuestos"
                            placeholder=""
                            className="form-control"
                            onChange={handleChange}
                            defaultValue={form.repuestos}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>
                            Costo:
                        </label>
                        <input
                            className="form-control"
                            name="costo"
                            type="text"
                            onChange={handleChange}
                            value={form.costo}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>
                            Observaciones:
                        </label>
                        <TextareaAutosize
                            aria-label="empty textarea"
                            name="observaciones1"
                            placeholder=""
                            className="form-control"
                            onChange={handleChange}
                            defaultValue={form.observaciones1}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>
                            Verificador:
                        </label>
                        <input
                            className="form-control"
                            name="verificador"
                            type="text"
                            onChange={handleChange}
                            value={form.verificador}
                        />
                    </FormGroup>
                </ModalBody>

                <ModalFooter>
                    <Button
                        className="editar"
                        onClick={() => editar(form)}
                    >
                        Editar
                    </Button>
                    <Button
                        className="editar"
                        onClick={() => cerrarModalActualizar()}
                    >
                        Cancelar
                    </Button>
                </ModalFooter>
            </Modal>



            <Modal className="{width:0px}" isOpen={modalInsertar}>
                <ModalHeader>
                    <div><h3>Insertar</h3></div>
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Grid container spacing={4}>
                            <Grid item xs={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Stack spacing={3}>
                                        <DateTimePicker
                                            label="Fecha Inicio"
                                            value={value}
                                            onChange={handleChange2}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </Stack>
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Stack spacing={3}>
                                        <DateTimePicker
                                            label="Fecha Termino"
                                            value={value2}
                                            onChange={handleChange3}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </Stack>
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={6}>
                                <label>
                                    Código O/T:
                                </label>
                                <input
                                    className="form-control"
                                    name="codigoot"
                                    type="text"
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <label>
                                    CI Técnico:
                                </label>
                                <input
                                    className="form-control"
                                    name="cedulat"
                                    type="text"
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <label>
                                    Nombre Técnico:
                                </label>
                                <input
                                    className="form-control"
                                    name="nombre"
                                    type="text"
                                    onChange={handleChange}
                                />

                            </Grid>
                            <Grid item xs={6}>
                                <label>
                                    Código Equipo:
                                </label>
                                <input
                                    className="form-control"
                                    name="codigo"
                                    type="text"
                                    onChange={handleChange}
                                />
                            </Grid >
                            <Grid item xs={6}>
                                <label>
                                    Equipo:
                                </label>
                                <select onChange={selecEquipo} className="form-select" aria-label="Default select tipo">
                                    <option selected>Equipo:</option>
                                    <option value="Angiógrafo" >Angiógrafo</option>
                                    <option value="Arco en C">Arco en C</option>
                                    <option value="Autoclave" >Autoclave</option>
                                    <option value="Balanza">Balanza</option>
                                    <option value="Bomba de Infusión" >Bomba de Infusión</option>
                                    <option value="Broncoscopio">Broncoscopio</option>
                                    <option value="Cabina de Flujo Laminar" >Cabina de Flujo Laminar</option>
                                    <option value="Central de Monitoreo">Central de Monitoreo</option>
                                    <option value="Cuna de calor radiante" >Cuna de calor radiante</option>
                                    <option value="Densitómetro">Densitómetro</option>
                                    <option value="Desfibrilador">Desfibrilador</option>
                                    <option value="Digitalizador AGFA">Digitalizador AGFA</option>
                                    <option value="Doppler Fetal" >Doppler Fetal</option>
                                    <option value="Electrobisturí">Electrobisturí</option>
                                    <option value="Electrocardiógrafo" >Electrocardiógrafo</option>
                                    <option value="Electrocauterio">Electrocauterio</option>
                                    <option value="Electromiógrafo" >Electromiógrafo</option>
                                    <option value="Equipo de Artroscopia">Equipo de Artroscopia</option>
                                    <option value="Ecógrafo" >Ecógrafo</option>
                                    <option value="Electroencefalógrafo">Electroencefalógrafo</option>
                                    <option value="Equipo de Rayos X" >Equipo de Rayos X</option>
                                    <option value="Equipo Ultrasonido">Equipo Ultrasonido</option>
                                    <option value="Esterilizador de Peróxido" >Esterilizador de Peróxido</option>
                                    <option value="Esterilizador 3M">Esterilizador 3M</option>
                                    <option value="Impresora Drystar" >Impresora Drystar</option>
                                    <option value="Incubadora Neonatal">Incubadora Neonatal</option>
                                    <option value="Inyector" >Inyector</option>
                                    <option value="Lámpara Cialíticas">Lámpara Cialíticas</option>
                                    <option value="Lavadora Desinfectadora" >Lavadora Desinfectadora</option>
                                    <option value="Mamógrafo">Mamógrafo</option>
                                    <option value="Máquina de Anestesia">Máquina de Anestesia</option>
                                    <option value="Mesa Quirúrgica">Mesa Quirúrgica</option>
                                    <option value="Microscopio" >Microscopio</option>
                                    <option value="Microscopio Oftalmológico">Microscopio Oftalmológico</option>
                                    <option value="Monitor de Radiación" >Monitor de Radiación</option>
                                    <option value="Monitor Fetal">Monitor Fetal</option>
                                    <option value="Monitor Multiparámetros" >Monitor Multiparámetros</option>
                                    <option value="Oftalmoscopio">Oftalmoscopio</option>
                                    <option value="Portatil Rayos X" >Portatil Rayos X</option>
                                    <option value="Refrigeradora">Refrigeradora</option>
                                    <option value="Resonancia Magnética">Resonancia Magnética</option>
                                    <option value="Tomógrafo">Tomógrafo</option>
                                    <option value="Torre de Endoscopía">Torre de Endoscopía</option>
                                    <option value="Torre de Laparoscopia">Torre de Laparoscopia</option>
                                    <option value="Ventilador">Ventilador</option>

                                </select>
                            </Grid >
                            <Grid item xs={6}>
                                <label>
                                    T. Mantenimiento:
                                </label>
                                <select onChange={selecMantenimiento} className="form-select" aria-label="Default select tipo">
                                    <option selected>Tipo de mantenimiento:</option>
                                    <option value="Preventivo" >Preventivo</option>
                                    <option value="Correctivo">Correctivo</option>
                                </select>

                            </Grid>
                            <Grid item xs={6}>
                                <label>
                                    Estado:
                                </label>
                                <select onChange={selecEstado} className="form-select" aria-label="Default select estado">
                                    <option selected>Estado de la solicitud:</option>
                                    <option value="Reparado Completamente" >Reparado Completamente</option>
                                    <option value="Reparado Parcialmente">Reparado Parcialmente</option>
                                    <option value="En espera de repuestos">En espera de repuestos</option>
                                    <option value="Baja">Baja</option>
                                </select>
                            </Grid>
                            {/* <Grid item xs={6}>
                                <label>
                                    Nivel Alerta:
                                </label>
                                <select onChange={selecAlerta} className="form-select" aria-label="Default select tipo">
                                    <option selected>Nivel de alerta:</option>
                                    <option value="Funcional" >Funcional</option>
                                    <option value="No Funcional">No Funcional</option>
                                </select>
                            </Grid> */}
                            <Grid item xs={12}>
                                <label>
                                    Costo:
                                </label>
                                <input
                                    className="form-control"
                                    name="costo"
                                    type="text"
                                    onChange={handleChange}
                                />
                            </Grid>

                        </Grid>
                    </FormGroup>


                    <FormGroup>
                        <label>
                            Falla:
                        </label>
                        <input
                            className="form-control"
                            name="falla"
                            type="text"
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>
                            Causas:
                        </label>
                        <input
                            className="form-control"
                            name="causas"
                            type="text"
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>
                            Actividades:
                        </label>
                        <input
                            className="form-control"
                            name="actividades"
                            type="text"
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>
                            Repuestos:
                        </label>
                        <input
                            className="form-control"
                            name="repuestos"
                            type="text"
                            onChange={handleChange}
                        />

                    </FormGroup>
                    <FormGroup>
                        <label>
                            Observaciones:
                        </label>
                        <input
                            className="form-control"
                            name="observaciones1"
                            type="text"
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>
                            Verificador:
                        </label>
                        <input
                            className="form-control"
                            name="verificador"
                            type="text"
                            onChange={handleChange}
                        />
                    </FormGroup>

                </ModalBody>

                <ModalFooter>
                    <Button
                        // color="primary"
                        className="editar"
                        onClick={() => insertar()}
                    >
                        Insertar
                    </Button>
                    <Button
                        // className="btn btn-danger"
                        className="editar"
                        onClick={() => cerrarModalInsertar()}
                    >
                        Cancelar
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );

}



