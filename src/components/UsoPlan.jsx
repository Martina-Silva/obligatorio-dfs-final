import { useSelector } from "react-redux"

const UsoPlan = () => {

    const user = useSelector(state => state.user.user)

    if (!user) return null

    const esPlus = user.plan === "PLUS"
    const cantidad = user.cantidadRecetas ?? 0
    const porcentaje = user.porcentajeUso ?? 0

    let nivel = ""
    if (porcentaje >= 100) nivel = "llena"
    else if (porcentaje >= 75) nivel = "alerta"

    return (
        <div className="uso-plan">
            <h3>
                Uso del plan <span className="plan-badge">{user.plan}</span>
            </h3>

            {esPlus ? (
                <>
                    <p>
                        Usaste <strong>{cantidad}</strong> de <strong>{user.limiteRecetas}</strong> recetas ({porcentaje}%)
                    </p>
                    <div
                        className="barra"
                        role="progressbar"
                        aria-valuenow={porcentaje}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    >
                        <div className={`barra-relleno ${nivel}`} style={{ width: `${porcentaje}%` }} />
                    </div>
                </>
            ) : (
                <p>
                    Tenés <strong>{cantidad}</strong> recetas creadas. Con PREMIUM no hay límite. 🎉
                </p>
            )}
        </div>
    )
}

export default UsoPlan