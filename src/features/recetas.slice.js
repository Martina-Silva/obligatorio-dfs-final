import { createSlice } from "@reduxjs/toolkit";

const filtrosIniciales = {
    titulo: "",
    categoria: "",
    tiempoMax: "",
}

const initialState = {
    lista: [],
    categorias: [],
    filtros: { ...filtrosIniciales },
    explorar: {
        filtros: { ...filtrosIniciales },
        pagina: 1,
    },
}

const recetasSlice = createSlice({
    name: "recetas",
    initialState,
    reducers: {
        guardarRecetas(state, action) {
            state.lista = action.payload;
        },
        quitarReceta(state, action) {
            state.lista = state.lista.filter(r => r._id !== action.payload);
        },
        guardarCategorias(state, action) {
            state.categorias = action.payload;
        },
        cambiarFiltro(state, action) {
            state.filtros[action.payload.campo] = action.payload.valor;
        },
        limpiarFiltros(state) {
            state.filtros = { ...filtrosIniciales };
        },
        cambiarFiltroExplorar(state, action) {
            state.explorar.filtros[action.payload.campo] = action.payload.valor;
            state.explorar.pagina = 1;
        },
        limpiarFiltrosExplorar(state) {
            state.explorar.filtros = { ...filtrosIniciales };
            state.explorar.pagina = 1;
        },
        irAPaginaExplorar(state, action) {
            state.explorar.pagina = action.payload;
        },
        limpiarRecetas(state) {
            state.lista = [];
            state.categorias = [];
            state.filtros = { ...filtrosIniciales };
            state.explorar = { filtros: { ...filtrosIniciales }, pagina: 1 };
        },
    },
})

export const {
    guardarRecetas,
    quitarReceta,
    guardarCategorias,
    cambiarFiltro,
    limpiarFiltros,
    cambiarFiltroExplorar,
    limpiarFiltrosExplorar,
    irAPaginaExplorar,
    limpiarRecetas,
} = recetasSlice.actions;
export default recetasSlice.reducer;