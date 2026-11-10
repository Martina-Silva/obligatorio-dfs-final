import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import { joiResolver } from "@hookform/resolvers/joi"
import { toast } from "react-toastify"
import { categoriaSchema } from "../validators/categoria.validators"
import {
    actualizarCategoriaService,
    crearCategoriaService,
    eliminarCategoriaService,
    obtenerCategoriaPorIdService,
} from "../services/categorias.service"
import { obtenerCategoriasService } from "../services/recetas.service"
import { guardarCategorias } from "../features/recetas.slice"
import { obtenerMensajeError } from "../utils/errores"

const VACIO = { nombre: "", descripcion: "" }

const AdminCategorias = () => {

    const dispatch = useDispatch()
    const categorias = useSelector(state => state.recetas.categorias)

    const [editandoId, setEditandoId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [errorServidor, setErrorServidor] = useState("")

    const {
        register,
        handleSubmit,
        reset,
        setFocus,
        formState: { errors, isValid, isDirty },
    } = useForm({
        resolver: joiResolver(categoriaSchema),
        mode: "onChange",
        defaultValues: VACIO,
    })

    const refrescar = async () => {
        const lista = await obtenerCategoriasService()
        dispatch(guardarCategorias(lista))
    }

    useEffect(() => {
        const cargar = async () => {
            try {
                await refrescar()
            } catch (error) {
                toast.error(obtenerMensajeError(error))
            }
        }
        cargar()
    }, [])

    const cancelar = () => {
        setEditandoId(null)
        setErrorServidor("")
        reset(VACIO)
    }

    const iniciarEdicion = async (id) => {
        try {
            const categoria = await obtenerCategoriaPorIdService(id)
            reset({ nombre: categoria.nombre, descripcion: categoria.descripcion || "" })
            setEditandoId(id)
            setErrorServidor("")

            window.scrollTo({ top: 0, behavior: "smooth" })
            setFocus("nombre")
        } catch (error) {
            toast.error(obtenerMensajeError(error))
        }
    }

    const guardar = async (data) => {
        setErrorServidor("")
        setLoading(true)
        try {
            if (editandoId) {
                await actualizarCategoriaService(editandoId, data)
                toast.success("Categoría actualizada")
            } else {
                await crearCategoriaService(data)
                toast.success("Categoría creada")
            }
            await refrescar()
            cancelar()
        } catch (error) {
            setErrorServidor(obtenerMensajeError(error))
        } finally {
            setLoading(false)
        }
    }

    const eliminar = async (categoria) => {
        if (!window.confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) return

        try {
            await eliminarCategoriaService(categoria._id)
            await refrescar()
            if (editandoId === categoria._id) cancelar()
            toast.success("Categoría eliminada")
        } catch (error) {
            toast.error(obtenerMensajeError(error))
        }
    }

    return (
        <>
            <div className="container">
                <h1>{editandoId ? "Editar categoría" : "Nueva categoría"}</h1>

                <form onSubmit={handleSubmit(guardar)} noValidate>
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre:</label>
                        <input {...register("nombre")} type="text" id="nombre" />
                        <span className="error">{errors.nombre?.message}</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="descripcion">Descripción (opcional):</label>
                        <input {...register("descripcion")} type="text" id="descripcion" />
                        <span className="error">{errors.descripcion?.message}</span>
                    </div>

                    {errorServidor && <p className="error-box">{errorServidor}</p>}

                    <div className="receta-acciones">
                        <button
                            type="submit"
                            disabled={!isValid || loading || (editandoId !== null && !isDirty)}
                        >
                            {loading ? "Guardando..." : editandoId ? "Guardar cambios" : "Crear categoría"}
                        </button>
                        {editandoId && (
                            <button type="button" className="btn-secundario" onClick={cancelar} disabled={loading}>
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="container">
                <h2>Categorías</h2>

                {categorias.length === 0 ? (
                    <p>Todavía no hay categorías.</p>
                ) : (
                    <ul className="lista-categorias">
                        {categorias.map(categoria => (
                            <li key={categoria._id} className="categoria-item">
                                <div>
                                    <strong>{categoria.nombre}</strong>
                                    {categoria.descripcion && (
                                        <p className="categoria-desc">{categoria.descripcion}</p>
                                    )}
                                </div>
                                <div className="receta-acciones">
                                    <button className="btn-editar" onClick={() => iniciarEdicion(categoria._id)}>
                                        Editar
                                    </button>
                                    <button className="btn-eliminar" onClick={() => eliminar(categoria)}>
                                        Eliminar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    )
}

export default AdminCategorias