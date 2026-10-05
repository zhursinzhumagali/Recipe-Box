const DEMO_MODE = true;
const API_URL = 'http://localhost:8000/api/auth/forgot-password';
const DEFAULT_ERROR = 'Could not send the email. Please try again';
const NETWORK_ERROR = 'No connection to the server. Check your internet and try again';
const SUCCESS_TEXT = 'If an account with this email exists, we have sent a reset link to it';

const form = document.getElementById('forgot-form');
const emailInput = document.getElementById('email');
const emailError = document.getElementById('email-error');
const submitButton = document.getElementById('submit-button');
const serverError = document.getElementById('server-error');
const notice = document.getElementById('notice');

function showEmailError(text) {
  emailError.textContent = text;
  emailError.hidden = false;
  emailInput.setAttribute('aria-invalid', 'true');
}

function clearEmailError() {
  emailError.hidden = true;
  emailInput.removeAttribute('aria-invalid');
}

function checkEmail() {
  const email = emailInput.value.trim();

  if (!email.includes('@') || !email.includes('.')) {
    showEmailError('Enter your email in the format name@mail.com');
    return false;
  }

  return true;
}

async function readErrorMessage(response) {
  try {
    const data = await response.json();
    return data.message || DEFAULT_ERROR;
  } catch (error) {
    return DEFAULT_ERROR;
  }
}

async function sendResetRequest() {
  if (DEMO_MODE) {
    return;
  }

  let response;

  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput.value.trim() }),
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
  submitButton.textContent = isLoading ? 'Sending…' : 'Send reset link';
}

async function handleSubmit(event) {
  event.preventDefault();
  clearEmailError();
  serverError.hidden = true;
  notice.hidden = true;

  if (!checkEmail()) {
    return;
  }

  setLoading(true);

  try {
    await sendResetRequest();
    notice.textContent = SUCCESS_TEXT;
    notice.hidden = false;
    form.reset();
  } catch (error) {
    serverError.textContent = error.message;
    serverError.hidden = false;
  } finally {
    setLoading(false);
  }
}

emailInput.addEventListener('input', clearEmailError);
form.addEventListener('submit', handleSubmit);
