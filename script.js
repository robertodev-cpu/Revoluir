/* =========================================================
   REVOLUIR — JAVASCRIPT
   =========================================================

   IMPORTANTE:
   1. Coloca o teu número do WhatsApp em WHATSAPP_NUMBER.
   2. Coloca os dados reais de pagamento.
   3. O WhatsApp usa o formato internacional sem +, espaços ou traços.
      Exemplo: 2449XXXXXXXX.
*/

const REVOLUIR_CONFIG = {
  whatsappNumber: "929219490",

  payment: {
    paypay: "958205630",
    express: "936352342",
    iban: "AO06.0040.0000.4571.6812.1015.8",
    accountName: "REVOLUIR"
  },

  price: "2.000 Kz"
};

document.addEventListener("DOMContentLoaded", () => {
  setupPaymentData();
  setupWhatsAppLinks();
  setupAreaOtherField();
  setupRegistrationForm();
  setupPaymentConfirmation();
  setupCopyButtons();
  setupScrollReveal();
});

function setupPaymentData() {
  document.querySelectorAll("[data-payment]").forEach((element) => {
    const key = element.dataset.payment;
    if (REVOLUIR_CONFIG.payment[key] !== undefined) {
      element.textContent = REVOLUIR_CONFIG.payment[key];
    }
  });
}

function whatsappUrl(message = "") {
  const number = String(REVOLUIR_CONFIG.whatsappNumber)
    .replace(/\D/g, "");

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function setupWhatsAppLinks() {
  const defaultMessage =
    "Olá, REVOLUIR. Quero saber mais sobre o processo de entrada na REVOLUIR.";

  document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
    link.href = whatsappUrl(defaultMessage);
  });
}

function getRadioValue(name) {
  const selected = document.querySelector(`input[name="${name}"]:checked`);
  return selected ? selected.value : "";
}

function setupAreaOtherField() {
  const areaInputs = document.querySelectorAll('input[name="area"]');
  const otherWrap = document.getElementById("otherAreaWrap");

  areaInputs.forEach((input) => {
    input.addEventListener("change", () => {
      const isOther = input.value === "Outro" && input.checked;
      otherWrap.classList.toggle("hidden", !isOther);

      if (!isOther) {
        document.getElementById("otherArea").value = "";
      }
    });
  });
}

function setupRegistrationForm() {
  const form = document.getElementById("memberForm");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    clearErrors();

    const data = collectMemberData();
    const errors = validateMemberData(data);

    if (Object.keys(errors).length > 0) {
      showErrors(errors);
      return;
    }

    const message = buildRegistrationMessage(data);

    // Guarda os dados no navegador para poder reutilizá-los
    // na confirmação do pagamento.
    localStorage.setItem("revoluirMember", JSON.stringify(data));

    // Abre o WhatsApp com os dados já preenchidos.
    window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");

    const success = document.getElementById("formSuccess");
    success.style.display = "block";
    success.textContent =
      "Os teus dados foram preparados para o WhatsApp. A janela do WhatsApp foi aberta. Depois, continua para a área de pagamento.";

    // Desce para pagamento.
    setTimeout(() => {
      document.getElementById("pagamento").scrollIntoView({
        behavior: "smooth"
      });
    }, 350);
  });
}

function collectMemberData() {
  return {
    fullName: document.getElementById("fullName").value.trim(),
    socialName: document.getElementById("socialName").value.trim(),
    socialNetwork: getRadioValue("socialNetwork"),
    area: getRadioValue("area"),
    otherArea: document.getElementById("otherArea").value.trim(),
    businessModel: document.getElementById("businessModel").value,
    businessArea: document.getElementById("businessArea").value.trim(),
    businessDescription:
      document.getElementById("businessDescription").value.trim()
  };
}

function validateMemberData(data) {
  const errors = {};

  if (!data.fullName) {
    errors.fullName = "Indica o teu nome completo.";
  }

  if (!data.socialName) {
    errors.socialName = "Indica o nome da tua rede social.";
  }

  if (!data.socialNetwork) {
    errors.socialNetwork = "Seleciona uma rede social.";
  }

  if (!data.area) {
    errors.area = "Seleciona uma área.";
  }

  if (data.area === "Outro" && !data.otherArea) {
    errors.area = "Indica qual é a tua área.";
  }

  if (!data.businessModel) {
    errors.businessModel = "Seleciona o teu modelo atual.";
  }

  if (!document.getElementById("consent").checked) {
    errors.consent = "É necessário aceitar o uso dos dados para o registro.";
  }

  return errors;
}

function showErrors(errors) {
  Object.entries(errors).forEach(([field, message]) => {
    const target = document.querySelector(`[data-error-for="${field}"]`);
    if (target) target.textContent = message;
  });

  const firstError = document.querySelector(".error:not(:empty)");
  if (firstError) {
    firstError.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
}

function clearErrors() {
  document.querySelectorAll(".error").forEach((element) => {
    element.textContent = "";
  });
}

function buildRegistrationMessage(data) {
  const actualArea =
    data.area === "Outro" ? data.otherArea : data.area;

  return `NOVO REGISTRO — REVOLUIR

Nome completo: ${data.fullName}
Rede social: ${data.socialNetwork}
Perfil: ${data.socialName}

Área: ${actualArea}
Modelo atual: ${data.businessModel}
Área do negócio: ${data.businessArea || "Não informado"}

Negócio:
${data.businessDescription || "Não informado"}

A pessoa preencheu o formulário no site e pretende avançar com a taxa de comprometimento de ${REVOLUIR_CONFIG.price}.`;
}

function setupPaymentConfirmation() {
  const button = document.getElementById("whatsappPaymentBtn");

  button.addEventListener("click", () => {
    const paymentName = document.getElementById("paymentName").value.trim();
    const paymentMethod = document.getElementById("paymentMethod").value;
    const member = JSON.parse(localStorage.getItem("revoluirMember") || "null");

    if (!paymentName) {
      showPaymentStatus("Escreve o nome verdadeiro utilizado no pagamento.", true);
      return;
    }

    if (!paymentMethod) {
      showPaymentStatus("Seleciona o método de pagamento.", true);
      return;
    }

    const memberName = member?.fullName || "Não informado";
    const social = member
      ? `${member.socialNetwork} — ${member.socialName}`
      : "Não informado";

    const message =
`CONFIRMAÇÃO DE PAGAMENTO — REVOLUIR

Olá, REVOLUIR. Já realizei o pagamento da taxa de comprometimento.

Nome verdadeiro utilizado no pagamento:
${paymentName}

Método:
${paymentMethod}

Valor:
${REVOLUIR_CONFIG.price}

Nome usado no registro do site:
${memberName}

Rede social:
${social}

Peço a confirmação do meu registro.

Se necessário, enviarei o comprovativo nesta conversa.`;

    window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");

    showPaymentStatus(
      "O WhatsApp foi aberto com a mensagem de confirmação. Se for necessário, anexa o comprovativo diretamente na conversa."
    );
  });
}

function showPaymentStatus(message, isError = false) {
  const element = document.getElementById("paymentStatus");

  element.style.display = "block";
  element.textContent = message;

  if (isError) {
    element.style.color = "#ff727a";
    element.style.background = "rgba(229,9,20,.06)";
    element.style.borderColor = "rgba(229,9,20,.3)";
  } else {
    element.style.color = "#a5e5a5";
    element.style.background = "rgba(50,130,50,.08)";
    element.style.borderColor = "rgba(50,130,50,.3)";
  }
}

function setupCopyButtons() {
  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const key = button.dataset.copy;
      const value = REVOLUIR_CONFIG.payment[key];

      try {
        await navigator.clipboard.writeText(value);
        const original = button.textContent;
        button.textContent = "Copiado ✓";

        setTimeout(() => {
          button.textContent = original;
        }, 1500);
      } catch {
        alert(`Copia manualmente: ${value}`);
      }
    });
  });
}

function setupScrollReveal() {
  const elements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach((element) => observer.observe(element));
}
