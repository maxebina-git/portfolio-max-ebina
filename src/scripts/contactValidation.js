const form = document.querySelector("#contact-form");

if (form) {
  const fields = {
    nome: {
      input: form.querySelector("#nome"),
      error: form.querySelector("#nome-error"),
      validate: (v) => v.trim().length > 2
    },

    telefone: {
      input: form.querySelector("#telefone"),
      error: form.querySelector("#telefone-error"),
      validate: (v) => v.trim().length >= 8
    },

    email: {
      input: form.querySelector("#email"),
      error: form.querySelector("#email-error"),
      validate: (v) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
    },

    assunto: {
      input: form.querySelector("#assunto"),
      error: form.querySelector("#assunto-error"),
      validate: (v) => v !== ""
    },

    mensagem: {
      input: form.querySelector("#mensagem"),
      error: form.querySelector("#mensagem-error"),
      validate: (v) => v.trim().length > 10
    }
  };

  function setError(field, message) {
    field.error.textContent = message;
    field.error.classList.remove("hidden");
    field.input.classList.add("border-red-500");
  }

  function clearError(field) {
    field.error.textContent = "";
    field.error.classList.add("hidden");
    field.input.classList.remove("border-red-500");
  }

  function validateField(key) {
    const field = fields[key];
    const value = field.input.value;

    const isValid = field.validate(value);

    if (!isValid) {
      setError(field, "Campo inválido");
      return false;
    }

    clearError(field);
    return true;
  }

  // =========================
  // SUBMIT (FETCH)
  // =========================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let isFormValid = true;

    Object.keys(fields).forEach((key) => {
      const valid = validateField(key);
      if (!valid) isFormValid = false;
    });

    if (!isFormValid) return;

    console.log("FORM VÁLIDO ✔ ENVIANDO...");

    try {
      const formData = new FormData(form);

      const res = await fetch(
        "https://maxebina.com.br/send-email.php",
        {
          method: "POST",
          body: formData
        }
      );

      const text = await res.text();

      if (text === "OK") {
        console.log("EMAIL ENVIADO ✔");

        form.reset();

        alert("Mensagem enviada com sucesso!");
      } else {
        console.error("Erro no envio:", text);
        alert("Erro ao enviar mensagem.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão.");
    }
  });

  // =========================
  // VALIDAÇÃO EM TEMPO REAL
  // =========================
  Object.keys(fields).forEach((key) => {
    fields[key].input.addEventListener("input", () => {
      validateField(key);
    });
  });
}