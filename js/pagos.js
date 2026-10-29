/* =========================================================
   DigiMax — pagos.js
   Complemento de la pasarela de pago FICTICIA.

   Agrega a la pasarela existente (modal #paymentForm y página
   #checkoutForm) estos métodos de pago, muy usados en Colombia:
     · Tarjeta  (usa la lógica original de script.js, sin cambios)
     · Nequi    (celular + aprobación en la app)
     · Daviplata(celular + documento + código OTP)
     · PSE      (banco, documento, correo)
     · Efectivo (Efecty / Baloto / Su Red con código de pago)

   USO: cargar DESPUÉS de script.js, en curso.html y pago.html:
     <script src="script.js"></script>
     <script src="pagos.js"></script>

   Todo es una simulación: no se conecta con ningún servicio
   real ni se procesa dinero.
   ========================================================= */
(function () {
  "use strict";

  if (typeof COURSES === "undefined" || typeof addPurchase !== "function") {
    console.error("[pagos.js] Debes cargar este archivo DESPUÉS de script.js.");
    return;
  }

  /* ---------------------------------------------------------
     1. CONFIGURACIÓN
     --------------------------------------------------------- */
  const METHODS = [
    { id: "card",      label: "Tarjeta",  sub: "Crédito o débito",        icon: "💳", color: "#4f46e5" },
    { id: "nequi",     label: "Nequi",    sub: "Desde tu celular",        icon: "📱", color: "#da0081" },
    { id: "daviplata", label: "Daviplata",sub: "Billetera digital",       icon: "📲", color: "#e11d2e" },
    { id: "pse",       label: "PSE",      sub: "Débito desde tu banco",   icon: "🏦", color: "#0a4da2" },
    { id: "cash",      label: "Efectivo", sub: "Efecty · Baloto · Su Red",icon: "💵", color: "#16a34a" }
  ];

  const BANKS = [
    "Bancolombia", "Banco de Bogotá", "Davivienda", "BBVA Colombia",
    "Banco de Occidente", "Banco Popular", "Banco AV Villas",
    "Banco Caja Social", "Scotiabank Colpatria", "Banco Itaú",
    "Banco Falabella", "Banco Agrario"
  ];

  const CASH_OPERATORS = ["Efecty", "Baloto", "Su Red"];

  // Dos lugares donde existe el formulario de pago en tu sitio
  const CONTEXT_DEFS = [
    {
      key: "modal", formSel: "#paymentForm", prefix: "pm",
      btnSel: "#pmSubmitBtn", errSel: "#pmError",
      courseId: () => PAYING_COURSE_ID,
      isActive: () => {
        const m = document.querySelector("#paymentModal");
        return !!m && m.classList.contains("open");
      },
      onSuccess: () => { closeModal("paymentModal"); openSuccessModal(); }
    },
    {
      key: "page", formSel: "#checkoutForm", prefix: "ck",
      btnSel: "#ckSubmitBtn", errSel: "#ckError",
      courseId: () => (getCourse(qs("id")) || COURSES[0]).id,
      isActive: () => true,
      onSuccess: () => { window.location.href = "mis-cursos.html"; }
    }
  ];

  const contexts = [];

  /* ---------------------------------------------------------
     2. UTILIDADES
     --------------------------------------------------------- */
  const digits  = (s) => String(s || "").replace(/\D/g, "");
  const isPhone = (s) => /^3\d{9}$/.test(digits(s));            // celulares colombianos: 3XX XXX XXXX
  const isDoc   = (s) => /^[0-9A-Za-z]{5,12}$/.test(String(s || "").trim());
  const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || "").trim());
  const rand    = (n) => Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join("");
  const refCode = (p) => p + "-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  const maskPhone = (p) => "******" + digits(p).slice(-4);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function getMethod(id) { return METHODS.find((m) => m.id === id); }

  /* ---------------------------------------------------------
     3. ESTILOS (baja especificidad: tus estilos siempre ganan)
     --------------------------------------------------------- */
  function injectStyles() {
    if (document.getElementById("pgx-styles")) return;
    const css = `
    .pgx-root{margin:0 0 1rem}
    .pgx-root [hidden]{display:none!important}
    .pgx-title{font-weight:600;font-size:.9rem;margin:0 0 .5rem}
    .pgx-methods{display:grid;grid-template-columns:repeat(auto-fit,minmax(104px,1fr));gap:.5rem}
    .pgx-method{display:flex;flex-direction:column;align-items:center;gap:.15rem;padding:.65rem .4rem;
      border:1.5px solid rgba(0,0,0,.14);border-radius:12px;background:#fff;color:inherit;font:inherit;
      cursor:pointer;text-align:center;transition:border-color .15s,box-shadow .15s}
    .pgx-method:hover{border-color:var(--pgx-accent)}
    .pgx-method.active{border-color:var(--pgx-accent);box-shadow:0 0 0 3px rgba(0,0,0,.07);
      box-shadow:0 0 0 3px color-mix(in srgb,var(--pgx-accent) 20%,transparent)}
    .pgx-ico{font-size:1.4rem;line-height:1}
    .pgx-name{font-weight:600;font-size:.88rem}
    .pgx-method small{font-size:.68rem;opacity:.65;line-height:1.2}
    .pgx-busy .pgx-methods{pointer-events:none;opacity:.55}
    .pgx-busy .pgx-panel{display:none}
    .pgx-panel{margin-top:.9rem}
    .pgx-note{font-size:.82rem;padding:.6rem .75rem;border-radius:10px;background:rgba(0,0,0,.04);margin:0 0 .8rem}
    .pgx-howto{font-size:.8rem;opacity:.8;margin:.2rem 0 .4rem;padding-left:1.1rem}
    .pgx-row{display:grid;grid-template-columns:1fr 1fr;gap:.6rem}
    @media (max-width:420px){.pgx-row{grid-template-columns:1fr}}
    :where(.pgx-field){margin-bottom:.8rem}
    :where(.pgx-panel label){display:block;font-size:.85rem;font-weight:500;margin-bottom:.3rem}
    :where(.pgx-panel input:not([type=radio])),:where(.pgx-panel select){width:100%;box-sizing:border-box;
      padding:.65rem .75rem;border:1.5px solid rgba(0,0,0,.15);border-radius:10px;font:inherit;background:#fff}
    .pgx-chips{display:flex;gap:.5rem;flex-wrap:wrap}
    .pgx-chip{position:relative;margin:0!important;cursor:pointer}
    .pgx-chip input{position:absolute;opacity:0;width:1px!important;height:1px;padding:0!important}
    .pgx-chip span{display:inline-block;padding:.5rem .9rem;border:1.5px solid rgba(0,0,0,.15);border-radius:999px;font-size:.85rem}
    .pgx-chip input:checked + span{border-color:var(--pgx-accent);background:rgba(0,0,0,.04);font-weight:600}
    .pgx-chip input:focus-visible + span{outline:2px solid var(--pgx-accent);outline-offset:2px}
    .pgx-status{margin-top:.9rem;padding:1.1rem;border:1.5px dashed rgba(0,0,0,.18);border-radius:14px;text-align:center}
    .pgx-spinner{width:34px;height:34px;margin:0 auto .6rem;border-radius:50%;border:3px solid rgba(0,0,0,.1);
      border-top-color:var(--pgx-accent,#6c4cf1);animation:pgx-spin .8s linear infinite}
    @keyframes pgx-spin{to{transform:rotate(360deg)}}
    .pgx-status-title{font-weight:600}
    .pgx-status-text{font-size:.82rem;opacity:.7;margin-top:.15rem}
    .pgx-steps{list-style:none;margin:.8rem auto;padding:0;max-width:300px;text-align:left;font-size:.84rem}
    .pgx-steps li{padding:.2rem 0 .2rem 1.5rem;position:relative;opacity:.45}
    .pgx-steps li::before{content:"○";position:absolute;left:0}
    .pgx-steps li.active{opacity:1;font-weight:600}
    .pgx-steps li.active::before{content:"●";color:var(--pgx-accent)}
    .pgx-steps li.done{opacity:.85}
    .pgx-steps li.done::before{content:"✓";color:#16a34a}
    .pgx-voucher{border:1.5px solid var(--pgx-accent);border-radius:14px;padding:1rem;text-align:center}
    .pgx-code{font:700 1.5rem/1.2 ui-monospace,Menlo,Consolas,monospace;letter-spacing:.08em;margin:.4rem 0}
    .pgx-dl{display:grid;grid-template-columns:auto 1fr;gap:.25rem .75rem;text-align:left;font-size:.85rem;margin:.8rem 0}
    .pgx-dl dt{opacity:.65}.pgx-dl dd{margin:0;font-weight:600}
    .pgx-vbtns{display:flex;gap:.5rem;justify-content:center;flex-wrap:wrap}
    .pgx-error{margin-top:.6rem;padding:.6rem .75rem;border-radius:10px;background:#fee2e2;color:#991b1b;font-size:.85rem}
    .pgx-error:not(.show){display:none}`;
    const style = document.createElement("style");
    style.id = "pgx-styles";
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* ---------------------------------------------------------
     4. HELPERS DE FORMULARIO (reutilizan las clases de tu HTML)
     --------------------------------------------------------- */
  const F = (ctx, label, control) =>
    `<div class="${ctx.gClass} pgx-field"><label class="${ctx.lClass}">${label}</label>${control}</div>`;
  const I = (ctx, attrs) => `<input class="${ctx.iClass}" ${attrs}>`;
  const S = (ctx, attrs, opts) => `<select class="${ctx.iClass}" ${attrs}>${opts}</select>`;
  const field = (ctx, name) => ctx.panel.querySelector(`[data-f="${name}"]`);
  const val = (ctx, name) => { const el = field(ctx, name); return el ? el.value.trim() : ""; };

  /* ---------------------------------------------------------
     5. PANELES POR MÉTODO
     --------------------------------------------------------- */
  const PANELS = {
    nequi: (ctx) => `
      <p class="pgx-note">Pagas desde tu app <b>Nequi</b>: te enviamos una notificación para que apruebes el cobro.</p>
      ${F(ctx, "Número de celular Nequi",
        I(ctx, 'data-f="phone" data-digits type="tel" inputmode="numeric" maxlength="10" placeholder="3001234567" autocomplete="tel-national"'))}
      <ol class="pgx-howto">
        <li>Escribe tu número y pulsa <b>Pagar con Nequi</b>.</li>
        <li>Abre la app Nequi y entra a la notificación.</li>
        <li>Aprueba el pago y listo.</li>
      </ol>`,

    daviplata: (ctx) => `
      <p class="pgx-note">Usa tu cuenta <b>Daviplata</b>. Te enviaremos un código de confirmación por SMS.</p>
      <div class="pgx-row">
        ${F(ctx, "Celular Daviplata",
          I(ctx, 'data-f="phone" data-digits type="tel" inputmode="numeric" maxlength="10" placeholder="3001234567"'))}
        ${F(ctx, "Número de documento",
          I(ctx, 'data-f="doc" data-digits type="text" inputmode="numeric" maxlength="10" placeholder="1012345678"'))}
      </div>
      <div data-g="otp" hidden>
        ${F(ctx, "Código de confirmación (6 dígitos)",
          I(ctx, 'data-f="otp" data-digits type="text" inputmode="numeric" maxlength="6" placeholder="••••••" autocomplete="one-time-code"'))}
        <p class="pgx-note">Modo demostración: escribe cualquier código de 6 dígitos.</p>
      </div>`,

    pse: (ctx) => {
      const user = typeof currentUser === "function" ? currentUser() : null;
      return `
      <p class="pgx-note">Pago seguro con débito a tu cuenta bancaria mediante <b>PSE</b>. Serás dirigido al portal de tu banco.</p>
      <div class="pgx-row">
        ${F(ctx, "Tipo de persona", S(ctx, 'data-f="person"',
          '<option value="natural">Persona natural</option><option value="juridica">Persona jurídica</option>'))}
        ${F(ctx, "Banco", S(ctx, 'data-f="bank"',
          '<option value="">Selecciona tu banco</option>' + BANKS.map((b) => `<option>${esc(b)}</option>`).join("")))}
      </div>
      <div class="pgx-row">
        ${F(ctx, "Tipo de documento", S(ctx, 'data-f="docType"',
          '<option>CC</option><option>CE</option><option>NIT</option><option>Pasaporte</option>'))}
        ${F(ctx, "Número de documento",
          I(ctx, 'data-f="doc" type="text" maxlength="12" placeholder="1012345678"'))}
      </div>
      ${F(ctx, "Correo electrónico",
        I(ctx, `data-f="email" type="email" placeholder="tucorreo@ejemplo.com" value="${esc(user ? user.email : "")}"`))}`;
    },

    cash: (ctx) => `
      <p class="pgx-note">Genera un código de pago y págalo en efectivo en un punto autorizado. El curso se activa cuando se confirma el pago.</p>
      ${F(ctx, "Elige dónde pagar",
        `<div class="pgx-chips">` + CASH_OPERATORS.map((op, i) =>
          `<label class="pgx-chip"><input type="radio" name="pgx-op-${ctx.key}" value="${op}" ${i === 0 ? "checked" : ""}><span>${op}</span></label>`
        ).join("") + `</div>`)}
      ${F(ctx, "Número de documento",
        I(ctx, 'data-f="doc" data-digits type="text" inputmode="numeric" maxlength="10" placeholder="1012345678"'))}`
  };

  function voucherHTML(ctx) {
    const course = getCourse(ctx.courseId());
    const code = ctx.data.code.replace(/(\d{4})(?=\d)/g, "$1 ");
    return `
      <div class="pgx-voucher">
        <strong>Código de pago generado</strong>
        <div class="pgx-code">${code}</div>
        <dl class="pgx-dl">
          <dt>Punto de pago</dt><dd>${esc(ctx.data.operator)}</dd>
          <dt>Valor a pagar</dt><dd>${course ? formatCOP(course.price) : "—"}</dd>
          <dt>Vence</dt><dd>${esc(ctx.data.expires)}</dd>
        </dl>
        <p class="pgx-note">Muestra este código en el punto de pago. <b>Demo:</b> usa el botón para simular que ya pagaste.</p>
        <div class="pgx-vbtns">
          <button type="button" class="btn btn-primary" data-action="simulate">Simular pago en el punto</button>
          <button type="button" class="btn btn-outline" data-action="copy">Copiar código</button>
        </div>
      </div>`;
  }

  /* ---------------------------------------------------------
     6. VALIDACIÓN Y ENVÍO POR MÉTODO
     --------------------------------------------------------- */
  const HANDLERS = {
    nequi: {
      validate(ctx) {
        if (!isPhone(val(ctx, "phone"))) return "Ingresa un celular Nequi válido de 10 dígitos (empieza por 3).";
      },
      submit(ctx) {
        const phone = val(ctx, "phone");
        runSteps(ctx, {
          title: "Aprueba el pago en tu app Nequi",
          subtitle: "Enviamos una notificación al " + maskPhone(phone),
          steps: [
            { text: "Enviando notificación a tu celular…", ms: 1500 },
            { text: "Esperando tu aprobación en Nequi…", ms: 3200 },
            { text: "Confirmando el pago…", ms: 1200 }
          ],
          onDone: () => complete(ctx, { method: "nequi", ref: refCode("NQ") })
        });
      }
    },

    daviplata: {
      validate(ctx) {
        if (ctx.stage === "otp") {
          if (!/^\d{6}$/.test(val(ctx, "otp"))) return "Ingresa el código de confirmación de 6 dígitos.";
          return;
        }
        if (!isPhone(val(ctx, "phone"))) return "Ingresa un celular Daviplata válido de 10 dígitos (empieza por 3).";
        if (!isDoc(val(ctx, "doc"))) return "Ingresa un número de documento válido.";
      },
      submit(ctx) {
        if (ctx.stage !== "otp") {
          // Paso 1 → pedir código OTP
          ctx.stage = "otp";
          ["phone", "doc"].forEach((n) => { field(ctx, n).readOnly = true; });
          ctx.panel.querySelector('[data-g="otp"]').hidden = false;
          field(ctx, "otp").focus();
          setButton(ctx);
          showToast("Te enviamos un código por SMS (demo).", "ok");
          return;
        }
        // Paso 2 → procesar
        runSteps(ctx, {
          title: "Validando tu pago con Daviplata",
          subtitle: "Cuenta " + maskPhone(val(ctx, "phone")),
          steps: [
            { text: "Verificando el código…", ms: 1200 },
            { text: "Consultando saldo disponible…", ms: 1500 },
            { text: "Confirmando el pago…", ms: 1200 }
          ],
          onDone: () => complete(ctx, { method: "daviplata", ref: refCode("DP") })
        });
      }
    },

    pse: {
      validate(ctx) {
        if (!val(ctx, "bank")) return "Selecciona tu banco para continuar.";
        if (!isDoc(val(ctx, "doc"))) return "Ingresa un número de documento válido.";
        if (!isEmail(val(ctx, "email"))) return "Ingresa un correo electrónico válido.";
      },
      submit(ctx) {
        const bank = val(ctx, "bank");
        runSteps(ctx, {
          title: "Pago seguro con PSE",
          subtitle: "Banco seleccionado: " + bank,
          steps: [
            { text: "Conectando con PSE…", ms: 1100 },
            { text: "Redirigiendo a " + bank + "…", ms: 1500 },
            { text: "Autorizando el débito…", ms: 1700 },
            { text: "Confirmando el pago…", ms: 1000 }
          ],
          onDone: () => complete(ctx, { method: "pse", ref: refCode("PSE") })
        });
      }
    },

    cash: {
      validate(ctx) {
        if (!isDoc(val(ctx, "doc"))) return "Ingresa un número de documento válido.";
      },
      submit(ctx) {
        const checked = ctx.panel.querySelector('input[type="radio"]:checked');
        const expires = new Date(Date.now() + 48 * 3600 * 1000)
          .toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" });
        ctx.data = { operator: checked ? checked.value : CASH_OPERATORS[0], code: rand(12), expires };
        ctx.stage = "voucher";
        ctx.panel.innerHTML = voucherHTML(ctx);
        setButton(ctx);
      }
    }
  };

  const ACTIONS = {
    cancel: (ctx) => cancel(ctx),
    copy: (ctx) => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(ctx.data.code)
          .then(() => showToast("Código copiado.", "ok"))
          .catch(() => {});
      }
    },
    simulate: (ctx) => runSteps(ctx, {
      title: "Confirmando tu pago…",
      subtitle: "Verificando el código con " + ctx.data.operator,
      steps: [
        { text: "Buscando el código de pago…", ms: 1200 },
        { text: "Pago recibido en el punto…", ms: 1200 }
      ],
      onDone: () => complete(ctx, { method: "cash", ref: ctx.data.code })
    })
  };

  /* ---------------------------------------------------------
     7. ESTADO Y UI
     --------------------------------------------------------- */
  function setButton(ctx) {
    if (!ctx.btn) return;
    const labels = {
      card: ctx.btnText,
      nequi: "Pagar con Nequi",
      daviplata: ctx.stage === "otp" ? "Confirmar código" : "Continuar con Daviplata",
      pse: "Pagar con PSE",
      cash: "Generar código de pago"
    };
    ctx.btn.textContent = labels[ctx.method];
    ctx.btn.style.display = (ctx.busy || ctx.stage === "voucher") ? "none" : "";
    ctx.btn.disabled = false;
  }

  function showError(ctx, msg) {
    ctx.errEl.textContent = msg;
    ctx.errEl.classList.add("show");
  }
  function clearError(ctx) { ctx.errEl.classList.remove("show"); }

  function selectMethod(ctx, id) {
    ctx.method = id;
    ctx.stage = null;
    ctx.data = {};
    const isCard = id === "card";

    ctx.root.style.setProperty("--pgx-accent", getMethod(id).color);
    ctx.root.querySelectorAll(".pgx-method").forEach((b) => {
      const on = b.dataset.method === id;
      b.classList.toggle("active", on);
      b.setAttribute("aria-checked", String(on));
    });

    // Los campos de tarjeta se ocultan y se deshabilitan (así no bloquean el envío)
    ctx.cardBlocks.forEach((b) => { b.style.display = isCard ? "" : "none"; });
    ctx.cardInputs.forEach((i) => { i.disabled = !isCard; });

    ctx.panel.hidden = isCard;
    ctx.panel.innerHTML = isCard ? "" : PANELS[id](ctx);

    setButton(ctx);
    clearError(ctx);
  }

  function showStatus(ctx, title, subtitle) {
    ctx.busy = true;
    ctx.root.classList.add("pgx-busy");
    ctx.status.hidden = false;
    ctx.status.querySelector(".pgx-status-title").textContent = title;
    ctx.status.querySelector(".pgx-status-text").textContent = subtitle || "";
    setButton(ctx);
  }

  function hideStatus(ctx) {
    clearTimeout(ctx.timer);
    ctx.timer = null;
    ctx.busy = false;
    ctx.root.classList.remove("pgx-busy");
    ctx.status.hidden = true;
    setButton(ctx);
  }

  function cancel(ctx, silent) {
    hideStatus(ctx);
    if (!silent) showToast("Pago cancelado.");
  }

  // Muestra una lista de pasos que se van completando (simula el proceso real)
  function runSteps(ctx, { title, subtitle, steps, onDone }) {
    clearError(ctx);
    showStatus(ctx, title, subtitle);
    const ul = ctx.status.querySelector(".pgx-steps");
    ul.innerHTML = steps.map((s) => `<li>${esc(s.text)}</li>`).join("");

    let i = 0;
    const next = () => {
      const items = ul.children;
      if (i > 0) items[i - 1].classList.add("done");
      if (i >= steps.length) {
        ctx.timer = null;
        onDone();
        return;
      }
      items[i].classList.add("active");
      ctx.timer = setTimeout(() => {
        items[i].classList.remove("active");
        i++;
        next();
      }, steps[i].ms);
    };
    next();
  }

  /* ---------------------------------------------------------
     8. FINALIZAR COMPRA
     --------------------------------------------------------- */
  const pending = { method: null, ref: null };

  // Envolvemos addPurchase para guardar con qué método se pagó
  // (también aplica al pago con tarjeta original => "card").
  const _addPurchase = window.addPurchase;
  window.addPurchase = function (email, courseId) {
    const already = isPurchased(email, courseId);
    _addPurchase(email, courseId);
    if (already) return;
    const list = getMyCourses(email);
    const entry = list.find((c) => c.courseId === courseId);
    if (entry) {
      entry.paymentMethod = pending.method || "card";
      if (pending.ref) entry.paymentRef = pending.ref;
      saveMyCourses(email, list);
    }
  };

  function complete(ctx, info) {
    if (!ctx.isActive()) { cancel(ctx, true); return; }   // el usuario cerró el modal
    pending.method = info.method;
    pending.ref = info.ref;
    try {
      addPurchase(currentUser().email, ctx.courseId());
    } finally {
      pending.method = null;
      pending.ref = null;
    }
    hideStatus(ctx);
    ctx.onSuccess();
    setTimeout(() => ctx.form.reset(), 0);                // deja el formulario limpio
  }

  /* ---------------------------------------------------------
     9. INICIALIZACIÓN
     --------------------------------------------------------- */
  function blockFor(input, ctx) {
    // Sube hasta el bloque más grande que contiene el input pero no el botón de envío
    let el = input;
    while (el.parentElement && el.parentElement !== ctx.form && !el.parentElement.contains(ctx.btn)) {
      el = el.parentElement;
    }
    return el;
  }

  function initContext(def) {
    const form = document.querySelector(def.formSel);
    if (!form) return;

    const ctx = Object.assign({}, def, {
      form, method: "card", stage: null, busy: false, timer: null, data: {}
    });
    ctx.btn = form.querySelector(def.btnSel) || form.querySelector('[type="submit"]');
    ctx.btnText = ctx.btn ? ctx.btn.textContent.trim() : "Realizar pago";

    // Campos de tarjeta existentes
    ctx.cardInputs = ["CardNumber", "CardName", "Expiry", "Cvv"]
      .map((s) => form.querySelector("#" + def.prefix + s)).filter(Boolean);
    const blocks = new Set(ctx.cardInputs.map((i) => blockFor(i, ctx)));
    ctx.cardBlocks = Array.from(blocks).sort((a, b) =>
      a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);

    // Copiamos las clases CSS de tus campos para que los nuevos se vean igual
    const sample = ctx.cardInputs[1] || ctx.cardInputs[0];
    ctx.iClass = sample ? sample.className : "";
    let group = sample ? sample.parentElement : null;
    while (group && group !== form && !group.querySelector("label")) group = group.parentElement;
    if (group === form) group = null;
    ctx.gClass = group ? group.className : "";
    const label = group ? group.querySelector("label") : null;
    ctx.lClass = label ? label.className : "";

    // Estructura inyectada
    ctx.root = document.createElement("div");
    ctx.root.className = "pgx-root";
    ctx.root.innerHTML = `
      <p class="pgx-title">Elige cómo pagar</p>
      <div class="pgx-methods" role="radiogroup" aria-label="Método de pago">
        ${METHODS.map((m) => `
          <button type="button" class="pgx-method" role="radio" aria-checked="false"
                  data-method="${m.id}" style="--pgx-accent:${m.color}">
            <span class="pgx-ico" aria-hidden="true">${m.icon}</span>
            <span class="pgx-name">${m.label}</span>
            <small>${m.sub}</small>
          </button>`).join("")}
      </div>
      <div class="pgx-panel" hidden></div>
      <div class="pgx-status" hidden role="status" aria-live="polite">
        <div class="pgx-spinner"></div>
        <div class="pgx-status-title"></div>
        <div class="pgx-status-text"></div>
        <ul class="pgx-steps"></ul>
        <button type="button" class="btn btn-outline btn-sm" data-action="cancel">Cancelar</button>
      </div>`;
    ctx.panel = ctx.root.querySelector(".pgx-panel");
    ctx.status = ctx.root.querySelector(".pgx-status");

    // Mensaje de error: usa el tuyo si existe; si no, crea uno
    ctx.errEl = form.querySelector(def.errSel);
    if (!ctx.errEl) {
      ctx.errEl = document.createElement("div");
      ctx.errEl.className = "pgx-error";
      ctx.root.appendChild(ctx.errEl);
    }

    // Insertar el selector justo antes de los campos de tarjeta
    const anchor = ctx.cardBlocks[0];
    if (anchor) anchor.parentNode.insertBefore(ctx.root, anchor);
    else form.insertBefore(ctx.root, form.firstChild);

    // Eventos del componente
    ctx.root.addEventListener("click", (e) => {
      const m = e.target.closest("[data-method]");
      if (m) {
        const locked = ctx.busy || (ctx.btn && ctx.btn.disabled);
        if (!locked) selectMethod(ctx, m.dataset.method);
        return;
      }
      const a = e.target.closest("[data-action]");
      if (a && ACTIONS[a.dataset.action]) ACTIONS[a.dataset.action](ctx, a);
    });

    ctx.root.addEventListener("input", (e) => {
      if (e.target.matches("[data-digits]")) {
        const max = e.target.maxLength;
        let v = digits(e.target.value);
        if (max > 0) v = v.slice(0, max);
        e.target.value = v;
      }
    });

    // Cuando el formulario se reinicia (form.reset), volvemos a "Tarjeta"
    form.addEventListener("reset", () => {
      setTimeout(() => { hideStatus(ctx); selectMethod(ctx, "card"); }, 0);
    });

    selectMethod(ctx, "card");
    contexts.push(ctx);
  }

  function boot() {
    injectStyles();
    CONTEXT_DEFS.forEach(initContext);
    if (!contexts.length) return;

    // Interceptamos el envío en fase de captura: si el método NO es tarjeta,
    // evitamos que corra la validación de tarjeta original de script.js.
    document.addEventListener("submit", (e) => {
      const ctx = contexts.find((c) => c.form === e.target);
      if (!ctx || ctx.method === "card") return;          // tarjeta => flujo original
      e.preventDefault();
      e.stopImmediatePropagation();
      if (ctx.busy) return;

      clearError(ctx);
      const handler = HANDLERS[ctx.method];
      const error = handler.validate(ctx);
      if (error) { showError(ctx, error); return; }
      handler.submit(ctx);
    }, true);

    // Si cierran el modal mientras se procesa, se cancela
    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-close-modal]")) {
        contexts.forEach((c) => { if (c.busy) cancel(c, true); });
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
