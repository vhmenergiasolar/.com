/* ========================================
   VHM Serviços Elétricos & Energia Solar
   JavaScript Puro — Interações
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {

    // ===== HERO PARTICLES =====
    (function createParticles() {
        var container = document.getElementById('hero-particles');
        if (!container) return;
        for (var i = 0; i < 30; i++) {
            var particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.width = (Math.random() * 4 + 2) + 'px';
            particle.style.height = particle.style.width;
            particle.style.animationDuration = (Math.random() * 8 + 6) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            particle.style.opacity = Math.random() * 0.5 + 0.2;
            container.appendChild(particle);
        }
    })();

    // ===== HEADER SCROLL =====
    var header = document.getElementById('header');
    var backToTop = document.getElementById('back-to-top');
    var lastScroll = 0;

    window.addEventListener('scroll', function () {
        var scrollY = window.pageYOffset || document.documentElement.scrollTop;

        // Header background
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active nav link
        updateActiveNav();

        lastScroll = scrollY;
    });

    // Back to top click
    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== ACTIVE NAV LINK =====
    function updateActiveNav() {
        var sections = document.querySelectorAll('section[id]');
        var navLinks = document.querySelectorAll('#nav a');
        var scrollPos = window.pageYOffset + 120;

        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ===== MOBILE MENU =====
    var menuToggle = document.getElementById('menu-toggle');
    var nav = document.getElementById('nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function () {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('open');
            document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
        });

        // Close menu on link click
        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                menuToggle.classList.remove('active');
                nav.classList.remove('open');
                document.body.style.overflow = '';
            });
        });

        // Close on outside click
        document.addEventListener('click', function (e) {
            if (nav.classList.contains('open') && !nav.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                nav.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var headerHeight = header ? header.offsetHeight : 0;
                var targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });

    // ===== SCROLL REVEAL =====
    var revealElements = document.querySelectorAll('.reveal');

    function checkReveal() {
        var windowHeight = window.innerHeight;
        revealElements.forEach(function (el) {
            var elementTop = el.getBoundingClientRect().top;
            var revealPoint = windowHeight - 80;
            if (elementTop < revealPoint) {
                el.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', checkReveal);
    window.addEventListener('resize', checkReveal);
    // Initial check
    setTimeout(checkReveal, 100);

    // ===== FAQ ACCORDION =====
    var faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
        var question = item.querySelector('.faq-question');
        question.addEventListener('click', function () {
            var isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(function (faq) {
                faq.classList.remove('active');
            });

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ===== SIMULATOR =====
    var simForm = document.getElementById('simulator-form');
    var simResults = document.getElementById('sim-results');

    if (simForm) {
        simForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var valor = parseFloat(document.getElementById('sim-valor').value);
            var tipo = document.getElementById('sim-tipo').value;

            if (!valor || valor < 50 || !tipo) {
                alert('Por favor, preencha o valor da conta (mínimo R$ 50) e selecione o tipo.');
                return;
            }

            // Cálculos
            var taxaMinima = 80; // taxa mínima da concessionária
            var economiaPercentual = tipo === 'empresarial' ? 0.92 : 0.90;
            var economiaMensal = (valor - taxaMinima) * economiaPercentual;
            if (economiaMensal < 0) economiaMensal = 0;
            var economiaAnual = economiaMensal * 12;

            // Custo estimado do sistema (R$/Wp)
            var custoWp = tipo === 'empresarial' ? 4.2 : 4.8;
            // kWp necessário (estimativa: cada kWp gera ~130 kWh/mês)
            var consumoMensal = valor / 0.85; // estimativa kWh
            var kwpNecessario = consumoMensal / 130;
            var custoSistema = kwpNecessario * 1000 * custoWp;

            var paybackAnos = custoSistema / economiaAnual;
            if (paybackAnos < 2) paybackAnos = 2;
            if (paybackAnos > 8) paybackAnos = 8;

            var economia25anos = economiaAnual * 25;

            // Formatar valores
            function formatMoney(val) {
                return 'R$ ' + val.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            }

            // Mostrar resultados
            document.getElementById('res-mensal').textContent = formatMoney(economiaMensal);
            document.getElementById('res-anual').textContent = formatMoney(economiaAnual);
            document.getElementById('res-payback').textContent = paybackAnos.toFixed(1) + ' anos';
            document.getElementById('res-25anos').textContent = formatMoney(economia25anos);

            simResults.classList.remove('hidden');

            // Animar cards
            var simCards = simResults.querySelectorAll('.sim-card');
            simCards.forEach(function (card, index) {
                card.classList.remove('show');
                setTimeout(function () {
                    card.classList.add('show');
                }, index * 150);
            });

            // Scroll to results
            setTimeout(function () {
                simResults.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 200);
        });
    }

    // ===== PROJECT FILTERS =====
    var filterBtns = document.querySelectorAll('.filter-btn');
    var projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var filter = this.getAttribute('data-filter');

            // Active button
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');

            // Filter cards
            projectCards.forEach(function (card) {
                var category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hide');
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    // Add fadeIn animation
    var style = document.createElement('style');
    style.textContent = '@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }';
    document.head.appendChild(style);

    // ===== PROJECT MODAL =====
    var modal = document.getElementById('project-modal');
    var modalClose = document.getElementById('modal-close');

    var projectsData = {

    1: {
        title: 'Residência — Itumbiara, GO',
        img: 'project 1.jpg',
        kwp: '6,5 kWp',
        telhado: 'Cerâmico',
        geracao: '~930 kWh/mês',
        economia: '~R$ 880/mês'
    },

    2: {
        title: 'Comércio — Itumbiara, GO',
        img: 'project 2.jpg',
        kwp: '2,2 kWp',
        telhado: 'Cerâmico • Microinversor',
        geracao: '~315 kWh/mês',
        economia: '~R$ 300/mês'
    },

    3: {
        title: 'Residência — Araporã, MG',
        img: 'project 3.png',
        kwp: '4,4 kWp',
        telhado: 'Fibrocimento',
        geracao: '~630 kWh/mês',
        economia: '~R$ 600/mês'
    },

    4: {
        title: 'Goiatuba, GO',
        img: 'project 4.webp',
        kwp: '8,8 kWp',
        telhado: 'Laje',
        geracao: '~1.276 kWh/mês',
        economia: '~R$ 1.210/mês'
    },

    5: {
        title: 'Cachoeira Dourada — GO',
        img: 'project 5.jpg',
        kwp: '4,4 kWp',
        telhado: 'Cerâmico',
        geracao: '~630 kWh/mês',
        economia: '~R$ 600/mês'
    },

    6: {
        title: 'Residência — Cachoeira Dourada, GO',
        img: 'project 6.jpg',
        kwp: '27 kWp',
        telhado: 'Cerâmico',
        geracao: '~3.900 kWh/mês',
        economia: '~R$ 3.700/mês'
    }

};

    document.querySelectorAll('.project-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var id = this.getAttribute('data-project');
            var data = projectsData[id];
            if (!data) return;

            document.getElementById('modal-title').textContent = data.title;
            document.getElementById('modal-img').style.backgroundImage = "url('" + data.img + "')";
            document.getElementById('modal-kwp').textContent = data.kwp;
            document.getElementById('modal-telhado').textContent = data.telhado;
            document.getElementById('modal-geracao').textContent = data.geracao;
            document.getElementById('modal-economia').textContent = data.economia;

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    window.closeModal = closeModal;

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // ===== COUNTER ANIMATION =====
var counters = document.querySelectorAll('.diff-number');
var countersAnimated = false;

function animateCounters() {
  if (countersAnimated) return;

  var diffSection = document.getElementById('diferenciais');
  if (!diffSection) return;

  var sectionTop = diffSection.getBoundingClientRect().top;
  if (sectionTop < window.innerHeight - 100) {
    countersAnimated = true;

    counters.forEach(function (counter) {
      var target = parseInt(counter.getAttribute('data-count'));
      var duration = 2000;
      var startTime = null;

      function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
      }

      function updateCounter(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var easedProgress = easeOutQuart(progress);
        var current = Math.floor(easedProgress * target);
        counter.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      }

      if (target > 0) {
        requestAnimationFrame(updateCounter);
      }
    });
  }
}

window.addEventListener('scroll', animateCounters);
// (opcional) já anima caso a seção esteja visível ao carregar:
window.addEventListener('load', animateCounters);

// ===== CONTACT FORM (STATIC) -> SEND TO WHATSAPP =====
var contactForm = document.getElementById('contact-form');
var formSuccess = document.getElementById('form-success');

// Número do WhatsApp do cliente (recebedor)
var WHATSAPP_NUMBER = "5564992251274";

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var isValid = true;

    // Clear previous errors
    contactForm.querySelectorAll('.error').forEach(function (el) {
      el.classList.remove('error');
    });
    contactForm.querySelectorAll('.form-error').forEach(function (el) {
      el.textContent = '';
    });
    if (formSuccess) formSuccess.classList.add('hidden');

    // Validate nome
    var nome = document.getElementById('c-nome');
    if (!nome.value.trim() || nome.value.trim().length < 3) {
      showError(nome, 'Por favor, insira seu nome (mínimo 3 letras).');
      isValid = false;
    }

    // Validate whatsapp
    var whatsapp = document.getElementById('c-whatsapp');
    var whatsappClean = whatsapp.value.replace(/\D/g, '');
    if (whatsappClean.length < 10 || whatsappClean.length > 11) {
      showError(whatsapp, 'Insira um número de WhatsApp válido com DDD.');
      isValid = false;
    }

    // Validate cidade
    var cidade = document.getElementById('c-cidade');
    if (!cidade.value.trim()) {
      showError(cidade, 'Por favor, insira sua cidade.');
      isValid = false;
    }

    // Validate tipo
    var tipo = document.getElementById('c-tipo');
    if (!tipo.value) {
      showError(tipo, 'Selecione o tipo do projeto.');
      isValid = false;
    }

    if (isValid) {
      // Montar mensagem pro WhatsApp
      var msg = [
        "Olá! Vim pelo site e quero um orçamento de Energia Solar ☀️",
        "",
        "Nome: " + nome.value.trim(),
        "WhatsApp: " + whatsapp.value.trim(),
        "Cidade: " + cidade.value.trim(),
        "Tipo de projeto: " + tipo.value
      ].join("\n");

      var waUrl = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg);

      // Feedback visual
      var submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Abrindo WhatsApp...';
      submitBtn.disabled = true;

      // Abre WhatsApp
      window.open(waUrl, '_blank', 'noopener,noreferrer');

      // Reset + sucesso
      setTimeout(function () {
        contactForm.reset();
        if (formSuccess) formSuccess.classList.remove('hidden');

        submitBtn.textContent = 'Enviar Mensagem';
        submitBtn.disabled = false;

        setTimeout(function () {
          if (formSuccess) formSuccess.classList.add('hidden');
        }, 5000);
      }, 600);
    }
  });
}

function showError(input, message) {
  input.classList.add('error');
  var errorSpan = input.parentElement.querySelector('.form-error');
  if (errorSpan) {
    errorSpan.textContent = message;
  }
}

// WhatsApp mask
var whatsappInput = document.getElementById('c-whatsapp');
if (whatsappInput) {
  whatsappInput.addEventListener('input', function (e) {
    var value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.substring(0, 11);

    if (value.length > 6) {
      e.target.value =
        '(' + value.substring(0, 2) + ') ' +
        value.substring(2, 7) + '-' +
        value.substring(7);
    } else if (value.length > 2) {
      e.target.value =
        '(' + value.substring(0, 2) + ') ' +
        value.substring(2);
    } else if (value.length > 0) {
      e.target.value = '(' + value;
    }
  });
}


    // ===== WHATSAPP BUTTON SHOW ON SCROLL =====
    var whatsappBtn = document.getElementById('whatsapp-btn');
    if (whatsappBtn) {
        whatsappBtn.style.transform = 'scale(0)';
        whatsappBtn.style.transition = 'transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)';

        setTimeout(function () {
            whatsappBtn.style.transform = 'scale(1)';
        }, 2000);
    }

    // ===== HEADER NAV SMOOTH HIDE/SHOW ON SCROLL =====
    var prevScrollPos = window.pageYOffset;

    // Initial reveal check
    setTimeout(function () {
        checkReveal();
        updateActiveNav();
    }, 200);

});
