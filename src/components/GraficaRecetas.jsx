import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js"
import { Bar } from "react-chartjs-2"
import { obtenerEstadisticasService } from "../services/usuarios.service"

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

ChartJS.defaults.font.family = "'Lora', Georgia, serif"
ChartJS.defaults.color = "#4a3426"

const opciones = {
    responsive: true,
    plugins: {
        legend: { display: false },
        title: {
            display: true,
            text: "Recetas por categoría",
            font: { size: 16 },
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: { precision: 0 },
        },
    },
}

const GraficaRecetas = () => {

    const lista = useSelector(state => state.recetas.lista)
    const [stats, setStats] = useState(null)

    useEffect(() => {
        let cancelado = false

        const cargar = async () => {
            try {
                const datos = await obtenerEstadisticasService()
                if (!cancelado) setStats(datos)
            } catch (error) {
                if (!cancelado) setStats(null)
            }
        }
        cargar()

        return () => { cancelado = true }
    }, [lista])

    if (!stats) {
        return <p>Cargando gráfico...</p>
    }

    if (stats.total === 0) {
        return <p>Cargá tu primera receta para ver el gráfico.</p>
    }

    return (
        <div className="grafica-wrap">
            <Bar
                options={opciones}
                data={{
                    labels: stats.porCategoria.map(c => c.categoria),
                    datasets: [
                        {
                            label: "Recetas",
                            data: stats.porCategoria.map(c => c.cantidad),
                            backgroundColor: "rgba(184, 67, 47, 0.75)",
                            borderColor: "#98351f",
                            borderWidth: 1,
                            borderRadius: 4,
                        },
                    ],
                }}
            />
            <p className="grafica-info">
                Total: <strong>{stats.total}</strong> recetas · Tiempo promedio: <strong>{stats.tiempoPromedioMin} min</strong>
            </p>
        </div>
    )
}

export default GraficaRecetas