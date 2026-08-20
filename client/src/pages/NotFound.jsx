import { useRouteError } from 'react-router-dom';

function NotFound() {
    const error = useRouteError();
    //this error variable will now have error status,status text, message etc.. we can pass this as the errorElement instead of  default error screen in React Router

    return (
        <div className='w-screen h-screen flex justify-center items-center bg-black/40'>
            <div className='flex flex-col items-center text-green-900'>
                <h1 className='font-extrabold text-3xl'>{error.status}</h1>
                <h2 className='text-2xl font-bold'>Oops!!!</h2>
                <p>Something went wrong</p>
                <p><i>{error.statusText}</i></p>
            </div>
        </div>
    )
}

export default NotFound