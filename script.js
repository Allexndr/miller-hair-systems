// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// FAQ Toggle functionality
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.product-card, .fact-card, .testimonial-card, .contact-item');
    animateElements.forEach(el => observer.observe(el));
});

// Test functionality
function startTest() {
    const modal = createTestModal();
    document.body.appendChild(modal);
    showTestStep(1);
}

function createTestModal() {
    const modal = document.createElement('div');
    modal.className = 'test-modal';
    modal.innerHTML = `
        <div class="test-modal-content">
            <div class="test-header">
                <h2>Выбор идеального изделия</h2>
                <button class="close-test" onclick="closeTest()">&times;</button>
            </div>
            <div class="test-progress">
                <div class="progress-bar">
                    <div class="progress-fill" id="progressFill"></div>
                </div>
                <span class="progress-text" id="progressText">Шаг 1 из 4</span>
            </div>
            <div class="test-content" id="testContent">
                <!-- Test questions will be inserted here -->
            </div>
            <div class="test-navigation">
                <button class="btn btn-secondary" id="prevBtn" onclick="previousStep()" style="display: none;">Назад</button>
                <button class="btn btn-primary" id="nextBtn" onclick="nextStep()">Далее</button>
            </div>
        </div>
    `;
    return modal;
}

const testQuestions = [
    {
        question: "Какой тип изделия вас интересует?",
        options: [
            { value: "system", text: "Система волос (полное замещение)" },
            { value: "crown", text: "Накладка на макушку" },
            { value: "accessory", text: "Аксессуар (хвост, челка, пучок)" }
        ]
    },
    {
        question: "Какая длина вас интересует?",
        options: [
            { value: "30-35", text: "30-35 см" },
            { value: "40-45", text: "40-45 см" },
            { value: "50-55", text: "50-55 см" },
            { value: "60-65", text: "60-65 см" },
            { value: "other", text: "Другая длина" }
        ]
    },
    {
        question: "Какой класс качества предпочитаете?",
        options: [
            { value: "couture", text: "Кутюр (VIP, пожизненная гарантия)" },
            { value: "classic", text: "Классик (премиум качество)" },
            { value: "exclusive", text: "Эксклюзив (полусистема)" }
        ]
    },
    {
        question: "Нужны ли дополнительные опции?",
        options: [
            { value: "silk", text: "Шелковая вставка (+380$)" },
            { value: "slavic", text: "Славянский волос (+210$)" },
            { value: "child", text: "Детский волос (+380$)" },
            { value: "coloring", text: "Окрашивание (+66$)" },
            { value: "none", text: "Ничего дополнительного" }
        ],
        multiple: true
    }
];

let currentStep = 1;
let testAnswers = {};

function showTestStep(step) {
    const testContent = document.getElementById('testContent');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Update progress
    const progress = (step / testQuestions.length) * 100;
    progressFill.style.width = progress + '%';
    progressText.textContent = `Шаг ${step} из ${testQuestions.length}`;
    
    // Show/hide navigation buttons
    prevBtn.style.display = step > 1 ? 'block' : 'none';
    nextBtn.textContent = step === testQuestions.length ? 'Получить результат' : 'Далее';
    
    // Show question
    const question = testQuestions[step - 1];
    testContent.innerHTML = `
        <div class="test-question">
            <h3>${question.question}</h3>
            <div class="test-options">
                ${question.options.map(option => `
                    <label class="test-option">
                        <input type="${question.multiple ? 'checkbox' : 'radio'}" 
                               name="step${step}" 
                               value="${option.value}"
                               ${testAnswers[`step${step}`] && testAnswers[`step${step}`].includes(option.value) ? 'checked' : ''}>
                        <span class="option-text">${option.text}</span>
                    </label>
                `).join('')}
            </div>
        </div>
    `;
    
    // Add event listeners
    const inputs = testContent.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            if (question.multiple) {
                const checked = Array.from(inputs).filter(i => i.checked).map(i => i.value);
                testAnswers[`step${step}`] = checked;
            } else {
                testAnswers[`step${step}`] = [input.value];
            }
        });
    });
}

function nextStep() {
    if (currentStep < testQuestions.length) {
        currentStep++;
        showTestStep(currentStep);
    } else {
        showTestResult();
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        showTestStep(currentStep);
    }
}

function showTestResult() {
    const testContent = document.getElementById('testContent');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    
    // Calculate recommendation
    const recommendation = calculateRecommendation(testAnswers);
    
    testContent.innerHTML = `
        <div class="test-result">
            <h3>Рекомендация для вас:</h3>
            <div class="recommendation-card">
                <h4>${recommendation.name}</h4>
                <p class="recommendation-price">${recommendation.price}</p>
                <p class="recommendation-description">${recommendation.description}</p>
                <div class="recommendation-features">
                    <h5>Включено в цену:</h5>
                    <ul>
                        ${recommendation.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="recommendation-actions">
                    <button class="btn btn-primary" onclick="openConsultation('${recommendation.name}')">
                        Заказать консультацию
                    </button>
                    <button class="btn btn-secondary" onclick="startTest()">
                        Пройти тест заново
                    </button>
                </div>
            </div>
        </div>
    `;
    
    nextBtn.style.display = 'none';
    prevBtn.style.display = 'none';
}

function calculateRecommendation(answers) {
    const productType = answers.step1 ? answers.step1[0] : 'system';
    const length = answers.step2 ? answers.step2[0] : '30-35';
    const quality = answers.step3 ? answers.step3[0] : 'classic';
    const options = answers.step4 || [];
    
    // Price calculation
    const basePrices = {
        'system': {
            '30-35': { 'couture': 2010, 'classic': 980, 'exclusive': 1330 },
            '40-45': { 'couture': 2600, 'classic': 1330, 'exclusive': 1610 },
            '50-55': { 'couture': 2930, 'classic': 1510, 'exclusive': 1790 },
            '60-65': { 'couture': 3630, 'classic': 1430, 'exclusive': 2480 }
        },
        'crown': {
            'mini': 510,
            'maxi': 715,
            'deep': 962
        },
        'accessory': {
            'tail-50': 460,
            'tail-60': 535,
            'tail-70': 610,
            'bangs': 270,
            'bun': 150,
            'crab': 470
        }
    };
    
    let basePrice = 0;
    let productName = '';
    let description = '';
    let features = [];
    
    if (productType === 'system') {
        basePrice = basePrices.system[length]?.[quality] || 980;
        productName = `Система волос ${length}см - ${quality.toUpperCase()}`;
        description = quality === 'couture' ? 
            'VIP система замещения волос из запатентованного шелкового тюля по 3D слепку головы.' :
            quality === 'classic' ?
            'Система замещения волос из Индийских отборных волос премиум класса.' :
            'Классическая полусистема волос с ручной работой опытных постижеров.';
        
        features = [
            'Индивидуальные мерки',
            'Ручная работа постижеров',
            quality === 'couture' ? 'Пожизненная гарантия' : 'Гарантия качества',
            'Гипоаллергенный материал'
        ];
    } else if (productType === 'crown') {
        const crownType = length === '30-35' ? 'mini' : length === '40-45' ? 'maxi' : 'deep';
        basePrice = basePrices.crown[crownType];
        productName = `Накладка на макушку - ${crownType.toUpperCase()}`;
        description = 'Накладка на макушку из натуральных Индийских отборных волос, на запатентованном шелковом тюле.';
        features = [
            'Решение проблемы поредевшей макушки',
            'Добавление объема и длины',
            'Индивидуальные мерки без доплаты',
            'Шелковый тюль'
        ];
    } else {
        basePrice = basePrices.accessory['tail-50'];
        productName = 'Аксессуар для волос';
        description = 'Накладной аксессуар из натуральных отборных Индийских волос.';
        features = [
            'Натуральные индийские волосы',
            'Различные стили',
            'Высокое качество',
            'Долговечность'
        ];
    }
    
    // Add option costs
    const optionPrices = {
        'silk': 380,
        'slavic': 210,
        'child': 380,
        'coloring': 66
    };
    
    let totalPrice = basePrice;
    options.forEach(option => {
        if (optionPrices[option]) {
            totalPrice += optionPrices[option];
            features.push(getOptionDescription(option));
        }
    });
    
    return {
        name: productName,
        price: `${totalPrice}$`,
        description: description,
        features: features
    };
}

function getOptionDescription(option) {
    const descriptions = {
        'silk': 'Шелковая вставка (+380$)',
        'slavic': 'Славянский волос (+210$)',
        'child': 'Детский волос (+380$)',
        'coloring': 'Окрашивание (+66$)'
    };
    return descriptions[option] || '';
}

function openConsultation(productName = '') {
    const message = productName ? 
        `Здравствуйте! Меня интересует консультация по изделию: ${productName}` :
        'Здравствуйте! Меня интересует консультация по выбору изделия.';
    
    const telegramUrl = `https://t.me/example_wig_shop?text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
}

function closeTest() {
    const modal = document.querySelector('.test-modal');
    if (modal) {
        modal.remove();
        currentStep = 1;
        testAnswers = {};
    }
}

// Add CSS for test modal
const testModalCSS = `
    .test-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
    }
    
    .test-modal-content {
        background: var(--dark-bg);
        border: 2px solid var(--primary-gold);
        border-radius: 20px;
        padding: 2rem;
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .test-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        border-bottom: 1px solid var(--primary-gold);
        padding-bottom: 1rem;
    }
    
    .test-header h2 {
        color: var(--primary-gold);
        margin: 0;
        font-size: 1.8rem;
    }
    
    .close-test {
        background: none;
        border: none;
        color: var(--primary-gold);
        font-size: 2rem;
        cursor: pointer;
        padding: 0;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.3s ease;
    }
    
    .close-test:hover {
        background: rgba(212, 175, 55, 0.1);
    }
    
    .test-progress {
        margin-bottom: 2rem;
    }
    
    .progress-bar {
        width: 100%;
        height: 8px;
        background: rgba(212, 175, 55, 0.2);
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 0.5rem;
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--primary-gold), var(--secondary-gold));
        border-radius: 4px;
        transition: width 0.3s ease;
    }
    
    .progress-text {
        color: var(--text-light);
        font-size: 0.9rem;
        opacity: 0.8;
    }
    
    .test-question h3 {
        color: var(--text-light);
        margin-bottom: 1.5rem;
        font-size: 1.3rem;
        text-align: center;
    }
    
    .test-options {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .test-option {
        display: flex;
        align-items: center;
        padding: 1rem;
        background: rgba(212, 175, 55, 0.1);
        border: 1px solid rgba(212, 175, 55, 0.3);
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .test-option:hover {
        background: rgba(212, 175, 55, 0.2);
        border-color: var(--primary-gold);
    }
    
    .test-option input {
        margin-right: 1rem;
        accent-color: var(--primary-gold);
    }
    
    .option-text {
        color: var(--text-light);
        font-weight: 500;
    }
    
    .test-navigation {
        display: flex;
        justify-content: space-between;
        margin-top: 2rem;
        gap: 1rem;
    }
    
    .test-result {
        text-align: center;
    }
    
    .test-result h3 {
        color: var(--primary-gold);
        margin-bottom: 2rem;
        font-size: 1.5rem;
    }
    
    .recommendation-card {
        background: linear-gradient(145deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05));
        border: 1px solid rgba(212, 175, 55, 0.3);
        border-radius: 15px;
        padding: 2rem;
        margin-bottom: 2rem;
    }
    
    .recommendation-card h4 {
        color: var(--primary-gold);
        margin-bottom: 1rem;
        font-size: 1.3rem;
    }
    
    .recommendation-price {
        font-size: 2rem;
        color: var(--primary-gold);
        font-weight: 700;
        margin-bottom: 1rem;
    }
    
    .recommendation-description {
        color: var(--text-light);
        margin-bottom: 1.5rem;
        line-height: 1.6;
    }
    
    .recommendation-features {
        text-align: left;
        margin-bottom: 2rem;
    }
    
    .recommendation-features h5 {
        color: var(--primary-gold);
        margin-bottom: 1rem;
        font-size: 1.1rem;
    }
    
    .recommendation-features ul {
        list-style: none;
        padding: 0;
    }
    
    .recommendation-features li {
        color: var(--text-light);
        margin-bottom: 0.5rem;
        position: relative;
        padding-left: 1.5rem;
    }
    
    .recommendation-features li::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: var(--primary-gold);
        font-weight: bold;
    }
    
    .recommendation-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .recommendation-actions .btn {
        flex: 1;
        min-width: 200px;
    }
    
    @media (max-width: 768px) {
        .test-modal-content {
            padding: 1.5rem;
            margin: 10px;
        }
        
        .test-header h2 {
            font-size: 1.5rem;
        }
        
        .test-navigation {
            flex-direction: column;
        }
        
        .recommendation-actions {
            flex-direction: column;
        }
        
        .recommendation-actions .btn {
            min-width: auto;
        }
    }
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = testModalCSS;
document.head.appendChild(style);

// Phone number click handler
document.addEventListener('DOMContentLoaded', () => {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Analytics or tracking could be added here
            console.log('Phone number clicked:', link.href);
        });
    });
});

// Telegram link handler
document.addEventListener('DOMContentLoaded', () => {
    const telegramLinks = document.querySelectorAll('a[href*="t.me"]');
    telegramLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Analytics or tracking could be added here
            console.log('Telegram link clicked:', link.href);
        });
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add scroll to top functionality
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '↑';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(45deg, var(--primary-gold), var(--secondary-gold));
    color: var(--dark-bg);
    border: none;
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
`;

document.body.appendChild(scrollToTopBtn);

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});
