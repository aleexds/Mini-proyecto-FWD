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

  const matchesRegisteredUser = registeredUsers.some(
    (user) =>
      user.username.toLowerCase() === enteredUsername.toLowerCase() &&
      user.password === enteredPassword
  );

  if (matchesDefault || matchesRegisteredUser) {
    hideErrorMessage();
    Swal.fire({
      title: 'Credenciales correctas',
      text: 'Acceso concedido',
      icon: 'success'
    });
  } else {
    showErrorMessage();
    Swal.fire({
      title: 'Error',
      text: 'Credenciales incorrectas',
      icon: 'error'
    });
  }
});