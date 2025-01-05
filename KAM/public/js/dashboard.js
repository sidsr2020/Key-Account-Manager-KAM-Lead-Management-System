// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the dashboard
    initializeDashboard();   
    // Set up event listeners
    setupEventListeners();   
    // Load initial data
    loadDashboardData();
});

function initializeDashboard() {
    // Initialize any dashboard-specific components
    updateDashboardStats([]);
    showLoadingState('Loading dashboard data...');
}

function setupEventListeners() {
    // Search input event listeners
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    // Debounced search as user types (500ms delay)
    let debounceTimer;
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            performSearch(searchInput.value);
        }, 500);
    });
    
    // Search button click
    searchButton.addEventListener('click', () => {
        performSearch(searchInput.value);
    });

    // Enter key in search
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(searchInput.value);
        }
    });
}

async function performSearch(searchTerm) {
    try {
        showLoadingState('Searching...');
        
        const response = await fetch(`/api/leads/search?query=${encodeURIComponent(searchTerm.trim())}`);
        if (!response.ok) {
            throw new Error(`Search failed: ${response.statusText}`);
        }
        
        const results = await response.json();
        updateDashboardWithResults(results);
        showSearchResultsMessage(results.length, searchTerm);
        
    } catch (error) {
        console.error('Search error:', error);
        showErrorMessage('Failed to perform search. Please try again.');
    } finally {
        removeLoadingState();
    }
}

async function loadDashboardData() {
    try {
        showLoadingState('Loading dashboard data...');
        
        // Fetch all necessary data
        const [leads, pendingCalls, recentInteractions] = await Promise.all([
            fetch('/api/leads').then(res => res.json()),
            fetch('/api/interactions/pending').then(res => res.json()).catch(() => []),
            fetch('/api/interactions/recent').then(res => res.json()).catch(() => [])
        ]);

        // Update all dashboard sections
        updateDashboardWithResults(leads);
        updatePendingCalls(pendingCalls);
        updateRecentInteractions(recentInteractions);
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showErrorMessage('Failed to load dashboard data. Please refresh the page.');
    } finally {
        removeLoadingState();
    }
}

function updateDashboardWithResults(leads) {
    updateDashboardStats(leads);
    updateLeadsList(leads);
}

function updateDashboardStats(leads) {
    const activeLeads = leads.filter(lead => lead.status === 'Active').length;
    const newLeads = leads.filter(lead => lead.status === 'New').length;
    const inactiveLeads = leads.filter(lead => lead.status === 'Inactive').length;

    const statsContainer = document.getElementById('dashboardStats');
    statsContainer.innerHTML = `
        <div class="col-md-3">
            <div class="card bg-primary text-white mb-3">
                <div class="card-body">
                    <h6 class="card-title">Total Leads</h6>
                    <h2 class="card-text">${leads.length}</h2>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card bg-success text-white mb-3">
                <div class="card-body">
                    <h6 class="card-title">Active Leads</h6>
                    <h2 class="card-text">${activeLeads}</h2>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card bg-info text-white mb-3">
                <div class="card-body">
                    <h6 class="card-title">New Leads</h6>
                    <h2 class="card-text">${newLeads}</h2>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card bg-warning text-white mb-3">
                <div class="card-body">
                    <h6 class="card-title">Inactive Leads</h6>
                    <h2 class="card-text">${inactiveLeads}</h2>
                </div>
            </div>
        </div>
    `;
}

function updateLeadsList(leads) {
    const container = document.getElementById('leadsContainer');
    
    if (leads.length === 0) {
        container.innerHTML = '<div class="alert alert-info">No leads found.</div>';
        return;
    }

    const leadsHtml = leads.map(lead => `
        <div class="card mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h5 class="card-title">${lead.restaurant_name}</h5>
                        <p class="card-text">
                            <strong>Address:</strong> ${lead.address}<br>
                            <strong>Contact:</strong> ${lead.contact_number}<br>
                            <strong>Status:</strong> 
                            <span class="badge bg-${getStatusColor(lead.status)}">${lead.status}</span><br>
                            <strong>KAM:</strong> ${lead.assigned_kam}
                        </p>
                    </div>
                   
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = leadsHtml;
}

function updatePendingCalls(calls) {
    const container = document.getElementById('pendingCallsList');
    
    if (!calls || calls.length === 0) {
        container.innerHTML = '<p class="text-muted">No pending calls for today.</p>';
        return;
    }

    container.innerHTML = calls.map(call => `
        <div class="card mb-2">
            <div class="card-body">
                <h6 class="mb-1">${call.restaurant_name}</h6>
                <p class="mb-0 text-muted">
                    Scheduled: ${new Date(call.scheduled_time).toLocaleTimeString()}
                </p>
            </div>
        </div>
    `).join('');
}

function updateRecentInteractions(interactions) {
    const container = document.getElementById('recentInteractionsList');
    
    if (!interactions || interactions.length === 0) {
        container.innerHTML = '<p class="text-muted">No recent interactions.</p>';
        return;
    }

    container.innerHTML = interactions.map(interaction => `
        <div class="card mb-2">
            <div class="card-body">
                <h6 class="mb-1">${interaction.restaurant_name}</h6>
                <p class="mb-1">
                    <span class="badge bg-${getInteractionTypeColor(interaction.interaction_type)}">
                        ${interaction.interaction_type}
                    </span>
                    ${interaction.notes}
                </p>
                <small class="text-muted">
                    ${new Date(interaction.created_at).toLocaleString()}
                </small>
            </div>
        </div>
    `).join('');
}

// Utility Functions
function getStatusColor(status) {
    const colors = {
        'New': 'info',
        'Active': 'success',
        'Inactive': 'secondary'
    };
    return colors[status] || 'primary';
}

function getInteractionTypeColor(type) {
    const colors = {
        'Call': 'primary',
        'Visit': 'success',
        'Order': 'info'
    };
    return colors[type] || 'secondary';
}

function showLoadingState(message) {
    const existingLoading = document.getElementById('loadingMessage');
    if (!existingLoading) {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loadingMessage';
        loadingDiv.className = 'alert alert-info alert-dismissible fade show';
        loadingDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.querySelector('.container').insertAdjacentElement('afterbegin', loadingDiv);
    }
}

function removeLoadingState() {
    const loadingDiv = document.getElementById('loadingMessage');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

function showErrorMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.querySelector('.container').insertAdjacentElement('afterbegin', alertDiv);
}

function showSearchResultsMessage(count, searchTerm) {
    if (!searchTerm) return;
    
    const message = `Found ${count} result${count !== 1 ? 's' : ''} for "${searchTerm}"`;
    const messageDiv = document.createElement('div');
    messageDiv.className = 'alert alert-info alert-dismissible fade show';
    messageDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.container');
    const existingMessage = container.querySelector('.alert-info');
    if (existingMessage) {
        existingMessage.remove();
    }
    container.insertAdjacentElement('afterbegin', messageDiv);
}