import { useState } from "react"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { joiResolver } from "@hookform/resolvers/joi"
import { toast } from "react-toastify"
import { loguear } from "../features/user.slice"
import { registroSchema } from "../validators/auth.validators"
import { iniciarSesionService, registrarUsuarioService } from "../services/auth.service"
import { obtenerMensajeError } from "../utils/errores"

const Registro = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [errorServidor, setErrorServidor] = useState("")

    const {
        register,
        handleSubmit,
        getValues,
        trigger,
        formState: { errors, isValid },
    } = useForm({
        resolver: joiResolver(registroSchema),
        mode: "onChange",
        defaultValues: { username: "", email: "", password: "", repetirPassword: "" },
    })

    const registrarse = async (data) => {
        setErrorServidor("")
        setLoading(true)
        try {
            await registrarUsuarioService(data.username, data.email, data.password)
        } catch (error) {
            setErrorServidor(obtenerMensajeError(error))
            setLoading(false)
            return
        }

        try {
            const user = await iniciarSesionService(data.email, data.password)
            dispatch(loguear(user))
            toast.success("Cuenta creada. ¡Bienvenida/o!")
            navigate("/recetas")
        } catch (error) {
            toast.info("Cuenta creada. Iniciá sesión para continuar")
            navigate("/")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container auth-container">
            <header>
                <h1>🍳 Registro</h1>
            </header>

            <form onSubmit={handleSubmit(registrarse)} noValidate>
                <div className="form-group">
                    <label htmlFor="username">Usuario:</label>
                    <input {...register("username")} type="text" id="username" />
                    <span className="error">{errors.username?.message}</span>
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input {...register("email")} type="email" id="email" />
                    <span className="error">{errors.email?.message}</span>
                </div>

                <div className="form-group">
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        {...register("password", {
                            onChange: () => {
                                if (getValues("repetirPassword")) trigger("repetirPassword")
                            },
                        })}
                        type="password"
                        id="password"
                    />
                    <span className="error">{errors.password?.message}</span>
                </div>

                <div className="form-group">
                    <label htmlFor="repetirPassword">Repetir contraseña:</label>
                    <input {...register("repetirPassword")} type="password" id="repetirPassword" />
                    <span className="error">{errors.repetirPassword?.message}</span>
                </div>

                {errorServidor && <p className="error-box">{errorServidor}</p>}

                <button type="submit" disabled={!isValid || loading}>
                    {loading ? "Registrando..." : "Registrarse"}
                </button>
            </form>

            <p className="auth-link">
                ¿Ya tenés cuenta? <Link to="/">Ingresá acá</Link>
            </p>
        </div>
    )
}

export default Registro