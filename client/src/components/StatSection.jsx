import StatCard from './StatCard'
import { useSelector } from 'react-redux';

function StatSection() {
    const clients = useSelector((state)=>state.client.clients);
    const quotes = useSelector((state)=>state.quote.quotes);
    const pendingQuotes = quotes.filter((quote)=>quote.status === 'draft');
    const approvedQuotes = quotes.filter((quote)=>quote.status === 'approved');
    return (
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            <StatCard title={'Total clients'} count={clients.length} />
            <StatCard title={'Total quotes'} count={quotes.length} />
            <StatCard title={'Approved quotes'} count={approvedQuotes.length} />
            <StatCard title={'Pending quotes'} count={pendingQuotes.length} />
        </div>
    )
}

export default StatSection