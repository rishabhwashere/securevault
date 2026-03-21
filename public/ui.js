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
}

export function renderViewMode() {
  const isAuthenticated = Boolean(state.user && state.token);
  authView.hidden = isAuthenticated;
  appView.hidden = !isAuthenticated;
}

export function renderVaultEntries({ onEdit, onDelete }) {
  vaultList.innerHTML = '';

  if (!state.user) {
    vaultList.append(createEmptyState('Log in to load vault entries.'));
    return;
  }

  if (!state.vaultEntries.length) {
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

export function populateVaultForm(entry) {
  const form = $('#vault-form');

  form.title.value = entry.title || '';
  form.category.value = entry.category || '';
  form.data.value = entry.data || '';
  form.tags.value = Array.isArray(entry.tags) ? entry.tags.join(', ') : entry.tags || '';

  state.editingId = entry._id;
  vaultSubmitButton.textContent = 'Update vault entry';
}

export function resetVaultForm() {
  const form = $('#vault-form');
  form.reset();
  state.editingId = null;
  vaultSubmitButton.textContent = 'Save vault entry';
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
