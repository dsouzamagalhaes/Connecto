    // Artists Page JavaScript

// Global variables for artists page
let selectedArtist = null;
let artistsData = [
    {
        id: 'luna-synthwave',
        name: 'Luna Synthwave',
        genre: 'Eletrônica / Synthwave',
        basePrice: 15000,
        category: 'electronic'
    },
    {
        id: 'cyber-phoenix',
        name: 'Cyber Phoenix',
        genre: 'Rock / Cyberpunk',
        basePrice: 18000,
        category: 'rock'
    },
    {
        id: 'neon-dreams',
        name: 'Neon Dreams',
        genre: 'Pop / Experimental',
        basePrice: 25000,
        category: 'pop'
    },
    {
        id: 'digital-sax',
        name: 'Digital Sax',
        genre: 'Jazz / Fusion',
        basePrice: 12000,
        category: 'jazz'
    },
    {
        id: 'quantum-orchestra',
        name: 'Quantum Orchestra',
        genre: 'Clássica / Moderna',
        basePrice: 30000,
        category: 'classical'
    },
    {
        id: 'pixel-beats',
        name: 'Pixel Beats',
        genre: 'Eletrônica / House',
        basePrice: 14000,
        category: 'electronic'
    }
];

// Initialize artists page
document.addEventListener('DOMContentLoaded', function() {
    initializeArtistsPage();
});

function initializeArtistsPage() {
    initializeNavigation();
    initializeArtistFilters();
    initializeSearch();
    initializeScrollAnimations();
    initializeBookingForm();
    
    // Update pricing in real-time
    updateBookingSummary();
}

// Artist Filter Functions
function initializeArtistFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const artistCards = document.querySelectorAll('.artist-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter artist cards
            filterArtists(filter);
        });
    });
}

function filterArtists(filter) {
    const artistCards = document.querySelectorAll('.artist-card');
    
    artistCards.forEach((card, index) => {
        const category = card.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;
        
        setTimeout(() => {
            if (shouldShow) {
                card.style.display = 'block';
                card.classList.remove('hidden');
                card.style.animationDelay = `${index * 100}ms`;
                card.classList.add('fade-in', 'visible');
            } else {
                card.classList.add('hidden');
                setTimeout(() => {
                    if (card.classList.contains('hidden')) {
                        card.style.display = 'none';
                    }
                }, 300);
            }
        }, index * 50);
    });
}

// Search Function
function initializeSearch() {
    const searchInput = document.getElementById('artist-search');
    
    searchInput.addEventListener('input', debounce(function() {
        const searchTerm = this.value.toLowerCase();
        searchArtists(searchTerm);
    }, 300));
}

function searchArtists(searchTerm) {
    const artistCards = document.querySelectorAll('.artist-card');
    
    artistCards.forEach(card => {
        const artistName = card.querySelector('.artist-name').textContent.toLowerCase();
        const artistGenre = card.querySelector('.artist-genre').textContent.toLowerCase();
        const artistTags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
        
        const matches = artistName.includes(searchTerm) || 
                       artistGenre.includes(searchTerm) || 
                       artistTags.some(tag => tag.includes(searchTerm));
        
        if (matches || searchTerm === '') {
            card.style.display = 'block';
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
            setTimeout(() => {
                if (card.classList.contains('hidden')) {
                    card.style.display = 'none';
                }
            }, 300);
        }
    });
}

// Booking Modal Functions
function openBookingModal(artistName) {
    const modal = document.getElementById('booking-modal');
    const artistNameEl = document.getElementById('selected-artist-name');
    const artistGenreEl = document.getElementById('selected-artist-genre');
    
    // Find artist data
    selectedArtist = artistsData.find(artist => artist.name === artistName);
    
    if (selectedArtist) {
        artistNameEl.textContent = selectedArtist.name;
        artistGenreEl.textContent = selectedArtist.genre;
        
        // Update summary
        document.getElementById('summary-artist').textContent = selectedArtist.name;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Animate modal in
        setTimeout(() => {
            modal.querySelector('.modal-content').style.transform = 'scale(1)';
            modal.querySelector('.modal-content').style.opacity = '1';
        }, 10);
    }
}

function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    const modalContent = modal.querySelector('.modal-content');
    
    modalContent.style.transform = 'scale(0.9)';
    modalContent.style.opacity = '0';
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetBookingForm();
    }, 300);
}

function resetBookingForm() {
    const form = document.getElementById('booking-form');
    form.reset();
    updateBookingSummary();
}

// Booking Form Initialization
function initializeBookingForm() {
    const form = document.getElementById('booking-form');
    const formInputs = form.querySelectorAll('input, select, textarea');
    
    // Add event listeners for real-time updates
    formInputs.forEach(input => {
        input.addEventListener('change', updateBookingSummary);
        input.addEventListener('input', updateBookingSummary);
    });
    
    // Form submission
    form.addEventListener('submit', handleBookingSubmission);
    
    // Close modal when clicking outside
    document.getElementById('booking-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeBookingModal();
        }
    });
}

function updateBookingSummary() {
    if (!selectedArtist) return;
    
    const eventDate = document.getElementById('event-date').value;
    const eventDuration = document.getElementById('event-duration').value;
    const expectedAudience = document.getElementById('expected-audience').value;
    
    // Update summary fields
    document.getElementById('summary-date').textContent = eventDate || '-';
    document.getElementById('summary-duration').textContent = eventDuration ? `${eventDuration} horas` : '-';
    
    // Calculate estimated price
    let estimatedPrice = selectedArtist.basePrice;
    
    // Duration multiplier
    if (eventDuration) {
        const durationMultiplier = {
            '1': 1,
            '2': 1.5,
            '3': 2,
            '4': 2.5,
            'custom': 2
        };
        estimatedPrice *= durationMultiplier[eventDuration] || 1;
    }
    
    // Audience multiplier
    if (expectedAudience) {
        const audienceMultiplier = {
            '50-100': 1,
            '100-500': 1.2,
            '500-1000': 1.5,
            '1000+': 2
        };
        estimatedPrice *= audienceMultiplier[expectedAudience] || 1;
    }
    
    // Format and display price
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(estimatedPrice);
    
    document.getElementById('summary-price').textContent = formattedPrice;
}

function handleBookingSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success notification
        showNotification('Solicitação de contratação enviada com sucesso! Entraremos em contato em breve.', 'success');
        
        // Reset form and close modal
        closeBookingModal();
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Send confirmation email simulation
        setTimeout(() => {
            showNotification('Email de confirmação enviado para seu endereço.', 'info');
        }, 2000);
        
    }, 2000);
}

// Artist Profile Function
function viewArtistProfile(artistId) {
    // Simulate opening artist profile
    showNotification('Perfil do artista em desenvolvimento. Em breve você poderá ver mais detalhes!', 'info');
    
    // In a real application, this would navigate to a detailed artist page
    // window.location.href = `artist-profile.html?id=${artistId}`;
}

// Scroll Animations
function initializeScrollAnimations() {
    const observeElements = document.querySelectorAll('.artist-card, .stat-item, .hero-content');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in', 'visible');
                
                // Stagger animation for grid items
                if (entry.target.classList.contains('artist-card')) {
                    const cards = Array.from(document.querySelectorAll('.artist-card'));
                    const delay = cards.indexOf(entry.target) * 100;
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

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

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
if (!document.querySelector('#modal-styles')) {
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
        .modal-content {
            transform: scale(0.9);
            opacity: 0;
            transition: all 0.3s ease;
        }
        
        .artist-card.hidden {
            opacity: 0;
            transform: scale(0.95);
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}
