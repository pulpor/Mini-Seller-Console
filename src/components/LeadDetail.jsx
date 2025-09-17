import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

function LeadDetail() {
  const { selectedLead, setSelectedLead, updateLead, convertToOpportunity } = useAppContext();
  const [editedLead, setEditedLead] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [opportunityData, setOpportunityData] = useState({
    amount: '',
    stage: 'Discovery'
  });
  const [isConverting, setIsConverting] = useState(false);
  const [conversionError, setConversionError] = useState(null);
  const [conversionSuccess, setConversionSuccess] = useState(false);

  if (!selectedLead) {
    return null;
  }

  // Initialize edited lead data if not yet set
  if (selectedLead && !editedLead) {
    setEditedLead({ ...selectedLead });
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedLead({
      ...editedLead,
      [name]: value
    });

    // Clear validation error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleOpportunityChange = (e) => {
    const { name, value } = e.target;
    setOpportunityData({
      ...opportunityData,
      [name]: value
    });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSave = async () => {
    const newErrors = {};

    // Validate email
    if (!validateEmail(editedLead.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    const result = await updateLead(editedLead.id, {
      email: editedLead.email,
      status: editedLead.status
    });

    setIsSaving(false);
    
    if (result.success) {
      setIsEditing(false);
    } else {
      setErrors({ submit: result.error });
    }
  };

  const handleConvert = async () => {
    if (selectedLead.status === 'Converted') {
      setConversionError('This lead has already been converted');
      return;
    }

    setIsConverting(true);
    setConversionError(null);

    const result = await convertToOpportunity(selectedLead.id, {
      name: selectedLead.name,
      accountName: selectedLead.company,
      amount: opportunityData.amount ? parseFloat(opportunityData.amount) : null,
      stage: opportunityData.stage
    });

    setIsConverting(false);

    if (result.success) {
      setConversionSuccess(true);
      // Reset opportunity data
      setOpportunityData({
        amount: '',
        stage: 'Discovery'
      });
      
      // Auto-close the panel after a delay
      setTimeout(() => {
        setConversionSuccess(false);
        setSelectedLead(null);
      }, 1500);
    } else {
      setConversionError(result.error);
    }
  };

  const closePanel = () => {
    setSelectedLead(null);
    setEditedLead(null);
    setIsEditing(false);
    setErrors({});
    setOpportunityData({
      amount: '',
      stage: 'Discovery'
    });
    setConversionSuccess(false);
    setConversionError(null);
  };

  const statusOptions = ['New', 'Contacted', 'Qualified', 'Converted'];
  const stageOptions = ['Discovery', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

  return (
    <div className="fixed inset-0 overflow-hidden z-10" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          onClick={closePanel}
        ></div>
        
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
          <div className="pointer-events-auto w-screen max-w-md slide-in">
            <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
              <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
                <div className="px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium text-gray-900" id="slide-over-title">
                      Lead Details
                    </h2>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        onClick={closePanel}
                      >
                        <span className="sr-only">Close panel</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex-1">
                  {/* Lead information */}
                  <div className="px-4 sm:px-6">
                    {conversionSuccess ? (
                      <div className="rounded-md bg-green-50 p-4 mb-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-green-800">
                              Lead successfully converted to Opportunity!
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="pb-6 pt-4">
                          <div className="flex items-center">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-gray-900">
                                {selectedLead.name}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                {selectedLead.company}
                              </p>
                            </div>
                            {/* Score indicator */}
                            <div className="ml-4 flex-shrink-0 bg-gray-100 rounded-full p-2">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{selectedLead.score}</div>
                                <div className="text-xs text-gray-500">Score</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 border-t border-gray-200 pt-4">
                            <dl className="divide-y divide-gray-200">
                              <div className="py-3 grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500">ID</dt>
                                <dd className="text-sm text-gray-900 col-span-2">{selectedLead.id}</dd>
                              </div>
                              <div className="py-3 grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500">Source</dt>
                                <dd className="text-sm text-gray-900 col-span-2">{selectedLead.source}</dd>
                              </div>
                              <div className="py-3 grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500">Email</dt>
                                <dd className="text-sm text-gray-900 col-span-2">
                                  {isEditing ? (
                                    <div>
                                      <input
                                        type="email"
                                        name="email"
                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                          errors.email ? 'border-red-300' : ''
                                        }`}
                                        value={editedLead.email}
                                        onChange={handleInputChange}
                                      />
                                      {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                      )}
                                    </div>
                                  ) : (
                                    selectedLead.email
                                  )}
                                </dd>
                              </div>
                              <div className="py-3 grid grid-cols-3 gap-4">
                                <dt className="text-sm font-medium text-gray-500">Status</dt>
                                <dd className="text-sm text-gray-900 col-span-2">
                                  {isEditing ? (
                                    <select
                                      name="status"
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                      value={editedLead.status}
                                      onChange={handleInputChange}
                                    >
                                      {statusOptions.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                      ))}
                                    </select>
                                  ) : (
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                      ${selectedLead.status === 'New' && 'bg-blue-100 text-blue-800'}
                                      ${selectedLead.status === 'Contacted' && 'bg-yellow-100 text-yellow-800'}
                                      ${selectedLead.status === 'Qualified' && 'bg-green-100 text-green-800'}
                                      ${selectedLead.status === 'Converted' && 'bg-purple-100 text-purple-800'}
                                    `}>
                                      {selectedLead.status}
                                    </span>
                                  )}
                                </dd>
                              </div>
                            </dl>
                          </div>
                          
                          {/* Edit Actions */}
                          <div className="mt-4 flex justify-end space-x-3">
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                  onClick={() => {
                                    setIsEditing(false);
                                    setEditedLead({ ...selectedLead });
                                    setErrors({});
                                  }}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                  onClick={handleSave}
                                  disabled={isSaving}
                                >
                                  {isSaving ? 'Saving...' : 'Save'}
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={() => setIsEditing(true)}
                              >
                                Edit
                              </button>
                            )}
                          </div>
                          
                          {errors.submit && (
                            <div className="mt-2 rounded-md bg-red-50 p-2">
                              <p className="text-sm text-red-700">{errors.submit}</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Convert to Opportunity Section */}
                        {selectedLead.status !== 'Converted' && (
                          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Convert to Opportunity</h3>
                            <div className="mt-2 max-w-xl text-sm text-gray-500">
                              <p>Create a new opportunity from this lead.</p>
                            </div>
                            
                            <form className="mt-4 space-y-4">
                              <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                                  Amount (Optional)
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">$</span>
                                  </div>
                                  <input
                                    type="number"
                                    name="amount"
                                    id="amount"
                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                                    placeholder="0.00"
                                    value={opportunityData.amount}
                                    onChange={handleOpportunityChange}
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <label htmlFor="stage" className="block text-sm font-medium text-gray-700">
                                  Stage
                                </label>
                                <select
                                  id="stage"
                                  name="stage"
                                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                  value={opportunityData.stage}
                                  onChange={handleOpportunityChange}
                                >
                                  {stageOptions.map(stage => (
                                    <option key={stage} value={stage}>{stage}</option>
                                  ))}
                                </select>
                              </div>
                              
                              {conversionError && (
                                <div className="rounded-md bg-red-50 p-4">
                                  <div className="flex">
                                    <div className="ml-3">
                                      <p className="text-sm font-medium text-red-800">
                                        {conversionError}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              <div className="pt-2">
                                <button
                                  type="button"
                                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                  onClick={handleConvert}
                                  disabled={isConverting}
                                >
                                  {isConverting ? 'Converting...' : 'Convert to Opportunity'}
                                </button>
                              </div>
                            </form>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeadDetail;
