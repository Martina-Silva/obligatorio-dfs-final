import { useDispatch, useSelector } from "react-redux"
import { cambiarFiltro, limpiarFiltros } from "../features/recetas.slice"

const FiltrosRecetas = () => {

    const dispatch = useDispatch()
    const filtros = useSelector(state => state.recetas.filtros)
    const categorias = useSelector(state => state.recetas.categorias)

    const cambiar = (campo) => (e) => {
        dispatch(cambiarFiltro({ campo, valor: e.target.value }))
    }

    const hayFiltros = filtros.titulo !== "" || filtros.categoria !== "" || filtros.tiempoMax !== ""

    return (
        <div className="filtros">
            <div className="form-group">
                <label htmlFor="filtro-titulo">Buscar por título:</label>
                <input
                    type="text"
                    id="filtro-titulo"
                    value={filtros.titulo}
                    onChange={cambiar("titulo")}
                    placeholder="Ej: tarta"
                />
            </div>

            <div className="form-group">
                <label htmlFor="filtro-categoria">Categoría:</label>
                <select id="filtro-categoria" value={filtros.categoria} onChange={cambiar("categoria")}>
                    <option value="">Todas</option>
                    {categorias.map(c => (
                        <option key={c._id} value={c._id}>{c.nombre}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="filtro-tiempo">Tiempo máximo (min):</label>
                <input
                    type="number"
                    min="1"
                    id="filtro-tiempo"
                    value={filtros.tiempoMax}
                    onChange={cambiar("tiempoMax")}
                />
            </div>

            {hayFiltros && (
                <button type="button" className="btn-secundario" onClick={() => dispatch(limpiarFiltros())}>
                    Limpiar filtros
                </button>
            )}
        </div>
    )
}

export default FiltrosRecetas