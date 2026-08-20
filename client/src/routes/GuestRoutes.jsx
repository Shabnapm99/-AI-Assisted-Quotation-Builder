import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function GuestRoutes() {
    let isLoggedIn = useSelector((state) => state.user.isLoggedin);
    return (
        isLoggedIn ? <Navigate to={'/dashboard'} replace /> : <Outlet />
    )
}

export default GuestRoutes