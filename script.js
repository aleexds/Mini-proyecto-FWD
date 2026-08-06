const STORAGE_KEY = 'fwd-login-credentials';
// Misma clave que usa registro.js para guardar las cuentas creadas desde el formulario de registro.
const USERS_KEY = 'fwd-registered-users';

const defaultCredentials = {
  username: 'FWD',
  password: '1234'
};

if (!localStorage.getItem(STORAGE_KEY)) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCredentials));
}

const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorMsg = document.getElementById('errorMsg');
const togglePasswordButton = document.getElementById('togglePassword');

function showErrorMessage() {
  errorMsg.classList.remove('hidden');
  errorMsg.textContent = 'Usuario o contraseña incorrectos';
}

function hideErrorMessage() {
  errorMsg.classList.add('hidden');
  errorMsg.textContent = '';
}

// Toast de error: fondo rojo oscuro, esquina superior derecha.
function showErrorToast() {
  Toastify({
    text: '❌ Usuario o contraseña incorrectos',
    duration: 3500,
    gravity: 'top',
    position: 'right',
    close: true,
    stopOnFocus: true,
    className: 'toast-error',
    style: {
      background: 'linear-gradient(135deg, #d9463f 0%, #8f221c 100%)',
      borderRadius: '14px',
      boxShadow: '0 12px 24px -8px rgba(143, 34, 28, 0.5)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '14px',
      padding: '14px 18px'
    }
  }).showToast();
}

// Toast de bienvenida: fondo navy con acento cian, con el nombre del usuario que ingresó.
function showWelcomeToast(name) {
  Toastify({
    text: `🚀 ¡Bienvenido, ${name}!`,
    duration: 3500,
    gravity: 'top',
    position: 'right',
    close: true,
    stopOnFocus: true,
    className: 'toast-success',
    style: {
      background: 'linear-gradient(135deg, #16294a 0%, #0e1b30 100%)',
      borderLeft: '4px solid #6fd6ff',
      borderRadius: '14px',
      boxShadow: '0 12px 24px -8px rgba(14, 27, 48, 0.55)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '14px',
      padding: '14px 18px'
    }
  }).showToast();
}

if (togglePasswordButton) {
  togglePasswordButton.addEventListener('click', () => {
    const isPasswordHidden = passwordInput.getAttribute('type') === 'password';
    const nextType = isPasswordHidden ? 'text' : 'password';
    const nextLabel = isPasswordHidden ? 'Ocultar contraseña' : 'Mostrar contraseña';

    passwordInput.setAttribute('type', nextType);
    togglePasswordButton.setAttribute('aria-label', nextLabel);
    togglePasswordButton.setAttribute('title', nextLabel);
    togglePasswordButton.classList.toggle('visible', isPasswordHidden);
  });
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const enteredUsername = usernameInput.value.trim();
  const enteredPassword = passwordInput.value.trim();

  const storedCredentials = JSON.parse(localStorage.getItem(STORAGE_KEY));
  const registeredUsers = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

  const matchesDefault =
    enteredUsername === storedCredentials.username &&
    enteredPassword === storedCredentials.password;

  const matchedUser = registeredUsers.find(
    (user) =>
      user.username.toLowerCase() === enteredUsername.toLowerCase() &&
      user.password === enteredPassword
  );

  if (matchesDefault || matchedUser) {
    hideErrorMessage();
    showWelcomeToast(enteredUsername);
  } else {
    showErrorMessage();
    showErrorToast();
  }
});