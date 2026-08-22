document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('cards-container');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.querySelector('.close-btn');

    let currentEvents = [...events];

    // Функция для получения типа события (поддержка рус/англ)
    function getEventType(event) {
        return event.тип || event.type || '';
    }

    function renderCards(filterType = 'all') {
        container.innerHTML = '';
        const filtered = filterType === 'all' ? currentEvents : currentEvents.filter(e => (e.тип || e.type) === filterType);
        filtered.forEach(event => {
            const card = document.createElement('div');
            card.className = 'card';
            const eventType = getEventType(event);
            card.innerHTML = `
                <img src="${event.скриншоты ? event.скриншоты[0] : ''}" alt="${event.название}" onerror="this.src='https://via.placeholder.com/600x400/cccccc/1a2a4a?text=Нет+скрина'">
                <div class="card-content">
                    <h3>${event.название}</h3>
                    <span class="type">${eventType} <button class="boss-btn" onclick="alert('БОССЫ')">БОССЫ</button></span>
                    <div class="date">${event.дата}</div>
                </div>
            `;
            card.addEventListener('click', () => openModal(event));
            container.appendChild(card);
        });
    }

    function openModal(event) {
        let stagesHtml = event.этапы ? event.этапы.map((stage, i) => `<li>${i+1}. ${stage}</li>`).join('') : '';
        let rewardsHtml = event.призы ? event.призы.map(prize => `<li>${prize}</li>`).join('') : '';
        let galleryHtml = event.скриншоты ? event.скриншоты.map(src => `<img src="${src}" alt="скрин" onerror="this.style.display='none'">`).join('') : '';

        modalBody.innerHTML = `
            <h2>${event.название}</h2>
            <div class="meta">Тип: ${getEventType(event)} | Дата: ${event.дата}</div>
            <div class="stages"><strong>Этапы:</strong><ul>${stagesHtml}</ul></div>
            <div class="rewards"><strong>Призы:</strong><ul>${rewardsHtml}</ul></div>
            <div class="gallery">${galleryHtml}</div>
        `;
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderCards(this.dataset.type);
        });
    });

    renderCards('all');
});
