// Navigation Toggle for Mobile
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// Add active class styling
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary-color) !important;
        position: relative;
    }
    .nav-link.active::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 100%;
        height: 2px;
        background: var(--primary-color);
    }
`;
document.head.appendChild(style);

// Animate Skills Progress Bars on Scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.skill-progress');
            progressBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    observer.observe(skillsSection);
}

// Animate Stat Cards on Scroll
const statCards = document.querySelectorAll('.stat-card');
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            statObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

statCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease';
    statObserver.observe(card);
});

// Animate Work Cards on Scroll
const workCards = document.querySelectorAll('.work-card');
if (workCards.length > 0) {
    const workObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
                workObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px'
    });

    workCards.forEach(card => {
        // Only animate if not already visible
        if (window.getComputedStyle(card).opacity !== '1') {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
            workObserver.observe(card);
        }
    });
}

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        // If fallback submit has been requested, allow default submit to proceed
        if (contactForm.dataset.fallback === '1') {
            return; // let browser do the normal form POST
        }
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // Simple validation
        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields');
            return;
        }

        // Honeypot: if _gotcha is filled then likely a bot -> drop silently
        const gotcha = document.getElementById('_gotcha');
        if (gotcha && gotcha.value) {
            console.warn('Honeypot triggered — dropping submission');
            // Show local success so bots / scrapers don't get retries
            document.getElementById('contact-status').textContent = 'Thanks — message received.';
            contactForm.reset();
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // POST the form data to Formspree so messages are delivered to your email
        // Formspree endpoint is read from the form action or data-formspree-endpoint attribute
        const endpoint = contactForm.getAttribute('data-formspree-endpoint') || contactForm.action;

        // Start a short watchdog - if fetch doesn't start within 3s we will fallback to normal submit
        let fetchStarted = false;
        const fallbackTimer = setTimeout(() => {
            if (!fetchStarted) {
                console.warn('Fetch did not start within timeout, falling back to normal submit');
                const statusEl = document.getElementById('contact-status');
                statusEl.style.color = 'var(--danger-color, #e11d48)';
                statusEl.textContent = 'Taking longer than expected — trying standard submit...';
                contactForm.dataset.fallback = '1';
                contactForm.submit();
            }
        }, 3000);

        try {
            console.log('Starting submit — preparing fetch to Formspree endpoint:', endpoint);
            const statusElStarting = document.getElementById('contact-status');
            statusElStarting.style.color = 'var(--text-primary)';
            statusElStarting.textContent = 'Sending message...';
            // Use FormData to match a regular form submit (more compatible with Formspree)
            const formData = new FormData(contactForm);
            // include a reply-to header that Formspree commonly uses
            if (email) formData.set('_replyto', email);
            if (subject) formData.set('_subject', subject);

            // mark that we are actually starting the fetch
            fetchStarted = true;
            const response = await fetch(endpoint, {
                method: 'POST',
                // Do not set Content-Type when sending FormData — browser handles it
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            });

            // Better logging for debugging (open devtools or check browser console)
            console.log('Formspree response status:', response.status);
            const respData = await response.json().catch(() => ({}));
            console.log('Formspree response body:', respData);

            const statusEl = document.getElementById('contact-status');
            clearTimeout(fallbackTimer);
            if (response.ok) {
                // show friendly inline message instead of alert
                statusEl.style.color = 'var(--primary-color)';
                statusEl.textContent = 'Thank you — message sent successfully.';
                contactForm.reset();
            } else {
                const errMsg = respData.error || respData.message || 'Something went wrong; your message was not sent.';
                // try fallback regular submit for better compatibility
                statusEl.style.color = 'var(--danger-color, #e11d48)';
                statusEl.textContent = 'Server refused the request — trying fallback...';
                console.warn('Formspree returned non-OK, trying fallback form submit', respData);
                // fall back: set a marker and do a normal submit so the browser will POST directly
                contactForm.dataset.fallback = '1';
                contactForm.submit();
            }
        } catch (err) {
            clearTimeout(fallbackTimer);
            console.error('Form submit error (caught):', err);
            console.error('Form submit error:', err);
            const statusEl = document.getElementById('contact-status');
            statusEl.style.color = 'var(--danger-color, #e11d48)';
            statusEl.textContent = 'Network error — trying fallback submit...';
            // fallback to normal form submit in case fetch/network blocked
            contactForm.dataset.fallback = '1';
            contactForm.submit();
        }
    });
}

// Navbar Background on Scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(15, 23, 42, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Parallax Effect for Hero Section - تم إزالته لتجنب ظهور Hero في الخلفية
// window.addEventListener('scroll', () => {
//     const scrolled = window.pageYOffset;
//     const hero = document.querySelector('.hero');
//     if (hero && scrolled < window.innerHeight) {
//         hero.style.transform = `translateY(${scrolled * 0.5}px)`;
//         hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
//     }
// });

// Ensure body is visible on load
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

