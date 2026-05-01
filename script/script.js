// Слайдер для главного экрана
document.addEventListener('DOMContentLoaded', function() {
    const slides = [
        { image: 'img/2.png', title: 'От мечты <br> к реальности с LoftSpace', number: '01' },
        { image: 'img/5.png', title: 'От мечты <br> к реальности с LoftSpace', number: '02' },
        { image: 'img/image 50.png', title: 'От мечты <br> к реальности с LoftSpace', number: '03' }
    ];
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    const headerImage = document.querySelector('.header_text_home img');
    const titleElement = document.querySelector('.text_body');
    const numberText = document.querySelector('.number_page .number_text:first-child');
    const leftArrow = document.querySelector('.arrow_left_right svg:first-child');
    const rightArrow = document.querySelector('.arrow_left_right svg:last-child');
    const lineSvg = document.querySelector('.number_page svg[width="262"]');
    const numberPage = document.querySelector('.number_page');
    let progressFill = null;
    
    function initProgress() {
        if (!lineSvg || !numberPage) return;
        const lineRect = lineSvg.getBoundingClientRect();
        const containerRect = numberPage.getBoundingClientRect();
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `position:absolute; top:${lineRect.top - containerRect.top}px; left:${lineRect.left - containerRect.left}px; width:${lineSvg.clientWidth}px; height:2px; overflow:hidden; border-radius:1px; z-index:5;`;
        progressFill = document.createElement('div');
        progressFill.style.cssText = `height:100%; width:0%; background:#D1921A; transition:width 0.4s ease; border-radius:1px;`;
        wrapper.appendChild(progressFill);
        numberPage.style.position = 'relative';
        numberPage.appendChild(wrapper);
    }
    
    function updateProgress() {
        if (!lineSvg || !numberPage) return;
        const lineRect = lineSvg.getBoundingClientRect();
        const containerRect = numberPage.getBoundingClientRect();
        const lineLeft = lineRect.left - containerRect.left;
        const step = lineSvg.clientWidth / (totalSlides - 1);
        const dotLeft = lineLeft + (currentSlide * step);
        
        let dot = document.querySelector('.moving-dot');
        if (!dot) {
            dot = document.createElement('div');
            dot.className = 'moving-dot';
            dot.style.cssText = `position:absolute; width:12px; height:12px; background:#D1921A; border-radius:50%; transition:left 0.4s ease; z-index:10; top:${lineRect.top - containerRect.top - 5}px;`;
            numberPage.appendChild(dot);
        }
        dot.style.left = `${dotLeft}px`;
        if (progressFill) progressFill.style.width = `${(currentSlide / (totalSlides - 1)) * 100}%`;
    }
    
    function updateSlide() {
        const slide = slides[currentSlide];
        if (headerImage) {
            headerImage.style.opacity = '0';
            setTimeout(() => { headerImage.src = slide.image; headerImage.style.opacity = '1'; }, 200);
        }
        if (titleElement) {
            titleElement.style.opacity = '0';
            setTimeout(() => { titleElement.innerHTML = slide.title; titleElement.style.opacity = '1'; }, 200);
        }
        if (numberText) numberText.textContent = slide.number;
        updateProgress();
    }
    
    function nextSlide() { currentSlide = (currentSlide + 1) % totalSlides; updateSlide(); }
    function prevSlide() { currentSlide = (currentSlide - 1 + totalSlides) % totalSlides; updateSlide(); }
    
    function init() {
        initProgress();
        updateSlide();
        if (leftArrow) { leftArrow.addEventListener('click', prevSlide); leftArrow.style.cursor = 'pointer'; }
        if (rightArrow) { rightArrow.addEventListener('click', nextSlide); rightArrow.style.cursor = 'pointer'; }
        let interval = setInterval(nextSlide, 5000);
        [leftArrow, rightArrow].forEach(arrow => {
            if (arrow) {
                arrow.addEventListener('mouseenter', () => clearInterval(interval));
                arrow.addEventListener('mouseleave', () => { interval = setInterval(nextSlide, 5000); });
            }
        });
        window.addEventListener('resize', () => updateProgress());
    }
    init();
});

// Увеличение фото по клику (популярные проекты)
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.block_popular_project_img img, .block_fotoGallery img').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            const modal = document.createElement('div');
            modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); display:flex; justify-content:center; align-items:center; z-index:9999; cursor:pointer;';
            modal.innerHTML = `<img src="${img.src}" style="max-width:90%; max-height:90%; border-radius:8px;">`;
            modal.addEventListener('click', () => modal.remove());
            document.body.appendChild(modal);
        });
    });
});

// Фотогалерея
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.block_fotoGallery');
    if (!container) return;
    const images = ['img/image 77.png', 'img/image 37.png', 'img/image 78.png', 'img/image 77.png', 'img/image 37.png', 'img/image 78.png'];
    container.innerHTML = '';
    images.forEach(src => { const img = document.createElement('img'); img.src = src; container.appendChild(img); });
    container.style.cssText = 'display:flex; overflow-x:auto; gap:20px; cursor:grab;';
    const style = document.createElement('style');
    style.textContent = `.block_fotoGallery::-webkit-scrollbar { display: none; } .block_fotoGallery { scrollbar-width: none; }`;
    document.head.appendChild(style);
    
    container.onwheel = e => {
        const maxLeft = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft >= maxLeft - 5 && e.deltaY > 0) window.scrollBy(0, 100);
        else { e.preventDefault(); container.scrollLeft += e.deltaY; }
    };
    let down = false, startX, startLeft;
    container.onmousedown = e => { down = true; startX = e.pageX; startLeft = container.scrollLeft; container.style.cursor = 'grabbing'; };
    document.onmouseup = () => { down = false; container.style.cursor = 'grab'; };
    container.onmousemove = e => { if (down) container.scrollLeft = startLeft - (e.pageX - startX); };
    container.querySelectorAll('img').forEach(img => { img.style.cssText = 'flex-shrink:0; cursor:pointer;'; });
});

// Новости
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.block_news, .block_news_center').forEach(block => {
        block.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        block.style.cursor = 'pointer';
        block.addEventListener('mouseenter', () => { block.style.transform = 'translateY(-10px)'; block.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)'; });
        block.addEventListener('mouseleave', () => { block.style.transform = 'translateY(0)'; block.style.boxShadow = 'none'; });
        block.addEventListener('click', () => {
            const text = block.querySelector('.news_text_2').innerText;
            const imgSrc = block.querySelector('img').src;
            const modal = document.createElement('div');
            modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); display:flex; justify-content:center; align-items:center; z-index:9999;';
            modal.innerHTML = `<div style="background:#1a1a1a; max-width:550px; width:90%; border-radius:20px; overflow:hidden;"><img src="${imgSrc}" style="width:100%; height:300px; object-fit:cover;"><div style="padding:35px;"><p style="color:#fff; font-size:18px; line-height:1.6; margin-bottom:25px;">${text}</p><div style="display:flex; gap:15px; justify-content:flex-end;"><button class="modal-close" style="background:transparent; border:1px solid #D1921A; color:#D1921A; padding:10px 25px; border-radius:30px; cursor:pointer;">Закрыть</button><button class="modal-share" style="background:#D1921A; border:none; color:#fff; padding:10px 25px; border-radius:30px; cursor:pointer;">Поделиться</button></div></div></div>`;
            document.body.appendChild(modal);
            modal.querySelector('.modal-close').onclick = () => modal.remove();
            modal.querySelector('.modal-share').onclick = () => { alert('Ссылка скопирована!'); modal.remove(); };
            modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
            document.addEventListener('keydown', function keyHandler(e) { if (e.key === 'Escape') { modal.remove(); document.removeEventListener('keydown', keyHandler); } });
        });
    });
});

// Форма "Оставить заявку"
document.addEventListener('DOMContentLoaded', () => {
    const targetBtn = Array.from(document.querySelectorAll('.text_find_a')).find(btn => btn.textContent.trim() === 'Оставить заявку');
    if (targetBtn) {
        targetBtn.onclick = (e) => {
            e.preventDefault();
            const modal = document.createElement('div');
            modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:99999; display:flex; justify-content:center; align-items:center;';
            modal.innerHTML = `<div style="background:#1a1a1a; padding:40px; border-radius:20px; width:90%; max-width:400px;"><h3 style="color:#D1921A; margin-bottom:20px;">Оставить заявку</h3><input type="text" id="nameInput" placeholder="Ваше имя" style="width:100%; padding:12px; margin-bottom:15px; background:#2a2a2a; border:1px solid #333; border-radius:8px; color:#fff; box-sizing:border-box;"><input type="tel" id="phoneInput" placeholder="Номер телефона" style="width:100%; padding:12px; margin-bottom:25px; background:#2a2a2a; border:1px solid #333; border-radius:8px; color:#fff; box-sizing:border-box;"><button id="sendBtn" style="width:100%; background:#D1921A; border:none; color:#fff; padding:14px; border-radius:30px; cursor:pointer; margin-bottom:10px;">Отправить</button><button id="closeBtn" style="width:100%; background:transparent; border:1px solid #D1921A; color:#D1921A; padding:14px; border-radius:30px; cursor:pointer;">Закрыть</button></div>`;
            document.body.appendChild(modal);
            document.getElementById('closeBtn').onclick = () => modal.remove();
            document.getElementById('sendBtn').onclick = () => {
                const name = document.getElementById('nameInput').value;
                const phone = document.getElementById('phoneInput').value;
                if (name && phone) { alert(`Спасибо, ${name}! Мы перезвоним вам.`); modal.remove(); }
                else alert('Заполните имя и телефон');
            };
            modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        };
    }
});

// Плавная прокрутка для якорных ссылок
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === "#") return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

// Горизонтальная прокрутка для блоков на 320px
document.addEventListener('DOMContentLoaded', function() {
    const scrollBlocks = ['.block_popular_project_img', '.block_button', '.block_all_news'];
    
    function enableScroll(container) {
        if (!container || window.innerWidth > 320) return;
        container.style.cssText = 'display:flex; overflow-x:auto; gap:15px; cursor:grab; scroll-behavior:smooth;';
        const style = document.createElement('style');
        style.textContent = `${scrollBlocks.join(',')}::-webkit-scrollbar { display: none; } ${scrollBlocks.join(',')} { scrollbar-width: none; }`;
        document.head.appendChild(style);
        
        container.onwheel = (e) => {
            const maxLeft = container.scrollWidth - container.clientWidth;
            if (container.scrollLeft >= maxLeft - 5 && e.deltaY > 0) window.scrollBy(0, 100);
            else { e.preventDefault(); container.scrollLeft += e.deltaY; }
        };
        
        let down = false, startX, startLeft;
        container.onmousedown = (e) => { down = true; startX = e.pageX; startLeft = container.scrollLeft; container.style.cursor = 'grabbing'; };
        document.onmouseup = () => { down = false; container.style.cursor = 'grab'; };
        container.onmousemove = (e) => { if (down) container.scrollLeft = startLeft - (e.pageX - startX); };
    }
    
    scrollBlocks.forEach(selector => enableScroll(document.querySelector(selector)));
    window.addEventListener('resize', () => scrollBlocks.forEach(selector => enableScroll(document.querySelector(selector))));
});

// Бургер-меню для мобильной версии
document.addEventListener('DOMContentLoaded', function() {
    const blockAllA = document.querySelector('.block_all_a');
    if (!blockAllA) return;
    
    const blockA1 = document.querySelector('.block_a_1');
    const blockA2 = document.querySelector('.block_a_2');
    
    // Скрываем оригинальный block_a_2
    if (blockA2) blockA2.style.display = 'none';
    
    // Проверяем, есть ли уже бургер
    if (document.querySelector('.burger')) return;
    
    // Создаём правый блок
    const rightBlock = document.createElement('div');
    rightBlock.className = 'header-right';
    rightBlock.style.cssText = 'display: flex; align-items: center; gap: 15px;';
    
    // Копируем телефон и кнопку
    if (blockA2) {
        const clonedBlockA2 = blockA2.cloneNode(true);
        clonedBlockA2.className = 'header-contacts';
        clonedBlockA2.style.cssText = 'display: flex; gap: 15px; align-items: center;';
        rightBlock.appendChild(clonedBlockA2);
    }
    
    // Создаём бургер
    const burger = document.createElement('div');
    burger.className = 'burger';
    burger.innerHTML = '<span></span><span></span><span></span>';
    rightBlock.appendChild(burger);
    blockAllA.appendChild(rightBlock);
    
    // Мобильное меню
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    let menuHtml = '';
    if (blockA1) {
        blockA1.querySelectorAll('.header_a_1').forEach(link => {
            menuHtml += `<a href="${link.getAttribute('href')}">${link.textContent}</a>`;
        });
    }
    if (blockA2) {
        const phoneLink = blockA2.querySelector('.header_a_2:first-child');
        const requestLink = blockA2.querySelector('.header_a_2:last-child');
        menuHtml += `<div class="mobile-contact"><a href="${phoneLink ? phoneLink.getAttribute('href') : 'tel:+78433661760'}" class="mobile-phone">${phoneLink ? phoneLink.textContent : '+7 (843) 366 17 60'}</a><a href="#" class="mobile-request">${requestLink ? requestLink.textContent : 'Оставить заявку'}</a></div>`;
    }
    mobileMenu.innerHTML = menuHtml;
    
    // Затемнение
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(mobileMenu);
    document.body.appendChild(overlay);
    
    // Стили
    const style = document.createElement('style');
    style.textContent = `
        .burger { display: none; cursor: pointer; z-index: 1001; }
        .burger span { display: block; width: 25px; height: 3px; background: #fff; margin: 5px 0; transition: 0.3s; }
        .mobile-menu { position: fixed; top: 0; right: -100%; width: 70%; max-width: 300px; height: 100%; background: #1a1a1a; z-index: 1000; padding: 80px 30px 30px; transition: 0.4s; overflow-y: auto; }
        .mobile-menu.active { right: 0; }
        .mobile-menu a { display: block; color: #fff; text-decoration: none; padding: 12px 0; font-size: 18px; border-bottom: 1px solid #333; }
        .mobile-menu a:hover { color: #D1921A; padding-left: 10px; }
        .mobile-contact { margin-top: 30px; padding-top: 20px; border-top: 1px solid #D1921A; display: none; }
        .mobile-contact .mobile-phone { color: #D1921A; font-weight: bold; }
        .mobile-contact .mobile-request { background: #D1921A; text-align: center; border-radius: 30px; margin-top: 15px; padding: 10px; border-bottom: none; color: #fff; }
        .burger.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        .burger.active span:nth-child(2) { opacity: 0; }
        .burger.active span:nth-child(3) { transform: rotate(-45deg) translate(7px, -6px); }
        .overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 999; }
        .overlay.active { display: block; }
        @media (min-width: 1025px) { .burger, .mobile-menu, .overlay { display: none !important; } .block_a_1 { display: flex !important; } .block_a_2 { display: flex !important; } .header-right { display: none !important; } }
        @media (max-width: 1024px) { .block_a_1 { display: none !important; } .block_a_2 { display: none !important; } .burger { display: block !important; } .block_all_a { display: flex !important; justify-content: space-between !important; align-items: center !important; } .header-right { display: flex !important; align-items: center; gap: 15px; } .header-right .header-contacts { display: flex !important; } }
        @media (max-width: 768px) { .header-right .header-contacts { display: none !important; } .mobile-contact { display: block !important; } }
    `;
    document.head.appendChild(style);
    
    function toggleMenu() {
        burger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }
    
    burger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
    
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) { toggleMenu(); setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 300); }
            } else if (this.classList.contains('mobile-request')) {
                e.preventDefault();
                toggleMenu();
                setTimeout(() => { const btn = document.querySelector('.text_find_a'); if (btn) btn.click(); }, 300);
            } else { toggleMenu(); }
        });
    });
});

// Слайдер для главного экрана
document.addEventListener('DOMContentLoaded', function() {
    const slides = [
        { image: 'img/2.png', title: 'От мечты <br> к реальности с LoftSpace', number: '01' },
        { image: 'img/5.png', title: 'От мечты <br> к реальности с LoftSpace', number: '02' },
        { image: 'img/image 50.png', title: 'От мечты <br> к реальности с LoftSpace', number: '03' }
    ];
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    const headerImage = document.querySelector('.header_text_home img');
    const titleElement = document.querySelector('.text_body');
    const numberText = document.querySelector('.number_page .number_text:first-child');
    const leftArrow = document.querySelector('.arrow_left_right svg:first-child');
    const rightArrow = document.querySelector('.arrow_left_right svg:last-child');
    const lineSvg = document.querySelector('.number_page svg');
    const numberPage = document.querySelector('.number_page');
    
    let progressFill = null;
    let dot = null;
    
    function initProgress() {
        if (!lineSvg || !numberPage) return;
        
        // Удаляем старые элементы
        const oldWrapper = document.querySelector('.progress-wrapper');
        if (oldWrapper) oldWrapper.remove();
        if (dot) dot.remove();
        
        const lineRect = lineSvg.getBoundingClientRect();
        const containerRect = numberPage.getBoundingClientRect();
        const lineWidth = lineSvg.clientWidth;
        
        // Создаем wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'progress-wrapper';
        wrapper.style.cssText = `
            position: absolute;
            top: ${lineRect.top - containerRect.top}px;
            left: ${lineRect.left - containerRect.left}px;
            width: ${lineWidth}px;
            height: 2px;
            overflow: hidden;
            border-radius: 1px;
            z-index: 5;
        `;
        
        // Оранжевая полоска
        progressFill = document.createElement('div');
        progressFill.style.cssText = `
            height: 100%;
            width: 0%;
            background: #D1921A;
            transition: width 0.4s ease;
            border-radius: 1px;
        `;
        
        wrapper.appendChild(progressFill);
        numberPage.style.position = 'relative';
        numberPage.appendChild(wrapper);
        
        // Создаем точку
        dot = document.createElement('div');
        dot.className = 'moving-dot';
        dot.style.cssText = `
            position: absolute;
            width: 12px;
            height: 12px;
            background: #D1921A;
            border-radius: 50%;
            transition: left 0.4s ease;
            z-index: 10;
            top: ${lineRect.top - containerRect.top - 5}px;
        `;
        numberPage.appendChild(dot);
        
        updateProgress();
    }
    
    function updateProgress() {
        if (!lineSvg || !progressFill || !dot) return;
        
        const lineRect = lineSvg.getBoundingClientRect();
        const containerRect = numberPage.getBoundingClientRect();
        const lineLeft = lineRect.left - containerRect.left;
        const lineWidth = lineSvg.clientWidth;
        const step = lineWidth / (totalSlides - 1);
        const dotLeft = lineLeft + (currentSlide * step);
        
        dot.style.left = `${dotLeft}px`;
        progressFill.style.width = `${(currentSlide / (totalSlides - 1)) * 100}%`;
    }
    
    function updateSlide() {
        const slide = slides[currentSlide];
        
        if (headerImage) {
            headerImage.style.opacity = '0';
            setTimeout(() => {
                headerImage.src = slide.image;
                headerImage.style.opacity = '1';
            }, 200);
        }
        
        if (titleElement) {
            titleElement.style.opacity = '0';
            setTimeout(() => {
                titleElement.innerHTML = slide.title;
                titleElement.style.opacity = '1';
            }, 200);
        }
        
        if (numberText) numberText.textContent = slide.number;
        updateProgress();
    }
    
    function nextSlide() { 
        currentSlide = (currentSlide + 1) % totalSlides; 
        updateSlide(); 
    }
    
    function prevSlide() { 
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides; 
        updateSlide(); 
    }
    
    function init() {
        initProgress();
        updateSlide();
        
        if (leftArrow) {
            leftArrow.addEventListener('click', prevSlide);
            leftArrow.style.cursor = 'pointer';
        }
        if (rightArrow) {
            rightArrow.addEventListener('click', nextSlide);
            rightArrow.style.cursor = 'pointer';
        }
        
        let interval = setInterval(nextSlide, 5000);
        
        [leftArrow, rightArrow].forEach(arrow => {
            if (arrow) {
                arrow.addEventListener('mouseenter', () => clearInterval(interval));
                arrow.addEventListener('mouseleave', () => {
                    interval = setInterval(nextSlide, 5000);
                });
            }
        });
        
        window.addEventListener('resize', () => {
            initProgress();
            updateSlide();
        });
    }
    
    init();
});