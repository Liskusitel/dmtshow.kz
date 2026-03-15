// ── Modal helpers ──
function openModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
  }
});

// ── Registration form ──
const regForm = document.getElementById('regForm');
const formSection = document.getElementById('formSection');
const successSection = document.getElementById('successSection');

function showError(fieldId, msg) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + 'Error');
  if (field) field.classList.add('error');
  if (error) { error.textContent = msg; error.classList.add('visible'); }
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + 'Error');
  if (field) field.classList.remove('error');
  if (error) error.classList.remove('visible');
}

function validatePhone(phone) {
  // Requires at least 7 digits; allows +, spaces, hyphens, parentheses
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15 && /^\+?[\d\s\-()]+$/.test(phone.trim());
}

if (regForm) {
  // Live clearing
  ['fullName', 'age', 'city', 'phone'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => clearError(id));
  });

  regForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const fullName = document.getElementById('fullName').value.trim();
    const age = parseInt(document.getElementById('age').value, 10);
    const city = document.getElementById('city').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const consent = document.getElementById('consent').checked;

    // Validate full name (minimum 2 words; patronymic is optional)
    if (!fullName || fullName.split(' ').filter(Boolean).length < 2) {
      showError('fullName', 'Введите ФИО (минимум имя и фамилия)');
      valid = false;
    }

    // Validate age
    if (!age || age < 18 || age > 80) {
      showError('age', 'Возраст должен быть от 18 лет');
      valid = false;
    }

    // Validate city
    if (!city || city.length < 2) {
      showError('city', 'Введите ваш город');
      valid = false;
    }

    // Validate phone
    if (!phone || !validatePhone(phone)) {
      showError('phone', 'Введите корректный номер телефона');
      valid = false;
    }

    // Validate consent
    if (!consent) {
      showToast('Пожалуйста, дайте согласие на обработку данных', '⚠️');
      valid = false;
    }

    if (!valid) return;

    // Success
    formSection.style.display = 'none';
    successSection.classList.add('visible');
    showToast('Заявка успешно отправлена! 🎉', '✅', 'success');
  });
}

// ── Toast ──
function showToast(message, icon = 'ℹ️', type = '') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast' + (type ? ` ${type}` : '');
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideInRight 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ── Header scroll effect ──
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    header.style.boxShadow = '0 4px 30px rgba(0,0,0,0.6)';
  } else {
    header.style.boxShadow = 'none';
  }
}, { passive: true });
