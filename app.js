const API = 'https://job-tracker-utyx.onrender.com/api/applications';
let allApplications = [];
let currentFilter = 'All';

document.addEventListener('DOMContentLoaded', fetchApplications);

async function fetchApplications() {
  try {
    const res = await fetch(API);
    allApplications = await res.json();
    renderApplications();
    updateStats();
  } catch (err) {
    console.log('Error fetching applications:', err);
  }
}

function renderApplications() {
  const grid = document.getElementById('applications-grid');


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
      ${app.interview && app.interview.date ? `<p class="card-date">📅 Interview: ${new Date(app.interview.date).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })}</p>` : ''}
      ${app.jobUrl ? `<a href="${app.jobUrl}" target="_blank" style="font-size:12px; color:#2e5fa3; display:block; margin-bottom:12px; word-break:break-all;">View Job Posting ↗</a>` : ''}
      <div class="card-actions">
      <button class="btn-edit" onclick="showDetailModal('${app._id}')">View</button>
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
  updateHeader(status);

  function updateHeader(status) {
    const titles = {
      'All': 'All Applications',
      'Applied': 'Applied Applications',
      'Interview': 'Applications in Interview',
      'Offer': 'Applications with Offers',
      'Rejected': 'Rejected Applications'
    };
    const subtitles = {
      'All': 'Track every opportunity in one place',
      'Applied': 'Applications you have applied to',
      'Interview': 'Applications currently in interview stage',
      'Offer': 'Applications that have received offers',
      'Rejected': 'Applications that were rejected'
    };
    document.querySelector('.header h1').textContent = titles[status] || 'My Applications';
    document.querySelector('.header p').textContent = subtitles[status] || 'Track every opportunity in one place';
  }
}

function toggleInterviewFields() {

  const status = document.getElementById('status').value;
  document.getElementById('interview-fields').style.display = status === 'Interview' ? 'block' : 'none';
  document.getElementById('offer-fields').style.display = status === 'Offer' ? 'block' : 'none';
}


function showAddForm() {
  document.getElementById('modal-title').textContent = 'Add Application';
  document.getElementById('edit-id').value = '';
  document.getElementById('company').value = '';
  document.getElementById('role').value = '';
  document.getElementById('jobUrl').value = '';
  document.getElementById('notes').value = '';
  document.getElementById('interview-fields').style.display = 'none';
  document.getElementById('offer-fields').style.display = 'none';
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

  // Interview fields
  if (app.status === 'Interview') {
    document.getElementById('interview-fields').style.display = 'block';
    document.getElementById('offer-fields').style.display = 'none';
    document.getElementById('interview-type').value = app.interview?.type || '';
    document.getElementById('interview-date').value = app.interview?.date
      ? new Date(app.interview.date).toISOString().slice(0, 16) : '';
    document.getElementById('interview-round').value = app.interview?.round || '';
    document.getElementById('interview-interviewer').value = app.interview?.interviewer || '';
    document.getElementById('interview-notes').value = app.interview?.notes || '';
  }
  // Offer fields
  else if (app.status === 'Offer') {
    document.getElementById('offer-fields').style.display = 'block';
    document.getElementById('interview-fields').style.display = 'none';
    document.getElementById('offer-salary').value = app.offer?.salary || '';
    document.getElementById('offer-currency').value = app.offer?.currency || 'ZAR';
    document.getElementById('offer-worktype').value = app.offer?.workType || '';
    document.getElementById('offer-contracttype').value = app.offer?.contractType || '';
    document.getElementById('offer-startdate').value = app.offer?.startDate
      ? new Date(app.offer.startDate).toISOString().slice(0, 10) : '';
    document.getElementById('offer-deadline').value = app.offer?.deadline
      ? new Date(app.offer.deadline).toISOString().slice(0, 10) : '';
    document.getElementById('offer-benefits').value = app.offer?.benefits || '';
    document.getElementById('offer-notes').value = app.offer?.notes || '';
  } else {
    document.getElementById('interview-fields').style.display = 'none';
    document.getElementById('offer-fields').style.display = 'none';
  }

  document.getElementById('modal-overlay').classList.add('open');
}

function showDetailModal(id) {
  const app = allApplications.find(a => a._id === id);
  if (!app) return;

  document.getElementById('detail-company').textContent = app.company;
  document.getElementById('detail-role').textContent = app.role;

  const date = new Date(app.appliedDate).toLocaleDateString('en-ZA', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  let html = `
    <div class="detail-section">
      <p class="detail-section-title">Application Info</p>
      <div class="detail-grid">
        <div class="detail-item">
          <label>Status</label>
          <p><span class="status-badge badge-${app.status}">${app.status}</span></p>
        </div>
        <div class="detail-item">
          <label>Applied Date</label>
          <p>${date}</p>
        </div>
        ${app.jobUrl ? `
        <div class="detail-item full-width">
          <label>Job URL</label>
          <p><a href="${app.jobUrl}" target="_blank" style="color:#2e5fa3">${app.jobUrl}</a></p>
        </div>` : ''}
        ${app.notes ? `
        <div class="detail-item full-width">
          <label>Notes</label>
          <p>${app.notes}</p>
        </div>` : ''}
      </div>
    </div>
  `;

  if (app.interview) {
    const interviewDate = app.interview.date
      ? new Date(app.interview.date).toLocaleDateString('en-ZA', {
          year: 'numeric', month: 'long', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        })
      : 'Not set';

    html += `
      <div class="detail-section">
        <p class="detail-section-title">Interview Details</p>
        <div class="detail-grid">
          <div class="detail-item">
            <label>Interview Type</label>
            <p>${app.interview.type || 'Not specified'}</p>
          </div>
          <div class="detail-item">
            <label>Round</label>
            <p>${app.interview.round || 'Not specified'}</p>
          </div>
          <div class="detail-item full-width">
            <label>Date & Time</label>
            <p>${interviewDate}</p>
          </div>
          ${app.interview.interviewer ? `
          <div class="detail-item full-width">
            <label>Interviewer / Panel</label>
            <p>${app.interview.interviewer}</p>
          </div>` : ''}
          ${app.interview.notes ? `
          <div class="detail-item full-width">
            <label>Interview Notes</label>
            <p>${app.interview.notes}</p>
          </div>` : ''}
        </div>
      </div>
    `;
  }
if (app.status === 'Offer' && app.offer) {
    const startDate = app.offer.startDate
      ? new Date(app.offer.startDate).toLocaleDateString('en-ZA', {
          year: 'numeric', month: 'long', day: 'numeric'
        })
      : 'Not specified';

    const deadline = app.offer.deadline
      ? new Date(app.offer.deadline).toLocaleDateString('en-ZA', {
          year: 'numeric', month: 'long', day: 'numeric'
        })
      : 'Not specified';

    const salary = app.offer.salary
      ? `${app.offer.currency} ${Number(app.offer.salary).toLocaleString()}`
      : 'Not specified';

    html += `
      <div class="detail-section">
        <p class="detail-section-title">Offer Details</p>
        <div class="detail-grid">
          <div class="detail-item">
            <label>Salary</label>
            <p>${salary}</p>
          </div>
          <div class="detail-item">
            <label>Work Type</label>
            <p>${app.offer.workType || 'Not specified'}</p>
          </div>
          <div class="detail-item">
            <label>Contract Type</label>
            <p>${app.offer.contractType || 'Not specified'}</p>
          </div>
          <div class="detail-item">
            <label>Start Date</label>
            <p>${startDate}</p>
          </div>
          <div class="detail-item full-width">
            <label>Offer Deadline</label>
            <p>${deadline}</p>
          </div>
          ${app.offer.benefits ? `
          <div class="detail-item full-width">
            <label>Benefits</label>
            <p>${app.offer.benefits}</p>
          </div>` : ''}
          ${app.offer.notes ? `
          <div class="detail-item full-width">
            <label>Notes</label>
            <p>${app.offer.notes}</p>
          </div>` : ''}
        </div>
      </div>
    `;
  }

  document.getElementById('detail-body').innerHTML = html;
  document.getElementById('detail-overlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

function closeDetailModal() {
  document.getElementById('detail-overlay').classList.remove('open');
}

async function saveApplication() {
  const id = document.getElementById('edit-id').value;
  const company = document.getElementById('company').value.trim();
  const role = document.getElementById('role').value.trim();

  if (!company || !role) {
    alert('Company and Role are required!');
    return;
  }

  const status = id ? document.getElementById('status').value : 'Applied';

  console.log('status is:', status);
console.log('offer block will run:', status === 'Offer');

  const data = {
    company,
    role,
    jobUrl: document.getElementById('jobUrl').value.trim(),
    notes: document.getElementById('notes').value.trim(),
    ...(id && { status })
  };

  if (status === 'Interview') {
    data.interview = {
      type: document.getElementById('interview-type').value,
      date: document.getElementById('interview-date').value,
      round: document.getElementById('interview-round').value,
      interviewer: document.getElementById('interview-interviewer').value.trim(),
      notes: document.getElementById('interview-notes').value.trim()
    };
  }

  if (status === 'Offer') {
    data.offer = {
      salary: document.getElementById('offer-salary').value,
      currency: document.getElementById('offer-currency').value,
      workType: document.getElementById('offer-worktype').value,
      contractType: document.getElementById('offer-contracttype').value,
      startDate: document.getElementById('offer-startdate').value,
      deadline: document.getElementById('offer-deadline').value,
      benefits: document.getElementById('offer-benefits').value.trim(),
      notes: document.getElementById('offer-notes').value.trim()
    };
  }
console.log('data being sent:', JSON.stringify(data));

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
    console.log('Error saving application:', err);
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
function setActiveNavItem(btn, status) {
  currentFilter = status;
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderApplications();
}