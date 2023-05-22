import { createSlice  } from "@reduxjs/toolkit";



export const ordenescompra = createSlice({
    name: "ordenesc",
    initialState: {
      id: "",
      indice: "",
      codigo: "",
      accesorios:[],
      situacion: "Activo",
      
    },
    // los reducers nos permiten cambiar los valores 
    //de nuestro slice es decir cambiar los valores de las variables de arriba
    reducers:{
        setOrdenescState: (state, action) => {
            state.indice = action.payload.indice
            state.id = action.payload.id
            state.codigo = action.payload.codigo
            state.mparada = action.payload.mparada
            state.accesorios = action.payload.accesorios
            state.situacion = action.payload.situacion
          },
    }
})
export const {setOrdenescState} = ordenescompra.actions
export default ordenescompra.reducer;