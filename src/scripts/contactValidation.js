const form = document.querySelector("#contact-form");

if (form) {
  const fields = {
    name: {
      input: form.querySelector("#name"),
      error: form.querySelector("#name-error"),
      validate: (v) => v.trim().length > 2
    },
    phone: {
      input: form.querySelector("#phone"),
      error: form.querySelector("#phone-error"),
      validate: (v) => v.trim().length >= 8
    },
    email: {
      input: form.querySelector("#email"),
      error: form.querySelector("#email-error"),
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
    },
    subject: {
      input: form.querySelector("#subject"),
      error: form.querySelector("#subject-error"),
      validate: (v) => v !== ""
    },
    message: {
      input: form.querySelector("#message"),
      error: form.querySelector("#message-error"),
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

  // validação no submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isFormValid = true;

    Object.keys(fields).forEach((key) => {
      const valid = validateField(key);
      if (!valid) isFormValid = false;
    });

    if (!isFormValid) return;

    console.log("FORM VÁLIDO ✔");
    form.submit(); // depois vamos trocar por fetch
  });

  // validação em tempo real
  Object.keys(fields).forEach((key) => {
    fields[key].input.addEventListener("input", () => {
      validateField(key);
    });
  });
}