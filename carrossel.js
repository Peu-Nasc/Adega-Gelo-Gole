document.addEventListener('DOMContentLoaded', () => {
    // Lógica do Carrossel
    const carousel = document.querySelector('.carousel-inner');
    if (carousel) {
        const items = document.querySelectorAll('.carousel-item');
        const indicators = document.querySelectorAll('.indicator');
        let currentIndex = 0;
        const intervalTime = 5000;
        let autoSlide;

        const updateCarousel = () => {
            if (items.length > 0) {
                carousel.style.transform = `translateX(${-currentIndex * 100}%)`;
                indicators.forEach((indicator, index) => {
                    indicator.classList.toggle('active', index === currentIndex);
                });
            }
        };
        const nextSlide = () => {
            if (items.length > 0) {
                currentIndex = (currentIndex + 1) % items.length;
                updateCarousel();
            }
        };
        const startAutoSlide = () => {
            stopAutoSlide();
            autoSlide = setInterval(nextSlide, intervalTime);
        };
        const stopAutoSlide = () => {
            clearInterval(autoSlide);
        };

        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
                stopAutoSlide();
                startAutoSlide();
            });
        });
        startAutoSlide();
    }

    // Lógica de Busca e Filtro
    const searchBar = document.getElementById('search-bar');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    const filterProducts = () => {
        const searchTerm = searchBar.value.toLowerCase();
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;

        productCards.forEach(card => {
            const productName = card.querySelector('.product-name').textContent.toLowerCase();
            const productCategory = card.dataset.category;
            const matchesSearch = productName.includes(searchTerm);
            const matchesFilter = activeFilter === 'todos' || productCategory === activeFilter;

            if (matchesSearch && matchesFilter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    };

    if (searchBar) {
        searchBar.addEventListener('keyup', filterProducts);
    }

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterProducts();
            });
        });
    }
});