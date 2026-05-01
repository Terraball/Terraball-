const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('[data-nav-links]');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const seedData = {
  vegetable: ['Tomato', 'Chilli', 'Brinjal', 'Okra'],
  flower: ['Marigold', 'Cosmos', 'Sunflower', 'Zinnia'],
  fruit: ['Custard Apple', 'Papaya', 'Tamarind', 'Amla'],
  tree: ['Banyan', 'Peepal', 'Gulmohar', 'Karanj']
};

const seedButtons = document.querySelectorAll('[data-seed-tab]');
const seedPanel = document.querySelector('[data-seed-panel]');

function renderSeeds(category) {
  if (!seedPanel) return;
  seedPanel.innerHTML = seedData[category].map((seed) => `<span>${seed}</span>`).join('');
}

seedButtons.forEach((button) => {
  button.addEventListener('click', () => {
    seedButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    renderSeeds(button.dataset.seedTab);
  });
});

const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const counter = entry.target;
    const target = Number(counter.dataset.counter);
    const duration = 1300;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(target * (1 - Math.pow(1 - progress, 3)));
      counter.textContent = value.toLocaleString('en-IN');

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
    observer.unobserve(counter);
  });
}, { threshold: 0.45 });

document.querySelectorAll('[data-counter]').forEach((counter) => {
  counterObserver.observe(counter);
});

const impactQuantity = document.querySelector('[data-impact-quantity]');
const impactEvent = document.querySelector('[data-impact-event]');
const impactResult = document.querySelector('[data-impact-result]');

function updateImpact() {
  if (!impactQuantity || !impactResult) return;

  const quantity = Math.max(Number(impactQuantity.value) || 0, 0);
  const lowTrees = Math.round(quantity * 0.4);
  const highTrees = Math.round(quantity * 0.6);
  const co2 = Math.round((quantity / 300) * 500);
  const eventName = impactEvent ? impactEvent.value : 'event';

  impactResult.innerHTML = `
    <strong>${quantity.toLocaleString('en-IN')} potential plants</strong>
    <span>${lowTrees.toLocaleString('en-IN')}-${highTrees.toLocaleString('en-IN')} trees may grow from your ${eventName.toLowerCase()} gifting</span>
    <span>Approx. ${co2.toLocaleString('en-IN')} kg CO2 absorbed in lifetime</span>
  `;
}

[impactQuantity, impactEvent].forEach((input) => {
  if (input) input.addEventListener('input', updateImpact);
});

updateImpact();


const seedCategorySelect = document.querySelector('[data-seed-category]');
const otherSeedField = document.querySelector('[data-other-seed-field]');
const otherSeedInput = otherSeedField ? otherSeedField.querySelector('input') : null;

function updateOtherSeedField() {
  if (!seedCategorySelect || !otherSeedField || !otherSeedInput) return;

  const showOther = seedCategorySelect.value === 'Other';
  otherSeedField.classList.toggle('visible', showOther);
  otherSeedInput.required = showOther;
  if (!showOther) {
    otherSeedInput.value = '';
  }
}

if (seedCategorySelect) {
  seedCategorySelect.addEventListener('change', updateOtherSeedField);
  updateOtherSeedField();
}

document.querySelectorAll('[data-mail-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formType = form.dataset.formType || 'Website Enquiry';
    const lines = [
      `TerraBall ${formType}`,
      '----------------------------------------',
      ''
    ];

    new FormData(form).forEach((value, key) => {
      if (value instanceof File) {
        if (value.name) {
          lines.push(`${key}: ${value.name}`);
        }
        return;
      }

      if (String(value).trim()) {
        lines.push(`${key}: ${value}`);
      }
    });

    lines.push('', '----------------------------------------');
    lines.push('Please reply with price, delivery charges, and confirmation details.');

    const subject = encodeURIComponent(`TerraBall ${formType}`);
    const body = encodeURIComponent(lines.join('\n'));
    window.location.href = `mailto:terraball2024@gmail.com?subject=${subject}&body=${body}`;
  });
});
