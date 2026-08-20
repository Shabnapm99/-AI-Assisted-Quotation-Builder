import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { IoMdDownload } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { MdCorporateFare } from "react-icons/md";
import { IoCallOutline, IoPersonOutline } from "react-icons/io5";
import { MdOutlineMail } from "react-icons/md";
import { axiosInstance } from '../axios/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { clearCurrentQuote, removeQuote, setCurrentQuote, setIsEditing, updateQuoteInList } from '../features/quotationSlice';
import QuoteItemsTable from '../components/QuoteItemsTable';
import { toast } from 'react-toastify';
import { FiArrowLeft } from 'react-icons/fi';
import { useReactToPrint } from 'react-to-print';
import { useRef } from "react";

function QuotationDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const quote = useSelector((state) => state.quote.currentQuote);
    const [loading, setLoading] = useState(true);

    //Print logic
    const contentToPrint = useRef(null);

    const handlePrint = useReactToPrint({
        contentRef: contentToPrint
    });

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const res = await axiosInstance.get(`/quotations/${id}`);
                dispatch(setCurrentQuote(res?.data?.quote));
            } catch (err) {
                console.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuote();
        return () => {
            dispatch(clearCurrentQuote());
        };
    }, [id, dispatch]);

    if (loading) {
        return <div className="p-6 text-center text-on-surface-variant">Loading quotation...</div>;
    }

    if (!quote) {
        return <div className="p-6 text-error text-center" >Quotation not found</div>;
    }

    //Delete quote item
    const handleDelete = async (itemId) => {
        try {
            await axiosInstance.delete(`/quotations/${id}/items/${itemId}`);
            const res = await axiosInstance.get(`/quotations/${id}`);
            const updatedQuote = res?.data?.quote;
            if (updatedQuote) {
                dispatch(setCurrentQuote(updatedQuote));
                dispatch(updateQuoteInList(updatedQuote));
            }
            toast.success('Quotation item removed successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Could not complete deletion request');
            console.error(`Error occurred: ${error.message}`);
        }
    };

    //Delete Quotation
    const handleDeleteQuote = async () => {
        if (!window.confirm(`Are you sure you want to permanently delete this quotation?`)) {
            return;
        }
        try {
            let response = await axiosInstance.delete(`/quotations/${id}`);
            if (response.status === 200) {
                dispatch(removeQuote(id));
                toast.success('Quotation removed successfully');
                navigate('/dashboard/quotes');
            }
        } catch (error) {
            console.error(`Error occurred: ${error.message}`);
            toast.error(error.response?.data?.message || 'Could not complete deletion request');
        }
    };

    //Edit a quotation
    const handleEditQuote = async () => {
        try {
            navigate('/dashboard/newquote');
            dispatch(setIsEditing({
                boolean: true,
                id: id
            }));
        } catch (error) {
            console.error(`Error editing quotation: ${error.message}`);
            toast.error('Could not complete edit request');
        }
    };

    //Handle status change
    const handleStatusChange = async (newStatus) => {
        try {
            let res = await axiosInstance.put(`/quotations/${id}`, { status: newStatus });
            if (res.status === 200) {
                const updated = {
                    ...quote,
                    status: newStatus
                };
                dispatch(setCurrentQuote(updated));
                dispatch(updateQuoteInList(updated));
                toast.success('Status updated');
            }
        } catch (error) {
            console.error("Status update failed:", error.message);
            toast.error(`Status update failed: ${error.message}`);
        }
    };


    return (
        <main className="flex-1 ps-8 space-y-8 mx-auto w-full min-h-full" ref={contentToPrint}>
            {/* Back Button */}
            <div className='print:hidden'>
                <button
                    onClick={() => navigate('/dashboard/quotes')}
                    className="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-secondary transition-colors cursor-pointer"
                >
                    <FiArrowLeft size={16} />
                    Back to Directory
                </button>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4" >
                <div className="flex items-center gap-4">
                    <h2 className="font-semibold text-[28px] text-on-surface">
                        {quote.title}
                    </h2>
                    <select
                        value={quote.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="px-3 py-1 text-base border-b bg-gray-50 rounded-md  print:hidden"
                    >
                        <option value="draft">DRAFT</option>
                        <option value="sent">SENT</option>
                        <option value="approved">APPROVED</option>
                        <option value="rejected">REJECTED</option>
                    </select>
                </div>

                <div className="flex items-center gap-3 print:hidden">
                    <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-on-surface-variant 
                    hover:bg-surface-container-low transition-colors cursor-pointer"
                        onClick={handlePrint}>
                        <IoMdDownload /> Download </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-on-surface-variant 
                    hover:bg-surface-container-low transition-colors cursor-pointer"
                        onClick={handleEditQuote}>
                        <CiEdit /> Edit </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-on-surface text-on-primary rounded-lg hover:opacity-90 active:scale-95 
                    transition-all cursor-pointer"
                        onClick={handleDeleteQuote}>
                        <MdDeleteOutline /> Delete </button>
                </div>
            </div>

            {/* Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" >

                {/* LEFT */}
                <div className="lg:col-span-9">

                    <div className="rounded-xl border border-outline-variant/30 overflow-hidden px-2">

                        <div className="px-6 py-4">
                            <h3 className="text-lg font-semibold">Quotation Items</h3>
                        </div>
                        <QuoteItemsTable quoteItems={quote.items} handleDelete={handleDelete} handleEdit={handleEditQuote} />

                        <div className="p-6 flex justify-end font-bold text-on-surface">
                            Grand Total: BD {quote.total_amount}
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="lg:col-span-3 space-y-6 rounded-xl bg-surface-container-lowest">

                    <div className="p-6  ">
                        <h3 className="text-sm uppercase text-gray-500 mb-4">
                            Client Information
                        </h3>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                <MdCorporateFare />
                            </div>

                            <div className="font-semibold text-on-background">
                                {quote.client?.company}
                            </div>
                        </div>

                        <div className="space-y-3 text-sm text-on-background">
                            <div className="flex items-center gap-2">
                                <IoPersonOutline /> {quote.client?.name}
                            </div>

                            <div className="flex items-center gap-2">
                                <MdOutlineMail /> {quote.client?.email}
                            </div>

                            <div className="flex items-center gap-2">
                                <IoCallOutline /> {quote.client?.phone}
                            </div>
                        </div>
                    </div>

                    <div className="text-sm text-gray-500 p-6">
                        <div className="font-semibold">Created</div>
                        <div>{new Date(quote.createdAt).toLocaleString()}</div>
                    </div>

                </div>
            </div>
        </main>
    );
}

export default QuotationDetails;