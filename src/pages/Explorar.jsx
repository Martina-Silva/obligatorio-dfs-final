import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import Paginacion from "../components/Paginacion"
import RecetaResumen from "../components/RecetaResumen"
import {
    cambiarFiltroExplorar,
    guardarCategorias,
    irAPaginaExplorar,
    limpiarFiltrosExplorar,
} from "../features/recetas.slice"
import { obtenerRecetasPublicasService } from "../services/explorar.service"
import { obtenerCategoriasService } from "../services/recetas.service"
import { obtenerMensajeError } from "../utils/errores"

const LIMITE = 6

const Explorar = () => {

    const dispatch = useDispatch()
    const categorias = useSelector(state => state.recetas.categorias)
    const { filtros, pagina } = useSelector(state => state.recetas.explorar)

    const [datos, setDatos] = useState({ recetas: [], total: 0, totalPages: 1 })
    const [cargando, setCargando] = useState(true)

    const hayFiltros = filtros.titulo !== "" || filtros.categoria !== "" || filtros.tiempoMax !== ""

    useEffect(() => {
        if (categorias.length > 0) return

        const cargarCategorias = async () => {
            try {
                const lista = await obtenerCategoriasService()
                dispatch(guardarCategorias(lista))
            } catch (error) {
                toast.error(obtenerMensajeError(error))
            }
        }
        cargarCategorias()
    }, [dispatch, categorias.length])

    useEffect(() => {
        let cancelado = false

        const temporizador = setTimeout(async () => {
            setCargando(true)
            try {
                const respuesta = await obtenerRecetasPublicasService({ pagina, limite: LIMITE, filtros })
                if (!cancelado) setDatos(respuesta)
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
    }, [filtros, pagina])

    const cambiar = (campo) => (e) => {
        dispatch(cambiarFiltroExplorar({ campo, valor: e.target.value }))
    }

    return (
        <div className="container">
            <h1>Explorar recetas</h1>

            <div className="filtros">
                <div className="form-group">
                    <label htmlFor="ex-titulo">Buscar por título:</label>
                    <input
                        type="text"
                        id="ex-titulo"
                        value={filtros.titulo}
                        onChange={cambiar("titulo")}
                        placeholder="Ej: tarta"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="ex-categoria">Categoría:</label>
                    <select id="ex-categoria" value={filtros.categoria} onChange={cambiar("categoria")}>
                        <option value="">Todas</option>
                        {categorias.map(c => (
                            <option key={c._id} value={c._id}>{c.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="ex-tiempo">Tiempo máximo (min):</label>
                    <input
                        type="number"
                        min="1"
                        id="ex-tiempo"
                        value={filtros.tiempoMax}
                        onChange={cambiar("tiempoMax")}
                    />
                </div>

                {hayFiltros && (
                    <button type="button" className="btn-secundario" onClick={() => dispatch(limpiarFiltrosExplorar())}>
                        Limpiar filtros
                    </button>
                )}
            </div>

            {cargando ? (
                <p>Cargando...</p>
            ) : datos.recetas.length === 0 ? (
                <p>
                    {hayFiltros
                        ? "No hay recetas que coincidan con los filtros."
                        : "Todavía no hay recetas publicadas."}
                </p>
            ) : (
                <>
                    <p className="total-resultados">{datos.total} receta(s) encontradas</p>
                    <div className="recetas-grid">
                        {datos.recetas.map(receta => (
                            <RecetaResumen key={receta._id} receta={receta} />
                        ))}
                    </div>
                    <Paginacion
                        pagina={pagina}
                        totalPaginas={datos.totalPages}
                        onCambiar={(nueva) => dispatch(irAPaginaExplorar(nueva))}
                    />
                </>
            )}
        </div>
    )
}

export default Explorar