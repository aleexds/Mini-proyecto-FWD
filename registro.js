const USERS_KEY = 'fwd-registered-users';
const ACTIVE_USER_KEY = 'fwd-active-user';

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function saveActiveUser(user) {
  localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
}

const registroForm = document.getElementById('registroForm');

if (registroForm) {
  registroForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const usuario = document.getElementById('usuario')?.value.trim() || '';
    const nombre = document.getElementById('nombre')?.value.trim() || '';
    const apellido = document.getElementById('apellido')?.value.trim() || '';
    const password = document.getElementById('password')?.value.trim() || '';

    if (!usuario || !nombre || !apellido || !password) {
      Swal.fire({
        title: 'Datos incompletos',
        text: 'Completá todos los campos para registrar tu cuenta.',
        icon: 'warning'
      });
      return;
    }

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

    const newUser = {
      username: usuario,
      nombre,
      apellido,
      password
    };

    users.push(newUser);
    saveUsers(users);
    saveActiveUser(newUser);

    Swal.fire({
      title: 'Registro exitoso',
      text: `Tu cuenta fue creada. Iniciá sesión con el usuario "${usuario}" y tu contraseña.`,
      icon: 'success'
    }).then(() => {
      window.location.href = 'index.html';
    });
  });
}
