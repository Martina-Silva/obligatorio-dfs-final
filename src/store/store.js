import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user.slice";
import recetasReducer from "../features/recetas.slice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        recetas: recetasReducer,
    },
})