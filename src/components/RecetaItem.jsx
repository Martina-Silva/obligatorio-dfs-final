import { useState } from "react"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import RecetaEditForm from "./RecetaEditForm"
import { eliminarRecetaService } from "../services/recetas.service"
import { obtenerPerfilService } from "../services/auth.service"
import { quitarReceta } from "../features/recetas.slice"
import { actualizarUsuario } from "../features/user.slice"
import { obtenerMensajeError } from "../utils/errores"

const RecetaItem = ({ receta }) => {

    const dispatch = useDispatch()
    const [eliminando, setEliminando] = useState(false)
    const [editando, setEditando] = useState(false)

    const eliminar = async () => {
        if (!window.confirm(`¿Eliminar la receta "${receta.titulo}"?`)) return

        setEliminando(true)
        try {
            await eliminarRecetaService(receta._id)
            dispatch(quitarReceta(receta._id))
            const perfil = await obtenerPerfilService()
            dispatch(actualizarUsuario(perfil))
            toast.success("Receta eliminada")
        } catch (error) {
            toast.error(obtenerMensajeError(error))
            setEliminando(false)
        }
    }

    return (
        <article className="receta-card">
            {receta.imagenUrl && (
                <img src={receta.imagenUrl} alt={receta.titulo} className="receta-img" />
            )}

            <div className="receta-body">
                {editando ? (
                    <RecetaEditForm receta={receta} onTerminar={() => setEditando(false)} />
                ) : (
                    <>
                        <h3>{receta.titulo}</h3>
                        <p className="receta-meta">
                            {receta.categoria?.nombre} · ⏱ {receta.tiempoPreparacionMin} min
                        </p>

                        <h4>Ingredientes</h4>
                        <ul>
                            {receta.ingredientes.map((ingrediente, i) => (
                                <li key={i}>{ingrediente}</li>
                            ))}
                        </ul>

                        <h4>Instrucciones</h4>
                        <p>{receta.instrucciones}</p>

                        {receta.comentarioIA && (
                            <div className="comentario-ia">
                                <strong>💡 Tip de IA</strong>
                                <span className="badge">
                                    {receta.origenComentarioIA === "Groq" ? "Groq" : "Respaldo local"}
                                </span>
                                <p>{receta.comentarioIA}</p>
                            </div>
                        )}

                        <div className="receta-acciones">
                            <button className="btn-editar" onClick={() => setEditando(true)} disabled={eliminando}>
                                Editar
                            </button>
                            <button className="btn-eliminar" onClick={eliminar} disabled={eliminando}>
                                {eliminando ? "Eliminando..." : "Eliminar"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </article>
    )
}

export default RecetaItem