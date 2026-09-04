/**
 * Amma Healing Center - Admin Portal Script
 * Authentication, Dashboard Metrics, Search/Filters, Actions & WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdminPortal();
});

let currentAppointments = [];
let currentFilter = 'all';
let currentSearch = '';
let currentAdminUser = null;

async function initAdminPortal() {
  initAuthForm();
  initDashboardControls();
  checkAuthAndLoad();
}

/**
 * Check Authentication Session on Load
 */
async function checkAuthAndLoad() {
  if (!window.AmmaSupabase) return;

  const { user, isDemo } = await window.AmmaSupabase.getAdminUser();
  if (user) {
    currentAdminUser = user;
    showDashboard(user, isDemo);
    loadAppointments();
  } else {
    showLogin();
  }
}

/**
 * Authentication Form Handler
 */
function initAuthForm() {
  const loginForm = document.getElementById('adminLoginForm');
  const alertBox = document.getElementById('loginAlertBox');
  const alertMsg = document.getElementById('loginAlertMsg');
  const loginBtn = document.getElementById('loginSubmitBtn');

  if (!loginForm) return;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (alertBox) alertBox.classList.remove('active');

    const emailInput = document.getElementById("email") || document.getElementById("adminEmail");
    const passwordInput = document.getElementById("password") || document.getElementById("adminPassword");

    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";

    if (!email || !password) {
      showLoginAlert("Please enter both email and password.");
      return;
    }

    if (loginBtn) {
      loginBtn.disabled = true;
      loginBtn.innerHTML = 'Signing in...';
    }

    try {
      const result = await window.AmmaSupabase.adminSignIn(email, password);

      if (!result.success) {
        if (loginBtn) {
          loginBtn.disabled = false;
          loginBtn.innerHTML = 'Sign In to Dashboard';
        }
        showLoginAlert(result.error || 'Invalid login credentials.');
        return;
      }

      currentAdminUser = result.user;
      showDashboard(result.user, result.isDemo);
      loadAppointments();
    } catch (err) {
      if (loginBtn) {
        loginBtn.disabled = false;
        loginBtn.innerHTML = 'Sign In to Dashboard';
      }
      showLoginAlert('An error occurred during login. Please try again.');
    }
  });

  function showLoginAlert(msg) {
    if (alertBox && alertMsg) {
      alertMsg.textContent = msg;
      alertBox.classList.add('active');
    } else {
      alert(msg);
    }
  }
}

/**
 * Switch View to Dashboard
 */
function showDashboard(user, isDemo) {
  const loginView = document.getElementById('loginView');
  const dashboardView = document.getElementById('dashboardView');
  const userEmailSpan = document.getElementById('adminUserEmail');
  const demoBanner = document.getElementById('demoModeBanner');

  if (loginView) loginView.style.display = 'none';
  if (dashboardView) dashboardView.style.display = 'block';

  if (userEmailSpan && user) {
    userEmailSpan.textContent = user.email || 'Admin';
  }

  if (demoBanner) {
    demoBanner.style.display = isDemo ? 'block' : 'none';
  }

  if (window.lucide) window.lucide.createIcons();
}

/**
 * Switch View to Login
 */
function showLogin() {
  const loginView = document.getElementById('loginView');
  const dashboardView = document.getElementById('dashboardView');
  if (loginView) loginView.style.display = 'flex';
  if (dashboardView) dashboardView.style.display = 'none';
  if (window.lucide) window.lucide.createIcons();
}

/**
 * Dashboard Controls (Filters, Search, Refresh, Logout)
 */
function initDashboardControls() {
  // Logout button
  const logoutBtn = document.getElementById('adminLogoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await window.AmmaSupabase.adminSignOut();
      currentAdminUser = null;
      showLogin();
    });
  }

  // Refresh button
  const refreshBtn = document.getElementById('adminRefreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      loadAppointments();
    });
  }

  // Filter Pills
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.getAttribute('data-status') || 'all';
      filterAndRender();
    });
  });

  // Search Input
  const searchInput = document.getElementById('adminSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      filterAndRender();
    });
  }

  // Close modal handlers
  document.querySelectorAll('.js-admin-modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      closeAdminModal();
    });
  });

  const modalOverlay = document.getElementById('adminDetailsModal');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeAdminModal();
    });
  }
}

/**
 * Fetch Appointments from Supabase
 */
async function loadAppointments() {
  const tableBody = document.getElementById('appointmentsTableBody');
  const mobileList = document.getElementById('appointmentsMobileList');

  if (tableBody) {
    tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 30px; color: var(--color-text-muted);">Loading appointments...</td></tr>`;
  }

  try {
    const result = await window.AmmaSupabase.fetchAppointments({ status: 'all' });
    if (!result.success) {
      if (tableBody) {
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 30px; color: #991B1B;">Error: ${escapeHtml(result.error)}</td></tr>`;
      }
      return;
    }

    currentAppointments = result.data || [];
    calculateMetrics(currentAppointments);
    filterAndRender();
  } catch (err) {
    console.error('Error fetching appointments:', err);
  }
}

/**
 * Calculate Summary Metrics
 */
function calculateMetrics(appointments) {
  const total = appointments.length;
  const pending = appointments.filter(a => (a.status || '').toLowerCase() === 'pending').length;
  const confirmed = appointments.filter(a => (a.status || '').toLowerCase() === 'confirmed').length;
  const completed = appointments.filter(a => (a.status || '').toLowerCase() === 'completed').length;
  const cancelled = appointments.filter(a => (a.status || '').toLowerCase() === 'cancelled').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const today = appointments.filter(a => a.appointment_date === todayStr).length;

  setMetricText('metricTotal', total);
  setMetricText('metricPending', pending);
  setMetricText('metricConfirmed', confirmed);
  setMetricText('metricCompleted', completed);
  setMetricText('metricCancelled', cancelled);
  setMetricText('metricToday', today);
}

function setMetricText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

/**
 * Filter and Render Table & Cards
 */
function filterAndRender() {
  let filtered = [...currentAppointments];

  // Apply Status Filter
  if (currentFilter && currentFilter !== 'all') {
    filtered = filtered.filter(a => (a.status || '').toLowerCase() === currentFilter.toLowerCase());
  }

  // Apply Search
  if (currentSearch && currentSearch.trim()) {
    const q = currentSearch.toLowerCase().trim();
    filtered = filtered.filter(a =>
      (a.full_name && a.full_name.toLowerCase().includes(q)) ||
      (a.phone && a.phone.toLowerCase().includes(q)) ||
      (a.therapy && a.therapy.toLowerCase().includes(q)) ||
      (a.concern && a.concern.toLowerCase().includes(q))
    );
  }

  renderTable(filtered);
  renderMobileCards(filtered);
  if (window.lucide) window.lucide.createIcons();
}

/**
 * Render Desktop Table
 */
function renderTable(items) {
  const tbody = document.getElementById('appointmentsTableBody');
  if (!tbody) return;

  if (items.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8">
          <div class="empty-state">
            <i data-lucide="inbox"></i>
            <p>No appointments found matching your criteria.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = items.map(item => {
    const status = (item.status || 'pending').toLowerCase();
    return `
      <tr data-id="${item.id}">
        <td><strong>${escapeHtml(item.full_name)}</strong></td>
        <td>
          <a href="tel:${escapeHtml(item.phone)}" style="color: var(--color-forest); font-weight: 500;">
            ${escapeHtml(item.phone)}
          </a>
        </td>
        <td><span style="font-weight: 600; color: var(--color-forest);">${escapeHtml(item.therapy)}</span></td>
        <td style="white-space: nowrap;">${escapeHtml(item.appointment_date)}</td>
        <td style="white-space: nowrap; font-size: 0.85rem;">${escapeHtml(item.preferred_time)}</td>
        <td>
          <span style="display: inline-block; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHtml(item.concern || '')}">
            ${escapeHtml(item.concern || '—')}
          </span>
        </td>
        <td>
          <span class="status-badge ${status}">
            ${status}
          </span>
        </td>
        <td>
          <div class="table-actions-row">
            <button type="button" class="btn-action btn-action-view" onclick="openDetailsModal('${item.id}')" title="View Details">
              <i data-lucide="eye" style="width: 14px; height: 14px;"></i>
              <span>View</span>
            </button>
            <button type="button" class="btn-action btn-action-wa" onclick="whatsappCustomer('${item.id}')" title="WhatsApp Customer">
              <i data-lucide="message-circle" style="width: 14px; height: 14px;"></i>
              <span>WhatsApp</span>
            </button>
            ${status !== 'confirmed' ? `
            <button type="button" class="btn-action btn-action-confirm" onclick="updateStatus('${item.id}', 'confirmed')" title="Confirm Appointment">
              <i data-lucide="check" style="width: 14px; height: 14px;"></i>
              <span>Confirm</span>
            </button>` : ''}
            ${status !== 'completed' ? `
            <button type="button" class="btn-action btn-action-complete" onclick="updateStatus('${item.id}', 'completed')" title="Mark as Completed">
              <i data-lucide="check-circle" style="width: 14px; height: 14px;"></i>
              <span>Complete</span>
            </button>` : ''}
            ${status !== 'cancelled' ? `
            <button type="button" class="btn-action btn-action-cancel" onclick="updateStatus('${item.id}', 'cancelled')" title="Cancel Appointment">
              <i data-lucide="x" style="width: 14px; height: 14px;"></i>
              <span>Cancel</span>
            </button>` : ''}
            <button type="button" class="btn-action btn-action-delete" onclick="deleteAppointment('${item.id}')" title="Delete Record">
              <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

/**
 * Render Mobile Cards
 */
function renderMobileCards(items) {
  const container = document.getElementById('appointmentsMobileList');
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i data-lucide="inbox"></i>
        <p>No appointments found matching your criteria.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => {
    const status = (item.status || 'pending').toLowerCase();
    return `
      <div class="appointment-mobile-card">
        <div class="mobile-card-header">
          <div>
            <div class="mobile-card-name">${escapeHtml(item.full_name)}</div>
            <div class="mobile-card-phone">${escapeHtml(item.phone)}</div>
          </div>
          <span class="status-badge ${status}">${status}</span>
        </div>

        <div class="mobile-card-details">
          <div class="mobile-card-details-row">
            <span class="lbl">Therapy:</span>
            <span class="val">${escapeHtml(item.therapy)}</span>
          </div>
          <div class="mobile-card-details-row">
            <span class="lbl">Date:</span>
            <span class="val">${escapeHtml(item.appointment_date)}</span>
          </div>
          <div class="mobile-card-details-row">
            <span class="lbl">Time:</span>
            <span class="val">${escapeHtml(item.preferred_time)}</span>
          </div>
          ${item.concern ? `
          <div class="mobile-card-details-row">
            <span class="lbl">Concern:</span>
            <span class="val" style="max-width: 60%;">${escapeHtml(item.concern)}</span>
          </div>` : ''}
        </div>

        <div class="mobile-card-actions">
          <button type="button" class="btn-action btn-action-wa" onclick="whatsappCustomer('${item.id}')">
            <i data-lucide="message-circle" style="width: 14px; height: 14px;"></i>
            <span>WhatsApp</span>
          </button>
          <button type="button" class="btn-action btn-action-view" onclick="openDetailsModal('${item.id}')">
            <i data-lucide="eye" style="width: 14px; height: 14px;"></i>
            <span>View</span>
          </button>
          ${status !== 'confirmed' ? `
          <button type="button" class="btn-action btn-action-confirm" onclick="updateStatus('${item.id}', 'confirmed')">
            <span>Confirm</span>
          </button>` : ''}
          ${status !== 'completed' ? `
          <button type="button" class="btn-action btn-action-complete" onclick="updateStatus('${item.id}', 'completed')">
            <span>Complete</span>
          </button>` : ''}
          ${status !== 'cancelled' ? `
          <button type="button" class="btn-action btn-action-cancel" onclick="updateStatus('${item.id}', 'cancelled')">
            <span>Cancel</span>
          </button>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Action: Update Status (Confirm, Cancel, Complete)
 */
async function updateStatus(id, newStatus) {
  try {
    const result = await window.AmmaSupabase.updateAppointmentStatus(id, newStatus);
    if (!result.success) {
      alert('Failed to update status: ' + result.error);
      return;
    }

    // Update in-memory list and re-render
    const item = currentAppointments.find(a => a.id === id);
    if (item) {
      item.status = newStatus;
    }
    calculateMetrics(currentAppointments);
    filterAndRender();
  } catch (err) {
    console.error('Update status error:', err);
  }
}

/**
 * Action: Delete Appointment Record
 */
async function deleteAppointment(id) {
  if (!confirm('Are you sure you want to permanently delete this appointment record?')) {
    return;
  }

  try {
    const result = await window.AmmaSupabase.deleteAppointmentRecord(id);
    if (!result.success) {
      alert('Failed to delete: ' + result.error);
      return;
    }

    currentAppointments = currentAppointments.filter(a => a.id !== id);
    calculateMetrics(currentAppointments);
    filterAndRender();
  } catch (err) {
    console.error('Delete error:', err);
  }
}

/**
 * Action: WhatsApp Customer with pre-filled message
 */
function whatsappCustomer(id) {
  const item = currentAppointments.find(a => a.id === id);
  if (!item) return;

  // Clean customer phone (extract digits)
  let cleanPhone = item.phone.replace(/[^0-9]/g, '');
  if (cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone;
  }

  const message = `Hello ${item.full_name},\n\nThis is Amma Healing Center, Mysuru regarding your ${item.therapy} appointment.\n\nDate: ${item.appointment_date}\nTime: ${item.preferred_time}\nStatus: ${item.status.toUpperCase()}\n\nPlease let us know if you have any questions or require directions to our center in Agrahara, Mysuru.\n\nThank you,\nAmma Healing Center`;

  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
}

/**
 * Action: Open Details Modal
 */
function openDetailsModal(id) {
  const item = currentAppointments.find(a => a.id === id);
  if (!item) return;

  const modal = document.getElementById('adminDetailsModal');
  const modalContent = document.getElementById('adminModalBody');

  if (modalContent) {
    modalContent.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px; font-size: 0.92rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border); padding-bottom: 10px;">
          <strong style="font-size: 1.1rem; color: var(--color-forest);">${escapeHtml(item.full_name)}</strong>
          <span class="status-badge ${item.status.toLowerCase()}">${escapeHtml(item.status)}</span>
        </div>

        <div>
          <span style="color: var(--color-text-muted); font-size: 0.82rem; font-weight: 600; text-transform: uppercase;">Phone Number</span>
          <div><a href="tel:${escapeHtml(item.phone)}" style="font-weight: 600; color: var(--color-forest);">${escapeHtml(item.phone)}</a></div>
        </div>

        <div>
          <span style="color: var(--color-text-muted); font-size: 0.82rem; font-weight: 600; text-transform: uppercase;">Therapy Selected</span>
          <div style="font-weight: 600; color: var(--color-text-title);">${escapeHtml(item.therapy)}</div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <span style="color: var(--color-text-muted); font-size: 0.82rem; font-weight: 600; text-transform: uppercase;">Appointment Date</span>
            <div style="font-weight: 600;">${escapeHtml(item.appointment_date)}</div>
          </div>
          <div>
            <span style="color: var(--color-text-muted); font-size: 0.82rem; font-weight: 600; text-transform: uppercase;">Preferred Time</span>
            <div style="font-weight: 600;">${escapeHtml(item.preferred_time)}</div>
          </div>
        </div>

        <div>
          <span style="color: var(--color-text-muted); font-size: 0.82rem; font-weight: 600; text-transform: uppercase;">Customer Concern / Note</span>
          <div style="background: var(--color-cream); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); margin-top: 4px; line-height: 1.5;">
            ${escapeHtml(item.concern || 'No specific notes provided by customer.')}
          </div>
        </div>

        <div style="font-size: 0.78rem; color: var(--color-text-muted); border-top: 1px dashed var(--color-border); padding-top: 10px;">
          Created: ${new Date(item.created_at || Date.now()).toLocaleString()}
        </div>

        <div style="display: flex; gap: 8px; margin-top: 10px;">
          <button type="button" class="btn-action btn-action-wa" style="flex: 1; padding: 10px;" onclick="whatsappCustomer('${item.id}')">
            <i data-lucide="message-circle" style="width: 16px; height: 16px;"></i>
            <span>WhatsApp Customer</span>
          </button>
        </div>
      </div>
    `;
  }

  if (modal) modal.classList.add('active');
  if (window.lucide) window.lucide.createIcons();
}

function closeAdminModal() {
  const modal = document.getElementById('adminDetailsModal');
  if (modal) modal.classList.remove('active');
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
