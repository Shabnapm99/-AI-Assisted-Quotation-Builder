import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { axiosInstance } from '../axios/axiosInstance';
import { setAuthState } from '../features/userSlice';

function ProtectedRoutes() {
    const isLoggedIn = useSelector((state) => state.user.isLoggedin);
    const dispatch = useDispatch();

    useEffect(() => {
        const verifySession = async () => {
            try {
                const response = await axiosInstance.get('/auth/verify');
                if (response.status === 200 && response.data?.user) {
                    dispatch(setAuthState({
                        isLoggedin: true,
                        authUser: response.data.user
                    }));
                }
            } catch (error) {
                // 401 error is intercepted by axiosInstance to clear auth state and redirect
            }
        };

        if (isLoggedIn) {
            verifySession();
        }
    }, [isLoggedIn, dispatch]);

    return (
        isLoggedIn ? <Outlet /> : <Navigate to={'/'} replace />
    );
}

export default ProtectedRoutes;