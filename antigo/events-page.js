// Global variables
let currentEventFilter = 'all';
let eventsData = [
    {
        id: 'festival-digital-paradise',
        title: 'Festival Digital Paradise 2025',
        category: 'entertainment',
        date: '2025-07-15',
        price: 'R$ 150 - R$ 500',
        location: 'Parque Tecnológico Neo',
        status: 'live'
    },
    {
        id: 'techcorp-launch',
        title: 'Lançamento TechCorp 2025',
        category: 'corporate',
        date: '2025-07-22',
        price: 'Apenas Convidados',
        location: 'Centro de Convenções Neo',
        status: 'upcoming'
    },
    {
        id: 'elite-wedding',
        title: 'Casamento Futurista Elite',
        category: 'private',
        date: '2025-08-05',
        price: 'Sob Consulta',
        location: 'Jardim Botânico Cyber',
        status: 'booking'
    },
    {
        id: 'metaverse-concert',
        title: 'Concerto Metaverso Global',
        category: 'virtual',
        date: '2025-08-12',
        price: 'R$ 50 - R$ 200',
        location: 'Metaverso NeoSpace',
        status: 'virtual'
    }
];

// Initialize events page
document.addEventListener('DOMContentLoaded', function() {
    initializeEventsPage();
});

function initializeEventsPage() {
    initializeNavigation();
    initializeEventFilters();
    initializeScrollAnimations();
    initializePlanningModal();
    
    // Add click handlers for category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            scrollToSection('upcoming-events');
            setTimeout(() => filterEvents(category), 500);
        });
    });
}

// Event Filter Functions
function initializeEventFilters() {
    const filterButtons = document.querySelectorAll('.events-filter .filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter events
            filterEvents(filter);
            currentEventFilter = filter;
        });
    });
}

function filterEvents(filter) {
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach((card, index) => {
        const category = card.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;
        
        setTimeout(() => {
            if (shouldShow) {
                card.style.display = 'grid';
                card.classList.remove('hidden');
                card.style.animationDelay = `${index * 100}ms`;
                card.classList.add('fade-in', 'visible');
            } else {
                card.classList.add('hidden');
                setTimeout(() => {
                    if (card.classList.contains('hidden')) {
                        card.style.display = 'none';
                    }
                }, 500);
            }
        }, index * 100);
    });
    
    // Update filter buttons in events section
    const eventsFilterButtons = document.querySelectorAll('.events-filter .filter-btn');
    eventsFilterButtons.forEach(btn => btn.classList.remove('active'));
    
    const targetButton = document.querySelector(`.events-filter .filter-btn[data-filter="${filter}"]`);
    if (targetButton) {
        targetButton.classList.add('active');
    }
}

// Event Action Functions
function buyTickets(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) return;
    
    showNotification(`Redirecionando para compra de ingressos do evento "${event.title}"...`, 'info');
    
    // Simulate ticket purchase flow
    setTimeout(() => {
        showNotification('Sistema de vendas em desenvolvimento. Em breve você poderá comprar ingressos online!', 'info');
    }, 2000);
}

function requestInvitation(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) return;
    
    showNotification(`Solicitação de convite para "${event.title}" enviada com sucesso!`, 'success');
    
    setTimeout(() => {
        showNotification('Nossa equipe entrará em contato em até 24 horas.', 'info');
    }, 2000);
}

function consultPrivateEvent(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) return;
    
    showNotification(`Consultando disponibilidade para "${event.title}"...`, 'info');
    
    setTimeout(() => {
        showNotification('Consulta enviada! Nossa equipe de eventos privados entrará em contato.', 'success');
    }, 2000);
}

function joinVirtualEvent(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) return;
    
    showNotification(`Preparando acesso ao evento virtual "${event.title}"...`, 'info');
    
    setTimeout(() => {
        showNotification('Plataforma virtual em desenvolvimento. Em breve você poderá participar de eventos no metaverso!', 'info');
    }, 2000);
}

function viewEventDetails(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) return;
    
    showNotification(`Carregando detalhes do evento "${event.title}"...`, 'info');
    
    // In a real application, this would open a detailed event page
    setTimeout(() => {
        showNotification('Página de detalhes em desenvolvimento. Em breve você terá acesso completo às informações!', 'info');
    }, 1500);
}

// Planning Modal Functions
function initializePlanningModal() {
    const planningForm = document.getElementById('planning-form');
    if (planningForm) {
        planningForm.addEventListener('submit', handlePlanningSubmission);
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('planning-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closePlanningModal();
            }
        });
    }
}

function startEventPlanning() {
    const modal = document.getElementById('planning-modal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Animate modal in
        setTimeout(() => {
            const modalContent = modal.querySelector('.modal-content');
            modalContent.style.transform = 'scale(1)';
            modalContent.style.opacity = '1';
        }, 10);
    }
}

function closePlanningModal() {
    const modal = document.getElementById('planning-modal');
    if (modal) {
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.transform = 'scale(0.9)';
        modalContent.style.opacity = '0';
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            resetPlanningForm();
        }, 300);
    }
}

function resetPlanningForm() {
    const form = document.getElementById('planning-form');
    if (form) {
        form.reset();
        
        // Reset all checkboxes
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    }
}

function requestQuote() {
    showNotification('Redirecionando para formulário de orçamento...', 'info');
    
    setTimeout(() => {
        startEventPlanning();
    }, 1000);
}

function handlePlanningSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
    submitButton.disabled = true;
    
    // Get selected technologies
    const selectedTech = [];
    const techCheckboxes = e.target.querySelectorAll('input[name="tech[]"]:checked');
    techCheckboxes.forEach(checkbox => {
        selectedTech.push(checkbox.value);
    });
    
    // Simulate API call
    setTimeout(() => {
        // Show success notification
        showNotification('Solicitação de planejamento enviada com sucesso! Nossa equipe entrará em contato em breve.', 'success');
        
        // Show additional info based on selections
        if (selectedTech.length > 0) {
            setTimeout(() => {
                const techNames = {
                    'holography': 'Holografia',
                    'ar-vr': 'AR/VR',
                    'drones': 'Shows de Drones',
                    'interactive': 'Experiências Interativas',
                    'streaming': 'Transmissão 4K',
                    'ai': 'IA Interativa'
                };
                
                const selectedNames = selectedTech.map(tech => techNames[tech]).join(', ');
                showNotification(`Tecnologias selecionadas: ${selectedNames}. Nossos especialistas prepararão uma proposta personalizada.`, 'info');
            }, 2000);
        }
        
        // Close modal and reset form
        closePlanningModal();
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Send confirmation email simulation
        setTimeout(() => {
            showNotification('Email de confirmação enviado! Verifique sua caixa de entrada.', 'info');
        }, 3000);
        
    }, 3000);
}

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 100;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function initializeScrollAnimations() {
    const observeElements = document.querySelectorAll(
        '.category-card, .event-card, .step-card, .hero-content'
    );
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in', 'visible');
                
                // Stagger animation for grid items
                if (entry.target.classList.contains('category-card') ||
                    entry.target.classList.contains('step-card')) {
                    const cards = Array.from(entry.target.parentElement.children);
                    const delay = cards.indexOf(entry.target) * 150;
                    entry.target.style.animationDelay = `${delay}ms`;
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    observeElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Notification System (reusing from artists page)
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '0.9rem',
        zIndex: '10001',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        maxWidth: '400px',
        wordWrap: 'break-word'
    });
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #00ff88, #00cc6a)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #ff4757, #ff3838)';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, #00f5ff, #0099cc)';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.color = 'inherit';
    closeButton.style.marginLeft = '1rem';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '1.2rem';
    
    closeButton.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (notification.parentElement) {
            notification.parentElement.removeChild(notification);
        }
    }, 300);
}

// Add smooth modal animation styles
if (!document.querySelector('#events-modal-styles')) {
    const style = document.createElement('style');
    style.id = 'events-modal-styles';
    style.textContent = `
        .modal-content {
            transform: scale(0.9);
            opacity: 0;
            transition: all 0.3s ease;
        }
        
        .event-card.hidden {
            opacity: 0;
            transform: scale(0.95);
            transition: all 0.5s ease;
        }
        
        .category-card {
            cursor: pointer;
        }
        
        .planning-form::-webkit-scrollbar {
            width: 6px;
        }
        
        .planning-form::-webkit-scrollbar-track {
            background: var(--surface-color);
            border-radius: 3px;
        }
        
        .planning-form::-webkit-scrollbar-thumb {
            background: var(--primary-color);
            border-radius: 3px;
        }
        
        .planning-form::-webkit-scrollbar-thumb:hover {
            background: var(--secondary-color);
        }
    `;
    document.head.appendChild(style);
}
