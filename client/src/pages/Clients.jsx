import { useState } from 'react'
import { FiUserPlus } from "react-icons/fi";
import DataTable from '../components/DataTable';
import { useDispatch, useSelector } from 'react-redux';
import StatSection from '../components/StatSection';
import NewClient from './NewClient';
import { setIsEditing } from '../features/clientSlice';

function Clients() {

    const dispatch = useDispatch();
    const clients = useSelector((state) => state.client.clients);
    const [showAddModal, setShowModal] = useState(false);
    // always reset editing state when modal closes
    const handleCloseModal = () => {
        dispatch(setIsEditing({
            boolean: false,
            id: null
        }))
        setShowModal(false);
    };

    return (
        <section className='grow overflow-y-auto p-8 bg-background'>
            <div className="max-w-container-max mx-auto space-y-8">
                <StatSection />

                {/* Page header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="font-[32px] text-[30px] text-on-surface tracking-tight">Client Directory
                        </h2>
                        <p className="font-[16px] text-[16px] text-on-surface-variant mt-1">Manage and monitor your
                            enterprise client relationships.</p>
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
                <DataTable clients={clients} />
            </div>

            {
                showAddModal && <NewClient onClose={handleCloseModal} />
            }

        </section>


    )
}

export default Clients