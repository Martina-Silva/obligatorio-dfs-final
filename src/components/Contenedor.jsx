import { useDispatch, useSelector } from "react-redux"
import { NavLink, Outlet, useNavigate } from "react-router"
import { desloguear } from "../features/user.slice"
import { limpiarRecetas } from "../features/recetas.slice"

const Contenedor = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user);

    const cerrarSesion = () => {
        localStorage.clear();
        dispatch(desloguear());
        dispatch(limpiarRecetas());
        navigate("/");
    }

    return (
        <>
            <header className="main-header">
                <div className="header-content">
                    <span className="app-logo">🍳 Recetario</span>

                    {user && (
                        <nav className="nav-links">
                            <NavLink to="/recetas">Mis recetas</NavLink>
                            <NavLink to="/explorar">Explorar</NavLink>
                            <NavLink to="/descubrir">Descubrir</NavLink>
                            {user.role === "ADMIN" && (
                                <NavLink to="/admin/categorias">Categorías</NavLink>
                            )}
                        </nav>
                    )}

                    {user && (
                        <div className="header-user">
                            <span>{user.username} ({user.plan})</span>
                            <button className="logout-btn" onClick={cerrarSesion}>Cerrar sesión</button>
                        </div>
                    )}
                </div>
            </header>
            <Outlet />
        </>
    )
}

export default Contenedor