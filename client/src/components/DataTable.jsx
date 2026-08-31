import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setClientSearchQuery } from '../features/clientSlice';
import { FiSearch } from 'react-icons/fi';

function DataTable({ clients, searchQuery = '' }) {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    return (
        <div
            className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
            <div className="overflow-y-auto max-h-100">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10 bg-surface-container-low/90 backdrop-blur">
                        <tr className="bg-surface-container-low/50">
                            <th
                                className="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant/20">
                                Name</th>
                            <th
                                className="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant/20">
                                Company</th>
                            <th
                                className="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant/20">
                                Email</th>
                            <th
                                className="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant/20">
                                Phone</th>
                            <th
                                className="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant/20">
                                Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                        {
                            clients && clients.length > 0 ? (
                                clients.map((client) => {
                                    return (
                                        <tr key={client._id} className="hover:bg-surface-container-low/30 transition-colors group cursor-pointer"
                                            onClick={() => navigate(`/dashboard/clients/${client._id}`)}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-body-md font-semibold text-on-surface group-hover:text-secondary transition-colors">{client.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-body-md text-on-surface-variant">{client.company}
                                            </td>
                                            <td className="px-6 py-4 text-body-md text-on-surface-variant">{client.email}
                                            </td>
                                            <td className="px-6 py-4 text-body-md text-on-surface-variant">{client.phone || '—'}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                    active
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-sm text-on-surface-variant">
                                        {searchQuery.trim() ? (
                                            <div className="flex flex-col items-center justify-center gap-2 py-4">
                                                <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant">
                                                    <FiSearch size={20} />
                                                </div>
                                                <p className="text-base font-medium text-on-surface">No clients found</p>
                                                <p className="text-xs text-on-surface-variant max-w-sm">
                                                    We couldn&apos;t find any clients matching &quot;<span className="font-semibold text-on-surface">{searchQuery}</span>&quot;. Try checking for typos or searching with different terms.
                                                </p>
                                                <button
                                                    onClick={() => dispatch(setClientSearchQuery(''))}
                                                    className="mt-2 px-3 py-1.5 bg-secondary/10 hover:bg-secondary/20 text-secondary text-xs font-semibold rounded-lg transition-all cursor-pointer"
                                                >
                                                    Clear Search Filter
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="italic">No clients added yet</span>
                                        )}
                                    </td>
                                </tr>
                            )
                        }

                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DataTable;