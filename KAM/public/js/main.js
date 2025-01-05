// Global variable to store current lead ID
let currentLeadId = null;

document.addEventListener('DOMContentLoaded', () => {
    // Set up form event listeners
    const leadForm = document.getElementById('leadForm');
    const contactForm = document.getElementById('contactForm');
    const interactionForm = document.getElementById('interactionForm');

    if (leadForm) leadForm.addEventListener('submit', handleLeadSubmit);
    if (contactForm) contactForm.addEventListener('submit', handleContactSubmit);
    if (interactionForm) interactionForm.addEventListener('submit', handleInteractionSubmit);

    // Load leads if we're on the leads page
    if (window.location.pathname === '/leads') {
        loadLeads();
    }

    // Load dashboard data if we're on the dashboard
    if (window.location.pathname === '/dashboard') {
        loadDashboardData();
    }
});

// Lead Management Functions
async function handleLeadSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const leadData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/leads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(leadData),
        });

        if (response.ok) {
            alert('Lead added successfully!');
            e.target.reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById('addLeadModal'));
            if (modal) modal.hide();
            loadLeads(); // Refresh the leads list
        } else {
            throw new Error('Failed to add lead');
        }
    } catch (error) {
        alert('Error adding lead: ' + error.message);
    }
}

async function loadLeads() {
    try {
        const response = await fetch('/api/leads');
        const leads = await response.json();
        displayLeads(leads);
    } catch (error) {
        console.error('Error loading leads:', error);
    }
}

function displayLeads(leads) {
    const container = document.querySelector('#leadsContainer');
    if (!container) return;

    const leadsHtml = leads.map(lead => `
        <div class="card mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h5 class="card-title">${lead.restaurant_name}</h5>
                        <p class="card-text">
                            <strong>Address:</strong> ${lead.address}<br>
                            <strong>Contact:</strong> ${lead.contact_number}<br>
                            <strong>Status:</strong> <span class="badge bg-${getStatusColor(lead.status)}">${lead.status}</span><br>
                            <strong>KAM:</strong> ${lead.assigned_kam}
                        </p>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="viewLeadDetails(${lead.id})">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = leadsHtml;
}

// Contact Management Functions
async function handleContactSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const contactData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactData),
        });

        if (response.ok) {
            alert('Contact added successfully!');
            e.target.reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById('addContactModal'));
            if (modal) modal.hide();
            loadContacts(currentLeadId); // Refresh contacts list
        } else {
            throw new Error('Failed to add contact');
        }
    } catch (error) {
        alert('Error adding contact: ' + error.message);
    }
}

async function loadContacts(leadId) {
    try {
        const response = await fetch(`/api/contacts/lead/${leadId}`);
        const contacts = await response.json();
        displayContacts(contacts);
    } catch (error) {
        console.error('Error loading contacts:', error);
    }
}

function displayContacts(contacts) {
    const container = document.querySelector('#contactsList');
    if (!container) return;

    if (contacts.length === 0) {
        container.innerHTML = '<p class="text-muted">No contacts added yet.</p>';
        return;
    }

    const contactsHtml = contacts.map(contact => `
        <div class="card mb-2">
            <div class="card-body">
                <h6 class="card-title">${contact.name}</h6>
                <p class="card-text">
                    <strong>Role:</strong> ${contact.role}<br>
                    <strong>Phone:</strong> ${contact.phone_number}<br>
                    <strong>Email:</strong> ${contact.email}
                </p>
            </div>
        </div>
    `).join('');

    container.innerHTML = contactsHtml;
}

// Interaction Management Functions
async function handleInteractionSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    // Convert checkbox value to boolean
    const interactionData = {
        ...Object.fromEntries(formData.entries()),
        follow_up_required: formData.get('follow_up_required') === 'on'
    };

    try {
        const response = await fetch('/api/interactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(interactionData),
        });

        if (response.ok) {
            alert('Interaction logged successfully!');
            e.target.reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById('addInteractionModal'));
            if (modal) modal.hide();
            loadInteractions(currentLeadId); // Refresh interactions list
        } else {
            throw new Error('Failed to log interaction');
        }
    } catch (error) {
        alert('Error logging interaction: ' + error.message);
    }
}

async function loadInteractions(leadId) {
    try {
        const response = await fetch(`/api/interactions/lead/${leadId}`);
        const interactions = await response.json();
        displayInteractions(interactions);
    } catch (error) {
        console.error('Error loading interactions:', error);
    }
}

function displayInteractions(interactions) {
    const container = document.querySelector('#interactionsList');
    if (!container) return;

    if (interactions.length === 0) {
        container.innerHTML = '<p class="text-muted">No interactions recorded yet.</p>';
        return;
    }

    const interactionsHtml = interactions.map(interaction => `
        <div class="card mb-2">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="card-title">
                            <span class="badge bg-${getInteractionTypeColor(interaction.interaction_type)}">
                                ${interaction.interaction_type}
                            </span>
                            ${new Date(interaction.interaction_date).toLocaleDateString()}
                        </h6>
                        <p class="card-text">${interaction.notes}</p>
                        <small class="text-muted">
                            Created: ${new Date(interaction.created_at).toLocaleString()}
                        </small>
                    </div>
                    ${interaction.follow_up_required ? 
                        '<span class="badge bg-warning">Follow-up Required</span>' : ''}
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = interactionsHtml;
}

// Lead Details View Functions
async function viewLeadDetails(leadId) {
        currentLeadId = leadId;
        try {
          // Fetch lead details
          const leadResponse = await fetch(`/api/leads/${leadId}`);
          if (!leadResponse.ok) {
            throw new Error('Failed to fetch lead details');
          }
          const lead = await leadResponse.json();
          
          // Update lead details tab
          document.querySelector('#details').innerHTML = `
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">${lead.restaurant_name}</h5>
                <p class="card-text">
                  <strong>Address:</strong> ${lead.address}<br>
                  <strong>Contact:</strong> ${lead.contact_number}<br>
                  <strong>Status:</strong> <span class="badge bg-${getStatusColor(lead.status)}">${lead.status}</span><br>
                  <strong>KAM:</strong> ${lead.assigned_kam}<br>
                  <strong>Created:</strong> ${new Date(lead.created_at).toLocaleString()}
                </p>
                
              </div>
            </div>
          `;
        //We can implement edit function also by adding below lines of code above, after paragraph tag(</p>) (and executing onClick()):
        // <button class="btn btn-primary btn-sm" onclick="showEditLeadForm(${leadId})">
        //   Edit Lead
        // </button>  

          // Load contacts and interactions
          await Promise.all([
            loadContacts(leadId),
            loadInteractions(leadId)
          ]);
      
          // Show the modal
          const modal = new bootstrap.Modal(document.getElementById('leadDetailsModal'));
          modal.show();
        } catch (error) {
          console.error('Error loading lead details:', error);
          showErrorAlert('Failed to load lead details. Please try again.');
        }
}

// Utility Functions
function showAddContactForm() {
    const form = document.getElementById('contactForm');
    form.querySelector('[name="lead_id"]').value = currentLeadId;
    const modal = new bootstrap.Modal(document.getElementById('addContactModal'));
    modal.show();
}

function showAddInteractionForm() {
    const form = document.getElementById('interactionForm');
    form.querySelector('[name="lead_id"]').value = currentLeadId;
    // Set today's date as default
    form.querySelector('[name="interaction_date"]').value = new Date().toISOString().split('T')[0];
    const modal = new bootstrap.Modal(document.getElementById('addInteractionModal'));
    modal.show();
}

function getStatusColor(status) {
    switch (status) {
        case 'New': return 'info';
        case 'Active': return 'success';
        case 'Inactive': return 'secondary';
        default: return 'primary';
    }
}

function getInteractionTypeColor(type) {
    switch (type) {
        case 'Call': return 'primary';
        case 'Visit': return 'success';
        case 'Order': return 'info';
        default: return 'secondary';
    }
}

// Search functionality
async function searchLeads() {
    const searchTerm = document.getElementById('searchInput').value;
    if (!searchTerm.trim()) {
        loadLeads(); // Load all leads if search is empty
        return;
    }

    try {
        const response = await fetch(`/api/leads/search?query=${encodeURIComponent(searchTerm)}`);
        const leads = await response.json();
        displayLeads(leads);
    } catch (error) {
        console.error('Error searching leads:', error);
    }
}