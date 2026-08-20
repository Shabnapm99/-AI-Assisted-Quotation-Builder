import { IoSearch, IoNotificationsOutline } from "react-icons/io5";
import { LuSettings } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";
import { useSelector } from 'react-redux';

function Header() {

    const user = useSelector((state) => state.user.authUser);

    return (
        <header
            className="h-16 flex justify-between items-center px-12 w-full bg-surface border-b border-outline-variant/30 sticky top-0 z-40">
            <div className="flex items-center gap-6 grow">
                <div className="relative w-full max-w-md">
                    <span
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]"
                        data-icon="search"><IoSearch /></span>
                    <input
                        className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-[14px] focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-on-surface-variant/50"
                        placeholder="Search across clients..." type="text" />
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                    <button
                        className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors relative">
                        <span className="" data-icon="notifications"><IoNotificationsOutline size={20} /></span>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
                    </button>
                    <button
                        className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors">
                        <span className="" data-icon="settings"><LuSettings size={20} /></span>
                    </button>
                </div>
                <div className="h-8 w-px bg-outline-variant/30"></div>
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="text-right">
                        <p className="text-label-md font-semibold text-on-surface">{user?.email ? user.email.split('@')[0] : 'Admin'}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-outline-variant group-hover:ring-2 group-hover:ring-secondary/30 transition-all flex justify-center items-center">
                        <FaRegUser />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header