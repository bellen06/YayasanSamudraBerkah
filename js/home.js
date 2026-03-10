// Scroll header effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'slideUp 0.8s ease-out';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe campaign cards
document.querySelectorAll('.campaign-card, .info-card, .impact-card').forEach(el => {
  observer.observe(el);
});

// Testimonials Carousel
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-item');
const totalTestimonials = testimonials.length;

function showTestimonial(index) {
  testimonials.forEach(item => {
    item.style.display = 'none';
  });
  
  if (index >= totalTestimonials) {
    currentTestimonial = 0;
  } else if (index < 0) {
    currentTestimonial = totalTestimonials - 1;
  } else {
    currentTestimonial = index;
  }
  
  testimonials[currentTestimonial].style.display = 'block';
  testimonials[currentTestimonial].style.animation = 'fadeIn 0.8s ease-out';
}

function nextTestimonial() {
  showTestimonial(currentTestimonial + 1);
}

function previousTestimonial() {
  showTestimonial(currentTestimonial - 1);
}

// Auto rotate testimonials every 5 seconds
setInterval(() => {
  nextTestimonial();
}, 5000);

// Smooth scroll for buttons
function smoothScroll(target) {
  target.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

// Counter animation for impact numbers
function animateCounter(element, target) {
  let current = 0;
  const increment = target / 50;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target.toLocaleString('id-ID');
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current).toLocaleString('id-ID');
    }
  }, 20);
}

// Trigger counter animation when section is visible
const impactObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
      const target = parseInt(entry.target.getAttribute('data-target'));
      // Clean target number (remove non-numeric except comma)
      const cleanTarget = parseInt(entry.target.getAttribute('data-target').toString().replace(/[^\d]/g, ''));
      
      animateCounter(entry.target, cleanTarget);
      entry.target.classList.add('animated');
      impactObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.impact-number').forEach(el => {
  impactObserver.observe(el);
});

// Add to window for onclick handlers
window.nextTestimonial = nextTestimonial;
window.previousTestimonial = previousTestimonial;
