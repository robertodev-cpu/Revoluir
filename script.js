/* ==========================================================================
   REVOLUIR — script.js
   Edita apenas a secção CONFIGURAÇÃO.
   ========================================================================== */

/* ---------- CONFIGURAÇÃO ------------------------------------------------- */

// Número de WhatsApp da REVOLUIR, só dígitos e com indicativo. Ex.: "244900000000"
const whatsappNumber = "929219490";

const payment = {
  paypay: "958205630",
  express: "936352342",
  iban: "AO06.0040.0000.4571.6812.1015.8",
  accountName: "REVOLUIR"
};

/* ---------- Utilitários -------------------------------------------------- */

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function whatsappUrl(text) {
  const number = String(whatsappNumber).replace(/\D/g, "");
  if (!number) return null;
  return "https://wa.me/" + number + (text ? "?text=" + encodeURIComponent(text) : "");
}

function openWhatsapp(text) {
  const url = whatsappUrl(text);
  if (!url) {
    alert("Número de WhatsApp ainda não configurado. Define whatsappNumber no topo do script.js.");
    return false;
  }
  const win = window.open(url, "_blank");
  if (win) win.opener = null;
  else window.location.href = url;
  return true;
}

function showMessage(el, html) {
  if (!el) return;
  el.innerHTML = html;
  el.style.display = "block";
}

/* ---------- Dados de pagamento vindos da configuração -------------------- */

$$("[data-payment]").forEach((el) => {
  const value = payment[el.dataset.payment];
  if (value) el.textContent = value;
});

/* ---------- Ligações de WhatsApp ----------------------------------------- */

$$("[data-whatsapp-link]").forEach((link) => {
  const url = whatsappUrl("Olá, REVOLUIR! Quero fazer parte da REVOLUIR.");
  if (url) link.href = url;
  else {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      openWhatsapp("");
    });
  }
});

/* ---------- Animação de entrada (scroll) --------------------------------- */

(function reveal() {
  const items = $$(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach((el) => observer.observe(el));
})();

/* ---------- Formulário de registro --------------------------------------- */

const form = $("#memberForm");

const socialHints = {
  Instagram: { placeholder: "Ex.: @joaomanuel", hint: "Indica o teu @ do Instagram." },
  TikTok: { placeholder: "Ex.: @joaomanuel", hint: "Indica o teu @ do TikTok." },
  Facebook: { placeholder: "Ex.: João Manuel Silva", hint: "Indica o nome do teu perfil no Facebook." },
  YouTube: { placeholder: "Ex.: @joaomanuel", hint: "Indica o nome ou @ do teu canal do YouTube." },
  LinkedIn: { placeholder: "Ex.: joao-manuel-silva", hint: "Indica o teu nome de utilizador do LinkedIn." },
  X: { placeholder: "Ex.: @joaomanuel", hint: "Indica o teu @ do X." },
  Outra: { placeholder: "Ex.: nome da rede e o teu utilizador", hint: "Indica a rede e o nome de utilizador real." }
};

function fieldOf(name) {
  return form.elements[name];
}

function errorBox(name, root = document) {
  return $('[data-error-for="' + name + '"]', root);
}

function setError(name, message) {
  const box = errorBox(name);
  if (box) box.textContent = message;
}

function clearError(name) {
  setError(name, "");
}

function closeToggle(fieldset) {
  const toggle = $(".field-toggle", fieldset);
  if (toggle) toggle.setAttribute("aria-expanded", "false");
}

// Abrir / fechar as listas de escolha (rede social, área)
$$(".field-toggle", form).forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
  });
});

// Rede social: só depois de escolher aparece o campo do utilizador
form.addEventListener("change", (event) => {
  const input = event.target;
  if (!input || input.type !== "radio") return;

  if (input.name === "socialNetwork") {
    const wrap = $("#socialUsernameWrap");
    const username = $("#socialUsername");
    const info = socialHints[input.value] || socialHints.Outra;
    $("#socialSelected").textContent = input.value;
    $("#socialUsernameLabel").innerHTML = "Nome de utilizador no " + input.value + " <span>*</span>";
    $("#socialUsernameHint").textContent = info.hint;
    username.placeholder = info.placeholder;
    wrap.classList.remove("hidden");
    clearError("socialNetwork");
    closeToggle(input.closest("fieldset"));
    username.focus({ preventScroll: true });
  }

  if (input.name === "area") {
    const otherWrap = $("#otherAreaWrap");
    const other = input.value === "Outro";
    $("#areaSelected").textContent = input.value;
    otherWrap.classList.toggle("hidden", !other);
    if (!other) {
      $("#otherArea").value = "";
      clearError("otherArea");
    }
    clearError("area");
    closeToggle(input.closest("fieldset"));
    if (other) $("#otherArea").focus({ preventScroll: true });
  }
});

// Limpar erros enquanto a pessoa corrige
form.addEventListener("input", (event) => {
  const name = event.target && event.target.name;
  if (name) clearError(name);
});

function validateForm() {
  const errors = [];
  const text = (name) => (fieldOf(name).value || "").trim();

  if (!text("fullName")) errors.push(["fullName", "Escreve o teu nome completo."]);
  if (!fieldOf("socialNetwork").value) errors.push(["socialNetwork", "Escolhe a rede social que utilizas."]);
  else if (!text("socialUsername")) errors.push(["socialUsername", "Indica o teu nome de utilizador."]);
  if (!fieldOf("area").value) errors.push(["area", "Escolhe a tua área de trabalho."]);
  else if (fieldOf("area").value === "Outro" && !text("otherArea")) errors.push(["otherArea", "Indica qual é a tua área."]);
  if (!text("businessModel")) errors.push(["businessModel", "Escolhe o teu modelo atual."]);
  if (!fieldOf("consent").checked) errors.push(["consent", "Confirma para poderes continuar."]);

  ["fullName", "socialNetwork", "socialUsername", "area", "otherArea", "businessModel", "consent"].forEach(clearError);
  errors.forEach(([name, message]) => setError(name, message));
  return errors;
}

function focusError(name) {
  let target = fieldOf(name);
  if (target instanceof RadioNodeList) target = $(".field-toggle", target[0].closest("fieldset"));
  if (target && target.focus) {
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.focus({ preventScroll: true });
  }
}

function registrationMessage() {
  const v = (name) => (fieldOf(name).value || "").trim();
  const area = v("area") === "Outro" ? "Outro — " + v("otherArea") : v("area");
  const lines = [
    "*NOVO REGISTRO — REVOLUIR*",
    "",
    "Nome: " + v("fullName"),
    "Rede social: " + v("socialNetwork"),
    "Utilizador: " + v("socialUsername"),
    "Área em que trabalha: " + area,
    "Modelo atual: " + v("businessModel")
  ];
  if (v("businessArea")) lines.push("Área do negócio: " + v("businessArea"));
  if (v("businessDescription")) lines.push("Sobre o negócio: " + v("businessDescription"));
  return lines.join("\n");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const errors = validateForm();
  const success = $("#formSuccess");
  if (errors.length) {
    success.style.display = "none";
    focusError(errors[0][0]);
    return;
  }
  if (openWhatsapp(registrationMessage())) {
    showMessage(success, 'Dados prontos! O WhatsApp foi aberto com a tua mensagem. Agora avança para o <a href="#pagamento"><strong>pagamento</strong></a>.');
  }
});

/* ---------- Métodos de pagamento ----------------------------------------- */

const methodButtons = $$(".payment-method");
const confirmation = $("#confirmacao");
const paymentMethodSelect = $("#paymentMethod");

function detailsOf(method) {
  return $('.payment-details[data-details="' + method + '"]');
}

methodButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const method = button.dataset.method;
    const panel = detailsOf(method);
    const willOpen = panel.hidden;

    // Só um método aberto de cada vez
    methodButtons.forEach((other) => {
      other.setAttribute("aria-expanded", "false");
      detailsOf(other.dataset.method).hidden = true;
    });

    if (willOpen) {
      panel.hidden = false;
      button.setAttribute("aria-expanded", "true");
    }

    // Escolher um método seleciona-o e mostra a confirmação
    paymentMethodSelect.value = method;
    confirmation.classList.remove("hidden");
    confirmation.classList.add("visible");
  });
});

// Copiar número / IBAN
$$("[data-copy]").forEach((button) => {
  const original = button.textContent;
  button.addEventListener("click", async () => {
    const source = $('[data-payment="' + button.dataset.copy + '"]');
    const value = source ? source.textContent.trim() : "";
    try {
      await navigator.clipboard.writeText(value);
    } catch (error) {
      const area = document.createElement("textarea");
      area.value = value;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    button.textContent = "Copiado ✓";
    setTimeout(() => { button.textContent = original; }, 1800);
  });
});

/* ---------- Confirmação de pagamento ------------------------------------- */

(function paymentConfirmation() {
  const nameInput = $("#paymentName");
  const status = $("#paymentStatus");
  const button = $("#whatsappPaymentBtn");

  function fieldError(input, message) {
    let box = input.parentElement.querySelector(".error");
    if (!box) {
      box = document.createElement("small");
      box.className = "error";
      input.parentElement.appendChild(box);
    }
    box.textContent = message;
  }

  [nameInput, paymentMethodSelect].forEach((input) => {
    input.addEventListener("input", () => fieldError(input, ""));
    input.addEventListener("change", () => fieldError(input, ""));
  });

  button.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const method = paymentMethodSelect.value;
    const value = $("#paymentValue").value;
    let invalid = null;

    fieldError(nameInput, "");
    fieldError(paymentMethodSelect, "");
    if (!name) { fieldError(nameInput, "Escreve o nome verdadeiro usado no pagamento."); invalid = nameInput; }
    if (!method) { fieldError(paymentMethodSelect, "Escolhe o método que utilizaste."); invalid = invalid || paymentMethodSelect; }
    if (invalid) {
      status.style.display = "none";
      invalid.focus();
      return;
    }

    const registered = (fieldOf("fullName").value || "").trim();
    const lines = [
      "*CONFIRMAÇÃO DE PAGAMENTO — REVOLUIR*",
      "",
      "Nome usado no pagamento: " + name,
      "Método: " + method,
      "Valor: " + value
    ];
    if (registered && registered !== name) lines.push("Nome no registro: " + registered);
    lines.push("", "Posso enviar o comprovativo por aqui, se for necessário.");

    if (openWhatsapp(lines.join("\n"))) {
      showMessage(status, "WhatsApp aberto. Envia a mensagem para confirmarmos o teu registro.");
    }
  });
})();
