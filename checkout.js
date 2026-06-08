const stepPanels = Array.from(document.querySelectorAll('[data-step-panel]'));
const stepIndicators = Array.from(document.querySelectorAll('[data-step-indicator]'));

let currentStep = 1;
const totalSteps = stepPanels.length;

function setStep(step) {
  currentStep = Math.max(1, Math.min(step, totalSteps));

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
    setStep(currentStep + 1);
  }

  if (prevButton) {
    setStep(currentStep - 1);
  }
});

setStep(1);
