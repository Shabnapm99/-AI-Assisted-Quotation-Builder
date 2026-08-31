import { useState, useEffect, useRef } from 'react';
import { IoSearch, IoClose, IoNotificationsOutline } from "react-icons/io5";
import { LuSettings } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { MdDescription } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { setClientSearchQuery } from '../features/clientSlice';
import { setQuoteSearchQuery } from '../features/quotationSlice';

function Header() {
    const user = useSelector((state) => state.user.authUser);
    const clients = useSelector((state) => state.client.clients || []);
    const quotes = useSelector((state) => state.quote.quotes || []);
    const clientSearchQuery = useSelector((state) => state.client.searchQuery || '');
    const quoteSearchQuery = useSelector((state) => state.quote.searchQuery || '');

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [localQuery, setLocalQuery] = useState('');
    const searchContainerRef = useRef(null);

    const isClientsPage = location.pathname === '/dashboard/clients';
    const isQuotesPage = location.pathname === '/dashboard/quotes';

    // Sync input with page-specific redux search queries
    useEffect(() => {
        if (isClientsPage) {
            setLocalQuery(clientSearchQuery);
        } else if (isQuotesPage) {
            setLocalQuery(quoteSearchQuery);
        } else {
            setLocalQuery('');
        }
    }, [location.pathname, clientSearchQuery, quoteSearchQuery, isClientsPage, isQuotesPage]);

    // Handle outside click to close the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setLocalQuery(val);
        setIsDropdownOpen(val.trim().length > 0);

        if (isClientsPage) {
            dispatch(setClientSearchQuery(val));
        } else if (isQuotesPage) {
            dispatch(setQuoteSearchQuery(val));
        } else {
            dispatch(setClientSearchQuery(val));
            dispatch(setQuoteSearchQuery(val));
        }
    };

    const handleClearSearch = () => {
        setLocalQuery('');
        dispatch(setClientSearchQuery(''));
        dispatch(setQuoteSearchQuery(''));
        setIsDropdownOpen(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setIsDropdownOpen(false);
        }
    };

    // Filtered data for quick dropdown preview
    const queryLower = localQuery.trim().toLowerCase();
    const matchedClients = queryLower
        ? clients.filter(c =>
            (c.name && c.name.toLowerCase().includes(queryLower)) ||
            (c.company && c.company.toLowerCase().includes(queryLower)) ||
            (c.email && c.email.toLowerCase().includes(queryLower)) ||
            (c.phone && c.phone.toLowerCase().includes(queryLower))
        )
        : [];

    const matchedQuotes = queryLower
        ? quotes.filter(q =>
            (q.title && q.title.toLowerCase().includes(queryLower)) ||
            (q.client?.name && q.client.name.toLowerCase().includes(queryLower)) ||
            (q.client?.company && q.client.company.toLowerCase().includes(queryLower)) ||
            (q.status && q.status.toLowerCase().includes(queryLower)) ||
            (q.total_amount && String(q.total_amount).includes(queryLower))
        )
        : [];

    // Dynamic placeholder
    let placeholderText = "Search clients & quotations...";
    if (isClientsPage) {
        placeholderText = "Search clients by name, company, email, phone...";
    } else if (isQuotesPage) {
        placeholderText = "Search quotations by title, client, status...";
    }

    const handleNavigateClient = (clientId) => {
        setIsDropdownOpen(false);
        navigate(`/dashboard/clients/${clientId}`);
    };

    const handleNavigateQuote = (quoteId) => {
        setIsDropdownOpen(false);
        navigate(`/dashboard/quotes/${quoteId}`);
    };

    const handleViewAllClients = () => {
        dispatch(setClientSearchQuery(localQuery));
        setIsDropdownOpen(false);
        navigate('/dashboard/clients');
    };

    const handleViewAllQuotes = () => {
        dispatch(setQuoteSearchQuery(localQuery));
        setIsDropdownOpen(false);
        navigate('/dashboard/quotes');
    };

    return (
        <header
            className="h-16 flex justify-between items-center px-12 w-full bg-surface border-b border-outline-variant/30 sticky top-0 z-40">
            <div className="flex items-center gap-6 grow" ref={searchContainerRef}>
                <div className="relative w-full max-w-md">
                    <span
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]"
                        data-icon="search">
                        <IoSearch />
                    </span>
                    <input
                        className="w-full bg-surface-container-low border border-transparent focus:border-secondary/30 rounded-full py-2 pl-10 pr-10 text-[14px] text-on-surface focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-on-surface-variant/50 focus:bg-surface outline-none"
                        placeholder={placeholderText}
                        type="text"
                        value={localQuery}
                        onChange={handleSearchChange}
                        onFocus={() => {
                            if (localQuery.trim().length > 0) setIsDropdownOpen(true);
                        }}
                        onKeyDown={handleKeyDown}
                    />
                    {localQuery.length > 0 && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container-high transition-colors"
                            title="Clear search"
                        >
                            <IoClose size={18} />
                        </button>
                    )}

                    {/* Quick Search Results Dropdown */}
                    {isDropdownOpen && localQuery.trim().length > 0 && (
                        <div className="absolute left-0 right-0 top-full mt-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xl z-50 overflow-hidden max-h-96 overflow-y-auto">
                            {matchedClients.length === 0 && matchedQuotes.length === 0 ? (
                                <div className="p-4 text-center text-sm text-on-surface-variant">
                                    No clients or quotations matching &quot;<span className="font-semibold text-on-surface">{localQuery}</span>&quot;
                                </div>
                            ) : (
                                <div className="divide-y divide-outline-variant/15">
                                    {/* Clients Section */}
                                    {matchedClients.length > 0 && (
                                        <div className="p-2">
                                            <div className="flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                                                <div className="flex items-center gap-1.5">
                                                    <HiUserGroup size={14} className="text-secondary" />
                                                    <span>Clients ({matchedClients.length})</span>
                                                </div>
                                                {matchedClients.length > 3 && !isClientsPage && (
                                                    <button
                                                        onClick={handleViewAllClients}
                                                        className="text-xs text-secondary hover:underline cursor-pointer lowercase"
                                                    >
                                                        view all
                                                    </button>
                                                )}
                                            </div>
                                            <div className="space-y-0.5">
                                                {matchedClients.slice(0, 3).map(client => (
                                                    <button
                                                        key={client._id}
                                                        onClick={() => handleNavigateClient(client._id)}
                                                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-container-low/60 flex items-center justify-between group transition-colors cursor-pointer"
                                                    >
                                                        <div>
                                                            <p className="text-sm font-medium text-on-surface group-hover:text-secondary">
                                                                {client.name}
                                                            </p>
                                                            <p className="text-xs text-on-surface-variant">
                                                                {client.company} • {client.email}
                                                            </p>
                                                        </div>
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                                                            Active
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Quotes Section */}
                                    {matchedQuotes.length > 0 && (
                                        <div className="p-2">
                                            <div className="flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                                                <div className="flex items-center gap-1.5">
                                                    <MdDescription size={14} className="text-secondary" />
                                                    <span>Quotations ({matchedQuotes.length})</span>
                                                </div>
                                                {matchedQuotes.length > 3 && !isQuotesPage && (
                                                    <button
                                                        onClick={handleViewAllQuotes}
                                                        className="text-xs text-secondary hover:underline cursor-pointer lowercase"
                                                    >
                                                        view all
                                                    </button>
                                                )}
                                            </div>
                                            <div className="space-y-0.5">
                                                {matchedQuotes.slice(0, 3).map(quote => (
                                                    <button
                                                        key={quote._id}
                                                        onClick={() => handleNavigateQuote(quote._id)}
                                                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-container-low/60 flex items-center justify-between group transition-colors cursor-pointer"
                                                    >
                                                        <div>
                                                            <p className="text-sm font-medium text-on-surface group-hover:text-secondary">
                                                                {quote.title}
                                                            </p>
                                                            <p className="text-xs text-on-surface-variant">
                                                                Client: {quote.client?.company || quote.client?.name || '—'}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-xs font-semibold text-on-surface block">
                                                                {quote.total_amount ? `${quote.total_amount} BD` : '0 BD'}
                                                            </span>
                                                            <span className="text-[11px] capitalize text-on-surface-variant">
                                                                {quote.status}
                                                            </span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
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
    );
}

export default Header;