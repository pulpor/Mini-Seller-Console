import { createContext, useState, useEffect, useContext } from 'react';
import leadsData from '../data/leads.json';

const AppContext = createContext();

export function AppProvider({ children }) {
  // State management
  const [leads, setLeads] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search, filter, sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Load leads with simulated delay
  useEffect(() => {
    const fetchLeads = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setLeads(leadsData);
      } catch (err) {
        setError('Failed to load leads. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeads();
  }, []);
  
  // Load filter/sort preferences from localStorage
  useEffect(() => {
    const savedFilters = localStorage.getItem('sellerConsoleFilters');
    if (savedFilters) {
      const { search, status, sort } = JSON.parse(savedFilters);
      setSearchTerm(search || '');
      setStatusFilter(status || 'All');
      setSortDirection(sort || 'desc');
    }
  }, []);
  
  // Save filter/sort preferences to localStorage
  useEffect(() => {
    localStorage.setItem('sellerConsoleFilters', JSON.stringify({
      search: searchTerm,
      status: statusFilter,
      sort: sortDirection
    }));
  }, [searchTerm, statusFilter, sortDirection]);
  
  // Filtered and sorted leads
  const filteredLeads = leads.filter(lead => {
    // Search filter (name or company)
    const matchesSearch = searchTerm === '' || 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Status filter
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    // Sort by score
    return sortDirection === 'desc' ? b.score - a.score : a.score - b.score;
  });
  
  // Update lead information with optimistic updates
  const updateLead = async (id, updates) => {
    let originalLeads = null;
    let originalSelectedLead = null;
    
    // Capture original state and apply optimistic update
    setLeads(currentLeads => {
      originalLeads = currentLeads; // Store for potential rollback
      return currentLeads.map(lead => 
        lead.id === id ? { ...lead, ...updates } : lead
      );
    });
    
    if (selectedLead && selectedLead.id === id) {
      originalSelectedLead = selectedLead;
      setSelectedLead(prev => ({ ...prev, ...updates }));
    }
    
    try {
      // Simulate API call with potential failure
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate 20% failure rate for demonstration
          if (Math.random() < 0.2) {
            reject(new Error('Simulated server error'));
          } else {
            resolve();
          }
        }, 500);
      });
      
      return { success: true };
    } catch (err) {
      // Rollback optimistic update on failure
      if (originalLeads) {
        setLeads(originalLeads);
      }
      if (originalSelectedLead && originalSelectedLead.id === id) {
        setSelectedLead(originalSelectedLead);
      }
      
      console.error(err);
      return { 
        success: false, 
        error: 'Failed to update lead. Changes have been reverted.' 
      };
    }
  };
  
  // Convert lead to opportunity with optimistic updates
  const convertToOpportunity = async (leadId, opportunityData) => {
    let originalLeads = null;
    let originalOpportunities = null;
    let originalSelectedLead = null;
    
    // Create new opportunity optimistically
    const newOpportunity = {
      id: `OPP-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      ...opportunityData
    };
    
    // Apply optimistic updates
    setOpportunities(prev => {
      originalOpportunities = prev; // Store for potential rollback
      return [...prev, newOpportunity];
    });
    
    setLeads(currentLeads => {
      originalLeads = currentLeads; // Store for potential rollback
      return currentLeads.map(lead => 
        lead.id === leadId ? { ...lead, status: 'Converted' } : lead
      );
    });
    
    if (selectedLead && selectedLead.id === leadId) {
      originalSelectedLead = selectedLead;
      setSelectedLead(prev => ({ ...prev, status: 'Converted' }));
    }
    
    try {
      // Simulate API call with potential failure
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate 15% failure rate for demonstration
          if (Math.random() < 0.15) {
            reject(new Error('Simulated conversion failure'));
          } else {
            resolve();
          }
        }, 800);
      });
      
      return { success: true, opportunity: newOpportunity };
    } catch (err) {
      // Rollback optimistic updates on failure
      if (originalOpportunities) {
        setOpportunities(originalOpportunities);
      }
      if (originalLeads) {
        setLeads(originalLeads);
      }
      if (originalSelectedLead && originalSelectedLead.id === leadId) {
        setSelectedLead(originalSelectedLead);
      }
      
      console.error(err);
      return { 
        success: false, 
        error: 'Failed to convert lead. Changes have been reverted.' 
      };
    }
  };
  
  return (
    <AppContext.Provider value={{
      leads: filteredLeads,
      opportunities,
      selectedLead,
      setSelectedLead,
      isLoading,
      error,
      searchTerm,
      setSearchTerm,
      statusFilter,
      setStatusFilter,
      sortDirection,
      setSortDirection,
      updateLead,
      convertToOpportunity
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
