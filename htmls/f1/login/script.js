const API_URL = 'http://localhost:8000/api/auth/login';
const PROFILE_PAGE = '../profile/profile.html';
const DEFAULT_ERROR = 'Could not sign in. Please try again';
const NETWORK_ERROR = 'No connection to the server. Check your internet and try again';

const form = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const toggleButton = document.getElementById('toggle-password');
const submitButton = document.getElementById('submit-button');
const serverError = document.getElementById('server-error');
const notice = document.getElementById('notice');

const allInputs = [emailInput, passwordInput];

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

function checkEmail() {
  const email = emailInput.value.trim();
  if (!email.includes('@') || !email.includes('.')) {
    showError(emailInput, 'Enter your email in the format name@mail.com');
    return false;
  }
  return true;
}

function checkPassword() {
  if (passwordInput.value === '') {
    showError(passwordInput, 'Enter your password');
    return false;
  }
  return true;
}

function isFormValid() {
  const emailOk = checkEmail();
  const passwordOk = checkPassword();
  return emailOk && passwordOk;
}

function togglePassword() {
  const isHidden = passwordInput.type === 'password';
  passwordInput.type = isHidden ? 'text' : 'password';
  toggleButton.textContent = isHidden ? 'Hide' : 'Show';
}

async function readErrorMessage(response) {
  try {
    const data = await response.json();
    return data.message || DEFAULT_ERROR;
  } catch (error) {
    return DEFAULT_ERROR;
  }
}

async function sendLogin() {
  let response;

  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
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

  return await response.json();
}

function saveSession(data) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
}

function goToNextPage() {
  window.location.href = PROFILE_PAGE;
}

function setLoading(isLoading) {
  submitButton.disabled = isLoading;
  submitButton.textContent = isLoading ? 'Signing in…' : 'Sign in';
}

async function handleSubmit(event) {
  event.preventDefault();
  clearAllErrors();
  notice.hidden = true;

  if (!isFormValid()) {
    return;
  }

  setLoading(true);

  try {
    const data = await sendLogin();
    saveSession(data);
    goToNextPage();
  } catch (error) {
    serverError.textContent = error.message;
    serverError.hidden = false;
    setLoading(false);
  }
}

notice.hidden = !window.location.search.includes('registered=1');

allInputs.forEach(function (input) {
  input.addEventListener('input', function () {
    clearError(input);
  });
});

toggleButton.addEventListener('click', togglePassword);
form.addEventListener('submit', handleSubmit);
