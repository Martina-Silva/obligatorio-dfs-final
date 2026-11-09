import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useForm } from "react-hook-form"
import { joiResolver } from "@hookform/resolvers/joi"
import { toast } from "react-toastify"
import RecetaExterna from "../components/RecetaExterna"
import { guardarCategorias } from "../features/recetas.slice"
import { actualizarUsuario } from "../features/user.slice"
import { obtenerPerfilService } from "../services/auth.service"
import { buscarRecetasExternasService, obtenerRecetaAleatoriaService } from "../services/externas.service"
import { obtenerCategoriasService } from "../services/recetas.service"
import { buscarSchema } from "../validators/externas.validators"
import { obtenerMensajeError } from "../utils/errores"

const Descubrir = () => {

    const dispatch = useDispatch()

    const [recetas, setRecetas] = useState([])
    const [cargando, setCargando] = useState(false)
    const [buscado, setBuscado] = useState(false)
    const [errorServidor, setErrorServidor] = useState("")

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors, isValid },
    } = useForm({
        resolver: joiResolver(buscarSchema),
        mode: "onChange",
        defaultValues: { nombre: "", idioma: "es" },
    })

    // Categorías (para guardar recetas) y datos del plan (para el límite)
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

    const buscar = async (data) => {
        setErrorServidor("")
        setCargando(true)
        try {
            const lista = await buscarRecetasExternasService(data.nombre, data.idioma)
            setRecetas(lista)
            setBuscado(true)
        } catch (error) {
            setErrorServidor(obtenerMensajeError(error))
        } finally {
            setCargando(false)
        }
    }

    const sorprender = async () => {
        setErrorServidor("")
        setCargando(true)
        try {
            const receta = await obtenerRecetaAleatoriaService(getValues("idioma"))
            setRecetas([receta])
            setBuscado(true)
        } catch (error) {
            setErrorServidor(obtenerMensajeError(error))
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="container">
            <h1>Descubrir recetas</h1>
            <p className="nota">
                Buscá recetas de todo el mundo en TheMealDB. Por defecto se traducen al español con IA.
                La búsqueda funciona mejor con el nombre en inglés (por ejemplo: chicken, pasta, cake).
            </p>

            <form onSubmit={handleSubmit(buscar)} noValidate className="buscador">
                <div className="form-group">
                    <label htmlFor="nombre">Receta:</label>
                    <input {...register("nombre")} type="text" id="nombre" placeholder="Ej: pasta" />
                    <span className="error">{errors.nombre?.message}</span>
                </div>

                <div className="form-group">
                    <label htmlFor="idioma">Idioma:</label>
                    <select {...register("idioma")} id="idioma">
                        <option value="es">Español (traducida con IA)</option>
                        <option value="en">Inglés (original)</option>
                    </select>
                </div>

                <div className="receta-acciones">
                    <button type="submit" disabled={!isValid || cargando}>
                        {cargando ? "Buscando..." : "Buscar"}
                    </button>
                    <button type="button" className="btn-secundario" onClick={sorprender} disabled={cargando}>
                        🎲 Sorprendeme
                    </button>
                </div>
            </form>

            {cargando && <p className="nota">Buscando y traduciendo con IA, puede tardar unos segundos...</p>}

            {errorServidor && <p className="error-box">{errorServidor}</p>}

            {!cargando && buscado && recetas.length === 0 && !errorServidor && (
                <p>No se encontraron recetas. Probá con el nombre en inglés (por ejemplo: chicken, pasta, cake).</p>
            )}

            {recetas.length > 0 && (
                <div className="recetas-grid">
                    {recetas.map(receta => (
                        <RecetaExterna key={receta.idExterno} receta={receta} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Descubrir