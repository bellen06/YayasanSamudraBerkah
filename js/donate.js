// Donation Form State Management
const formState = {
  selectedAmount: null,
  customAmount: null,
  donorName: '',
  donorEmail: '',
  donorPhone: '',
  donorMessage: '',
  currentStep: 1
};

// Format currency to Indonesian Rupiah
function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Get total donation amount
function getTotalAmount() {
  return formState.customAmount || formState.selectedAmount || 0;
}

// Select amount button handler
function selectAmount(amount) {
  formState.selectedAmount = amount;
  formState.customAmount = null;
  
  // Update button states
  document.querySelectorAll('.amount-btn').forEach(btn => {
    btn.classList.remove('selected');
    if (parseInt(btn.getAttribute('data-amount')) === amount) {
      btn.classList.add('selected');
    }
  });
  
  // Hide custom input if preset amount is selected
  const customInput = document.getElementById('customAmount');
  customInput.classList.remove('show');
  customInput.value = '';
  
  updateSummary();
  enableNextButton(1);
}

// Custom amount input handler
function selectCustomAmount(value) {
  const customValue = parseInt(value);
  
  if (customValue > 0) {
    formState.customAmount = customValue;
    formState.selectedAmount = null;
    
    // Remove selected state from all buttons
    document.querySelectorAll('.amount-btn').forEach(btn => {
      btn.classList.remove('selected');
    });
    
    updateSummary();
    enableNextButton(1);
  }
}

// Update summary display
function updateSummary() {
  const totalAmount = getTotalAmount();
  const formattedAmount = formatCurrency(totalAmount);
  
  // Update step 1 summary
  document.getElementById('summaryAmount1').textContent = formattedAmount;
  document.getElementById('totalAmount1').textContent = formattedAmount;
  
  // Update step 2 summary
  document.getElementById('totalAmount2').textContent = formattedAmount;
  document.getElementById('summaryName').textContent = formState.donorName || '-';
  document.getElementById('summaryEmail').textContent = formState.donorEmail || '-';
}

// Enable/disable next button
function enableNextButton(step) {
  const btn = document.getElementById(`nextBtn${step}`);
  if (step === 1) {
    btn.disabled = getTotalAmount() === 0;
  } else if (step === 2) {
    const hasName = document.getElementById('donorName').value.trim();
    const hasEmail = document.getElementById('donorEmail').value.trim();
    btn.disabled = !hasName || !hasEmail;
  }
}

// Navigate to step
function goToStep(step) {
  if (step === 2) {
    // Validate step 1
    if (getTotalAmount() === 0) {
      alert('Silahkan pilih jumlah donasi terlebih dahulu');
      return;
    }
  } else if (step === 3) {
    // Validate step 2
    const name = document.getElementById('donorName').value.trim();
    const email = document.getElementById('donorEmail').value.trim();
    
    if (!name || !email) {
      alert('Silahkan lengkapi data Anda terlebih dahulu');
      return;
    }
    
    // Update form state
    formState.donorName = name;
    formState.donorEmail = email;
    formState.donorPhone = document.getElementById('donorPhone').value.trim();
    formState.donorMessage = document.getElementById('donorMessage').value.trim();
    
    // Show success screen with data
    showSuccessScreen();
  }
  
  // Update step
  formState.currentStep = step;
  updateStepDisplay();
}

// Update step display
function updateStepDisplay() {
  // Hide all sections
  document.querySelectorAll('.form-section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Show current section
  document.getElementById(`section${formState.currentStep}`).classList.add('active');
  
  // Update progress steps
  for (let i = 1; i <= 3; i++) {
    const stepEl = document.getElementById(`step${i}`);
    const lineEl = document.getElementById(`line${i}`);
    
    stepEl.classList.remove('active', 'completed');
    if (lineEl) lineEl.classList.remove('active');
    
    if (i < formState.currentStep) {
      stepEl.classList.add('completed');
      if (lineEl) lineEl.classList.add('active');
    } else if (i === formState.currentStep) {
      stepEl.classList.add('active');
      if (lineEl) lineEl.classList.add('active');
    }
  }
  
  // Update title and subtitle
  const titles = {
    1: 'Berikan Donasi Anda',
    2: 'Data Pribadi Anda',
    3: 'Donasi Berhasil'
  };
  
  const subtitles = {
    1: 'Pilih jumlah donasi yang ingin Anda berikan',
    2: 'Lengkapi informasi Anda untuk konfirmasi donasi',
    3: 'Terima kasih atas donasi Anda'
  };
  
  document.getElementById('pageTitle').textContent = titles[formState.currentStep];
  document.getElementById('pageSubtitle').textContent = subtitles[formState.currentStep];
  
  // Update summary when going to step 2
  if (formState.currentStep === 2) {
    updateSummary();
  }
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show success screen with custom amount input support
function showSuccessScreen() {
  const totalAmount = getTotalAmount();
  const formattedAmount = formatCurrency(totalAmount);
  const referenceNumber = 'YSB' + Date.now().toString().slice(-8);
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  // Update success details
  document.getElementById('successName').textContent = formState.donorName;
  document.getElementById('successEmail').textContent = formState.donorEmail;
  document.getElementById('successAmount').textContent = formattedAmount;
  document.getElementById('successDate').textContent = currentDate;
  document.getElementById('successReference').textContent = referenceNumber;
  
  // Go to step 3
  formState.currentStep = 3;
  updateStepDisplay();
  
  // Countdown and auto-reset after 3 seconds
  let countdown = 3;
  const countdownEl = document.getElementById('countdown');
  
  const timer = setInterval(() => {
    countdown--;
    countdownEl.textContent = countdown;
    
    if (countdown <= 0) {
      clearInterval(timer);
      resetForm();
    }
  }, 1000);
}

// Reset form to initial state
function resetForm() {
  formState.selectedAmount = null;
  formState.customAmount = null;
  formState.donorName = '';
  formState.donorEmail = '';
  formState.donorPhone = '';
  formState.donorMessage = '';
  formState.currentStep = 1;
  
  // Reset form inputs
  document.getElementById('customAmount').value = '';
  document.getElementById('customAmount').classList.remove('show');
  document.getElementById('donorName').value = '';
  document.getElementById('donorEmail').value = '';
  document.getElementById('donorPhone').value = '';
  document.getElementById('donorMessage').value = '';
  
  // Reset button states
  document.querySelectorAll('.amount-btn').forEach(btn => {
    btn.classList.remove('selected');
  });
  
  updateStepDisplay();
  updateSummary();
}

// Share on social media
function shareOnSocial() {
  const text = `Saya baru saja berdonasi untuk membantu sesama melalui Yayasan Samudra Berkah. Mari bergabung dengan saya untuk memberikan dampak positif. Kunjungi: `;
  const url = window.location.origin;
  
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + url)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + url)}`;
  
  // Show simple share dialog
  const shareDialog = document.createElement('div');
  shareDialog.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    z-index: 10000;
    text-align: center;
  `;
  
  shareDialog.innerHTML = `
    <h3 style="margin-bottom: 1rem; color: var(--text-dark);">Bagikan Donasi Anda</h3>
    <div style="display: flex; gap: 1rem; justify-content: center;">
      <a href="${whatsappUrl}" target="_blank" style="
        padding: 0.75rem 1.5rem;
        background: #25D366;
        color: white;
        border-radius: 0.5rem;
        text-decoration: none;
        font-weight: 600;
      ">WhatsApp</a>
      <a href="${twitterUrl}" target="_blank" style="
        padding: 0.75rem 1.5rem;
        background: #1DA1F2;
        color: white;
        border-radius: 0.5rem;
        text-decoration: none;
        font-weight: 600;
      ">Twitter</a>
      <button onclick="this.parentElement.parentElement.remove()" style="
        padding: 0.75rem 1.5rem;
        background: #E0E0E0;
        color: #333;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
      ">Tutup</button>
    </div>
  `;
  
  document.body.appendChild(shareDialog);
}

// Event listeners for form inputs
document.getElementById('donorName').addEventListener('input', (e) => {
  formState.donorName = e.target.value;
  updateSummary();
  enableNextButton(2);
});

document.getElementById('donorEmail').addEventListener('input', (e) => {
  formState.donorEmail = e.target.value;
  updateSummary();
  enableNextButton(2);
});

document.getElementById('donorPhone').addEventListener('input', (e) => {
  formState.donorPhone = e.target.value;
});

document.getElementById('donorMessage').addEventListener('input', (e) => {
  formState.donorMessage = e.target.value;
});

// Custom amount input visibility toggle
document.getElementById('customAmount').addEventListener('focus', (e) => {
  if (e.target.value === '') {
    e.target.classList.add('show');
  }
});

document.addEventListener('click', (e) => {
  if (e.target.id !== 'customAmount' && e.target.parentElement?.id !== 'customAmount') {
    const customAmount = document.getElementById('customAmount');
    if (customAmount.value === '' && !customAmount.classList.contains('show')) {
      customAmount.classList.remove('show');
    }
  }
});

// Add to window for onclick handlers
window.selectAmount = selectAmount;
window.selectCustomAmount = selectCustomAmount;
window.goToStep = goToStep;
window.shareOnSocial = shareOnSocial;

// Initialize
updateStepDisplay();
