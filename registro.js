// Los usuarios registrados se guardan como un array bajo esta clave,
// separada de las credenciales por defecto que usa el login (fwd-login-credentials).
const USERS_KEY = 'fwd-registered-users';

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

const registroForm = document.getElementById('registroForm');
const usuarioInput = document.getElementById('usuario');
const nombreInput = document.getElementById('nombre');
const apellidoInput = document.getElementById('apellido');
const emailInput = document.getElementById('email');
const telefonoInput = document.getElementById('telefono');
const direccionInput = document.getElementById('direccion');
const passwordInput = document.getElementById('password');

registroForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const usuario = usuarioInput.value.trim();
  const nombre = nombreInput.value.trim();
  const apellido = apellidoInput.value.trim();
  const email = emailInput.value.trim();
  const telefono = telefonoInput.value.trim();
  const direccion = direccionInput.value.trim();
  const password = passwordInput.value.trim();

  const users = getUsers();

  const yaExiste = users.some(
    (user) => user.username.toLowerCase() === usuario.toLowerCase()
  );

  if (yaExiste) {
    Swal.fire({
      title: 'Ese usuario ya existe',
      text: 'Elegí otro nombre de usuario o iniciá sesión con tus datos.',
      icon: 'warning'
    });
    return;
  }

  users.push({
    username: usuario, // esto es lo que hay que escribir en "Usuario" al iniciar sesión
    nombre,
    apellido,
    email,
    telefono,
    direccion,
    password
  });

  saveUsers(users);

  Swal.fire({
    title: 'Registro exitoso',
    text: `Tu cuenta fue creada. Iniciá sesión con el usuario "${usuario}" y tu contraseña.`,
    icon: 'success'
  }).then(() => {
    window.location.href = 'index.html';
  });
});