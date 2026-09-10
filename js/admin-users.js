/**
 * Smart Legal Metrology Inspection & Compliance System
 * User & Inspector Directory Management Controller (Admin)
 */

const AdminUsers = {
  users: [],

  init() {
    this.loadUsers();
    this.bindEvents();
  },

  loadUsers() {
    this.users = Storage.get(CONFIG.STORAGE_KEYS.USERS_LIST) || MockData.users;
    this.renderUsersTable();
  },

  bindEvents() {
    const searchInput = document.getElementById('users-search-input');
    const roleFilter = document.getElementById('users-filter-role');
    const addUserBtn = document.getElementById('btn-add-new-user');
    const saveUserBtn = document.getElementById('btn-save-user-modal');

    if (searchInput) {
      searchInput.oninput = Utils.debounce(() => this.filterUsers(), 200);
    }
    if (roleFilter) {
      roleFilter.onchange = () => this.filterUsers();
    }
    if (addUserBtn) {
      addUserBtn.onclick = () => this.openUserModal();
    }
    if (saveUserBtn) {
      saveUserBtn.onclick = () => this.saveUserFromModal();
    }
  },

  filterUsers() {
    const search = (document.getElementById('users-search-input')?.value || '').toLowerCase();
    const role = document.getElementById('users-filter-role')?.value || 'ALL';

    const filtered = this.users.filter(u => {
      const matchSearch = !search ||
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        u.employeeId.toLowerCase().includes(search) ||
        u.department.toLowerCase().includes(search);

      const matchRole = role === 'ALL' || u.role === role;
      return matchSearch && matchRole;
    });

    this.renderUsersTable(filtered);
  },

  renderUsersTable(usersList = this.users) {
    const tbody = document.getElementById('users-table-body');
    const countEl = document.getElementById('users-total-count');
    if (!tbody) return;

    if (countEl) countEl.textContent = `${usersList.length} Authorized Users`;

    if (usersList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center p-4 text-muted">No inspectors found.</td></tr>`;
      return;
    }

    tbody.innerHTML = usersList
      .map(u => `
        <tr>
          <td class="font-monospace fw-bold text-primary">${Utils.escapeHtml(u.employeeId)}</td>
          <td>
            <div class="fw-bold">${Utils.escapeHtml(u.name)}</div>
            <div class="form-hint-text">${Utils.escapeHtml(u.email)}</div>
          </td>
          <td><span class="badge bg-primary-subtle text-primary border">${Utils.escapeHtml(u.role)}</span></td>
          <td>${Utils.escapeHtml(u.department)}</td>
          <td style="font-size:0.75rem; color:var(--text-muted);">${Utils.formatDate(u.lastLogin)}</td>
          <td>
            <span class="status-badge ${u.status === 'Active' ? 'compliant' : 'neutral'}">
              ${Utils.escapeHtml(u.status)}
            </span>
          </td>
          <td class="text-end">
            <button class="btn-gov btn-gov-sm btn-gov-secondary" onclick="AdminUsers.editUser('${u.id}')" title="Edit Officer">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn-gov btn-gov-sm ${u.status === 'Active' ? 'btn-gov-danger' : 'btn-gov-success'}" onclick="AdminUsers.toggleUserStatus('${u.id}')" title="Toggle Status">
              <i class="bi ${u.status === 'Active' ? 'bi-person-x' : 'bi-person-check'}"></i>
            </button>
          </td>
        </tr>
      `)
      .join('');
  },

  openUserModal(user = null) {
    const modalEl = document.getElementById('admin-user-modal');
    if (!modalEl) return;

    modalEl.querySelector('#user-modal-title').textContent = user ? `Edit ${user.name}` : 'Register New Inspection Officer';
    modalEl.querySelector('#modal-user-name').value = user ? user.name : '';
    modalEl.querySelector('#modal-user-empid').value = user ? user.employeeId : `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
    modalEl.querySelector('#modal-user-email').value = user ? user.email : '';
    modalEl.querySelector('#modal-user-phone').value = user ? user.phone : '';
    modalEl.querySelector('#modal-user-dept').value = user ? user.department : 'Enforcement Zone 1';
    modalEl.querySelector('#modal-user-role').value = user ? user.role : 'Inspector';

    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
  },

  editUser(id) {
    const user = this.users.find(u => u.id === id);
    if (user) this.openUserModal(user);
  },

  saveUserFromModal() {
    const modalEl = document.getElementById('admin-user-modal');
    if (!modalEl) return;

    const name = modalEl.querySelector('#modal-user-name').value.trim();
    const employeeId = modalEl.querySelector('#modal-user-empid').value.trim();
    const email = modalEl.querySelector('#modal-user-email').value.trim();
    const phone = modalEl.querySelector('#modal-user-phone').value.trim();
    const department = modalEl.querySelector('#modal-user-dept').value.trim();
    const role = modalEl.querySelector('#modal-user-role').value;

    if (!name || !email || !employeeId) {
      UI.showToast('error', 'Validation Error', 'Full Name, Employee ID, and Email are required.');
      return;
    }

    const existingIdx = this.users.findIndex(u => u.employeeId === employeeId || u.email === email);
    const userObj = {
      id: existingIdx >= 0 ? this.users[existingIdx].id : `USR-${Date.now().toString().slice(-4)}`,
      name,
      employeeId,
      email,
      phone,
      department,
      role,
      status: 'Active',
      lastLogin: new Date().toISOString()
    };

    if (existingIdx >= 0) {
      this.users[existingIdx] = { ...this.users[existingIdx], ...userObj };
      UI.showToast('success', 'User Updated', `Officer ${name} profile updated.`);
    } else {
      this.users.unshift(userObj);
      UI.showToast('success', 'User Registered', `New officer ${name} authorized.`);
    }

    Storage.set(CONFIG.STORAGE_KEYS.USERS_LIST, this.users);
    this.renderUsersTable();

    const bsModal = bootstrap.Modal.getInstance(modalEl);
    if (bsModal) bsModal.hide();
  },

  toggleUserStatus(id) {
    const user = this.users.find(u => u.id === id);
    if (user) {
      user.status = user.status === 'Active' ? 'Suspended' : 'Active';
      Storage.set(CONFIG.STORAGE_KEYS.USERS_LIST, this.users);
      this.renderUsersTable();
      UI.showToast('info', 'Status Changed', `Officer ${user.name} is now ${user.status}.`);
    }
  }
};
