const coupons = {
  SAVE10:   { type: "percent", value: 10, label: "10% OFF" },
  FLAT20:   { type: "fixed",   value: 20000, label: "Rp. 20.000 OFF" },
  FREESHIP: { type: "ship",    value: 15000, label: "Free Shipping" },
};

const banks = [
  { name: "HDFC Bank",   icon: "🏦", color: "#004C8F" },
  { name: "SBI",         icon: "🏛️", color: "#22408B" },
  { name: "ICICI Bank",  icon: "🔶", color: "#F58220" },
  { name: "Axis Bank",   icon: "🔴", color: "#970000" },
  { name: "Kotak",       icon: "🔵", color: "#E1001F" },
  { name: "Yes Bank",    icon: "🟢", color: "#00853E" },
];
const otherBanks = [
  "Punjab National Bank","Bank of Baroda","Canara Bank","Union Bank","IndusInd Bank",
  "Federal Bank","South Indian Bank","Bank of India","Indian Bank","City Union Bank",
];

const wallets = [
  { name: "Paytm",    icon: "💰", desc: "Most Popular",   balance: "Rp. 120.000", color: "#00BAF2" },
  { name: "PhonePe",  icon: "📱", desc: "UPI Wallet",     balance: "Rp. 45.000",  color: "#5f259f" },
  { name: "Amazon Pay",icon: "🛒",desc: "Amazon Balance", balance: "Rp. 230.000", color: "#FF9900" },
  { name: "Freecharge",icon: "⚡",desc: "Instant Pay",    balance: "Rp. 18.000",  color: "#FF5722" },
];

const savedCards = [
  { number: "•••• •••• •••• 4242", name: "Guest User",    icon: "fab fa-cc-visa",       color: "#1a1f71" },
  { number: "•••• •••• •••• 5353", name: "Guest User",    icon: "fab fa-cc-mastercard", color: "#eb001b" },
];

const shippingBase = 15000;
const TAX_RATE     = 0.10; // 10% tax for example

/* ========================
   STATE
======================== */
let state = {
  products: [],
  coupon: null,
  shipping: shippingBase,
  selectedBank: null,
  selectedWallet: null,
  selectedEmiPlan: null,
  activeTab: "card",
  qrInterval: null,
  qrSeconds: 299,
};

/* ========================
   INIT
======================== */
document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  renderProducts();
  renderSavedCards();
  renderBankGrid();
  renderOtherBanks();
  renderWallets();
  renderEmiPlans();
  updatePrices();
  bindCardInputs();
  startQRTimer();
});

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    state.products = cart.map(item => ({
        ...item,
        price: parsePrice(item.price),
        quantity: parseInt(item.quantity || item.qty) || 1,
        emoji: "📦" 
    }));
}

function parsePrice(priceStr) {
    if (typeof priceStr === 'number') return priceStr;
    return parseFloat(priceStr.replace(/[^0-9.-]+/g, ""));
}

function formatCurrency(value) {
    return 'Rp. ' + value.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

/* ========================
   PRODUCT RENDERING
======================== */
function renderProducts() {
  const list = document.getElementById("productList");
  if (!list) return;
  list.innerHTML = "";
  state.products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product-item";
    const quantity = parseInt(p.quantity || p.qty) || 1;
    div.innerHTML = `
      <div class="product-thumb">${p.emoji}</div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.description || "Furniture Item"}</div>
      </div>
      <div class="product-qty-price">
        <div class="product-price">${formatCurrency(p.price * quantity)}</div>
        <div class="qty-control">
          <button class="qty-btn" onclick="changeQty('${p.id}', -1)"><i class="fas fa-minus"></i></button>
          <span class="qty-value" id="qty-${p.id}">${quantity}</span>
          <button class="qty-btn" onclick="changeQty('${p.id}', +1)"><i class="fas fa-plus"></i></button>
        </div>
      </div>
    `;
    list.appendChild(div);
  });
}

function changeQty(id, delta) {
  const product = state.products.find(p => p.id == id);
  if (!product) return;
  
  let currentQty = parseInt(product.quantity || product.qty) || 1;
  const newQty = currentQty + delta;
  
  if (newQty < 1) { showToast("Minimum quantity is 1", "error"); return; }
  if (newQty > 10) { showToast("Maximum quantity is 10", "warning"); return; }
  
  if (product.quantity !== undefined) product.quantity = newQty;
  else product.qty = newQty;
  
  // Sync back to localStorage
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItem = cart.find(item => item.id == id);
  if (cartItem) {
    if (cartItem.quantity !== undefined) cartItem.quantity = newQty;
    else cartItem.qty = newQty;
  }
  localStorage.setItem('cart', JSON.stringify(cart));

  renderProducts();
  updatePrices();
  showToast(`Quantity updated to ${newQty}`, "success");
}

/* ========================
   SAVED CARDS
======================== */
function renderSavedCards() {
  const container = document.getElementById("savedCards");
  if (!container) return;
  container.innerHTML = "";
  savedCards.forEach((card, i) => {
    const div = document.createElement("div");
    div.className = "saved-card-item";
    div.id = `saved-card-${i}`;
    div.onclick = () => selectSavedCard(i, card);
    div.innerHTML = `
      <input type="radio" class="saved-card-radio" name="savedCard" id="sc${i}" />
      <span class="saved-card-icon" style="color:${card.color}"><i class="${card.icon}"></i></span>
      <div class="saved-card-info">
        <div class="saved-card-number">${card.number}</div>
        <div class="saved-card-name">${card.name}</div>
      </div>
    `;
    container.appendChild(div);
  });
}

function selectSavedCard(index, card) {
  document.querySelectorAll(".saved-card-item").forEach(el => el.classList.remove("selected"));
  const el = document.getElementById(`saved-card-${index}`);
  if (el) el.classList.add("selected");
  const radio = document.getElementById(`sc${index}`);
  if (radio) radio.checked = true;

  // Autofill card number (fake) and name
  const fakeNumbers = ["4242424242424242", "5353535353535353"];
  autofillCardFromSaved(fakeNumbers[index], card.name);
  showToast(`Card ending in ${card.number.slice(-4)} selected`, "success");
}

function autofillCardFromSaved(rawNumber, name) {
  const numInput = document.getElementById("cardNumber");
  const nameInput = document.getElementById("cardHolder");
  if (numInput) {
    numInput.value = formatCardNumber(rawNumber);
    updateCardPreviewNumber(rawNumber);
    detectCardType(rawNumber);
  }
  if (nameInput) {
    nameInput.value = name.toUpperCase();
    const display = document.getElementById("cardHolderDisplay");
    if (display) display.textContent = name.toUpperCase();
  }
  // Switch to card tab
  const cardTabBtn = document.querySelector("[data-tab='card']");
  if (cardTabBtn) switchTab("card", cardTabBtn);
}

/* ========================
   PRICE CALCULATION
======================== */
function updatePrices() {
  const subtotal = state.products.reduce((sum, p) => {
    const qty = parseInt(p.quantity || p.qty) || 1;
    return sum + (p.price * qty);
  }, 0);
  let discount = 0;
  let ship = shippingBase;

  if (state.coupon) {
    const c = state.coupon;
    if (c.type === "percent") discount = subtotal * (c.value / 100);
    else if (c.type === "fixed") discount = Math.min(c.value, subtotal);
    else if (c.type === "ship")  { ship = 0; }
  }

  state.shipping = ship;
  const tax   = (subtotal - discount) * TAX_RATE;
  const total = subtotal - discount + ship + tax;

  const subEl = document.getElementById("subtotal");
  const shipEl = document.getElementById("shipping");
  const taxEl = document.getElementById("tax");
  const totalEl = document.getElementById("total");
  const payBtnText = document.getElementById("payBtnText");

  if (subEl) subEl.textContent = formatCurrency(subtotal);
  if (shipEl) shipEl.textContent  = ship === 0 ? "FREE" : formatCurrency(ship);
  if (taxEl) taxEl.textContent        = formatCurrency(tax);
  if (totalEl) totalEl.textContent      = formatCurrency(total);

  const discRow = document.getElementById("discountRow");
  const discAmt = document.getElementById("discountAmt");
  if (discount > 0) {
    if (discRow) discRow.style.display = "flex";
    if (discAmt) discAmt.textContent   = `-${formatCurrency(discount)}`;
  } else if (state.coupon && state.coupon.type === "ship") {
    if (discRow) discRow.style.display = "flex";
    if (discAmt) discAmt.textContent   = `-${formatCurrency(shippingBase)}`;
  } else {
    if (discRow) discRow.style.display = "none";
  }

  // Update pay button text
  if (payBtnText) payBtnText.textContent = `Pay ${formatCurrency(total)}`;
  return { subtotal, discount, ship, tax, total };
}

function getTotal() {
  const { total } = updatePrices();
  return total;
}

/* ========================
   COUPON
======================== */
function fillCoupon(code) {
  const input = document.getElementById("couponInput");
  if (input) input.value = code;
}

function applyCoupon() {
  const input = document.getElementById("couponInput");
  if (!input) return;
  const code = input.value.trim().toUpperCase();
  const msgEl = document.getElementById("couponMessage");

  if (!code) {
    if (msgEl) msgEl.innerHTML = `<div class="coupon-msg-error"><i class="fas fa-times-circle"></i> Please enter a coupon code.</div>`;
    return;
  }

  if (coupons[code]) {
    state.coupon = coupons[code];
    updatePrices();
    if (msgEl) msgEl.innerHTML = `<div class="coupon-msg-success"><i class="fas fa-check-circle"></i> "${code}" applied! ${coupons[code].label}</div>`;
    showToast(`Coupon "${code}" applied! ${coupons[code].label}`, "success");
  } else {
    state.coupon = null;
    updatePrices();
    if (msgEl) msgEl.innerHTML = `<div class="coupon-msg-error"><i class="fas fa-times-circle"></i> Invalid coupon code. Try SAVE10, FLAT20 or FREESHIP.</div>`;
    showToast("Invalid coupon code!", "error");
  }
}

/* ========================
   CARD INPUT BINDING
======================== */
function bindCardInputs() {
  const numInput    = document.getElementById("cardNumber");
  const nameInput   = document.getElementById("cardHolder");
  const expiryInput = document.getElementById("cardExpiry");
  const cvvInput    = document.getElementById("cardCvv");

  if (numInput) {
    numInput.addEventListener("input", (e) => {
      let raw = e.target.value.replace(/\D/g, "").slice(0, 16);
      e.target.value = formatCardNumber(raw);
      updateCardPreviewNumber(raw);
      detectCardType(raw);
      clearError("cardNumberError");
    });
  }

  if (nameInput) {
    nameInput.addEventListener("input", (e) => {
      const val = e.target.value.toUpperCase();
      e.target.value = val;
      const display = document.getElementById("cardHolderDisplay");
      if (display) display.textContent = val || "FULL NAME";
      clearError("cardHolderError");
    });
  }

  if (expiryInput) {
    expiryInput.addEventListener("input", (e) => {
      let raw = e.target.value.replace(/\D/g, "");
      if (raw.length >= 3) raw = raw.slice(0, 2) + "/" + raw.slice(2, 4);
      else if (raw.length === 2 && e.target.value.length < (expiryInput.dataset.prev?.length || 0)) raw = raw;
      else if (raw.length === 2) raw = raw + "/";
      expiryInput.dataset.prev = raw;
      e.target.value = raw;
      const display = document.getElementById("cardExpiryDisplay");
      if (display) display.textContent = raw || "MM/YY";
      clearError("cardExpiryError");
    });
  }

  if (cvvInput) {
    cvvInput.addEventListener("focus", () => {
      const preview = document.getElementById("cardPreview");
      if (preview) preview.classList.add("flipped");
    });
    cvvInput.addEventListener("blur", () => {
      const preview = document.getElementById("cardPreview");
      if (preview) preview.classList.remove("flipped");
    });
    cvvInput.addEventListener("input", (e) => {
      const val = e.target.value.replace(/\D/g, "");
      e.target.value = val;
      const display = document.getElementById("cardCvvDisplay");
      if (display) display.textContent = "•".repeat(val.length) || "•••";
      clearError("cardCvvError");
    });
  }

  // EMI card input
  const emiCard = document.getElementById("emiCardNumber");
  if (emiCard) {
    emiCard.addEventListener("input", (e) => {
      let raw = e.target.value.replace(/\D/g, "").slice(0, 16);
      e.target.value = formatCardNumber(raw);
    });
  }
}

function formatCardNumber(raw) {
  return raw.match(/.{1,4}/g)?.join(" ") || raw;
}

function updateCardPreviewNumber(raw) {
  const groups = [];
  for (let i = 0; i < 4; i++) {
    const chunk = raw.slice(i * 4, i * 4 + 4);
    groups.push(chunk.padEnd(4, "•").replace(/\d/g, (d, idx) => idx < chunk.length ? d : "•"));
  }
  const display = document.getElementById("cardNumberDisplay");
  if (display) display.textContent = groups.join(" ") || "•••• •••• •••• ••••";
}

function detectCardType(raw) {
  const badge = document.getElementById("cardTypeBadge");
  const networkIcon = document.getElementById("cardNetworkIcon");
  if (!badge || !networkIcon) return;

  if (/^4/.test(raw)) {
    badge.innerHTML = `<i class="fab fa-cc-visa" style="color:#1a1f71"></i>`;
    networkIcon.innerHTML = `<i class="fab fa-cc-visa"></i>`;
  } else if (/^5[1-5]/.test(raw)) {
    badge.innerHTML = `<i class="fab fa-cc-mastercard" style="color:#eb001b"></i>`;
    networkIcon.innerHTML = `<i class="fab fa-cc-mastercard"></i>`;
  } else if (/^3[47]/.test(raw)) {
    badge.innerHTML = `<i class="fab fa-cc-amex" style="color:#007bc1"></i>`;
    networkIcon.innerHTML = `<i class="fab fa-cc-amex"></i>`;
  } else if (/^6/.test(raw)) {
    badge.innerHTML = `<i class="fab fa-cc-discover" style="color:#ff6600"></i>`;
    networkIcon.innerHTML = `<i class="fab fa-cc-discover"></i>`;
  } else {
    badge.innerHTML = "";
    networkIcon.innerHTML = `<i class="fab fa-cc-visa"></i>`;
  }
}

/* ========================
   TABS
======================== */
function switchTab(tab, btn) {
  document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(el => el.classList.remove("active"));
  const target = document.getElementById(`tab-${tab}`);
  if (target) target.classList.add("active");
  if (btn) btn.classList.add("active");
  state.activeTab = tab;
}

/* ========================
   UPI
======================== */
function verifyUPI() {
  const upiInput = document.getElementById("upiId");
  if (!upiInput) return;
  const upi    = upiInput.value.trim();
  const result = document.getElementById("upiVerifyResult");
  const errEl  = document.getElementById("upiError");

  if (!upi) { if (errEl) errEl.textContent = "Please enter a UPI ID."; return; }
  if (errEl) errEl.textContent = "";

  const upiRegex = /^[\w.\-]+@[\w]+$/;
  if (!upiRegex.test(upi)) {
    if (errEl) errEl.textContent = "Invalid UPI ID format. Example: name@upi";
    if (result) result.innerHTML = `<div class="upi-invalid"><i class="fas fa-times-circle"></i> Invalid UPI ID format.</div>`;
    return;
  }

  if (result) result.innerHTML = `<div style="color:var(--text-muted); font-size:0.82rem;"><i class="fas fa-spinner fa-spin"></i> Verifying...</div>`;

  setTimeout(() => {
    if (result) result.innerHTML = `<div class="upi-verified"><i class="fas fa-check-circle"></i> UPI ID verified! Linked to <strong>${upi.split("@")[0].replace(/.(?=.{2})/g, "*")}</strong></div>`;
    showToast("UPI ID verified successfully!", "success");
  }, 1500);
}

/* ========================
   QR TIMER
======================== */
function startQRTimer() {
  state.qrSeconds = 299;
  updateQRTimerDisplay();
  if (state.qrInterval) clearInterval(state.qrInterval);
  state.qrInterval = setInterval(() => {
    state.qrSeconds--;
    if (state.qrSeconds <= 0) {
      clearInterval(state.qrInterval);
      const timerEl = document.getElementById("qrTimer");
      if (timerEl) timerEl.textContent = "Expired";
      return;
    }
    updateQRTimerDisplay();
  }, 1000);
}

function updateQRTimerDisplay() {
  const el = document.getElementById("qrTimer");
  if (!el) return;
  const m = String(Math.floor(state.qrSeconds / 60)).padStart(2, "0");
  const s = String(state.qrSeconds % 60).padStart(2, "0");
  el.textContent = `${m}:${s}`;
}

/* ========================
   NET BANKING
======================== */
function renderBankGrid() {
  const grid = document.getElementById("bankGrid");
  if (!grid) return;
  grid.innerHTML = "";
  banks.forEach(bank => {
    const div = document.createElement("div");
    div.className = "bank-item";
    div.id = `bank-${bank.name.replace(/\s/g, "")}`;
    div.onclick = () => selectBank(bank.name);
    div.innerHTML = `
      <span class="bank-icon">${bank.icon}</span>
      <span class="bank-name">${bank.name}</span>
    `;
    grid.appendChild(div);
  });
}

function renderOtherBanks() {
  const sel = document.getElementById("otherBank");
  if (!sel) return;
  otherBanks.forEach(b => {
    const opt = document.createElement("option");
    opt.value = b;
    opt.textContent = b;
    sel.appendChild(opt);
  });
}

function selectBank(name) {
  if (!name) return;
  state.selectedBank = name;
  document.querySelectorAll(".bank-item").forEach(el => el.classList.remove("selected"));
  const el = document.getElementById(`bank-${name.replace(/\s/g, "")}`);
  if (el) el.classList.add("selected");

  const info = document.getElementById("selectedBankInfo");
  if (info) {
    info.style.display = "block";
    info.innerHTML = `<i class="fas fa-check-circle" style="color:var(--success)"></i> <strong>${name}</strong> selected. You will be redirected to the bank's secure login page.`;
  }
  showToast(`${name} selected`, "success");
}

/* ========================
   WALLETS
======================== */
function renderWallets() {
  const grid = document.getElementById("walletGrid");
  if (!grid) return;
  grid.innerHTML = "";
  wallets.forEach(w => {
    const div = document.createElement("div");
    div.className = "wallet-item";
    div.id = `wallet-${w.name.replace(/\s/g, "")}`;
    div.onclick = () => selectWallet(w);
    div.innerHTML = `
      <span class="wallet-icon">${w.icon}</span>
      <div class="wallet-info">
        <div class="wallet-item-name">${w.name}</div>
        <div class="wallet-item-desc">${w.desc}</div>
      </div>
    `;
    grid.appendChild(div);
  });
}

function selectWallet(wallet) {
  state.selectedWallet = wallet;
  document.querySelectorAll(".wallet-item").forEach(el => el.classList.remove("selected"));
  const el = document.getElementById(`wallet-${wallet.name.replace(/\s/g, "")}`);
  if (el) el.classList.add("selected");

  const section = document.getElementById("walletBalanceSection");
  if (section) {
    section.style.display = "block";
    const wName = document.getElementById("walletName");
    const wBal = document.getElementById("walletBalance");
    if (wName) wName.textContent = wallet.name;
    if (wBal) wBal.textContent = wallet.balance;
  }
  showToast(`${wallet.name} wallet selected`, "success");
}

/* ========================
   EMI PLANS
======================== */
function renderEmiPlans() {
  const total = state.products.reduce((s, p) => {
    const qty = parseInt(p.quantity || p.qty) || 1;
    return s + (p.price * qty);
  }, 0);
  const plans = [
    { months: 3,  rate: 0,    label: "No Cost EMI" },
    { months: 6,  rate: 1.5,  label: "1.5% per month" },
    { months: 9,  rate: 1.2,  label: "1.2% per month" },
    { months: 12, rate: 1.0,  label: "1.0% per month" },
    { months: 18, rate: 0.9,  label: "0.9% per month" },
    { months: 24, rate: 0.8,  label: "0.8% per month" },
  ];

  const container = document.getElementById("emiPlans");
  if (!container) return;
  container.innerHTML = "";
  plans.forEach((plan, i) => {
    const interest   = plan.rate / 100;
    const monthly    = plan.rate === 0
      ? total / plan.months
      : (total * interest * Math.pow(1 + interest, plan.months)) / (Math.pow(1 + interest, plan.months) - 1);
    const totalPay   = monthly * plan.months;

    const div = document.createElement("div");
    div.className = "emi-plan-item";
    div.id = `emi-${i}`;
    div.onclick = () => selectEmiPlan(i, plan, monthly, totalPay);
    div.innerHTML = `
      <div class="emi-left">
        <input type="radio" class="emi-radio" name="emiPlan" id="emiR${i}" />
        <div>
          <div class="emi-months">${plan.months} Months ${plan.rate === 0 ? '<span class="emi-no-cost">No Cost</span>' : ""}</div>
          <div class="emi-rate">${plan.label}</div>
        </div>
      </div>
      <div class="emi-right">
        <div class="emi-amount">${formatCurrency(monthly)}/mo</div>
        <div class="emi-total">Total: ${formatCurrency(totalPay)}</div>
      </div>
    `;
    container.appendChild(div);
  });
}

function selectEmiPlan(i, plan, monthly, totalPay) {
  state.selectedEmiPlan = { plan, monthly, totalPay };
  document.querySelectorAll(".emi-plan-item").forEach(el => el.classList.remove("selected"));
  const el = document.getElementById(`emi-${i}`);
  if (el) el.classList.add("selected");
  const radio = document.getElementById(`emiR${i}`);
  if (radio) radio.checked = true;
  showToast(`${plan.months}-month EMI selected: ${formatCurrency(monthly)}/mo`, "success");
}

/* ========================
   PAYMENT PROCESSING
======================== */
function processPayment(method) {
  if (!validatePayment(method)) return;

  const btn = document.querySelector(`#tab-${method} .pay-btn`);
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span> Processing...`;
  }

  setTimeout(() => {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = restoreBtnHTML(method);
    }
    showSuccessModal(method);
  }, 2500);
}

function restoreBtnHTML(method) {
  const map = {
    card:       `<i class="fas fa-lock"></i> <span id="payBtnText">Pay Now</span>`,
    upi:        `<i class="fas fa-lock"></i> Pay via UPI`,
    netbanking: `<i class="fas fa-university"></i> Proceed to Net Banking`,
    wallet:     `<i class="fas fa-wallet"></i> Pay via Wallet`,
    emi:        `<i class="fas fa-calendar-check"></i> Confirm EMI Plan`,
  };
  return map[method] || `<i class="fas fa-lock"></i> Pay Now`;
}

/* ========================
   VALIDATION
======================== */
function validatePayment(method) {
  if (method === "card")       return validateCard();
  if (method === "upi")        return validateUPIPayment();
  if (method === "netbanking") return validateNetBanking();
  if (method === "wallet")     return validateWallet();
  if (method === "emi")        return validateEMI();
  return true;
}

function validateCard() {
  let valid = true;
  const numInput = document.getElementById("cardNumber");
  const nameInput = document.getElementById("cardHolder");
  const expiryInput = document.getElementById("cardExpiry");
  const cvvInput = document.getElementById("cardCvv");

  const num    = numInput ? numInput.value.replace(/\s/g, "") : "";
  const name   = nameInput ? nameInput.value.trim() : "";
  const expiry = expiryInput ? expiryInput.value : "";
  const cvv    = cvvInput ? cvvInput.value : "";

  clearAllCardErrors();

  if (!num || num.length < 13 || !luhnCheck(num)) {
    setError("cardNumberError", "Please enter a valid card number.");
    setInputState("cardNumber", "error");
    valid = false;
  } else { setInputState("cardNumber", "valid"); }

  if (!name || name.length < 3 || !/^[a-zA-Z\s]+$/.test(name)) {
    setError("cardHolderError", "Please enter a valid cardholder name.");
    setInputState("cardHolder", "error");
    valid = false;
  } else { setInputState("cardHolder", "valid"); }

  if (!expiry || !validateExpiry(expiry)) {
    setError("cardExpiryError", "Please enter a valid expiry date (MM/YY).");
    setInputState("cardExpiry", "error");
    valid = false;
  } else { setInputState("cardExpiry", "valid"); }

  if (!cvv || cvv.length < 3) {
    setError("cardCvvError", "CVV must be 3–4 digits.");
    setInputState("cardCvv", "error");
    valid = false;
  } else { setInputState("cardCvv", "valid"); }

  if (!valid) showToast("Please fix the errors before proceeding.", "error");
  return valid;
}

function validateUPIPayment() {
  const upiInput = document.getElementById("upiId");
  if (!upiInput) return false;
  const upi    = upiInput.value.trim();
  const errEl  = document.getElementById("upiError");
  const result = document.getElementById("upiVerifyResult");
  if (!upi) { if (errEl) errEl.textContent = "Please enter your UPI ID."; return false; }
  if (!/^[\w.\-]+@[\w]+$/.test(upi)) {
    if (errEl) errEl.textContent = "Invalid UPI ID. Format: name@bankcode";
    return false;
  }
  if (!result || !result.querySelector(".upi-verified")) {
    showToast("Please verify your UPI ID first.", "warning");
    return false;
  }
  return true;
}

function validateNetBanking() {
  if (!state.selectedBank) {
    showToast("Please select a bank to proceed.", "error");
    return false;
  }
  return true;
}

function validateWallet() {
  if (!state.selectedWallet) {
    showToast("Please select a wallet to proceed.", "error");
    return false;
  }
  const mobileInput = document.getElementById("walletMobile");
  const mobile = mobileInput ? mobileInput.value.trim() : "";
  const mErr   = document.getElementById("walletMobileError");
  if (!mobile || mobile.length < 10) {
    if (mErr) mErr.textContent = "Please enter a valid mobile number.";
    return false;
  }
  if (mErr) mErr.textContent = "";
  return true;
}

function validateEMI() {
  if (!state.selectedEmiPlan) {
    showToast("Please select an EMI plan.", "error");
    return false;
  }
  const cardInput = document.getElementById("emiCardNumber");
  const cardNum = cardInput ? cardInput.value.replace(/\s/g, "") : "";
  const errEl   = document.getElementById("emiCardError");
  if (!cardNum || cardNum.length < 13 || !luhnCheck(cardNum)) {
    if (errEl) errEl.textContent = "Please enter a valid credit card number.";
    return false;
  }
  if (errEl) errEl.textContent = "";
  return true;
}

/* ========================
   LUHN CHECK
======================== */
function luhnCheck(num) {
  let sum = 0;
  let isEven = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let digit = parseInt(num[i], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}

function validateExpiry(expiry) {
  const [mm, yy] = expiry.split("/");
  if (!mm || !yy || mm.length !== 2 || yy.length !== 2) return false;
  const month = parseInt(mm, 10);
  const year  = parseInt("20" + yy, 10);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const exp = new Date(year, month - 1, 1);
  return exp >= new Date(now.getFullYear(), now.getMonth(), 1);
}

/* ========================
   ERROR HELPERS
======================== */
function setError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}
function clearError(id) {
  const el = document.getElementById(id);
  if (el) el.textContent = "";
}
function clearAllCardErrors() {
  ["cardNumberError", "cardHolderError", "cardExpiryError", "cardCvvError"].forEach(clearError);
  ["cardNumber", "cardHolder", "cardExpiry", "cardCvv"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("input-error", "input-valid");
  });
}
function setInputState(id, state) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove("input-error", "input-valid");
  if (state === "error") el.classList.add("input-error");
  if (state === "valid") el.classList.add("input-valid");
}

/* ========================
   SUCCESS MODAL
======================== */
function showSuccessModal(method) {
  const total = updatePrices().total;
  const txnId = "TXN" + Date.now().toString().slice(-10).toUpperCase();
  const date  = new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

  const methodLabels = {
    card: "Credit / Debit Card",
    upi:  "UPI",
    netbanking: `Net Banking (${state.selectedBank || "Bank"})`,
    wallet: `Wallet (${state.selectedWallet?.name || "Wallet"})`,
    emi: `EMI (${state.selectedEmiPlan?.plan?.months || "?"} months)`,
  };

  const msgEl = document.getElementById("modalMessage");
  const detailsEl = document.getElementById("modalDetails");
  const modal = document.getElementById("successModal");

  if (msgEl) msgEl.textContent = "Your payment has been processed successfully.";
  if (detailsEl) detailsEl.innerHTML = `
    <div class="modal-detail-row"><span>Transaction ID</span><span>${txnId}</span></div>
    <div class="modal-detail-row"><span>Date & Time</span><span>${date}</span></div>
    <div class="modal-detail-row"><span>Payment Method</span><span>${methodLabels[method] || method}</span></div>
    <div class="modal-detail-row"><span>Amount Paid</span><span>${formatCurrency(total)}</span></div>
    <div class="modal-detail-row"><span>Status</span><span style="color:var(--success)">✅ Success</span></div>
  `;

  if (modal) modal.classList.add("active");
}

function closeModal() {
  const modal = document.getElementById("successModal");
  if (modal) modal.classList.remove("active");
  showToast("Thank you for your payment! 🎉", "success");

  // Reset form
  const cardForm = document.getElementById("cardForm");
  if (cardForm) cardForm.reset();
  clearAllCardErrors();
  
  const numDisp = document.getElementById("cardNumberDisplay");
  const nameDisp = document.getElementById("cardHolderDisplay");
  const expDisp = document.getElementById("cardExpiryDisplay");
  const cvvDisp = document.getElementById("cardCvvDisplay");
  const netIcon = document.getElementById("cardNetworkIcon");
  const typeBadge = document.getElementById("cardTypeBadge");

  if (numDisp) numDisp.textContent = "•••• •••• •••• ••••";
  if (nameDisp) nameDisp.textContent = "FULL NAME";
  if (expDisp) expDisp.textContent = "MM/YY";
  if (cvvDisp) cvvDisp.textContent    = "•••";
  if (netIcon) netIcon.innerHTML     = `<i class="fab fa-cc-visa"></i>`;
  if (typeBadge) typeBadge.innerHTML       = "";

  state.coupon = null;
  state.selectedBank = null;
  state.selectedWallet = null;
  state.selectedEmiPlan = null;
  updatePrices();
  
  const cMsg = document.getElementById("couponMessage");
  const cInput = document.getElementById("couponInput");
  const discRow = document.getElementById("discountRow");

  if (cMsg) cMsg.innerHTML = "";
  if (cInput) cInput.value = "";
  if (discRow) discRow.style.display = "none";
  
  // Optionally redirect or clear cart
  localStorage.removeItem('cart');
  setTimeout(() => window.location.href = 'homepage.html', 2000);
}

/* ========================
   TOAST
======================== */
function showToast(message, type = "default") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.className   = `toast toast-${type} show`;
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

