document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('cards-container');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.querySelector('.close-btn');

    let currentEvents = [...events];

    function renderCards(filterType = 'all') {
        container.innerHTML = '';
        const filtered = filterType === 'all' ? currentEvents : currentEvents.filter(e => e.тип === filterType);
        filtered.forEach(event => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${event.скриншоты[0]}" alt="${event.название}" onerror="this.src='https://via.placeholder.com/600x400/cccccc/1a2a4a?text=Нет+скрина'">
                <div class="card-content">
                    <h3>${event.название}</h3>
                    <div class="type-wrapper">
                        <span class="type">${event.тип}</span>
                        <button class="boss-btn" onclick="alert('БОССЫ')">БОССЫ</button>
                    </div>
                    <div class="rewards">
                        ${event.этапы.map(stage => `
                            <div class="reward-block">
                                <strong>${stage.название}</strong>
                                <img src="${stage.фото}" alt="${stage.название}" style="max-width: 120px; height: auto; display: block; cursor: pointer;" onclick="window.open('${stage.фото}', '_blank')" onerror="this.style.display='none'">
                                <span>Очки: ${stage.очки}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            card.addEventListener('click', () => openModal(event));
            container.appendChild(card);
        });
    }

    function openModal(event) {
        let stagesHtml = event.этапы.map((stage, i) => `
            <li>
                <strong>${stage.название}</strong><br>
                <img src="${stage.фото}" alt="${stage.название}" style="max-width: 150px; height: auto; cursor: pointer;" onclick="window.open('${stage.фото}', '_blank')" onerror="this.style.display='none'">
                <br>Очки: ${stage.очки}
            </li>
        `).join('');

        let galleryHtml = event.скриншоты.map(src => `<img src="${src}" alt="скрин" onerror="this.style.display='none'" style="max-width: 100%; cursor: pointer;" onclick="window.open('${src}', '_blank')">`).join('');

        modalBody.innerHTML = `
            <h2>${event.название}</h2>
            <div class="meta">Тип: ${event.тип}</div>
            <div class="stages"><strong>Награды:</strong><ul>${stagesHtml}</ul></div>
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
