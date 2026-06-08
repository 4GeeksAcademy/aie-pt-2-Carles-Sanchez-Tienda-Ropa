const stepPanels = Array.from(document.querySelectorAll('[data-step-panel]'));
const stepIndicators = Array.from(document.querySelectorAll('[data-step-indicator]'));
const stepAlerts = Array.from(document.querySelectorAll('[data-step-alert]'));
const paymentSuccess = document.querySelector('[data-payment-success]');

let currentStep = 1;
const totalSteps = stepPanels.length;

function getField(id) {
  return document.getElementById(id);
}

function getErrorNode(field) {
  const parent = field.parentElement;
  let node = parent.querySelector('[data-field-error]');

  if (!node) {
    node = document.createElement('p');
    node.setAttribute('data-field-error', '');
    node.className = 'mt-1 text-xs font-medium text-red-600';
    parent.appendChild(node);
  }

  return node;
}

function setFieldError(field, message) {
  const errorNode = getErrorNode(field);
  field.classList.remove('border-stone-300', 'focus:border-stone-500');
  field.classList.add('border-red-500', 'focus:border-red-500');
  errorNode.textContent = message;
}

function clearFieldError(field) {
  const parent = field.parentElement;
  const errorNode = parent.querySelector('[data-field-error]');

  field.classList.remove('border-red-500', 'focus:border-red-500');
  field.classList.add('border-stone-300', 'focus:border-stone-500');

  if (errorNode) {
    errorNode.remove();
  }
}

function showStepAlert(step, visible) {
  stepAlerts.forEach((alertNode) => {
    if (Number(alertNode.dataset.stepAlert) === step) {
      alertNode.classList.toggle('hidden', !visible);
    }
  });
}

function hasTwoWordName(value) {
  const normalized = value.trim().replace(/\s+/g, ' ');
  const words = normalized.split(' ').filter(Boolean);
  const lettersOnly = normalized.replace(/[^A-Za-zÀ-ÿ]/g, '');
  return words.length >= 2 && lettersOnly.length > 2;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidPhone(value) {
  const trimmed = value.trim();
  if (!/^\+?[0-9\s-]+$/.test(trimmed)) {
    return false;
  }

  const digits = trimmed.replace(/\D/g, '');
  return digits.length >= 9 && digits.length <= 15;
}

function isNumeric(value) {
  return /^\d+$/.test(value.trim());
}

function isValidCardNumber(value) {
  const normalized = value.replace(/\s+/g, '');
  return /^\d{13,19}$/.test(normalized);
}

function isValidExpiry(value) {
  const trimmed = value.trim();
  const withSlash = /^(0[1-9]|1[0-2])\/(\d{2})$/.test(trimmed);
  const withoutSlash = /^(0[1-9]|1[0-2])(\d{2})$/.test(trimmed);
  return withSlash || withoutSlash;
}

function isValidCvv(value) {
  return /^\d{3,4}$/.test(value.trim());
}

function validateStep(step) {
  const errors = [];

  if (step === 1) {
    const nombre = getField('nombre');
    const email = getField('email');
    const telefono = getField('telefono');

    if (!hasTwoWordName(nombre.value)) {
      errors.push([nombre, 'Introduce nombre y apellidos (minimo dos palabras).']);
    }
    if (!isValidEmail(email.value)) {
      errors.push([email, 'Introduce un email valido.']);
    }
    if (!isValidPhone(telefono.value)) {
      errors.push([telefono, 'Introduce un telefono numerico con formato valido.']);
    }
  }

  if (step === 2) {
    const direccion = getField('direccion');
    const ciudad = getField('ciudad');
    const provincia = getField('provincia');
    const pais = getField('pais');
    const codigoPostal = getField('codigo-postal');

    if (!direccion.value.trim()) {
      errors.push([direccion, 'La direccion es obligatoria.']);
    }
    if (!ciudad.value.trim()) {
      errors.push([ciudad, 'La ciudad es obligatoria.']);
    }
    if (!provincia.value.trim()) {
      errors.push([provincia, 'La provincia es obligatoria.']);
    }
    if (!pais.value.trim()) {
      errors.push([pais, 'El pais es obligatorio.']);
    }
    if (!isNumeric(codigoPostal.value)) {
      errors.push([codigoPostal, 'El codigo postal debe ser numerico.']);
    }
  }

  if (step === 3) {
    const titularTarjeta = getField('titular-tarjeta');
    const numeroTarjeta = getField('numero-tarjeta');
    const caducidad = getField('caducidad');
    const cvv = getField('cvv');

    if (!hasTwoWordName(titularTarjeta.value)) {
      errors.push([titularTarjeta, 'Introduce nombre y apellidos del titular.']);
    }
    if (!isValidCardNumber(numeroTarjeta.value)) {
      errors.push([numeroTarjeta, 'El numero de tarjeta debe ser numerico.']);
    }
    if (!isValidExpiry(caducidad.value)) {
      errors.push([caducidad, 'Introduce una fecha valida (MM/AA).']);
    }
    if (!isValidCvv(cvv.value)) {
      errors.push([cvv, 'El CVV/CVC debe tener 3 o 4 digitos.']);
    }
  }

  const stepPanel = stepPanels.find((panel) => Number(panel.dataset.stepPanel) === step);
  if (stepPanel) {
    stepPanel.querySelectorAll('input, textarea').forEach((field) => clearFieldError(field));
  }

  errors.forEach(([field, message]) => {
    setFieldError(field, message);
  });

  showStepAlert(step, errors.length > 0);
  return errors.length === 0;
}

function setStep(step) {
  currentStep = Math.max(1, Math.min(step, totalSteps));

  if (paymentSuccess) {
    paymentSuccess.classList.add('hidden');
  }

  stepPanels.forEach((panel) => {
    const panelStep = Number(panel.dataset.stepPanel);
    panel.classList.toggle('hidden', panelStep !== currentStep);
  });

  stepIndicators.forEach((indicator) => {
    const indicatorStep = Number(indicator.dataset.stepIndicator);
    const isActive = indicatorStep === currentStep;
    const isCompleted = indicatorStep < currentStep;

    indicator.classList.remove('border-stone-900', 'bg-stone-900', 'text-amber-100');
    indicator.classList.remove('border-stone-300', 'bg-white', 'text-stone-700');
    indicator.classList.remove('border-stone-200', 'bg-stone-50', 'text-stone-500');

    if (isActive) {
      indicator.classList.add('border-stone-900', 'bg-stone-900', 'text-amber-100');
    } else if (isCompleted) {
      indicator.classList.add('border-stone-300', 'bg-white', 'text-stone-700');
    } else {
      indicator.classList.add('border-stone-200', 'bg-stone-50', 'text-stone-500');
    }
  });
}

document.addEventListener('click', (event) => {
  const nextButton = event.target.closest('[data-next-step]');
  const prevButton = event.target.closest('[data-prev-step]');

  if (nextButton) {
    const canContinue = validateStep(currentStep);

    if (canContinue) {
      setStep(currentStep + 1);
    }
  }

  if (prevButton) {
    showStepAlert(currentStep, false);
    setStep(currentStep - 1);
  }

  if (event.target.closest('[data-confirm-payment]')) {
    const canConfirm = validateStep(3);

    if (paymentSuccess) {
      paymentSuccess.classList.toggle('hidden', !canConfirm);
    }
  }
});

setStep(1);
