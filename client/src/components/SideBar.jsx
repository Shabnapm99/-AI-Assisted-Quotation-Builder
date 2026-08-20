import { NavLink, useNavigate } from 'react-router-dom'
import { HiUserGroup, HiX } from "react-icons/hi"
import { MdDescription } from "react-icons/md"
import { CgLogOut } from "react-icons/cg"
import { axiosInstance } from '../axios/axiosInstance'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { setAuthState } from '../features/userSlice';

function SideBar({ open, setOpen }) {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        let response = await axiosInstance.post('/auth/logout');
        if (response.status === 200) {
            console.log("user loggedout successfully")
            dispatch(setAuthState({
                isLoggedin: false,
                authUser: null
            }));
            toast.success("Logged out successfully");
            navigate('/')

        }
    }


    // Dynamic styling function for NavLinks
    const getLinkStyle = ({ isActive }) => {
        const baseClasses = "flex items-center gap-3 px-4 py-3 transition-all duration-150 text-[16px] font-medium"

        return isActive
            ? `${baseClasses} border-l-4 border-secondary text-on-secondary-container bg-secondary-container/10`
            : `${baseClasses} text-on-primary-container/70 hover:text-on-primary-container hover:bg-white/5 active:scale-95`
    }

    return (
        <aside className={`
            h-screen w-64 fixed left-0 top-0 bg-primary-container flex flex-col py-8 shadow-sm z-50
            transform transition-transform duration-300 ease-in-out
            md:translate-x-0 
            ${open ? 'translate-x-0' : '-translate-x-full'}
        `}>

            {/* Sidebar Header & Mobile Close Button */}
            <div className="px-6 mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-[24px] font-bold text-white">QuoteAI</h1>
                    <p className="text-on-primary-container text-[14px] opacity-60">Enterprise Edition</p>
                </div>

                {/* Close Button on Mobile */}
                <button
                    onClick={() => setOpen(false)}
                    className="md:hidden text-white/70 hover:text-white transition-colors"
                >
                    <HiX size={24} />
                </button>
            </div>

            {/* Navigation Links */}
            <nav className="grow">
                <ul className="space-y-1">
                    {/* Clients Link */}
                    <li>
                        <NavLink
                            to="/dashboard/clients"
                            className={getLinkStyle}
                            onClick={() => setOpen(false)} // Closes mobile drawer automatically on click
                        >
                            <HiUserGroup size={20} />
                            <span>Clients</span>
                        </NavLink>
                    </li>

                    {/* Quotations Link */}
                    <li>
                        <NavLink
                            to="/dashboard/quotes"
                            className={getLinkStyle}
                            onClick={() => setOpen(false)}
                        >
                            <MdDescription size={20} />
                            <span>Quotations</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>

            {/* Footer / Logout */}
            <div className="px-4 mt-auto">
                <button
                    className="w-full py-3 px-4 bg-secondary text-on-secondary rounded-lg font-bold text-[15px] flex items-center justify-center gap-4 hover:opacity-90 transition-all cursor-pointer"
                    onClick={handleLogout}>
                    <CgLogOut size={24} />
                    <span>Logout</span>
                </button>

                <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-3">
                    <img
                        alt="Company Logo"
                        className="w-8 h-8 rounded-full bg-surface-container-high"
                        src="/images/favicon-16x16.png"
                    />
                    <div className="flex flex-col">
                        <span className="text-on-primary-container text-[14px]">Acme Corp</span>
                        <span className="text-on-primary-container text-[10px] uppercase tracking-wider opacity-60">Premium</span>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default SideBar