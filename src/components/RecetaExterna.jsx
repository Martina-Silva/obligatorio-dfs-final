import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router"
import { useForm } from "react-hook-form"
import { joiResolver } from "@hookform/resolvers/joi"
import { toast } from "react-toastify"
import { guardarExternaSchema } from "../validators/externas.validators"
import { pedirTipIAService } from "../services/externas.service"
import { crearRecetaService } from "../services/recetas.service"
import { obtenerPerfilService } from "../services/auth.service"
import { actualizarUsuario } from "../features/user.slice"
import { obtenerMensajeError } from "../utils/errores"

const RecetaExterna = ({ receta }) => {

    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)
    const categorias = useSelector(state => state.recetas.categorias)

    const [tip, setTip] = useState(null)
    const [cargandoTip, setCargandoTip] = useState(false)
    const [mostrarGuardar, setMostrarGuardar] = useState(false)
    const [guardando, setGuardando] = useState(false)
    const [guardada, setGuardada] = useState(false)
    const [errorServidor, setErrorServidor] = useState("")

    const limiteAlcanzado = user?.limiteRecetas != null && user.cantidadRecetas >= user.limiteRecetas

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        resolver: joiResolver(guardarExternaSchema),
        mode: "onChange",
        defaultValues: { tiempoPreparacionMin: "", categoria: "" },
    })

    const pedirTip = async () => {
        setCargandoTip(true)
        try {
            const resultado = await pedirTipIAService(receta.nombre, receta.ingredientes)
            setTip(resultado)
        } catch (error) {
            toast.error(obtenerMensajeError(error))
        } finally {
            setCargandoTip(false)
        }
    }

    const guardar = async (data) => {
        setErrorServidor("")
        setGuardando(true)
        try {
            const nueva = {
                titulo: receta.nombre,
                ingredientes: receta.ingredientes,
                instrucciones: receta.instrucciones,
                tiempoPreparacionMin: Number(data.tiempoPreparacionMin),
                categoria: data.categoria,
            }
            if (receta.imagen) {
                nueva.imagenUrl = receta.imagen
            }

            await crearRecetaService(nueva)

            // Actualizamos el uso del plan
            const perfil = await obtenerPerfilService()
            dispatch(actualizarUsuario(perfil))

            toast.success("Receta guardada en tus recetas")
            setGuardada(true)
            setMostrarGuardar(false)
        } catch (error) {
            setErrorServidor(obtenerMensajeError(error))
        } finally {
            setGuardando(false)
        }
    }

    return (
        <article className="receta-card">
            {receta.imagen && (
                <img src={receta.imagen} alt={receta.nombre} className="receta-img" />
            )}

            <div className="receta-body">
                <h3>{receta.nombre}</h3>
                <p className="receta-meta">
                    {receta.categoria} · {receta.origen}
                    <span className="badge-idioma">
                        {receta.idioma === "es" ? "Traducida con IA" : "Original (inglés)"}
                    </span>
                </p>

                <details className="externa-detalle">
                    <summary>Ver ingredientes e instrucciones</summary>

                    <h4>Ingredientes</h4>
                    <ul className="detalle-lista">
                        {receta.ingredientes.map((ingrediente, i) => (
                            <li key={i}>{ingrediente}</li>
                        ))}
                    </ul>

                    <h4>Instrucciones</h4>
                    <p className="detalle-texto">{receta.instrucciones}</p>

                    {receta.video && (
                        <p className="externa-video">
                            <a href={receta.video} target="_blank" rel="noreferrer">▶ Ver video</a>
                        </p>
                    )}
                </details>

                {tip && (
                    <div className="comentario-ia">
                        <strong>💡 Tip de IA</strong>
                        <span className="badge">
                            {tip.origen === "Groq" ? "Groq" : "Respaldo local"}
                        </span>
                        <p>{tip.sugerenciaIA}</p>
                    </div>
                )}

                {guardada ? (
                    <p className="guardada-ok">
                        ✅ Guardada. <Link to="/recetas">Verla en mis recetas</Link>
                    </p>
                ) : (
                    <div className="receta-acciones">
                        <button className="btn-editar" onClick={pedirTip} disabled={cargandoTip}>
                            {cargandoTip ? "Pensando..." : "💡 Tip de IA"}
                        </button>
                        <button
                            onClick={() => setMostrarGuardar(!mostrarGuardar)}
                            disabled={limiteAlcanzado}
                            title={limiteAlcanzado ? "Llegaste al límite de tu plan" : ""}
                        >
                            Guardar en mis recetas
                        </button>
                    </div>
                )}

                {limiteAlcanzado && !guardada && (
                    <p className="aviso">Llegaste al límite de recetas de tu plan. Pasate a PREMIUM para guardar más.</p>
                )}

                {mostrarGuardar && !guardada && (
                    <form onSubmit={handleSubmit(guardar)} noValidate className="guardar-externa">
                        <div className="form-group">
                            <label htmlFor={`cat-${receta.idExterno}`}>Categoría:</label>
                            <select {...register("categoria")} id={`cat-${receta.idExterno}`}>
                                <option value="">Elegí una categoría</option>
                                {categorias.map(c => (
                                    <option key={c._id} value={c._id}>{c.nombre}</option>
                                ))}
                            </select>
                            <span className="error">{errors.categoria?.message}</span>
                        </div>

                        <div className="form-group">
                            <label htmlFor={`tiempo-${receta.idExterno}`}>Tiempo de preparación (minutos):</label>
                            <input
                                {...register("tiempoPreparacionMin")}
                                type="number"
                                min="1"
                                id={`tiempo-${receta.idExterno}`}
                            />
                            <span className="error">{errors.tiempoPreparacionMin?.message}</span>
                        </div>

                        {errorServidor && <p className="error-box">{errorServidor}</p>}

                        <button type="submit" disabled={!isValid || guardando}>
                            {guardando ? "Guardando (la IA arma el tip)..." : "Confirmar y guardar"}
                        </button>
                    </form>
                )}
            </div>
        </article>
    )
}

export default RecetaExterna