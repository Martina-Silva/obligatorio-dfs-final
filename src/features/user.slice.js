import { createSlice } from "@reduxjs/toolkit";

const guardado = localStorage.getItem("user");

const initialState = {
    user: guardado ? JSON.parse(guardado) : null,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loguear(state, action) {
            state.user = action.payload;
        },
        desloguear(state) {
            state.user = null;
        },
        actualizarUsuario(state, action) {
            state.user = { ...state.user, ...action.payload };
        },
    },
})

export const { loguear, desloguear, actualizarUsuario } = userSlice.actions;
export default userSlice.reducer;