import { useNavigate } from 'react-router-dom';

function QuotesTable({ quotes }) {

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
                Client</th>
              <th
                className="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant/20">
                Title</th>
              <th
                className="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant/20">
                status</th>
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
              quotes.length > 0 ? (quotes.map((quote) => {
                return(

                <tr key={quote._id} className="hover:bg-surface-container-low/30 transition-colors group cursor-pointer"
                  onClick={() => navigate(`/dashboard/quotes/${quote._id}`)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-body-md font-semibold text-on-surface">{quote?.client?.company || quote?.client?.name || '—'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-body-md text-on-surface-variant">{quote?.title}
                  </td>
                  <td className="px-6 py-4 text-body-md text-on-surface-variant">
                    <span className="capitalize">{quote?.status}</span>
                  </td>
                  <td className="px-6 py-4 text-body-md text-on-surface-variant">{quote?.total_amount} BD</td>
                  <td className="px-6 py-4 text-body-md text-on-surface-variant">{new Date(quote.createdAt).toLocaleDateString()}</td>
                </tr>)
              })) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-sm text-on-surface-variant italic">
                    No quotes added yet
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

export default QuotesTable