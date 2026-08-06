const STORAGE_KEY = 'fwd-login-credentials';
const USERS_KEY = 'fwd-registered-users';
const ACTIVE_USER_KEY = 'fwd-active-user';

const defaultCredentials = {
  username: 'FWD',
  password: '1234'
};

function getStoredCredentials() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : defaultCredentials;
}

function saveStoredCredentials(credentials) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
}

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getActiveUser() {
  const stored = localStorage.getItem(ACTIVE_USER_KEY);
  return stored ? JSON.parse(stored) : null;
}

function saveActiveUser(user) {
  localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
}

function clearActiveUser() {
  localStorage.removeItem(ACTIVE_USER_KEY);
}

function getDisplayName(user) {
  if (!user) return 'Usuario';

  const fullName = [user.nombre, user.apellido].filter(Boolean).join(' ').trim();
  return fullName || user.name || user.username || 'Usuario';
}

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || 'U';
}

if (!localStorage.getItem(STORAGE_KEY)) {
  saveStoredCredentials(defaultCredentials);
}

const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorMsg = document.getElementById('errorMsg');
const togglePasswordButton = document.getElementById('togglePassword');

function showErrorMessage() {
  if (errorMsg) {
    errorMsg.classList.remove('hidden');
    errorMsg.textContent = 'Usuario o contraseña incorrectos';
  }
}

function hideErrorMessage() {
  if (errorMsg) {
    errorMsg.classList.add('hidden');
    errorMsg.textContent = '';
  }
}

function showLoginErrorAlert() {
  Swal.fire({
    title: 'Error',
    text: 'Credenciales incorrectas',
    icon: 'error'
  });
}

function showLoginSuccessAlert(userName) {
  Swal.fire({
    title: 'Credenciales correctas',
    text: 'Acceso concedido',
    icon: 'success'
  }).then(() => {
    window.location.href = 'Dashboard.html';
  });
}

if (togglePasswordButton && passwordInput) {
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

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const enteredUsername = usernameInput?.value.trim() || '';
    const enteredPassword = passwordInput?.value.trim() || '';

    const storedCredentials = getStoredCredentials();
    const registeredUsers = getUsers();

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
      const authUser = matchedUser || {
        username: enteredUsername,
        nombre: enteredUsername,
        apellido: ''
      };

      saveActiveUser(authUser);
      showLoginSuccessAlert(getDisplayName(authUser));
    } else {
      showErrorMessage();
      showLoginErrorAlert();
    }
  });
}

function setupDashboardUser() {
  const activeUser = getActiveUser();
  const welcomeTitle = document.getElementById('titulo-bienvenida');
  const userNameElement = document.querySelector('.dashboard__user-name');
  const userInitialsElement = document.querySelector('.dashboard__user-initials');

  if (!activeUser) {
    Swal.fire({
      title: 'Sesión no iniciada',
      text: 'Debés iniciar sesión para ver el dashboard.',
      icon: 'warning'
    }).then(() => {
      window.location.href = 'index.html';
    });
    return;
  }

  const displayName = getDisplayName(activeUser);

  if (welcomeTitle) {
    welcomeTitle.textContent = `Bienvenido/a de nuevo, ${displayName}`;
  }

  if (userNameElement) {
    userNameElement.textContent = displayName;
  }

  if (userInitialsElement) {
    userInitialsElement.textContent = getInitials(displayName);
  }
}

function setupClientNavigation() {
  document.querySelectorAll('a[href="Clientes.html"], a[href="clientes.html"], a[href="#clientes"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (link.getAttribute('href') === '#clientes') {
        event.preventDefault();
        window.location.href = 'Clientes.html';
      }
    });
  });
}

function createSpaceBackground() {
  if (document.getElementById('spaceCanvas')) {
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.id = 'spaceCanvas';
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '-1';
  canvas.style.pointerEvents = 'none';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  const stars = [];
  const planets = [];
  const blackHoles = [];

  function createScene() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    stars.length = 0;
    planets.length = 0;
    blackHoles.length = 0;

    const starCount = width > 900 ? 140 : 90;
    for (let i = 0; i < starCount; i += 1) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.25 + 0.05
      });
    }

    const planetCount = width > 900 ? 3 : 2;
    for (let i = 0; i < planetCount; i += 1) {
      planets.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.7,
        radius: Math.random() * 24 + 14,
        color: i === 0 ? '#6fd6ff' : '#b99cff',
        speed: (Math.random() * 0.002 + 0.001) * (i % 2 === 0 ? 1 : -1),
        offset: Math.random() * Math.PI * 2
      });
    }

    const blackHoleCount = width > 900 ? 2 : 1;
    for (let i = 0; i < blackHoleCount; i += 1) {
      blackHoles.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.8,
        radius: Math.random() * 18 + 14,
        glow: Math.random() * 0.3 + 0.3
      });
    }
  }

  function animate() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    ctx.clearRect(0, 0, width, height);

    const background = ctx.createLinearGradient(0, 0, 0, height);
    background.addColorStop(0, '#020611');
    background.addColorStop(1, '#071224');
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    stars.forEach((star) => {
      star.y += star.speed;
      if (star.y > height + 5) {
        star.y = -5;
        star.x = Math.random() * width;
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
      ctx.fill();
    });

    planets.forEach((planet, index) => {
      planet.offset += planet.speed;
      const driftX = Math.sin(planet.offset) * (30 + index * 12);
      const driftY = Math.cos(planet.offset * 0.7) * (20 + index * 8);

      ctx.beginPath();
      ctx.arc(planet.x + driftX, planet.y + driftY, planet.radius, 0, Math.PI * 2);
      ctx.fillStyle = planet.color;
      ctx.globalAlpha = 0.82;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    blackHoles.forEach((hole) => {
      const gradient = ctx.createRadialGradient(hole.x, hole.y, 2, hole.x, hole.y, hole.radius * 2.3);
      gradient.addColorStop(0, 'rgba(255,255,255,0.2)');
      gradient.addColorStop(0.3, 'rgba(0,0,0,0.4)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.95)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(hole.x, hole.y, hole.radius * 2.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(hole.x, hole.y, hole.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#000';
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  createScene();
  animate();
  window.addEventListener('resize', createScene);
}

const currentPage = window.location.pathname.split('/').pop() || 'index.html';

if (currentPage === 'Dashboard.html') {
  setupDashboardUser();
  setupClientNavigation();
} else if (currentPage === 'Clientes.html') {
  const activeUser = getActiveUser();
  if (!activeUser) {
    Swal.fire({
      title: 'Sesión no iniciada',
      text: 'Debés iniciar sesión para ver la vista de clientes.',
      icon: 'warning'
    }).then(() => {
      window.location.href = 'index.html';
    });
  }
}

createSpaceBackground();