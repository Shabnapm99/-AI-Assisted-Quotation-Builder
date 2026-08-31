import { useState } from 'react';
import { FiUserPlus, FiX } from "react-icons/fi";
import DataTable from '../components/DataTable';
import { useDispatch, useSelector } from 'react-redux';
import StatSection from '../components/StatSection';
import NewClient from './NewClient';
import { setIsEditing, setClientSearchQuery } from '../features/clientSlice';

function Clients() {

    const dispatch = useDispatch();
    const clients = useSelector((state) => state.client.clients || []);
    const searchQuery = useSelector((state) => state.client.searchQuery || '');
    const [showAddModal, setShowModal] = useState(false);

    // always reset editing state when modal closes
    const handleCloseModal = () => {
        dispatch(setIsEditing({
            boolean: false,
            id: null
        }));
        setShowModal(false);
    };

    const queryLower = searchQuery.trim().toLowerCase();
    const filteredClients = queryLower
        ? clients.filter((client) => {
            return (
                (client.name && client.name.toLowerCase().includes(queryLower)) ||
                (client.company && client.company.toLowerCase().includes(queryLower)) ||
                (client.email && client.email.toLowerCase().includes(queryLower)) ||
                (client.phone && client.phone.toLowerCase().includes(queryLower))
            );
        })
        : clients;

    return (
        <section className='grow overflow-y-auto p-8 bg-background'>
            <div className="max-w-container-max mx-auto space-y-8">
                <StatSection />

                {/* Page header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="font-[32px] text-[30px] text-on-surface tracking-tight">Client Directory</h2>
                            {searchQuery.trim() && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
                                    <span>Filtered: {filteredClients.length} of {clients.length}</span>
                                    <button
                                        onClick={() => dispatch(setClientSearchQuery(''))}
                                        className="hover:text-error transition-colors ml-1 cursor-pointer"
                                        title="Clear filter"
                                    >
                                        <FiX size={13} />
                                    </button>
                                </span>
                            )}
                        </div>
                        <p className="font-[16px] text-[16px] text-on-surface-variant mt-1">
                            Manage and monitor your enterprise client relationships.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="px-4 py-2.5 bg-secondary text-on-secondary font-[14px] text-[14px] rounded-lg flex items-center gap-2 
                            shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer" onClick={() => setShowModal(true)}>
                            <span className="text-[18px]" data-icon="person_add"><FiUserPlus /></span>
                            Add Client
                        </button>
                    </div>
                </div>
                <DataTable clients={filteredClients} searchQuery={searchQuery} />
            </div>

            {
                showAddModal && <NewClient onClose={handleCloseModal} />
            }

        </section>
    );
}

export default Clients;