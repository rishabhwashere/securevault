import { state } from './state.js';

const $ = (selector) => document.querySelector(selector);

const authView = $('#auth-view');
const appView = $('#app-view');
const feedbackBanner = $('#feedback-banner');
const appFeedbackBanner = $('#app-feedback-banner');
const logoutButton = $('#logout-button');
const vaultList = $('#vault-list');
const vaultTemplate = $('#vault-card-template');
const vaultSubmitButton = $('#vault-submit-button');
const welcomeHeading = $('#welcome-heading');
const welcomeCopy = $('#welcome-copy');
const vaultCount = $('#vault-count');
const vaultSummary = $('#vault-summary');
const vaultStatus = $('#vault-status');
const vaultStatusCopy = $('#vault-status-copy');

function formatDate(value) {
  if (!value) return 'Unknown time';

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
}

function createEmptyState(message, className = 'empty-state') {
  const wrapper = document.createElement('div');
  wrapper.className = className;
  wrapper.innerHTML = `<p>${message}</p>`;
  return wrapper;
}

export function bindSectionNav() {
  const loginButton = $('#show-login');
  const registerButton = $('#show-register');
  const loginForm = $('#login-form');
  const registerForm = $('#register-form');

  loginButton.addEventListener('click', () => {
    loginButton.classList.add('is-active');
    registerButton.classList.remove('is-active');
    loginForm.hidden = false;
    registerForm.hidden = true;
    setFeedback('');
  });

  registerButton.addEventListener('click', () => {
    registerButton.classList.add('is-active');
    loginButton.classList.remove('is-active');
    registerForm.hidden = false;
    loginForm.hidden = true;
    setFeedback('');
  });
}

export function renderSession() {
  logoutButton.hidden = !state.user;

  if (!state.user) {
    if (welcomeHeading) welcomeHeading.textContent = 'Welcome back';
    if (welcomeCopy) welcomeCopy.textContent = 'Manage your vault entries here.';
    return;
  }

  const firstName = String(state.user.name || 'there').split(' ')[0];
  welcomeHeading.textContent = `Welcome, ${firstName}`;
  welcomeCopy.textContent = state.vaultEntries.length
    ? 'Your entries are loaded.'
    : 'Create your first vault entry.';
}

export function renderViewMode() {
  const isAuthenticated = Boolean(state.user && state.token);
  authView.hidden = isAuthenticated;
  appView.hidden = !isAuthenticated;
}

export function renderVaultEntries({ onEdit, onDelete }) {
  vaultList.innerHTML = '';

  if (!state.user) {
    renderVaultSummary();
    vaultList.append(createEmptyState('Log in to load vault entries.'));
    return;
  }

  if (!state.vaultEntries.length) {
    renderVaultSummary();
    vaultList.append(createEmptyState('No vault entries yet. Create the first one from the form above.'));
    return;
  }

  state.vaultEntries.forEach((entry) => {
    const fragment = vaultTemplate.content.cloneNode(true);
    const root = fragment.querySelector('.vault-card');

    fragment.querySelector('.vault-category').textContent = entry.category || 'general';
    fragment.querySelector('.vault-title').textContent = entry.title;
    fragment.querySelector('.vault-data').textContent = entry.data;

    const meta = fragment.querySelector('.vault-meta');
    const tags = Array.isArray(entry.tags)
      ? entry.tags
      : String(entry.tags || '')
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean);

    meta.append(...tags.map((tag) => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = `#${tag}`;
      return span;
    }));

    const createdTag = document.createElement('span');
    createdTag.className = 'tag';
    createdTag.textContent = formatDate(entry.createdAt);
    meta.append(createdTag);

    const files = fragment.querySelector('.vault-files');
    (entry.filePath || []).forEach((fileUrl, index) => {
      const link = document.createElement('a');
      link.className = 'file-link';
      link.href = fileUrl;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.textContent = `File ${index + 1}`;
      files.append(link);
    });

    root.querySelector('[data-action="edit"]').addEventListener('click', () => onEdit(entry));
    root.querySelector('[data-action="delete"]').addEventListener('click', () => onDelete(entry));

    vaultList.append(fragment);
  });

  renderVaultSummary();
}

export function setFeedback(message, type = 'success') {
  const banner = state.user ? appFeedbackBanner : feedbackBanner;
  const inactiveBanner = state.user ? feedbackBanner : appFeedbackBanner;

  inactiveBanner.hidden = true;
  inactiveBanner.textContent = '';
  inactiveBanner.className = 'feedback-banner';

  if (!message) {
    banner.hidden = true;
    banner.textContent = '';
    banner.className = 'feedback-banner';
    return;
  }

  banner.hidden = false;
  banner.textContent = message;
  banner.className = `feedback-banner ${type === 'error' ? 'is-error' : 'is-success'}`;
}

export function renderVaultSummary(statusOverride = null) {
  const count = state.vaultEntries.length;
  const hasEntries = count > 0;
  const latestEntry = hasEntries ? state.vaultEntries[0] : null;

  if (vaultCount) {
    vaultCount.textContent = `${count} ${count === 1 ? 'entry' : 'entries'}`;
  }

  if (vaultSummary) {
    vaultSummary.textContent = hasEntries
      ? `Latest: "${latestEntry.title}"`
      : 'Your saved entries will appear here.';
  }

  if (statusOverride) {
    vaultStatus.textContent = statusOverride.title;
    vaultStatusCopy.textContent = statusOverride.copy;
    return;
  }

  if (!state.user) {
    vaultStatus.textContent = 'Signed out';
    vaultStatusCopy.textContent = 'Sign in to view your entries.';
    return;
  }

  if (state.editingId) {
    vaultStatus.textContent = 'Editing';
    vaultStatusCopy.textContent = 'Update the fields and save.';
    return;
  }

  vaultStatus.textContent = hasEntries ? 'Synced' : 'Ready';
  vaultStatusCopy.textContent = hasEntries
    ? 'Your entries are up to date.'
    : 'No activity yet.';
}

export function populateVaultForm(entry) {
  const form = $('#vault-form');

  form.title.value = entry.title || '';
  form.category.value = entry.category || '';
  form.data.value = entry.data || '';
  form.tags.value = Array.isArray(entry.tags) ? entry.tags.join(', ') : entry.tags || '';

  state.editingId = entry._id;
  vaultSubmitButton.textContent = 'Update vault entry';
  renderVaultSummary();
}

export function resetVaultForm() {
  const form = $('#vault-form');
  form.reset();
  state.editingId = null;
  vaultSubmitButton.textContent = 'Save vault entry';
  renderVaultSummary();
}

export function getElements() {
  return {
    logoutButton,
    showLoginButton: $('#show-login'),
    showRegisterButton: $('#show-register'),
    registerForm: $('#register-form'),
    loginForm: $('#login-form'),
    vaultForm: $('#vault-form'),
    refreshVaultButton: $('#refresh-vault-button'),
    vaultResetButton: $('#vault-reset-button')
  };
}
