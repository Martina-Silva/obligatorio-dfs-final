import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import CambiarPlan from "../components/CambiarPlan"
import FiltrosRecetas from "../components/FiltrosRecetas"
import GraficaRecetas from "../components/GraficaRecetas"
import RecetaForm from "../components/RecetaForm"
import RecetaItem from "../components/RecetaItem"
import UsoPlan from "../components/UsoPlan"
import { guardarCategorias, guardarRecetas } from "../features/recetas.slice"
import { actualizarUsuario } from "../features/user.slice"
import { obtenerPerfilService } from "../services/auth.service"
import { obtenerCategoriasService, obtenerMisRecetasService } from "../services/recetas.service"
import { obtenerMensajeError } from "../utils/errores"

const Recetas = () => {

    const dispatch = useDispatch()
    const lista = useSelector(state => state.recetas.lista)
    const filtros = useSelector(state => state.recetas.filtros)
    const [cargando, setCargando] = useState(true)

    const hayFiltros = filtros.titulo !== "" || filtros.categoria !== "" || filtros.tiempoMax !== ""

    useEffect(() => {
        const cargarBase = async () => {
            try {
                const [categorias, perfil] = await Promise.all([
                    obtenerCategoriasService(),
                    obtenerPerfilService(),
                ])
                dispatch(guardarCategorias(categorias))
                dispatch(actualizarUsuario(perfil))
            } catch (error) {
                toast.error(obtenerMensajeError(error))
            }
        }
        cargarBase()
    }, [dispatch])

    useEffect(() => {
        let cancelado = false

        const temporizador = setTimeout(async () => {
            try {
                const recetas = await obtenerMisRecetasService(filtros)
                if (!cancelado) dispatch(guardarRecetas(recetas))
            } catch (error) {
                if (!cancelado) toast.error(obtenerMensajeError(error))
            } finally {
                if (!cancelado) setCargando(false)
            }
        }, 300)

        return () => {
            cancelado = true
            clearTimeout(temporizador)
        }
    }, [filtros, dispatch])

    return (
        <>
            <div className="container">
                <h1>Mi cuenta</h1>
                <UsoPlan />
                <CambiarPlan />
            </div>

            <div className="container">
                <h2>Estadísticas</h2>
                <GraficaRecetas />
            </div>

            <div className="container">
                <h2>Nueva receta</h2>
                <RecetaForm />
            </div>

            <div className="container">
                <h2>Mis recetas</h2>
                <FiltrosRecetas />

                {cargando ? (
                    <p>Cargando...</p>
                ) : lista.length === 0 ? (
                    <p>
                        {hayFiltros
                            ? "No hay recetas que coincidan con los filtros."
                            : "Todavía no cargaste ninguna receta."}
                    </p>
                ) : (
                    <div className="recetas-grid">
                        {lista.map(receta => (
                            <RecetaItem key={receta._id} receta={receta} />
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default Recetas