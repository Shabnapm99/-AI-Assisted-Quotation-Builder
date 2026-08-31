import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setQuoteSearchQuery } from '../features/quotationSlice';
import { FiSearch } from 'react-icons/fi';

function QuotesTable({ quotes, searchQuery = '' }) {

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
                Client</th>
              <th
                className="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant/20">
                Title</th>
              <th
                className="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant/20">
                Status</th>
              <th
                className="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant/20">
                Total Amount</th>
              <th
                className="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant/20">
                Created date</th>

            </tr>
          </thead>
          <tbody>
            {
              quotes && quotes.length > 0 ? (quotes.map((quote) => {
                return (

                  <tr key={quote._id} className="hover:bg-surface-container-low/30 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/dashboard/quotes/${quote._id}`)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-body-md font-semibold text-on-surface group-hover:text-secondary transition-colors">{quote?.client?.company || quote?.client?.name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-body-md text-on-surface-variant">{quote?.title}
                    </td>
                    <td className="px-6 py-4 text-body-md text-on-surface-variant">
                      <span className="capitalize">{quote?.status}</span>
                    </td>
                    <td className="px-6 py-4 text-body-md text-on-surface-variant">{quote?.total_amount} BD</td>
                    <td className="px-6 py-4 text-body-md text-on-surface-variant">{new Date(quote.createdAt).toLocaleDateString()}</td>
                  </tr>);
              })) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-sm text-on-surface-variant">
                    {searchQuery.trim() ? (
                      <div className="flex flex-col items-center justify-center gap-2 py-4">
                        <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant">
                          <FiSearch size={20} />
                        </div>
                        <p className="text-base font-medium text-on-surface">No quotations found</p>
                        <p className="text-xs text-on-surface-variant max-w-sm">
                          We couldn&apos;t find any quotations matching &quot;<span className="font-semibold text-on-surface">{searchQuery}</span>&quot;. Try checking for typos or searching with different terms.
                        </p>
                        <button
                          onClick={() => dispatch(setQuoteSearchQuery(''))}
                          className="mt-2 px-3 py-1.5 bg-secondary/10 hover:bg-secondary/20 text-secondary text-xs font-semibold rounded-lg transition-all cursor-pointer"
                        >
                          Clear Search Filter
                        </button>
                      </div>
                    ) : (
                      <span className="italic">No quotes added yet</span>
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

export default QuotesTable;