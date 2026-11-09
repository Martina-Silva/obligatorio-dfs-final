import { useState } from "react"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { joiResolver } from "@hookform/resolvers/joi"
import { toast } from "react-toastify"
import { loguear } from "../features/user.slice"
import { loginSchema } from "../validators/auth.validators"
import { iniciarSesionService } from "../services/auth.service"
import { obtenerMensajeError } from "../utils/errores"

const Login = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [errorServidor, setErrorServidor] = useState("")

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        resolver: joiResolver(loginSchema),
        mode: "onChange",
        defaultValues: { email: "", password: "" },
    })

    const ingresar = async (data) => {
        setErrorServidor("")
        setLoading(true)
        try {
            const user = await iniciarSesionService(data.email, data.password)
            dispatch(loguear(user))
            toast.success("Ingreso exitoso")
            navigate("/recetas")
        } catch (error) {
            setErrorServidor(obtenerMensajeError(error))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container auth-container">
            <header>
                <h1>🍳 Iniciar sesión</h1>
            </header>

            <form onSubmit={handleSubmit(ingresar)} noValidate>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input {...register("email")} type="email" id="email" />
                    <span className="error">{errors.email?.message}</span>
                </div>

                <div className="form-group">
                    <label htmlFor="password">Contraseña:</label>
                    <input {...register("password")} type="password" id="password" />
                    <span className="error">{errors.password?.message}</span>
                </div>

                {errorServidor && <p className="error-box">{errorServidor}</p>}

                <button type="submit" disabled={!isValid || loading}>
                    {loading ? "Ingresando..." : "Ingresar"}
                </button>
            </form>

            <p className="auth-link">
                ¿No tenés cuenta? <Link to="/registro">Registrate acá</Link>
            </p>
        </div>
    )
}

export default Login