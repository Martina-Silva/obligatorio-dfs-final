import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { obtenerRecetaPorIdService } from "../services/explorar.service"
import { obtenerMensajeError } from "../utils/errores"

const RecetaDetalle = () => {

    // El id viene de la URL: /explorar/:id
    const { id } = useParams()

    const [receta, setReceta] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        let cancelado = false

        const cargar = async () => {
            try {
                const datos = await obtenerRecetaPorIdService(id)
                if (!cancelado) setReceta(datos)
            } catch (err) {
                if (!cancelado) setError(obtenerMensajeError(err))
            } finally {
                if (!cancelado) setCargando(false)
            }
        }
        cargar()

        return () => { cancelado = true }
    }, [id])

    return (
        <div className="container">
            <Link to="/explorar" className="volver">← Volver a explorar</Link>

            {cargando && <p>Cargando...</p>}

            {error && <p className="error-box">{error}</p>}

            {receta && (
                <article>
                    {receta.imagenUrl && (
                        <img src={receta.imagenUrl} alt={receta.titulo} className="detalle-img" />
                    )}

                    <h1>{receta.titulo}</h1>
                    <p className="receta-meta">
                        {receta.categoria?.nombre} · ⏱ {receta.tiempoPreparacionMin} min · Por {receta.usuario?.username}
                    </p>

                    <h3>Ingredientes</h3>
                    <ul className="detalle-lista">
                        {receta.ingredientes.map((ingrediente, i) => (
                            <li key={i}>{ingrediente}</li>
                        ))}
                    </ul>

                    <h3>Instrucciones</h3>
                    <p className="detalle-texto">{receta.instrucciones}</p>

                    {receta.comentarioIA && (
                        <div className="comentario-ia">
                            <strong>💡 Tip de IA</strong>
                            <span className="badge">
                                {receta.origenComentarioIA === "Groq" ? "Groq" : "Respaldo local"}
                            </span>
                            <p>{receta.comentarioIA}</p>
                        </div>
                    )}
                </article>
            )}
        </div>
    )
}

export default RecetaDetalle