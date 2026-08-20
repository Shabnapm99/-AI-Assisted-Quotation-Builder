import { useNavigate } from 'react-router-dom';

function DataTable({ clients }) {

    const navigate = useNavigate();
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
                                                    <span className="text-body-md font-semibold text-on-surface">{client.name}</span>
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
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-sm text-on-surface-variant italic">
                                        No clients added yet
                                    </td>
                                </tr>
                            )
                        }

                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DataTable