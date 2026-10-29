/* =========================================================
   DigiMax — script.js
   Lógica compartida: datos, autenticación simulada (localStorage),
   render de cursos, compra ficticia, comunidad y utilidades UI.
   ========================================================= */

/* ---------------------------------------------------------
   1. DATOS DE CURSOS (catálogo ficticio)
   --------------------------------------------------------- */
const COURSES = [
 {
    id: "c1",
    title: "Desarrollo Web Full Stack con React y Node.js",
    cat: "tecnologia",
    catLabel: "Tecnología",
    level: "Intermedio",
    duration: "42 horas",
    lessons: 4,
    price: 149000,
    oldPrice: 299000,
    rating: 4.9,
    reviews: 320,
    teacher: "Carlos Mendoza",
    teacherRole: "Senior Full Stack Engineer",
    icon: "💻",
    grad: "grad-blue",
    longDesc: "Aprende a construir aplicaciones web completas desde el frontend hasta el backend...",
    curriculum: [
      { title: "Fundamentos de HTML5 y CSS3 Moderno", time: "4h 15m" },
      { title: "JavaScript ES6+ Avanzado", time: "8h 30m" },
      { title: "Frontend con React y Redux Toolkit", time: "14h 45m" },
      { title: "Backend con Node.js, Express y MongoDB", time: "14h 30m" }
    ]
  },
  {
    id: "c2",
    title: "Ciencia de Datos y Machine Learning con Python",
    cat: "tecnologia",
    catLabel: "Tecnología",
    level: "Avanzado",
    duration: "50 horas",
    lessons: 4,
    price: 179000,
    oldPrice: 350000,
    rating: 4.8,
    reviews: 210,
    teacher: "Dra. Elena Gómez",
    teacherRole: "Data Scientist & AI Researcher",
    icon: "📊",
    grad: "grad-purple",
    longDesc: "Domina el análisis de datos, visualización y algoritmos de Machine Learning con Python...",
    curriculum: [
      { title: "Introducción a Python para Ciencia de Datos", time: "8h" },
      { title: "Análisis Exploratorio con Pandas y NumPy", time: "12h" },
      { title: "Visualización con Seaborn y Matplotlib", time: "10h" },
      { title: "Modelos de Machine Learning con Scikit-Learn", time: "20h" }
    ]
  },
  {
    id: "c3",
    title: "Marketing Digital y Estrategia de Redes Sociales",
    cat: "marketing",
    catLabel: "Marketing",
    level: "Principiante",
    duration: "24 horas",
    lessons: 3,
    price: 99000,
    oldPrice: 180000,
    rating: 4.7,
    reviews: 185,
    teacher: "Ana María Silva",
    teacherRole: "Growth Marketer & Digital Specialist",
    icon: "📈",
    grad: "grad-green",
    longDesc: "Diseña estrategias efectivas en redes sociales, campañas de Ads y conversión digital...",
    curriculum: [
      { title: "Fundamentos del Marketing Digital", time: "5h" },
      { title: "Estrategia de Contenidos y SEO", time: "7h" },
      { title: "Publicidad en Meta Ads y Google Ads", time: "12h" }
    ]
  },
  {
    id: "c4", title: "Fotografía Digital para Todos", cat: "diseno", catLabel: "Diseño",
    teacher: "Miguel Ángel Torres", teacherRole: "Fotógrafo profesional",
    price: 45900, oldPrice: 65900, rating: 4.6, reviews: 80, level: "Principiante",
    duration: "9 horas", lessons: 5, badge: "trend", grad: "grad-4", icon: "📷",
    desc: "Captura momentos y cuenta historias a través de la fotografía digital.",
    longDesc: "Aprende a usar la luz, la composición y tu cámara (o celular) para capturar fotografías con intención. Incluye edición básica y creación de un portafolio visual propio.",
    curriculum: [
      {title: "Fundamentos de composición", time: "1h 00min"},
      {title: "Luz natural y luz artificial", time: "1h 30min"},
      {title: "Ajustes manuales de cámara", time: "2h 00min"},
      {title: "Edición con herramientas digitales", time: "2h 10min"},
      {title: "Proyecto final: tu portafolio visual", time: "1h 40min"}
    ]
  },
  {
    id: "c5", title: "Diseño Gráfico Básico", cat: "diseno", catLabel: "Diseño",
    teacher: "Camila Sánchez", teacherRole: "Diseñadora gráfica",
    price: 42900, oldPrice: 62900, rating: 4.7, reviews: 64, level: "Principiante",
    duration: "8 horas", lessons: 5, badge: "", grad: "grad-6", icon: "🎨",
    desc: "Aprende los fundamentos del diseño: color, tipografía y composición visual.",
    longDesc: "Un curso práctico para dominar los principios del diseño gráfico y comenzar a crear piezas visuales atractivas para redes sociales, marca personal o negocios.",
    curriculum: [
      {title: "Teoría del color", time: "1h 00min"},
      {title: "Tipografía y jerarquía visual", time: "1h 20min"},
      {title: "Composición y retícula", time: "1h 30min"},
      {title: "Herramientas de diseño digital", time: "2h 00min"},
      {title: "Proyecto final: kit de marca", time: "2h 10min"}
    ]
  },
  {
    id: "c6", title: "Inglés para Principiantes", cat: "idiomas", catLabel: "Idiomas",
    teacher: "Jessica Londoño", teacherRole: "Docente de inglés certificada",
    price: 35900, oldPrice: 49900, rating: 4.8, reviews: 110, level: "Principiante",
    duration: "14 horas", lessons: 5, badge: "popular", grad: "grad-5", icon: "🗣️",
    desc: "Comienza a hablar inglés con confianza desde tus primeras clases.",
    longDesc: "Vocabulario esencial, gramática básica y práctica de conversación guiada. Pensado para avanzar a tu propio ritmo con ejercicios cortos y aplicables.",
    curriculum: [
      {title: "Saludos y presentaciones", time: "40 min"},
      {title: "Vocabulario cotidiano", time: "1h 20min"},
      {title: "Gramática esencial", time: "2h 00min"},
      {title: "Conversación guiada", time: "2h 30min"},
      {title: "Proyecto final: tu primera conversación", time: "1h 00min"}
    ]
  },
  {
    id: "c7", title: "Finanzas Personales para Adultos", cat: "negocios", catLabel: "Negocios",
    teacher: "Miguel Ángel Torres", teacherRole: "Asesor financiero",
    price: 38900, oldPrice: 54900, rating: 4.7, reviews: 58, level: "Principiante",
    duration: "7 horas", lessons: 5, badge: "", grad: "grad-7", icon: "💰",
    desc: "Organiza tus finanzas, ahorra e invierte con criterio, sin importar tu ingreso.",
    longDesc: "Aprende a construir un presupuesto realista, salir de deudas, ahorrar con propósito y dar tus primeros pasos en el mundo de la inversión.",
    curriculum: [
      {title: "Diagnóstico financiero personal", time: "45 min"},
      {title: "Presupuesto y control de gastos", time: "1h 15min"},
      {title: "Estrategias para salir de deudas", time: "1h 30min"},
      {title: "Ahorro con propósito", time: "1h 00min"},
      {title: "Primeros pasos en inversión", time: "1h 40min"}
    ]
  },
  {
    id: "c8", title: "Desarrollo Personal y Hábitos", cat: "personal", catLabel: "Desarrollo personal",
    teacher: "Ana Fernández", teacherRole: "Coach de hábitos",
    price: 32900, oldPrice: 45900, rating: 4.9, reviews: 132, level: "Todos los niveles",
    duration: "6 horas", lessons: 5, badge: "nuevo", grad: "grad-1", icon: "🌱",
    desc: "Construye hábitos sostenibles y mejora tu productividad día a día.",
    longDesc: "Un curso práctico sobre ciencia del hábito, gestión del tiempo y enfoque. Ideal para quienes buscan mejorar su rutina sin depender de la fuerza de voluntad.",
    curriculum: [
      {title: "La ciencia detrás de los hábitos", time: "50 min"},
      {title: "Diseño de rutinas sostenibles", time: "1h 10min"},
      {title: "Gestión del tiempo y prioridades", time: "1h 20min"},
      {title: "Enfoque y eliminación de distracciones", time: "1h 00min"},
      {title: "Proyecto final: tu plan de 30 días", time: "1h 00min"}
    ]
  }
];

const CATEGORIES = [
  {key: "tecnologia", label: "Tecnología", icon: "💻", cls: "cat-tech", count: "1 curso"},
  {key: "negocios", label: "Negocios", icon: "💼", cls: "cat-negocios", count: "2 cursos"},
  {key: "personal", label: "Desarrollo personal", icon: "🌱", cls: "cat-personal", count: "1 curso"},
  {key: "diseno", label: "Diseño", icon: "🎨", cls: "cat-diseno", count: "2 cursos"},
  {key: "marketing", label: "Marketing", icon: "📣", cls: "cat-marketing", count: "1 curso"},
  {key: "idiomas", label: "Idiomas", icon: "🗨️", cls: "cat-idiomas", count: "1 curso"}
];

const LIVE_CLASSES = [
  {id: "l1", courseId: "c1", title: "Marketing Digital para principiantes", teacher: "Valentina R.", time: "10:00 AM", seats: 28, grad: "grad-1", icon: "📈", live: true},
  {id: "l2", courseId: "c3", title: "Excel Intermedio: Tablas y funciones", teacher: "Andrés M.", time: "11:30 AM", seats: 32, grad: "grad-3", icon: "📊", live: true},
  {id: "l3", courseId: "c5", title: "Diseño Gráfico Básico", teacher: "Camila S.", time: "2:30 PM", seats: 15, grad: "grad-6", icon: "🎨", live: false},
  {id: "l4", courseId: "c6", title: "Inglés para principiantes", teacher: "Jessica L.", time: "4:00 PM", seats: 41, grad: "grad-5", icon: "🗣️", live: false},
  {id: "l5", courseId: "c7", title: "Finanzas Personales para adultos", teacher: "Miguel A.", time: "6:00 PM", seats: 19, grad: "grad-7", icon: "💰", live: false},
  {id: "l6", courseId: "c2", title: "Programación Web: repaso semanal", teacher: "Andrés M.", time: "7:30 PM", seats: 24, grad: "grad-2", icon: "💻", live: false}
];

const SEED_POSTS = [
  {id: "p1", author: "Laura Gómez", role: "Estudiante · Marketing Digital", time: "Hace 2 horas", topic: "Marketing", text: "Terminé el módulo de Meta Ads y ya lancé mi primera campaña 🎉 ¿algún tip para bajar el costo por clic?", likes: 14},
  {id: "p2", author: "Carlos Restrepo", role: "Estudiante · Programación Web", time: "Hace 5 horas", topic: "Tecnología", text: "¿Alguien más está atascado con flexbox? Encontré este truco: usar gap en vez de márgenes me salvó la vida.", likes: 9},
  {id: "p3", author: "Ana Fernández", role: "Estudiante · Desarrollo Personal", time: "Ayer", topic: "Desarrollo personal", text: "Llevo 21 días con la rutina del curso y ya se siente automática. Recomendadísimo si les cuesta la constancia.", likes: 22}
];

/* ---------------------------------------------------------
   2. UTILIDADES GENERALES
   --------------------------------------------------------- */
const $ = (sel, ctx) => (ctx || document).querySelector(sel);
const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

function formatCOP(n){
  return "$" + Number(n).toLocaleString("es-CO");
}

function qs(name){
  return new URLSearchParams(window.location.search).get(name);
}

function getCourse(id){
  return COURSES.find(c => c.id === id);
}

function badgeMeta(badge){
  switch(badge){
    case "popular": return {label: "Más popular", cls: "badge-popular"};
    case "nuevo": return {label: "Nuevo", cls: "badge-new"};
    case "best": return {label: "Bestseller", cls: "badge-best"};
    case "trend": return {label: "Popular", cls: "badge-trend"};
    default: return null;
  }
}

function showToast(message, type){
  let toast = $("#toast");
  if(!toast){
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.className = "toast" + (type ? " " + type : "");
  toast.textContent = message;
  requestAnimationFrame(() => toast.classList.add("show"));
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 3200);
}

/* ---------------------------------------------------------
   3. AUTENTICACIÓN FICTICIA (localStorage)
   --------------------------------------------------------- */
const LS_USERS = "digimax_users";
const LS_SESSION = "digimax_session";

function getUsers(){
  return JSON.parse(localStorage.getItem(LS_USERS) || "[]");
}
function saveUsers(users){
  localStorage.setItem(LS_USERS, JSON.stringify(users));
}
function getSession(){
  return JSON.parse(localStorage.getItem(LS_SESSION) || "null");
}
function setSession(email){
  localStorage.setItem(LS_SESSION, JSON.stringify({email}));
}
function clearSession(){
  localStorage.removeItem(LS_SESSION);
}
function currentUser(){
  const s = getSession();
  if(!s) return null;
  return getUsers().find(u => u.email === s.email) || null;
}
function isLoggedIn(){
  return !!currentUser();
}

function registerUser(name, email, password){
  const users = getUsers();
  if(users.some(u => u.email.toLowerCase() === email.toLowerCase())){
    return {ok: false, error: "Ya existe una cuenta registrada con este correo."};
  }
  users.push({name, email, password, joined: new Date().toISOString()});
  saveUsers(users);
  setSession(email);
  return {ok: true};
}

function loginUser(email, password){
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if(!user) return {ok: false, error: "No encontramos una cuenta con ese correo."};
  if(user.password !== password) return {ok: false, error: "La contraseña es incorrecta."};
  setSession(email);
  return {ok: true};
}

function logoutUser(){
  clearSession();
  window.location.href = "index.html";
}

function initials(name){
  return name.trim().split(/\s+/).slice(0,2).map(w => w[0].toUpperCase()).join("");
}

function requireAuth(){
  if(!isLoggedIn()){
    window.location.href = "login.html?redirect=" + encodeURIComponent(location.pathname.split("/").pop());
    return false;
  }
  return true;
}

/* ---------------------------------------------------------
   4. MIS CURSOS (compra ficticia + progreso)
   --------------------------------------------------------- */
function myCoursesKey(email){ return "digimax_mycourses_" + email; }

function getMyCourses(email){
  return JSON.parse(localStorage.getItem(myCoursesKey(email)) || "[]");
}
function saveMyCourses(email, list){
  localStorage.setItem(myCoursesKey(email), JSON.stringify(list));
}
function isPurchased(email, courseId){
  return getMyCourses(email).some(c => c.courseId === courseId);
}
function addPurchase(email, courseId){
  const list = getMyCourses(email);
  if(list.some(c => c.courseId === courseId)) return;
  list.push({
    courseId,
    progress: 0,
    purchasedAt: new Date().toISOString(),
    completed: false
  });
  saveMyCourses(email, list);
}
function bumpProgress(email, courseId, amount){
  const list = getMyCourses(email);
  const entry = list.find(c => c.courseId === courseId);
  if(!entry) return;
  entry.progress = Math.min(100, entry.progress + amount);
  entry.completed = entry.progress >= 100;
  saveMyCourses(email, list);
}

/* ---------------------------------------------------------
   5. NAVBAR — estado de sesión, menú usuario, móvil
   --------------------------------------------------------- */
function initNavbar(){
  const user = currentUser();
  document.body.classList.toggle("is-auth", !!user);

  // Chip de usuario
  const chipName = $("#navUserName");
  const chipAvatar = $("#navUserAvatar");
  if(user && chipName){
    chipName.textContent = user.name.split(" ")[0];
    if(chipAvatar) chipAvatar.textContent = initials(user.name);
  }

  // Menú desplegable de usuario
  const chip = $("#userChip");
  const menu = $("#userMenu");
  if(chip && menu){
    chip.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("open");
    });
    document.addEventListener("click", () => menu.classList.remove("open"));
  }

  // Cerrar sesión
  $$(".logout-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      logoutUser();
    });
  });

  // Menú móvil
  const toggle = $("#mobileToggle");
  const links = $("#navLinks");
  if(toggle && links){
    toggle.addEventListener("click", () => links.classList.toggle("mobile-open"));
  }

  // Resaltar enlace activo
  const current = location.pathname.split("/").pop() || "index.html";
  $$(".nav-links a").forEach(a => {
    if(a.getAttribute("href") === current) a.classList.add("active");
  });

  // Buscador en navbar
  const navSearch = $("#navSearchInput");
  if(navSearch){
    navSearch.addEventListener("keydown", (e) => {
      if(e.key === "Enter" && navSearch.value.trim()){
        window.location.href = "cursos.html?q=" + encodeURIComponent(navSearch.value.trim());
      }
    });
  }
}

/* ---------------------------------------------------------
   6. RENDER DE TARJETAS DE CURSO
   --------------------------------------------------------- */
function courseCardHTML(course){
  const b = badgeMeta(course.badge);
  return `
  <article class="course-card">
    <a href="curso.html?id=${course.id}" class="course-thumb ${course.grad}">
      ${b ? `<span class="course-badge ${b.cls}">${b.label}</span>` : ""}
      <span>${course.icon}</span>
    </a>
    <div class="course-body">
      <span class="course-cat">${course.catLabel}</span>
      <h3 class="course-title"><a href="curso.html?id=${course.id}">${course.title}</a></h3>
      <p class="course-desc">${course.desc}</p>
      <div class="course-meta">
        <span class="stars">★ ${course.rating}</span>
        <span>(${course.reviews})</span>
        <span>·</span>
        <span>${course.level}</span>
      </div>
      <div class="course-foot">
        <span class="course-price">${formatCOP(course.price)}</span>
        <a href="curso.html?id=${course.id}" class="btn btn-primary">Ver curso</a>
      </div>
    </div>
  </article>`;
}

function renderFeaturedCourses(targetSel, limit){
  const el = $(targetSel);
  if(!el) return;
  const list = COURSES.slice(0, limit || 4);
  el.innerHTML = list.map(courseCardHTML).join("");
}

function renderCategoryGrid(targetSel){
  const el = $(targetSel);
  if(!el) return;
  el.innerHTML = CATEGORIES.map(c => `
    <a href="cursos.html?cat=${c.key}" class="category-card">
      <div class="cat-icon ${c.cls}">${c.icon}</div>
      <span>${c.label}</span>
      <small>${c.count}</small>
    </a>
  `).join("");
}

/* ---------------------------------------------------------
   7. PÁGINA DE CATÁLOGO (cursos.html) — filtros y búsqueda
   --------------------------------------------------------- */
function initCoursesPage(){
  const grid = $("#coursesGrid");
  if(!grid) return;

  const searchInput = $("#coursesSearch");
  const chips = $$(".filter-chip");
  const resultsCount = $("#resultsCount");
  let activeCat = qs("cat") || "todas";
  let activeQuery = qs("q") || "";

  if(searchInput) searchInput.value = activeQuery;

  function applyFilters(){
    let list = COURSES;
    if(activeCat !== "todas"){
      list = list.filter(c => c.cat === activeCat);
    }
    if(activeQuery.trim()){
      const q = activeQuery.trim().toLowerCase();
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.catLabel.toLowerCase().includes(q) ||
        c.teacher.toLowerCase().includes(q)
      );
    }
    if(list.length){
      grid.innerHTML = list.map(courseCardHTML).join("");
    } else {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1;">
          <div class="e-icon">🔍</div>
          <h3>No encontramos cursos</h3>
          <p>Intenta con otra palabra clave o categoría.</p>
        </div>`;
    }
    if(resultsCount) resultsCount.textContent = list.length + (list.length === 1 ? " curso encontrado" : " cursos encontrados");

    chips.forEach(chip => chip.classList.toggle("active", chip.dataset.cat === activeCat));
  }

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      activeCat = chip.dataset.cat;
      applyFilters();
    });
  });

  if(searchInput){
    searchInput.addEventListener("input", () => {
      activeQuery = searchInput.value;
      applyFilters();
    });
  }

  applyFilters();
}

/* ---------------------------------------------------------
   8. PÁGINA DE DETALLE DE CURSO (curso.html)
   --------------------------------------------------------- */
function initCourseDetailPage(){
  const wrap = $("#courseDetailRoot");
  if(!wrap) return;

  const course = getCourse(qs("id")) || COURSES[0];
  document.title = course.title + " · DigiMax";

  $("#cdCategory").textContent = course.catLabel;
  $("#cdTitle").textContent = course.title;
  $("#cdDesc").textContent = course.longDesc;
  $("#cdRating").textContent = "★ " + course.rating + " (" + course.reviews + " reseñas)";
  $("#cdLevel").innerHTML = "Nivel: <b>" + course.level + "</b>";
  $("#cdDuration").innerHTML = "Duración: <b>" + course.duration + "</b>";
  $("#cdLessons").innerHTML = "<b>" + course.lessons + "</b> clases";
  $("#cdTeacherName").textContent = course.teacher;
  $("#cdTeacherRole").textContent = course.teacherRole;
  $("#cdTeacherAvatar").textContent = initials(course.teacher);
  $("#cdBreadcrumbTitle").textContent = course.title;

  const thumb = $("#cdThumb");
  thumb.classList.add(course.grad);
  thumb.textContent = course.icon;

  $("#cdPrice").textContent = formatCOP(course.price);
  $("#cdOldPrice").textContent = formatCOP(course.oldPrice);

  $("#cdCurriculum").innerHTML = course.curriculum.map((item, i) => `
    <div class="curriculum-item">
      <div class="c-left">
        <span class="c-num">${i+1}</span>
        <span>${item.title}</span>
      </div>
      <span class="c-time">${item.time}</span>
    </div>
  `).join("");

  // Otros cursos relacionados
  const related = COURSES.filter(c => c.cat === course.cat && c.id !== course.id).slice(0,3);
  const relatedList = related.length ? related : COURSES.filter(c => c.id !== course.id).slice(0,3);
  $("#cdRelated").innerHTML = relatedList.map(courseCardHTML).join("");

  updateBuyButton(course.id);

  $("#cdBuyBtn").addEventListener("click", () => {
    if(!isLoggedIn()){
      window.location.href = "login.html?redirect=curso.html?id=" + course.id;
      return;
    }
    if(isPurchased(currentUser().email, course.id)){
      window.location.href = "mis-cursos.html";
      return;
    }
    openPaymentModal(course.id);
  });
}

function updateBuyButton(courseId){
  const btn = $("#cdBuyBtn");
  if(!btn) return;
  const user = currentUser();
  if(user && isPurchased(user.email, courseId)){
    btn.textContent = "Ir a mi curso";
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-outline");
  } else {
    btn.textContent = "Comprar curso";
    btn.classList.add("btn-primary");
    btn.classList.remove("btn-outline");
  }
}

/* ---------------------------------------------------------
   9. PASARELA DE PAGO FICTICIA (modal)
   --------------------------------------------------------- */
let PAYING_COURSE_ID = null;

function openPaymentModal(courseId){
  PAYING_COURSE_ID = courseId;
  const course = getCourse(courseId);
  const modal = $("#paymentModal");
  if(!modal) return;
  $("#pmCourseTitle").textContent = course.title;
  $("#pmCoursePrice").textContent = formatCOP(course.price);
  $("#pmThumb").className = "thumb-sm " + course.grad;
  $("#pmThumb").textContent = course.icon;
  $("#paymentForm").reset();
  $("#pmError").classList.remove("show");
  modal.classList.add("open");
}

function closeModal(id){
  const modal = $("#" + id);
  if(modal) modal.classList.remove("open");
}

function initPaymentModal(){
  const form = $("#paymentForm");
  if(!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const card = $("#pmCardNumber").value.trim();
    const name = $("#pmCardName").value.trim();
    const exp = $("#pmExpiry").value.trim();
    const cvv = $("#pmCvv").value.trim();
    const err = $("#pmError");

    if(card.length < 12 || name.length < 3 || exp.length < 4 || cvv.length < 3){
      err.textContent = "Revisa los datos de la tarjeta ficticia antes de continuar.";
      err.classList.add("show");
      return;
    }
    err.classList.remove("show");

    const submitBtn = $("#pmSubmitBtn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Procesando pago...";

    setTimeout(() => {
      const user = currentUser();
      addPurchase(user.email, PAYING_COURSE_ID);
      submitBtn.disabled = false;
      submitBtn.textContent = "Realizar pago";
      closeModal("paymentModal");
      openSuccessModal();
    }, 1200);
  });

  $$("[data-close-modal]").forEach(btn => {
    btn.addEventListener("click", () => closeModal(btn.dataset.closeModal));
  });
}

function openSuccessModal(){
  const modal = $("#successModal");
  if(!modal){
    showToast("¡Pago realizado con éxito! Curso agregado a Mis cursos.", "ok");
    return;
  }
  modal.classList.add("open");
}

/* ---------------------------------------------------------
   10. MIS CURSOS (mis-cursos.html)
   --------------------------------------------------------- */
function initMyCoursesPage(){
  const root = $("#myCoursesRoot");
  if(!root) return;
  if(!requireAuth()) return;

  const user = currentUser();
  const tabs = $$(".tab-btn");
  let activeTab = "activos";

  function render(){
    const my = getMyCourses(user.email);
    const enriched = my.map(m => ({...m, course: getCourse(m.courseId)})).filter(m => m.course);

    $("#statTotal").textContent = enriched.length;
    $("#statCompleted").textContent = enriched.filter(m => m.completed).length;
    $("#statInProgress").textContent = enriched.filter(m => !m.completed && m.progress > 0).length;
    const avg = enriched.length ? Math.round(enriched.reduce((s,m) => s + m.progress, 0) / enriched.length) : 0;
    $("#statAvg").textContent = avg + "%";

    let list = enriched;
    if(activeTab === "activos") list = enriched.filter(m => !m.completed);
    if(activeTab === "completados") list = enriched.filter(m => m.completed);

    const grid = $("#myCoursesList");
    if(!list.length){
      grid.innerHTML = `
        <div class="empty-state">
          <div class="e-icon">🎓</div>
          <h3>${enriched.length ? "No tienes cursos en esta pestaña" : "Aún no tienes cursos"}</h3>
          <p>${enriched.length ? "Explora tu progreso en las otras pestañas." : "Explora nuestro catálogo y comienza a aprender hoy."}</p>
          <a href="cursos.html" class="btn btn-primary">Explorar cursos</a>
        </div>`;
      return;
    }

    grid.innerHTML = list.map(m => `
      <div class="mycourse-card">
        <div class="mycourse-thumb ${m.course.grad}">${m.course.icon}</div>
        <div class="mycourse-info">
          <h4>${m.course.title}</h4>
          <div class="mc-teacher">Con ${m.course.teacher}</div>
          <div class="mycourse-progress">
            <div class="progress-bar"><span style="width:${m.progress}%"></span></div>
            <span>${m.progress}%</span>
          </div>
        </div>
        <div class="mycourse-actions">
          ${m.completed ? `<div class="done-tag">✓ Completado</div>` : ""}
          <button class="btn ${m.completed ? "btn-outline" : "btn-primary"} btn-sm" data-continue="${m.course.id}">
            ${m.completed ? "Repasar curso" : "Continuar curso"}
          </button>
        </div>
      </div>
    `).join("");

    $$("[data-continue]").forEach(btn => {
      btn.addEventListener("click", () => {
        bumpProgress(user.email, btn.dataset.continue, 15 + Math.floor(Math.random()*10));
        render();
        showToast("¡Avanzaste en tu curso! Sigue así 💪", "ok");
      });
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      activeTab = tab.dataset.tab;
      render();
    });
  });

  render();
}

/* ---------------------------------------------------------
   11. CLASES EN VIVO (clases.html)
   --------------------------------------------------------- */
function initLiveClassesPage(){
  const grid = $("#liveGrid");
  if(!grid) return;
  if(!requireAuth()) return;

  grid.innerHTML = LIVE_CLASSES.map(l => `
    <div class="live-card">
      <div class="live-thumb ${l.grad}">
        ${l.live ? `<span class="badge-live"><span class="blink"></span> EN VIVO</span>` : `<span class="badge-time">${l.time}</span>`}
        <span>${l.icon}</span>
      </div>
      <div class="live-body">
        <h4>${l.title}</h4>
        <div class="l-teacher">Con ${l.teacher} · ${l.time}</div>
        <div class="live-foot">
          <span class="l-seats">👥 ${l.seats} inscritos</span>
          <button class="btn btn-sm ${l.live ? "btn-primary" : "btn-outline"}" data-join="${l.id}">
            ${l.live ? "Unirme" : "Recordarme"}
          </button>
        </div>
      </div>
    </div>
  `).join("");

  $$("[data-join]").forEach(btn => {
    btn.addEventListener("click", () => {
      const cls = LIVE_CLASSES.find(l => l.id === btn.dataset.join);
      showToast(cls.live ? "Ingresando a la clase en vivo..." : "Te avisaremos antes de que comience.", "ok");
    });
  });
}

/* ---------------------------------------------------------
   12. COMUNIDAD (comunidad.html)
   --------------------------------------------------------- */
const LS_POSTS = "digimax_posts";
const LS_LIKES = "digimax_liked_posts";

function getPosts(){
  const stored = JSON.parse(localStorage.getItem(LS_POSTS) || "null");
  return stored || SEED_POSTS;
}
function savePosts(posts){
  localStorage.setItem(LS_POSTS, JSON.stringify(posts));
}
function getLikedSet(){
  return new Set(JSON.parse(localStorage.getItem(LS_LIKES) || "[]"));
}
function saveLikedSet(set){
  localStorage.setItem(LS_LIKES, JSON.stringify(Array.from(set)));
}

function initCommunityPage(){
  const feed = $("#postsFeed");
  if(!feed) return;
  if(!requireAuth()) return;

  const user = currentUser();

  function render(){
    const posts = getPosts();
    const liked = getLikedSet();
    feed.innerHTML = posts.slice().reverse().map(p => `
      <article class="post-card">
        <div class="post-head">
          <div class="user-avatar">${initials(p.author)}</div>
          <div>
            <strong>${p.author}</strong>
            <span>${p.role} · ${p.time}</span>
          </div>
          <span class="post-topic-tag">${p.topic}</span>
        </div>
        <p class="post-text">${p.text}</p>
        <div class="post-actions">
          <button data-like="${p.id}" class="${liked.has(p.id) ? "liked" : ""}">👍 ${p.likes}</button>
          <button>💬 Comentar</button>
          <button>↗ Compartir</button>
        </div>
      </article>
    `).join("");

    $$("[data-like]").forEach(btn => {
      btn.addEventListener("click", () => {
        const posts = getPosts();
        const liked = getLikedSet();
        const post = posts.find(p => p.id === btn.dataset.like);
        if(liked.has(post.id)){
          liked.delete(post.id);
          post.likes -= 1;
        } else {
          liked.add(post.id);
          post.likes += 1;
        }
        savePosts(posts);
        saveLikedSet(liked);
        render();
      });
    });
  }

  const composer = $("#postComposer");
  if(composer){
    composer.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = $("#postText").value.trim();
      if(!text) return;
      const topic = $("#postTopicSelect").value;
      const posts = getPosts();
      posts.push({
        id: "p" + Date.now(),
        author: user.name,
        role: "Estudiante",
        time: "Ahora",
        topic,
        text,
        likes: 0
      });
      savePosts(posts);
      composer.reset();
      render();
      showToast("Tu publicación fue compartida con la comunidad.", "ok");
    });
  }

  render();
}

/* ---------------------------------------------------------
   13. PERFIL (perfil.html)
   --------------------------------------------------------- */
function initProfilePage(){
  const root = $("#profileRoot");
  if(!root) return;
  if(!requireAuth()) return;

  const user = currentUser();
  const my = getMyCourses(user.email);

  $("#profName").textContent = user.name;
  $("#profEmail").textContent = user.email;
  $("#profAvatar").textContent = initials(user.name);
  $("#profJoined").textContent = new Date(user.joined || Date.now()).toLocaleDateString("es-CO", {year:"numeric", month:"long"});
  $("#profTotalCourses").textContent = my.length;
  $("#profCompleted").textContent = my.filter(c => c.completed).length;
  const avg = my.length ? Math.round(my.reduce((s,c) => s + c.progress, 0) / my.length) : 0;
  $("#profAvgProgress").textContent = avg + "%";
}

/* ---------------------------------------------------------
   13b. PÁGINA DE PAGO INDEPENDIENTE (pago.html)
   --------------------------------------------------------- */
function initCheckoutPage(){
  const root = $("#checkoutRoot");
  if(!root) return;
  if(!requireAuth()) return;

  const course = getCourse(qs("id")) || COURSES[0];
  $("#ckThumb").className = "thumb-sm " + course.grad;
  $("#ckThumb").textContent = course.icon;
  $("#ckTitle").textContent = course.title;
  $("#ckTeacher").textContent = "Con " + course.teacher;
  $("#ckPrice").textContent = formatCOP(course.price);
  $("#ckSubtotal").textContent = formatCOP(course.price);
  $("#ckTotal").textContent = formatCOP(course.price);

  const form = $("#checkoutForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const card = $("#ckCardNumber").value.trim();
    const name = $("#ckCardName").value.trim();
    const exp = $("#ckExpiry").value.trim();
    const cvv = $("#ckCvv").value.trim();
    const err = $("#ckError");

    if(card.length < 12 || name.length < 3 || exp.length < 4 || cvv.length < 3){
      err.textContent = "Revisa los datos de la tarjeta ficticia antes de continuar.";
      err.classList.add("show");
      return;
    }
    err.classList.remove("show");

    const btn = $("#ckSubmitBtn");
    btn.disabled = true;
    btn.textContent = "Procesando pago...";

    setTimeout(() => {
      addPurchase(currentUser().email, course.id);
      window.location.href = "mis-cursos.html";
    }, 1200);
  });
  
}

/* ---------------------------------------------------------
   14. FORMULARIOS DE LOGIN / REGISTRO
   --------------------------------------------------------- */
function initLoginForm(){
  const form = $("#loginForm");
  if(!form) return;

  if(isLoggedIn()){
    window.location.href = "index.html";
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("#loginEmail").value.trim();
    const password = $("#loginPassword").value;
    const err = $("#loginError");

    const result = loginUser(email, password);
    if(!result.ok){
      err.textContent = result.error;
      err.classList.add("show");
      return;
    }
    err.classList.remove("show");
    const redirect = qs("redirect");
    window.location.href = redirect ? redirect : "index.html";
  });
}

function initRegisterForm(){
  const form = $("#registerForm");
  if(!form) return;

  if(isLoggedIn()){
    window.location.href = "index.html";
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#regName").value.trim();
    const email = $("#regEmail").value.trim();
    const password = $("#regPassword").value;
    const password2 = $("#regPassword2").value;
    const err = $("#registerError");

    if(name.length < 3){
      err.textContent = "Ingresa tu nombre completo.";
      err.classList.add("show");
      return;
    }
    if(!email.includes("@")){
      err.textContent = "Ingresa un correo electrónico válido.";
      err.classList.add("show");
      return;
    }
    if(password.length < 6){
      err.textContent = "La contraseña debe tener al menos 6 caracteres.";
      err.classList.add("show");
      return;
    }
    if(password !== password2){
      err.textContent = "Las contraseñas no coinciden.";
      err.classList.add("show");
      return;
    }

    const result = registerUser(name, email, password);
    if(!result.ok){
      err.textContent = result.error;
      err.classList.add("show");
      return;
    }
    err.classList.remove("show");
    window.location.href = "index.html";
  });
}

/* ---------------------------------------------------------
   15. INICIALIZACIÓN GLOBAL
   --------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  renderFeaturedCourses("#featuredCourses", 4);
  renderCategoryGrid("#categoryGrid");
  initCoursesPage();
  initCourseDetailPage();
  initPaymentModal();
  initMyCoursesPage();
  initLiveClassesPage();
  initCommunityPage();
  initProfilePage();
  initCheckoutPage();
  initLoginForm();
  initRegisterForm();
});
