const API = 'https://job-tracker-sibusisiwe.up.railway.app/api/applications';let allApplications = [];
let currentFilter = 'All';

// Load all applications on page load
document.addEventListener('DOMContentLoaded', fetchApplications);

async function fetchApplications() {
  try {
    const res = await fetch(API);
    allApplications = await res.json();
    renderApplications();
    updateStats();
  } catch (err) {
    console.error('Error fetching applications:', err);
  }
}

function renderApplications() {
  const grid = document.getElementById('applications-grid');
  const emptyState = document.getElementById('empty-state');

  const filtered = currentFilter === 'All'
    ? allApplications
    : allApplications.filter(a => a.status === currentFilter);

  grid.innerHTML = '';

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="empty-state">No applications found.</p>';
    return;
  }

  filtered.forEach(app => {
    const date = new Date(app.appliedDate).toLocaleDateString('en-ZA', {
      year: 'numeric', month: 'short', day: 'numeric'
    });

    const card = document.createElement('div');
    card.className = `app-card ${app.status}`;
    card.innerHTML = `
      <div class="card-header">
        <div>
          <p class="company-name">${app.company}</p>
          <p class="role-name">${app.role}</p>
        </div>
        <span class="status-badge badge-${app.status}">${app.status}</span>
      </div>
      ${app.notes ? `<p class="card-notes">${app.notes}</p>` : ''}
      <p class="card-date">Applied: ${date}</p>
      ${app.jobUrl ? `<a href="${app.jobUrl}" target="_blank" style="font-size:12px; color:#2e5fa3; display:block; margin-bottom:12px;">View Job Posting ↗</a>` : ''}
      <div class="card-actions">
        <button class="btn-edit" onclick="showEditForm('${app._id}')">Edit</button>
        <button class="btn-delete" onclick="deleteApplication('${app._id}')">Delete</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function updateStats() {
  document.getElementById('stat-total').textContent = allApplications.length;
  document.getElementById('stat-applied').textContent = allApplications.filter(a => a.status === 'Applied').length;
  document.getElementById('stat-interview').textContent = allApplications.filter(a => a.status === 'Interview').length;
  document.getElementById('stat-offer').textContent = allApplications.filter(a => a.status === 'Offer').length;
  document.getElementById('stat-rejected').textContent = allApplications.filter(a => a.status === 'Rejected').length;
}

function filterApplications(status, btn) {
  currentFilter = status;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderApplications();
}

function showAddForm() {
  document.getElementById('modal-title').textContent = 'Add Application';
  document.getElementById('edit-id').value = '';
  document.getElementById('company').value = '';
  document.getElementById('role').value = '';
  document.getElementById('jobUrl').value = '';
  document.getElementById('notes').value = '';
  document.getElementById('status-group').style.display = 'none';
  document.getElementById('modal-overlay').classList.add('open');
}

function showEditForm(id) {
  const app = allApplications.find(a => a._id === id);
  if (!app) return;

  document.getElementById('modal-title').textContent = 'Edit Application';
  document.getElementById('edit-id').value = app._id;
  document.getElementById('company').value = app.company;
  document.getElementById('role').value = app.role;
  document.getElementById('jobUrl').value = app.jobUrl || '';
  document.getElementById('notes').value = app.notes || '';
  document.getElementById('status').value = app.status;
  document.getElementById('status-group').style.display = 'block';
  document.getElementById('modal-overlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

async function saveApplication() {
  const id = document.getElementById('edit-id').value;
  const company = document.getElementById('company').value.trim();
  const role = document.getElementById('role').value.trim();

  if (!company || !role) {
    alert('Company and Role are required!');
    return;
  }

  const data = {
    company,
    role,
    jobUrl: document.getElementById('jobUrl').value.trim(),
    notes: document.getElementById('notes').value.trim(),
    ...(id && { status: document.getElementById('status').value })
  };

  try {
    const res = await fetch(id ? `${API}/${id}` : API, {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      closeModal();
      fetchApplications();
    }
  } catch (err) {
    console.error('Error saving application:', err);
  }
}

async function deleteApplication(id) {
  if (!confirm('Are you sure you want to delete this application?')) return;

  try {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    fetchApplications();
  } catch (err) {
    console.error('Error deleting application:', err);
  }
}