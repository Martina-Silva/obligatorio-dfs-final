import { Link } from "react-router"

const RecetaResumen = ({ receta }) => {
    return (
        <article className="receta-card">
            {receta.imagenUrl && (
                <img src={receta.imagenUrl} alt={receta.titulo} className="receta-img" />
            )}

            <div className="receta-body">
                <h3>{receta.titulo}</h3>
                <p className="receta-meta">
                    {receta.categoria?.nombre} · ⏱ {receta.tiempoPreparacionMin} min
                </p>
                <p className="receta-meta">Por {receta.usuario?.username}</p>

                <Link className="btn-link" to={`/explorar/${receta._id}`}>
                    Ver detalle
                </Link>
            </div>
        </article>
    )
}

export default RecetaResumen