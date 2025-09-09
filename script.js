document.addEventListener('DOMContentLoaded', () => {
    
    // --- НОВЫЙ КОД: Логика для мобильного меню ---
    const burgerMenu = document.getElementById('burgerMenu');
    const navigationMenu = document.getElementById('navigationMenu');
    if (burgerMenu && navigationMenu) {
        burgerMenu.addEventListener('click', () => {
            navigationMenu.classList.toggle('active');
        });
    }

    // --- Логика для карусели команды ---
    const teamTrack = document.getElementById('teamTrack');
    if (teamTrack) {
        const teamCards = teamTrack.querySelectorAll('.team-card');
        const teamPrevBtn = document.getElementById('teamPrevBtn');
        const teamNextBtn = document.getElementById('teamNextBtn');
        
        let teamCurrentIndex = 0;
        const totalCards = teamCards.length;

        function updateTeamCarousel() {
            if (teamCards.length === 0) return; // Защита от ошибок, если карточек нет
            const cardWidth = teamCards[0].offsetWidth;
            const margin = parseInt(window.getComputedStyle(teamCards[0]).marginRight) * 2;
            const offset = - (teamCurrentIndex * (cardWidth + margin)) + (teamTrack.parentElement.offsetWidth / 2) - ((cardWidth + margin) / 2);
            
            teamTrack.style.transform = `translateX(${offset}px)`;

            teamCards.forEach((card, index) => {
                card.classList.toggle('active', index === teamCurrentIndex);
            });
        }
        
        teamNextBtn.addEventListener('click', () => {
            teamCurrentIndex = (teamCurrentIndex + 1) % totalCards;
            updateTeamCarousel();
        });

        teamPrevBtn.addEventListener('click', () => {
            teamCurrentIndex = (teamCurrentIndex - 1 + totalCards) % totalCards;
            updateTeamCarousel();
        });
        
        updateTeamCarousel();
        window.addEventListener('resize', updateTeamCarousel);
    }

    // --- Логика для отправки формы в Telegram ---
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    // !!! ВАЖНО: Замените на ваши реальные данные
    const BOT_TOKEN = 'ВАШ_БОТ_ТОКЕН'; // <-- ВСТАВЬТЕ ВАШ ТОКЕН СЮДА
    const CHAT_ID = 'ВАШ_ЧАТ_ID';     // <-- ВСТАВЬТЕ ВАШ ID ЧАТА СЮДА

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            let message = `<b>Новая заявка с сайта "ЭКО САДИК"!</b>\n\n<b>Имя:</b> ${name}\n<b>Телефон:</b> ${phone}`;

            const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
            const params = { chat_id: CHAT_ID, text: message, parse_mode: 'HTML' };

            fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params) })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    formMessage.textContent = 'Спасибо! Ваша заявка отправлена.';
                    formMessage.style.color = 'var(--bash-green)';
                    contactForm.reset();
                } else { throw new Error(data.description); }
            })
            .catch(error => {
                formMessage.textContent = `Ошибка отправки. Попробуйте позже.`;
                formMessage.style.color = 'red';
                console.error('Ошибка:', error);
            });
        });
    }
});
