import { Navigate, Outlet } from "react-router"

const ProtectedRoute = () => {

    const isAuth = localStorage.getItem("token") !== null;

    return isAuth ? <Outlet /> : <Navigate to="/" />
}

export default ProtectedRoute