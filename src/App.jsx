import { Provider } from "react-redux"
import { BrowserRouter, Route, Routes } from "react-router"
import { ToastContainer } from "react-toastify"
import { store } from "./store/store"
import AdminRoute from "./components/AdminRoute"
import Contenedor from "./components/Contenedor"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminCategorias from "./pages/AdminCategorias"
import Descubrir from "./pages/Descubrir"
import Explorar from "./pages/Explorar"
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import RecetaDetalle from "./pages/RecetaDetalle"
import Recetas from "./pages/Recetas"
import Registro from "./pages/Registro"

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Contenedor />}>
            <Route path="/" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/recetas" element={<ProtectedRoute />}>
              <Route path="" element={<Recetas />} />
            </Route>
            <Route path="/explorar" element={<ProtectedRoute />}>
              <Route path="" element={<Explorar />} />
              <Route path=":id" element={<RecetaDetalle />} />
            </Route>
            <Route path="/descubrir" element={<ProtectedRoute />}>
              <Route path="" element={<Descubrir />} />
            </Route>
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminRoute />}>
                <Route path="categorias" element={<AdminCategorias />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer position="bottom-right" autoClose={5000} theme="colored" />
    </Provider>
  )
}

export default App