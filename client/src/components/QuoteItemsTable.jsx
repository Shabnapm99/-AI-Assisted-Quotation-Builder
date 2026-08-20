import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'

function QuoteItemsTable({ quoteItems, handleDelete, handleEdit }) {
    return (
        <div className="overflow-x-auto bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden mt-2 mb-2">
            <table className="w-full text-left text-on-surface">
                <thead className="bg-surface-container-low text-sm text-on-surface-variant">
                    <tr>
                        <th className="px-6 py-3">Description</th>
                        <th className="px-6 py-3 text-center">Quantity</th>
                        <th className="px-6 py-3 text-right">Unit Price</th>
                        <th className="px-6 py-3 text-right">Total</th>
                        <th
                            className="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant/20 text-right print:hidden">
                            Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {quoteItems?.map((item) => (
                        <tr key={item._id} className="border-t border-gray-300 hover:bg-surface-container-low/30 cursor-pointer">
                            <td className="px-6 py-4">
                                <div className="font-semibold">{item.title}</div>
                                <div className="text-sm text-gray-500">{item.description}</div>
                            </td>
                            <td className="px-6 py-4 text-center">{item.quantity}</td>
                            <td className="px-6 py-4 text-right">{item.unit_price != null ? `${item.unit_price} BD` : '—'}</td>
                            <td className="px-6 py-4 text-right font-medium">
                                {item.total != null ? `${item.total} BD` : '0 BD'}
                            </td>

                            <td className="px-6 py-4 text-right print:hidden">

                                <button
                                    className="p-1.5 text-on-surface-variant hover:text-secondary hover:bg-secondary/10 rounded transition-all"
                                    title="Edit"
                                    onClick={() => handleEdit(item._id)}>
                                    <span className="text-[20px]"
                                        data-icon="edit"><FaEdit /></span>
                                </button>
                                <button
                                    className="p-1.5 text-error/80  hover:bg-error/10 rounded transition-all"
                                    title="Delete"
                                    onClick={() => handleDelete(item._id)}>
                                    <span className=" text-[20px]"
                                        data-icon="delete"><MdDelete /></span>
                                </button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default QuoteItemsTable