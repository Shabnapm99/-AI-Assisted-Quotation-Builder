import StatSection from '../components/StatSection';
import { useDispatch, useSelector } from 'react-redux';
import QuotesTable from '../components/QuotesTable';
import { FiPlus, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { setQuoteSearchQuery } from '../features/quotationSlice';

function Quotations() {

    const dispatch = useDispatch();
    const quotes = useSelector((state) => state.quote.quotes || []);
    const searchQuery = useSelector((state) => state.quote.searchQuery || '');
    const navigate = useNavigate();

    const queryLower = searchQuery.trim().toLowerCase();
    const filteredQuotes = queryLower
        ? quotes.filter((quote) => {
            const clientName = (quote?.client?.name || '').toLowerCase();
            const clientCompany = (quote?.client?.company || '').toLowerCase();
            const title = (quote?.title || '').toLowerCase();
            const status = (quote?.status || '').toLowerCase();
            const totalAmount = String(quote?.total_amount || '');

            return (
                title.includes(queryLower) ||
                clientName.includes(queryLower) ||
                clientCompany.includes(queryLower) ||
                status.includes(queryLower) ||
                totalAmount.includes(queryLower)
            );
        })
        : quotes;

    return (
        <section className='grow overflow-y-auto p-8 bg-background'>
            <div className="max-w-container-max mx-auto space-y-8">
                <StatSection />

                {/* Page header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="font-[32px] text-[30px] text-on-surface tracking-tight">Quotations</h2>
                            {searchQuery.trim() && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
                                    <span>Filtered: {filteredQuotes.length} of {quotes.length}</span>
                                    <button
                                        onClick={() => dispatch(setQuoteSearchQuery(''))}
                                        className="hover:text-error transition-colors ml-1 cursor-pointer"
                                        title="Clear filter"
                                    >
                                        <FiX size={13} />
                                    </button>
                                </span>
                            )}
                        </div>
                        <p className="font-[16px] text-[16px] text-on-surface-variant mt-1">
                            Manage and track your client proposals in one place.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => navigate(`/dashboard/newquote`)}
                            className="px-4 py-2.5 bg-secondary text-on-secondary font-[14px] text-[14px] rounded-lg flex items-center gap-2 shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer">
                            <span className="text-[18px]" data-icon="person_add"><FiPlus size={16} /></span>
                            Add Quote
                        </button>
                    </div>
                </div>
                <QuotesTable quotes={filteredQuotes} searchQuery={searchQuery} />
            </div>

        </section>
    );
}

export default Quotations;