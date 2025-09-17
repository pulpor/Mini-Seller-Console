import { useState } from 'react';
import LeadList from './components/LeadList';
import LeadDetail from './components/LeadDetail';
import OpportunityTable from './components/OpportunityTable';
import { useAppContext } from './context/AppContext';

function App() {
  const { opportunities } = useAppContext();
  const [activeTab, setActiveTab] = useState('leads');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Mini Seller Console</h1>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('leads')}
              className={`${
                activeTab === 'leads'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            >
              Leads
            </button>
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`${
                activeTab === 'opportunities'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              Opportunities
              {opportunities.length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {opportunities.length}
                </span>
              )}
            </button>
          </nav>
        </div>
        
        {/* Content */}
        <div className="mt-4">
          {activeTab === 'leads' ? <LeadList /> : <OpportunityTable />}
        </div>
      </div>
      
      {/* Lead Detail Panel (appears when a lead is selected) */}
      <LeadDetail />
    </div>
  );
}

export default App;
