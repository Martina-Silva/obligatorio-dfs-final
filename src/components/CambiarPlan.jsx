import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { cambiarPlanService } from "../services/usuarios.service"
import { obtenerPerfilService } from "../services/auth.service"
import { actualizarUsuario } from "../features/user.slice"
import { obtenerMensajeError } from "../utils/errores"

const CambiarPlan = () => {

    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)
    const [loading, setLoading] = useState(false)

    // Solo se muestra a los usuarios del plan PLUS
    if (!user || user.plan !== "PLUS") return null

    const cambiar = async () => {
        if (!window.confirm("¿Querés pasar al plan PREMIUM? Vas a poder crear recetas ilimitadas.")) return

        setLoading(true)
        try {
            await cambiarPlanService()
            const perfil = await obtenerPerfilService()
            dispatch(actualizarUsuario(perfil))
            toast.success("¡Ahora sos PREMIUM!")
        } catch (error) {
            toast.error(obtenerMensajeError(error))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="cambiar-plan">
            <h3>Pasate a PREMIUM</h3>
            <p>El plan PLUS permite hasta {user.limiteRecetas} recetas. Con PREMIUM podés crear todas las que quieras.</p>
            <button onClick={cambiar} disabled={loading}>
                {loading ? "Cambiando plan..." : "Pasar a PREMIUM"}
            </button>
        </div>
    )
}

export default CambiarPlan