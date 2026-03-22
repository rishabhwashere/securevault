import { createApi } from './api.js';
import { clearSession, setSession, state } from './state.js';
import {
  bindSectionNav,
  getElements,
  populateVaultForm,
  renderSession,
  renderViewMode,
  renderVaultEntries,
  resetVaultForm,
  setFeedback
} from './ui.js';

const elements = getElements();

function api() {
  return createApi(state.token);
}

async function refreshVault() {
  if (!state.token) {
    state.vaultEntries = [];
    renderVaultEntries({ onEdit: handleEditVault, onDelete: handleDeleteVault });
    return;
  }

  const response = await api().getVaultEntries();
  state.vaultEntries = response.data || [];
  renderVaultEntries({ onEdit: handleEditVault, onDelete: handleDeleteVault });
}

async function refreshAll() {
  renderViewMode();

  if (state.token) {
    await refreshVault();
  } else {
    state.vaultEntries = [];
    renderVaultEntries({ onEdit: handleEditVault, onDelete: handleDeleteVault });
  }
  renderSession();
}

async function handleRegister(event) {
  event.preventDefault();

  const formData = new FormData(elements.registerForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    const response = await api().register(payload);
    setFeedback(`Welcome, ${response.user.name}! Your account has been created.`);
    elements.registerForm.reset();
    elements.showLoginButton.click();
  } catch (error) {
    setFeedback(error.message, 'error');
  }
}

async function handleLogin(event) {
  event.preventDefault();

  const formData = new FormData(elements.loginForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    const response = await api().login(payload);
    setSession(response.token, response.user);
    await refreshAll();
    setFeedback(`Welcome Back, ${response.user.name}!`);
    elements.loginForm.reset();
  } catch (error) {
    setFeedback(error.message, 'error');
  }
}

async function handleVaultSubmit(event) {
  event.preventDefault();

  if (!state.token) {
    setFeedback('Log in first to create or update vault entries.', 'error');
    return;
  }

  const formData = new FormData(elements.vaultForm);
  const rawTags = String(formData.get('tags') || '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  formData.delete('tags');
  rawTags.forEach((tag) => formData.append('tags', tag));

  try {
    if (state.editingId) {
      const updatePayload = {
        title: formData.get('title'),
        category: formData.get('category'),
        data: formData.get('data'),
        tags: rawTags
      };

      await api().updateVaultEntry(state.editingId, updatePayload);
      setFeedback('Vault entry updated successfully.');
    } else {
      await api().createVaultEntry(formData);
      setFeedback('Vault entry created successfully.');
    }

    resetVaultForm();
    await refreshVault();
  } catch (error) {
    setFeedback(error.message, 'error');
  }
}

function handleEditVault(entry) {
  populateVaultForm(entry);
  setFeedback(`Editing "${entry.title}". Save the form to apply changes.`);
}

async function handleDeleteVault(entry) {
  if (!state.token) {
    setFeedback('Log in first to delete vault entries.', 'error');
    return;
  }

  const shouldDelete = window.confirm(`Delete "${entry.title}"?`);
  if (!shouldDelete) return;

  try {
    await api().deleteVaultEntry(entry._id);
    setFeedback('Vault entry deleted successfully.');
    if (state.editingId === entry._id) {
      resetVaultForm();
    }
    await refreshVault();
  } catch (error) {
    setFeedback(error.message, 'error');
  }
}

function handleLogout() {
  clearSession();
  resetVaultForm();
  renderViewMode();
  renderSession();
  renderVaultEntries({ onEdit: handleEditVault, onDelete: handleDeleteVault });
  setFeedback('You have been logged out.');
}

function bindEvents() {
  bindSectionNav();

  elements.registerForm.addEventListener('submit', handleRegister);
  elements.loginForm.addEventListener('submit', handleLogin);
  elements.vaultForm.addEventListener('submit', handleVaultSubmit);
  elements.vaultResetButton.addEventListener('click', resetVaultForm);
  elements.logoutButton.addEventListener('click', handleLogout);
  elements.refreshVaultButton.addEventListener('click', () => refreshVault().catch((error) => setFeedback(error.message, 'error')));
}

async function bootstrap() {
  bindEvents();
  renderViewMode();
  renderSession();
  renderVaultEntries({ onEdit: handleEditVault, onDelete: handleDeleteVault });

  try {
    await refreshAll();
  } catch (error) {
    setFeedback(error.message, 'error');
  }
}

bootstrap();
