import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

function ProtectedRoutes() {

    let isLoggedIn = useSelector((state)=>state.user.isLoggedin);
  return (
    isLoggedIn?<Outlet/>:<Navigate to={'/'}/>
  )
}

export default ProtectedRoutes