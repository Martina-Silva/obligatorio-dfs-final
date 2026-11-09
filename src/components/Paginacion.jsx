const Paginacion = ({ pagina, totalPaginas, onCambiar }) => {

    if (totalPaginas <= 1) return null

    return (
        <div className="paginacion">
            <button
                type="button"
                className="btn-secundario"
                onClick={() => onCambiar(pagina - 1)}
                disabled={pagina <= 1}
            >
                ← Anterior
            </button>

            <span>Página {pagina} de {totalPaginas}</span>

            <button
                type="button"
                className="btn-secundario"
                onClick={() => onCambiar(pagina + 1)}
                disabled={pagina >= totalPaginas}
            >
                Siguiente →
            </button>
        </div>
    )
}

export default Paginacion