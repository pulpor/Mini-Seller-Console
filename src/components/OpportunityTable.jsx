import { useAppContext } from '../context/AppContext';

function OpportunityTable() {
  const { opportunities } = useAppContext();

  if (opportunities.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No opportunities yet</h3>
          <p className="mt-1 text-sm text-gray-500">Convert leads to create new opportunities.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Opportunities</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {opportunities.length} {opportunities.length === 1 ? 'opportunity' : 'opportunities'} found
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {opportunities.map((opportunity) => (
              <tr key={opportunity.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{opportunity.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{opportunity.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{opportunity.accountName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                    ${opportunity.stage === 'Discovery' && 'bg-blue-100 text-blue-800'}
                    ${opportunity.stage === 'Qualification' && 'bg-indigo-100 text-indigo-800'}
                    ${opportunity.stage === 'Proposal' && 'bg-yellow-100 text-yellow-800'}
                    ${opportunity.stage === 'Negotiation' && 'bg-orange-100 text-orange-800'}
                    ${opportunity.stage === 'Closed Won' && 'bg-green-100 text-green-800'}
                    ${opportunity.stage === 'Closed Lost' && 'bg-red-100 text-red-800'}
                  `}>
                    {opportunity.stage}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {opportunity.amount ? `$${opportunity.amount.toLocaleString()}` : '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(opportunity.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OpportunityTable;
