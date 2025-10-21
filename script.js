(function() {
    var header = document.querySelector('header');
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('nav a'));
    var sections = [
        { id: 'home', el: document.querySelector('#home') },
        { id: 'facts', el: document.getElementById('facts') },
        { id: 'causes-effects', el: document.getElementById('causes-effects') },
        { id: 'what-to-do', el: document.getElementById('what-to-do') },
        { id: 'prevention', el: document.getElementById('prevention') },
        { id: 'resources', el: document.getElementById('resources') },
        { id: 'about', el: document.getElementById('about') }
    ].filter(function(s){ return s.el; });

    function setActive(id) {
        navLinks.forEach(function(a){
            var hash = a.getAttribute('href') || '';
            var target = hash.replace('#','') || 'home';
            if (target === id) { a.classList.add('active'); }
            else { a.classList.remove('active'); }
        });
    }

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry){
            if (entry.isIntersecting) {
                var id = entry.target.id || (entry.target.classList.contains('hero') ? 'home' : '');
                if (id) setActive(id);
            }
        });
    }, {
        root: null,
        rootMargin: '-' + (header ? header.offsetHeight : 64) + 'px 0px -60% 0px',
        threshold: [0.25, 0.6]
    });

    sections.forEach(function(s){ observer.observe(s.el); });

    // Close mobile menu on click
    navLinks.forEach(function(a){
        a.addEventListener('click', function(){
            var menuToggle = document.getElementById('menu-toggle');
            if (menuToggle && menuToggle.checked) menuToggle.checked = false;
        });
    });
})();

// Contact form -> open Gmail compose (formatted) with fallback to mailto
(function(){
    var form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', function(e){
        e.preventDefault();

        var nameInput = document.getElementById('name');
        var emailInput = document.getElementById('email');
        var messageInput = document.getElementById('message');
        var submitButton = form.querySelector('button[type="submit"]');

        var name = (nameInput && nameInput.value) ? nameInput.value.trim() : '';
        var email = (emailInput && emailInput.value) ? emailInput.value.trim() : '';
        var message = (messageInput && messageInput.value) ? messageInput.value.trim() : '';

        // Basic guardrails
        if (!name || !email || !message) {
            form.reportValidity && form.reportValidity();
            return;
        }

        if (submitButton) submitButton.disabled = true;

        var recipientEmailAddress = 'kutchiaraaa@gmail.com';
        var now = new Date();
        var formattedDate = now.toLocaleString();

        // Structured email body
        var bodyPlainText = [
            'PRISM Contact Submission',
            '--------------------------------',
            'Sender Name:  ' + name,
            'Sender Email: ' + email,
            'Date: ' + formattedDate,
            '',
            'Message:',
            message,
            '',
            '—',
            'This message was sent from the PRISM website contact form.'
        ].join('\n');

        var subjectPlainText = 'PRISM Inquiry';

        // Gmail compose URL
        var gmailUrl = 'https://mail.google.com/mail/?view=cm&fs=1' +
            '&to=' + encodeURIComponent(recipientEmailAddress) +
            '&su=' + encodeURIComponent(subjectPlainText) +
            '&body=' + encodeURIComponent(bodyPlainText);

        // Fallback mailto URL for non-Gmail environments
        var mailtoUrl = 'mailto:' + encodeURIComponent(recipientEmailAddress) +
            '?subject=' + encodeURIComponent(subjectPlainText) +
            '&body=' + encodeURIComponent(bodyPlainText);

        // Try opening Gmail; if blocked or unavailable, fallback to mailto
        var popup = window.open(gmailUrl, '_blank');
        if (!popup) {
            window.location.href = mailtoUrl;
        }

        // Re-enable the button shortly after navigation attempt
        setTimeout(function(){ if (submitButton) submitButton.disabled = false; }, 1200);
    });
})();

// Hero quotes typewriter loop
(function(){
    var el = document.getElementById('quote-text');
    if (!el) return;
    var quotes = [
        'Protect your dreams. Protect your future.',
        'Small steps today create big changes tomorrow.',
        'Stay informed. Stay empowered. Stay true to you.',
        'Your goals matter keep going, keep growing.',
        'Mindfulness today, success for life.'
    ];
    var qIndex = 0;
    var charIndex = 0;
    var typing = true;
    var TYPE_MS = 60;    // typing speed
    var HOLD_MS = 2500;  // hold after fully typed
    var ERASE_MS = 35;   // erase speed

    function type() {
        var q = quotes[qIndex];
        if (typing) {
            if (charIndex <= q.length) {
                el.textContent = q.slice(0, charIndex++);
                setTimeout(type, TYPE_MS);
            } else {
                typing = false;
                setTimeout(type, HOLD_MS);
            }
        } else {
            if (charIndex > 0) {
                el.textContent = q.slice(0, --charIndex);
                setTimeout(type, ERASE_MS);
            } else {
                typing = true;
                qIndex = (qIndex + 1) % quotes.length;
                // ensure approx 10s per quote including type/hold/erase
                setTimeout(type, TYPE_MS);
            }
        }
    }
    type();
})();


