import { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import { joiResolver } from "@hookform/resolvers/joi"
import { toast } from "react-toastify"
import { recetaSchema } from "../validators/receta.validators"
import { crearRecetaService, obtenerMisRecetasService, subirImagenService } from "../services/recetas.service"
import { obtenerPerfilService } from "../services/auth.service"
import { guardarRecetas } from "../features/recetas.slice"
import { actualizarUsuario } from "../features/user.slice"
import { obtenerMensajeError } from "../utils/errores"

const TIPOS_IMAGEN = ["image/jpeg", "image/png", "image/webp"]
const MAX_MB = 4

const RecetaForm = () => {

    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)
    const categorias = useSelector(state => state.recetas.categorias)
    const filtros = useSelector(state => state.recetas.filtros)

    const [loading, setLoading] = useState(false)
    const [errorServidor, setErrorServidor] = useState("")
    const [imagen, setImagen] = useState(null)
    const [errorImagen, setErrorImagen] = useState("")
    const inputImagen = useRef(null)

    // Plan PLUS: al llegar al límite no se pueden crear más recetas
    const limiteAlcanzado = user?.limiteRecetas != null && user.cantidadRecetas >= user.limiteRecetas

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm({
        resolver: joiResolver(recetaSchema),
        mode: "onChange",
        defaultValues: {
            titulo: "",
            ingredientes: "",
            instrucciones: "",
            tiempoPreparacionMin: "",
            categoria: "",
        },
    })

    const elegirImagen = (e) => {
        const archivo = e.target.files[0]
        setErrorImagen("")

        if (!archivo) {
            setImagen(null)
            return
        }
        if (!TIPOS_IMAGEN.includes(archivo.type)) {
            setErrorImagen("La imagen debe ser JPG, PNG o WEBP")
            setImagen(null)
            e.target.value = ""
            return
        }
        if (archivo.size > MAX_MB * 1024 * 1024) {
            setErrorImagen(`La imagen no puede pesar más de ${MAX_MB} MB`)
            setImagen(null)
            e.target.value = ""
            return
        }
        setImagen(archivo)
    }

    const crear = async (data) => {
        setErrorServidor("")
        setLoading(true)
        try {
            const receta = {
                titulo: data.titulo,
                // Un ingrediente por línea
                ingredientes: data.ingredientes.split("\n").map(i => i.trim()).filter(i => i !== ""),
                instrucciones: data.instrucciones,
                tiempoPreparacionMin: Number(data.tiempoPreparacionMin),
                categoria: data.categoria,
            }

            if (imagen) {
                receta.imagenUrl = await subirImagenService(imagen)
            }

            await crearRecetaService(receta)

            // Refrescamos la lista (respetando los filtros activos) y el uso del plan
            const [lista, perfil] = await Promise.all([
                obtenerMisRecetasService(filtros),
                obtenerPerfilService(),
            ])
            dispatch(guardarRecetas(lista))
            dispatch(actualizarUsuario(perfil))

            toast.success("Receta creada con su tip de IA")
            reset()
            setImagen(null)
            if (inputImagen.current) inputImagen.current.value = ""
        } catch (error) {
            setErrorServidor(obtenerMensajeError(error))
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(crear)} noValidate>

            {limiteAlcanzado && (
                <p className="aviso">
                    Llegaste al límite de {user.limiteRecetas} recetas del plan PLUS. Pasate a PREMIUM para crear más.
                </p>
            )}

            <div className="form-group">
                <label htmlFor="titulo">Título:</label>
                <input {...register("titulo")} type="text" id="titulo" />
                <span className="error">{errors.titulo?.message}</span>
            </div>

            <div className="form-group">
                <label htmlFor="categoria">Categoría:</label>
                <select {...register("categoria")} id="categoria">
                    <option value="">Elegí una categoría</option>
                    {categorias.map(c => (
                        <option key={c._id} value={c._id}>{c.nombre}</option>
                    ))}
                </select>
                <span className="error">{errors.categoria?.message}</span>
            </div>

            <div className="form-group">
                <label htmlFor="tiempoPreparacionMin">Tiempo de preparación (minutos):</label>
                <input {...register("tiempoPreparacionMin")} type="number" min="1" id="tiempoPreparacionMin" />
                <span className="error">{errors.tiempoPreparacionMin?.message}</span>
            </div>

            <div className="form-group">
                <label htmlFor="ingredientes">Ingredientes (uno por línea):</label>
                <textarea {...register("ingredientes")} id="ingredientes" rows="4" />
                <span className="error">{errors.ingredientes?.message}</span>
            </div>

            <div className="form-group">
                <label htmlFor="instrucciones">Instrucciones:</label>
                <textarea {...register("instrucciones")} id="instrucciones" rows="4" />
                <span className="error">{errors.instrucciones?.message}</span>
            </div>

            <div className="form-group">
                <label htmlFor="imagen">Imagen (opcional, JPG/PNG/WEBP hasta {MAX_MB} MB):</label>
                <input
                    type="file"
                    id="imagen"
                    accept="image/jpeg,image/png,image/webp"
                    ref={inputImagen}
                    onChange={elegirImagen}
                />
                <span className="error">{errorImagen}</span>
            </div>

            {errorServidor && <p className="error-box">{errorServidor}</p>}

            <button type="submit" disabled={!isValid || loading || limiteAlcanzado}>
                {loading ? "Creando receta (la IA está pensando un tip)..." : "Crear receta"}
            </button>
        </form>
    )
}

export default RecetaForm