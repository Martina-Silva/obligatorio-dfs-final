import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router"

// Solo deja pasar al usuario con rol ADMIN
const AdminRoute = () => {

    const user = useSelector(state => state.user.user)

    return user?.role === "ADMIN" ? <Outlet /> : <Navigate to="/recetas" />
}

export default AdminRoute