const USERS_KEY = 'fwd-registered-users';
const ACTIVE_USER_KEY = 'fwd-active-user';
const THEME_KEY = 'fwd-theme';

function readTheme() {
  const raw = localStorage.getItem(THEME_KEY);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  document.body.style.background = theme === 'dark' ? '#07111f' : '#f4f7ff';
  document.body.style.color = theme === 'dark' ? '#f3f6ff' : '#132035';
}

setupThemeToggle();

function setupThemeToggle() {
  let theme = readTheme() === 'light' ? 'light' : 'dark';
  applyTheme(theme);

  const toolbar = document.createElement('div');
  toolbar.id = 'global-toolbar';
  toolbar.style.position = 'fixed';
  toolbar.style.right = '16px';
  toolbar.style.top = '16px';
  toolbar.style.display = 'flex';
  toolbar.style.gap = '8px';
  toolbar.style.zIndex = '2000';
  toolbar.style.padding = '8px';
  toolbar.style.borderRadius = '999px';
  toolbar.style.background = 'rgba(8, 15, 34, 0.9)';
  toolbar.style.backdropFilter = 'blur(8px)';
  document.body.appendChild(toolbar);

  const themeButton = document.createElement('button');
  themeButton.type = 'button';
  themeButton.textContent = theme === 'dark' ? '☀️' : '🌙';
  themeButton.style.border = 'none';
  themeButton.style.borderRadius = '999px';
  themeButton.style.padding = '8px 10px';
  themeButton.style.cursor = 'pointer';
  themeButton.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    applyTheme(theme);
    themeButton.textContent = theme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem(THEME_KEY, JSON.stringify(theme));
  });
  toolbar.appendChild(themeButton);
}

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
      text: `Tu cuenta fue creada con éxito.`,
      icon: 'success'
    }).then(() => {
      window.location.href = 'index.html';
    });
  });
}
