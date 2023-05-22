import React from "react";
import PropTypes from 'prop-types';

import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import  '../css/InicioCompras.css'
import Manual from "./Manual";
import Plan from "./Plan";
import '../css/Planmantenimiento.css';
import '../css/Presentacion.css';

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
            {value === index && <Box sx={{ p: 3,bgcolor:'#fff' }}>{children}</Box>}
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
export default function Planmantenimiento(){
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
 
    const handleChangeIndex = (index) => {
        setValue(index);
    };

    return(
        <>
        <Typography component="div" variant="h3" className="princi3" >
          MANTENIMIENTO EQUIPOS MÉDICOS
        </Typography>
        <AppBar position="relative" color="default">
                        <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" variant="fullWidth" aria-label="action tabs example">
                            <Tab label="Manual" {...a11yProps(0)} />
                            <Tab label="Plan Mantenimiento" {...a11yProps(1)} />
                        </Tabs>
              
  
                    </AppBar>
                    <Box sx={{bgcolor:"#fff"}}>
                
                        <TabPanel value={value} index={0} >
                           <Manual/>
                        </TabPanel>
                        <TabPanel value={value} index={1} >
                            <Plan/>
                        </TabPanel>
             
               
                    </Box>
                  
            
        </>
    );
}