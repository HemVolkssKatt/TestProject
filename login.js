function switchTab(tab) {
  const indicator  = document.getElementById('tab-indicator');
  const tabLogin   = document.getElementById('tab-login');
  const tabSignup  = document.getElementById('tab-signup');
  const formLogin  = document.getElementById('form-login');
  const formSignup = document.getElementById('form-signup');

  if (tab === 'login') {
    // Activate Login
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
    formLogin.classList.add('active');
    formSignup.classList.remove('active');
    indicator.classList.remove('slide-right');
    // Reset signup form errors
    clearFormErrors('signupForm');
  } else {
    // Activate Signup
    tabSignup.classList.add('active');
    tabLogin.classList.remove('active');
    formSignup.classList.add('active');
    formLogin.classList.remove('active');
    indicator.classList.add('slide-right');
    // Reset login form errors
    clearFormErrors('loginForm');
  }
}

/* ────────────────────────────────────────────────
   2. PASSWORD VISIBILITY TOGGLE
   ──────────────────────────────────────────────── */
/**
 * Toggles the visibility of a password input field.
 * @param {string} inputId   - ID of the password <input>
 * @param {HTMLElement} btn  - The toggle button element
 */
function togglePass(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;

  if (input.type === 'password') {
    input.type = 'text';
    btn.classList.add('visible');
    btn.innerHTML = `
      <svg class="eye-icon" width="18" height="18" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8
                 a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8
                 a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </svg>`;
  } else {
    input.type = 'password';
    btn.classList.remove('visible');
    btn.innerHTML = `
      <svg class="eye-icon" width="18" height="18" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>`;
  }
}

/* ────────────────────────────────────────────────
   3. PASSWORD STRENGTH METER
   ──────────────────────────────────────────────── */
const sgPassword = document.getElementById('sg-password');
if (sgPassword) {
  sgPassword.addEventListener('input', () => {
    updateStrengthMeter(sgPassword.value);
  });
}

/**
 * Evaluates password strength and updates the UI segments.
 * @param {string} password
 */
function updateStrengthMeter(password) {
  const s1    = document.getElementById('s1');
  const s2    = document.getElementById('s2');
  const s3    = document.getElementById('s3');
  const s4    = document.getElementById('s4');
  const label = document.getElementById('strength-label');

  const segments = [s1, s2, s3, s4];
  segments.forEach(s => s.className = 'strength-segment');

  if (!password) { label.textContent = ''; return; }

  let score = 0;
  if (password.length >= 8)                          score++;
  if (/[A-Z]/.test(password))                        score++;
  if (/[0-9]/.test(password))                        score++;
  if (/[^A-Za-z0-9]/.test(password))                score++;

  const levels = [
    { cls: 'weak',   text: '🔴 Weak',      color: '#e53e3e' },
    { cls: 'fair',   text: '🟡 Fair',      color: '#d69e2e' },
    { cls: 'good',   text: '🟢 Good',      color: '#68d391' },
    { cls: 'strong', text: '✅ Strong',    color: '#38a169' },
  ];

  const level = levels[score - 1] || levels[0];

  for (let i = 0; i < score; i++) {
    segments[i].classList.add(level.cls);
  }
  label.textContent = level.text;
  label.style.color = level.color;
}

/* ────────────────────────────────────────────────
   4. FORM VALIDATION HELPERS
   ──────────────────────────────────────────────── */

/**
 * Shows an error on a specific field.
 * @param {string} groupId  - Container element ID
 * @param {string} errId    - Error <span> ID
 * @param {string} message  - Error message to display
 */
function showError(groupId, errId, message) {
  const group = document.getElementById(groupId);
  const err   = document.getElementById(errId);
  if (group) group.classList.add('has-error');
  if (err)   err.textContent = message;
}

/**
 * Clears error on a specific field.
 * @param {string} groupId
 * @param {string} errId
 */
function clearError(groupId, errId) {
  const group = document.getElementById(groupId);
  const err   = document.getElementById(errId);
  if (group) group.classList.remove('has-error');
  if (err)   err.textContent = '';
}

/**
 * Clears all errors in a form.
 * @param {string} formId
 */
function clearFormErrors(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
  form.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
}

/** Validates an email address format */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Validates a phone number (basic) */
function isValidPhone(phone) {
  return /^[\+]?[\d\s\-\(\)]{7,15}$/.test(phone.trim());
}

/* ────────────────────────────────────────────────
   5. LOGIN FORM SUBMISSION
   ──────────────────────────────────────────────── */
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    const email    = document.getElementById('lg-email').value;
    const password = document.getElementById('lg-password').value;

    // Clear previous errors
    clearError('lg-email-group', 'lg-email-err');
    clearError('lg-pass-group',  'lg-pass-err');

    // Validate Email
    if (!email.trim()) {
      showError('lg-email-group', 'lg-email-err', 'Email address is required.');
      valid = false;
    } else if (!isValidEmail(email)) {
      showError('lg-email-group', 'lg-email-err', 'Please enter a valid email address.');
      valid = false;
    }

    // Validate Password
    if (!password) {
      showError('lg-pass-group', 'lg-pass-err', 'Password is required.');
      valid = false;
    } else if (password.length < 6) {
      showError('lg-pass-group', 'lg-pass-err', 'Password must be at least 6 characters.');
      valid = false;
    }

    if (!valid) return;

    // Show loader
    setLoading('login-btn', 'login-loader', true);

    // Simulate API call
    await delay(1800);

    // Hide loader
    setLoading('login-btn', 'login-loader', false);

    // Show success toast
    showToast('success', '🎉 Welcome back to Furnio!');

    // Reset form
    loginForm.reset();
  });
}

/* ────────────────────────────────────────────────
   6. SIGNUP FORM SUBMISSION
   ──────────────────────────────────────────────── */
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    const fname    = document.getElementById('sg-fname').value;
    const lname    = document.getElementById('sg-lname').value;
    const email    = document.getElementById('sg-email').value;
    const phone    = document.getElementById('sg-phone').value;
    const password = document.getElementById('sg-password').value;
    const cpass    = document.getElementById('sg-cpassword').value;
    const terms    = document.getElementById('sg-terms').checked;

    // Clear all
    clearError('sg-fname-group', 'sg-fname-err');
    clearError('sg-lname-group', 'sg-lname-err');
    clearError('sg-email-group', 'sg-email-err');
    clearError('sg-phone-group', 'sg-phone-err');
    clearError('sg-pass-group',  'sg-pass-err');
    clearError('sg-cpass-group', 'sg-cpass-err');
    document.getElementById('sg-terms-err').textContent = '';

    // Validate First Name
    if (!fname.trim()) {
      showError('sg-fname-group', 'sg-fname-err', 'First name is required.');
      valid = false;
    } else if (fname.trim().length < 2) {
      showError('sg-fname-group', 'sg-fname-err', 'At least 2 characters.');
      valid = false;
    }

    // Validate Last Name
    if (!lname.trim()) {
      showError('sg-lname-group', 'sg-lname-err', 'Last name is required.');
      valid = false;
    } else if (lname.trim().length < 2) {
      showError('sg-lname-group', 'sg-lname-err', 'At least 2 characters.');
      valid = false;
    }

    // Validate Email
    if (!email.trim()) {
      showError('sg-email-group', 'sg-email-err', 'Email address is required.');
      valid = false;
    } else if (!isValidEmail(email)) {
      showError('sg-email-group', 'sg-email-err', 'Please enter a valid email address.');
      valid = false;
    }

    // Validate Phone
    if (!phone.trim()) {
      showError('sg-phone-group', 'sg-phone-err', 'Phone number is required.');
      valid = false;
    } else if (!isValidPhone(phone)) {
      showError('sg-phone-group', 'sg-phone-err', 'Enter a valid phone number.');
      valid = false;
    }

    // Validate Password
    if (!password) {
      showError('sg-pass-group', 'sg-pass-err', 'Password is required.');
      valid = false;
    } else if (password.length < 8) {
      showError('sg-pass-group', 'sg-pass-err', 'Password must be at least 8 characters.');
      valid = false;
    }

    // Validate Confirm Password
    if (!cpass) {
      showError('sg-cpass-group', 'sg-cpass-err', 'Please confirm your password.');
      valid = false;
    } else if (cpass !== password) {
      showError('sg-cpass-group', 'sg-cpass-err', 'Passwords do not match.');
      valid = false;
    }

    // Validate Terms
    if (!terms) {
      document.getElementById('sg-terms-err').textContent =
        'You must accept the Terms & Conditions to continue.';
      valid = false;
    }

    if (!valid) return;

    // Show loader
    setLoading('signup-btn', 'signup-loader', true);

    // Simulate API call
    await delay(2000);

    // Hide loader
    setLoading('signup-btn', 'signup-loader', false);

    // Show success toast & switch to login
    showToast('success', '✅ Account created! Please sign in.');
    signupForm.reset();
    updateStrengthMeter('');
    setTimeout(() => switchTab('login'), 800);
  });
}

/* ────────────────────────────────────────────────
   7. SOCIAL BUTTON HANDLERS
   ──────────────────────────────────────────────── */
document.getElementById('google-btn')?.addEventListener('click', () => {
  showToast('error', '⚙️ Google sign-in coming soon!');
});

document.getElementById('facebook-btn')?.addEventListener('click', () => {
  showToast('error', '⚙️ Facebook sign-in coming soon!');
});

/* ────────────────────────────────────────────────
   8. REAL-TIME INLINE VALIDATION (on blur)
   ──────────────────────────────────────────────── */

// Login – Email
document.getElementById('lg-email')?.addEventListener('blur', function () {
  if (this.value && !isValidEmail(this.value)) {
    showError('lg-email-group', 'lg-email-err', 'Please enter a valid email address.');
  } else {
    clearError('lg-email-group', 'lg-email-err');
  }
});

// Login – Password
document.getElementById('lg-password')?.addEventListener('blur', function () {
  if (this.value && this.value.length < 6) {
    showError('lg-pass-group', 'lg-pass-err', 'Password must be at least 6 characters.');
  } else {
    clearError('lg-pass-group', 'lg-pass-err');
  }
});

// Signup – Email
document.getElementById('sg-email')?.addEventListener('blur', function () {
  if (this.value && !isValidEmail(this.value)) {
    showError('sg-email-group', 'sg-email-err', 'Please enter a valid email address.');
  } else {
    clearError('sg-email-group', 'sg-email-err');
  }
});

// Signup – Confirm Password (live match check)
document.getElementById('sg-cpassword')?.addEventListener('input', function () {
  const pass = document.getElementById('sg-password').value;
  if (this.value && this.value !== pass) {
    showError('sg-cpass-group', 'sg-cpass-err', 'Passwords do not match.');
  } else {
    clearError('sg-cpass-group', 'sg-cpass-err');
  }
});

/* ────────────────────────────────────────────────
   9. UTILITY FUNCTIONS
   ──────────────────────────────────────────────── */

/**
 * Sets the loading state on a submit button.
 * @param {string} btnId
 * @param {string} loaderId
 * @param {boolean} loading
 */
function setLoading(btnId, loaderId, loading) {
  const btn    = document.getElementById(btnId);
  const loader = document.getElementById(loaderId);
  const text   = btn?.querySelector('.btn-text');

  if (!btn) return;
  btn.disabled = loading;

  if (loading) {
    text?.classList.add('hidden');
    loader?.classList.remove('hidden');
  } else {
    text?.classList.remove('hidden');
    loader?.classList.add('hidden');
  }
}

/**
 * Shows a toast notification.
 * @param {'success'|'error'} type
 * @param {string} message
 */
let toastTimeout;
function showToast(type, message) {
  const toast   = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');

  if (!toast || !toastMsg) return;

  // Reset
  clearTimeout(toastTimeout);
  toast.className = 'toast';
  toast.classList.remove('hidden');
  toast.classList.add(type);
  toastMsg.textContent = message;

  // Auto-hide after 3.5s
  toastTimeout = setTimeout(() => {
    toast.classList.add('hidden');
  }, 3500);
}

/**
 * Promisified delay.
 * @param {number} ms
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


document.querySelectorAll('.form-input').forEach(input => {
  input.addEventListener('focus', function () {
    this.closest('.input-wrapper')
        ?.parentElement
        ?.classList.add('focused');
  });
  input.addEventListener('blur', function () {
    this.closest('.input-wrapper')
        ?.parentElement
        ?.classList.remove('focused');
  });
});


document.addEventListener('DOMContentLoaded', () => {
  switchTab('login');
  console.log('%c Furnio Auth loaded successfully!', 'color:#c8995e;font-weight:bold;font-size:14px;');
});
