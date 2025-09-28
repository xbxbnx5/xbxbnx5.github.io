document.addEventListener('DOMContentLoaded', () => {

    // --- 1. ПЛАВНЫЙ СКРОЛЛ ПО ЯКОРЯМ ---
    const anchors = document.querySelectorAll('a[href*="#"]');

    for (let anchor of anchors) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const blockID = anchor.getAttribute('href').substr(1);
            
            if (document.getElementById(blockID)) {
                document.getElementById(blockID).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // --- 2. АНИМАЦИЯ ПОЯВЛЕНИЯ ЭЛЕМЕНТОВ ПРИ СКРОЛЛЕ ---
    const scrollElements = document.querySelectorAll('.fade-in');

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            } 
        });
    };
    
    // Вызываем функции при загрузке и скролле
    window.addEventListener('scroll', handleScrollAnimation);
    handleScrollAnimation(); // Проверяем видимость при первой загрузке

    // --- 3. АНИМАЦИЯ СЧЕТЧИКОВ ---
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    const factsSection = document.querySelector('.course-facts-section');
    let countersAnimated = false; // Флаг, чтобы анимация сработала один раз

    const startCountersAnimation = () => {
        if (!countersAnimated) {
             const counters = document.querySelectorAll('.fact-card h3');
             counters.forEach(counter => {
                 const targetValue = +counter.innerText;
                 counter.innerText = '0'; // Сбрасываем в 0 перед анимацией
                 animateValue(counter, 0, targetValue, 1500);
             });
             countersAnimated = true; // Устанавливаем флаг
        }
    };
    
    // Используем Intersection Observer для запуска анимации счетчиков
    // Это более производительно, чем событие 'scroll'
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCountersAnimation();
                observer.unobserve(entry.target); // Отключаем наблюдение после срабатывания
            }
        });
    }, { threshold: 0.5 }); // Сработает, когда 50% элемента видно

    if (factsSection) {
        observer.observe(factsSection);
    }

});
