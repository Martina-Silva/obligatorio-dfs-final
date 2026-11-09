import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import { joiResolver } from "@hookform/resolvers/joi"
import { toast } from "react-toastify"
import { recetaSchema } from "../validators/receta.validators"
import { actualizarRecetaService, obtenerMisRecetasService } from "../services/recetas.service"
import { guardarRecetas } from "../features/recetas.slice"
import { obtenerMensajeError } from "../utils/errores"

const RecetaEditForm = ({ receta, onTerminar }) => {

    const dispatch = useDispatch()
    const categorias = useSelector(state => state.recetas.categorias)
    const filtros = useSelector(state => state.recetas.filtros)

    const [loading, setLoading] = useState(false)
    const [errorServidor, setErrorServidor] = useState("")

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isDirty },
    } = useForm({
        resolver: joiResolver(recetaSchema),
        mode: "onChange",
        defaultValues: {
            titulo: receta.titulo,
            ingredientes: receta.ingredientes.join("\n"),
            instrucciones: receta.instrucciones,
            tiempoPreparacionMin: receta.tiempoPreparacionMin,
            categoria: receta.categoria?._id || "",
        },
    })

    const guardar = async (data) => {
        setErrorServidor("")
        setLoading(true)
        try {
            await actualizarRecetaService(receta._id, {
                titulo: data.titulo,
                ingredientes: data.ingredientes.split("\n").map(i => i.trim()).filter(i => i !== ""),
                instrucciones: data.instrucciones,
                tiempoPreparacionMin: Number(data.tiempoPreparacionMin),
                categoria: data.categoria,
            })

            // Recargamos la lista respetando los filtros activos
            const lista = await obtenerMisRecetasService(filtros)
            dispatch(guardarRecetas(lista))

            toast.success("Receta actualizada")
            onTerminar()
        } catch (error) {
            setErrorServidor(obtenerMensajeError(error))
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(guardar)} noValidate className="edit-form">

            <div className="form-group">
                <label htmlFor={`titulo-${receta._id}`}>Título:</label>
                <input {...register("titulo")} type="text" id={`titulo-${receta._id}`} />
                <span className="error">{errors.titulo?.message}</span>
            </div>

            <div className="form-group">
                <label htmlFor={`categoria-${receta._id}`}>Categoría:</label>
                <select {...register("categoria")} id={`categoria-${receta._id}`}>
                    <option value="">Elegí una categoría</option>
                    {categorias.map(c => (
                        <option key={c._id} value={c._id}>{c.nombre}</option>
                    ))}
                </select>
                <span className="error">{errors.categoria?.message}</span>
            </div>

            <div className="form-group">
                <label htmlFor={`tiempo-${receta._id}`}>Tiempo (minutos):</label>
                <input {...register("tiempoPreparacionMin")} type="number" min="1" id={`tiempo-${receta._id}`} />
                <span className="error">{errors.tiempoPreparacionMin?.message}</span>
            </div>

            <div className="form-group">
                <label htmlFor={`ingredientes-${receta._id}`}>Ingredientes (uno por línea):</label>
                <textarea {...register("ingredientes")} id={`ingredientes-${receta._id}`} rows="4" />
                <span className="error">{errors.ingredientes?.message}</span>
            </div>

            <div className="form-group">
                <label htmlFor={`instrucciones-${receta._id}`}>Instrucciones:</label>
                <textarea {...register("instrucciones")} id={`instrucciones-${receta._id}`} rows="4" />
                <span className="error">{errors.instrucciones?.message}</span>
            </div>

            {errorServidor && <p className="error-box">{errorServidor}</p>}

            <div className="receta-acciones">
                <button type="submit" disabled={!isValid || !isDirty || loading}>
                    {loading ? "Guardando..." : "Guardar"}
                </button>
                <button type="button" className="btn-secundario" onClick={onTerminar} disabled={loading}>
                    Cancelar
                </button>
            </div>
        </form>
    )
}

export default RecetaEditForm