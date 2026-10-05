const API_URL = 'http://localhost:3000';
const LOGIN_PAGE = '../login/login.html?registered=1';
const MIN_NAME_LENGTH = 2;
const MIN_PASSWORD_LENGTH = 8;
const DEFAULT_ERROR = 'Could not create the account. Please try again';
const NETWORK_ERROR = 'No connection to the server. Check your internet and try again';

const form = document.getElementById('register-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirm');
const toggleButton = document.getElementById('toggle-password');
const submitButton = document.getElementById('submit-button');
const serverError = document.getElementById('server-error');

const allInputs = [nameInput, emailInput, passwordInput, confirmInput];

function showError(input, message) {
  const error = document.getElementById(input.id + '-error');
  error.textContent = message;
  error.hidden = false;
  input.setAttribute('aria-invalid', 'true');
}

function clearError(input) {
  const error = document.getElementById(input.id + '-error');
  error.hidden = true;
  input.removeAttribute('aria-invalid');
}

function clearAllErrors() {
  allInputs.forEach(clearError);
  serverError.hidden = true;
}

function checkName() {
  if (nameInput.value.trim().length < MIN_NAME_LENGTH) {
    showError(nameInput, 'Enter a name of at least ' + MIN_NAME_LENGTH + ' characters');
    return false;
  }
  return true;
}

function checkEmail() {
  const email = emailInput.value.trim();
  if (!email.includes('@') || !email.includes('.')) {
    showError(emailInput, 'Enter your email in the format name@mail.com');
    return false;
  }
  return true;
}

function checkPassword() {
  if (passwordInput.value.length < MIN_PASSWORD_LENGTH) {
    showError(passwordInput, 'Password must be at least ' + MIN_PASSWORD_LENGTH + ' characters');
    return false;
  }
  return true;
}

function checkConfirm() {
  if (confirmInput.value !== passwordInput.value) {
    showError(confirmInput, 'Passwords do not match');
    return false;
  }
  return true;
}

function isFormValid() {
  const nameOk = checkName();
  const emailOk = checkEmail();
  const passwordOk = checkPassword();
  const confirmOk = checkConfirm();
  return nameOk && emailOk && passwordOk && confirmOk;
}

function togglePassword() {
  const isHidden = passwordInput.type === 'password';
  const newType = isHidden ? 'text' : 'password';
  passwordInput.type = newType;
  confirmInput.type = newType;
  toggleButton.textContent = isHidden ? 'Hide' : 'Show';
}

async function readErrorMessage(response) {
  try {
    const data = await response.json();
    return data.error || data.message || DEFAULT_ERROR;
  } catch (error) {
    return DEFAULT_ERROR;
  }
}

async function sendRegistration() {
  let response;

  try {
    response = await fetch(API_URL + '/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value,
      }),
    });
  } catch (error) {
    throw new Error(NETWORK_ERROR);
  }

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
}

function setLoading(isLoading) {
  submitButton.disabled = isLoading;
  submitButton.textContent = isLoading ? 'Creating account…' : 'Sign up';
}

async function handleSubmit(event) {
  event.preventDefault();
  clearAllErrors();

  if (!isFormValid()) {
    return;
  }

  setLoading(true);

  try {
    await sendRegistration();
    window.location.href = LOGIN_PAGE;
  } catch (error) {
    serverError.textContent = error.message;
    serverError.hidden = false;
  } finally {
    setLoading(false);
  }
}

allInputs.forEach(function (input) {
  input.addEventListener('input', function () {
    clearError(input);
  });
});

toggleButton.addEventListener('click', togglePassword);
form.addEventListener('submit', handleSubmit);
