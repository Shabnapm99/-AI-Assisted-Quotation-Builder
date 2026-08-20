import StatSection from '../components/StatSection'
import { useSelector } from 'react-redux';
import QuotesTable from '../components/QuotesTable';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function Quotations() {

   const quotes = useSelector((state) => state.quote.quotes);
   let navigate = useNavigate();

   return (
     <section className='grow overflow-y-auto p-8 bg-background'>
            <div className="max-w-container-max mx-auto space-y-8">
                <StatSection/>

                {/* Page header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="font-[32px] text-[30px] text-on-surface tracking-tight">Quotations
                        </h2>
                        <p className="font-[16px] text-[16px] text-on-surface-variant mt-1">Manage and track your client proposals in one place.</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => navigate(`/dashboard/newquote`)}
                            className="px-4 py-2.5 bg-secondary text-on-secondary font-[14px] text-[14px] rounded-lg flex items-center gap-2 shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer">
                            <span className="text-[18px]" data-icon="person_add"><FiPlus size={16} /></span>
                            Add Quote
                        </button>
                    </div>
                </div>
                <QuotesTable quotes={quotes}/>
            </div>

        </section>
  )
}

export default Quotations