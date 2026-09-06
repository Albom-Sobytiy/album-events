function openImageModal(src) {
    document.getElementById('image-modal-img').src = src;
    document.getElementById('image-modal').style.display = 'flex';
}

function closeImageModal() {
    document.getElementById('image-modal').style.display = 'none';
    document.getElementById('image-modal-img').src = '';
}

function openModalById(eventId) {
    const event = window.events.find(e => e.id === eventId);
    if (!event) return;
    let rewardsHtml = '';
    if (event.награды && event.награды.length > 0) {
        event.награды.forEach(reward => {
            let imagesHtml = reward.фото.map(src => {
                const imgSrc = 'https://raw.githubusercontent.com/Albom-Sobytiy/album-events/main/' + encodeURIComponent(src);
                return `<img src="${imgSrc}" alt="${reward.название}" onclick="openImageModal('${imgSrc}')" onerror="this.style.display='none'">`;
            }).join('');
            rewardsHtml += `
                <div class="reward-block">
                    <h3>${reward.название}</h3>
                    <div class="reward-images">${imagesHtml}</div>
                </div>
            `;
        });
    }
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <div class="modal-title-row">
            <h2>${event.название}</h2>
        </div>
        <div class="modal-subtitle">Награды</div>
        <hr class="modal-divider">
        ${rewardsHtml}
    `;
    // Устанавливаем фон, если он указан
    const modalContent = document.getElementById('modal-content');
    if (event.фон && event.фон.length > 0) {
        modalContent.style.backgroundImage = `url('${event.фон}')`;
    } else {
        modalContent.style.backgroundImage = `url('https://raw.githubusercontent.com/Albom-Sobytiy/album-events/main/%D0%9B%D0%B8%D0%B3%D0%B0%20%D0%90%D0%B2%20%D1%84%D0%BE%D0%BD.png')`; // фон по умолчанию
    }
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('cards-container');
    const closeImgBtn = document.querySelector('.close-img-btn');
    const imageModal = document.getElementById('image-modal');

    function renderCards(filterType = 'all') {
        container.innerHTML = '';
        const filtered = filterType === 'all' ? window.events : window.events.filter(e => e.тип === filterType);
        filtered.forEach(event => {
            const card = document.createElement('div');
            card.className = 'card';
            const hasBoss = event.боссы && event.боссы.length > 0;
            card.innerHTML = `
                <div class="card-img-wrapper">
                    <img src="${event.скриншоты[0] || ''}" alt="${event.название}" onerror="this.src='https://via.placeholder.com/600x400/cccccc/1a2a4a?text=Нет+скрина'">
                </div>
                <div class="card-content">
                    <h3>${event.название}</h3>
                    <div class="card-btn-group">
                        <button class="card-btn" onclick="event.stopPropagation(); openModalById(${event.id})">Награды</button>
                        ${hasBoss ? `<button class="card-btn" onclick="event.stopPropagation(); openImageModal('${event.боссы}')">Боссы</button>` : ''}
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderCards(this.dataset.type);
        });
    });

    // Закрытие модалки наград по клику на фон
    window.addEventListener('click', function(e) {
        if (e.target === document.getElementById('modal')) closeModal();
    });

    // Закрытие модалки картинок по клику на фон
    window.addEventListener('click', function(e) {
        if (e.target === imageModal) closeImageModal();
    });

    // Крестик для картинок
    closeImgBtn.addEventListener('click', closeImageModal);

    renderCards('all');
});
