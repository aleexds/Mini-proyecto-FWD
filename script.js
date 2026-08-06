const STORAGE_KEY = 'fwd-login-credentials';

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

function showErrorMessage() {
  errorMsg.classList.remove('hidden');
  errorMsg.textContent = 'Usuario o contraseña incorrectos';
}

function hideErrorMessage() {
  errorMsg.classList.add('hidden');
  errorMsg.textContent = '';
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const enteredUsername = usernameInput.value.trim();
  const enteredPassword = passwordInput.value.trim();
  const storedCredentials = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (
    enteredUsername === storedCredentials.username &&
    enteredPassword === storedCredentials.password
  ) {
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
