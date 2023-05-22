import React  from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import BallotIcon from '@mui/icons-material/Ballot';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { useNavigate } from 'react-router-dom';


export default function OrdenesCMenu(){
    const navigate = useNavigate();
    const [open2, setOpen2] = React.useState(false);

    const Changeview = (referencia) => {
        navigate(referencia);
    }
    const handleClick2 = () => {
        setOpen2(!open2);
    };

    return(
        <>
                    <ListItemButton onClick={handleClick2}>
                        <ListItemIcon>
                            <EngineeringIcon />
                        </ListItemIcon>
                        <ListItemText primary="Gestión de Ordenes" />
                        {open2 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open2} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>

                        <ListItemButton  onClick={() =>Changeview('ordenes/OC')}>
                        <ListItemIcon>
                            <BallotIcon />
                        </ListItemIcon>
                        <ListItemText primary="Solicitud Orden de Compra" />
                    </ListItemButton>

                    <ListItemButton  onClick={() =>Changeview('ordenes/gestion')}>
                        <ListItemIcon>
                            <BallotIcon />
                        </ListItemIcon>
                        <ListItemText primary="Gestión Ordenes" />
                    </ListItemButton>

                    <ListItemButton  onClick={() =>Changeview('ordenes/produccion')}>
                        <ListItemIcon>
                            <BallotIcon />
                        </ListItemIcon>
                        <ListItemText primary="Produccion" />
                    </ListItemButton>

                        </List>
                    </Collapse>
        </>
    )

    
}
