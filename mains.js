document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DO MENU MOBILE (NAVBAR) ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeBtn = document.querySelector('.close-btn');

    const closeMobileMenu = () => {
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    };

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.classList.add('no-scroll');
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', closeMobileMenu);
        }
        
        mobileMenu.querySelectorAll('.nav-item').forEach(item => {
            if (item.id !== 'mobile-cart-button') {
                item.addEventListener('click', closeMobileMenu);
            }
        });
    }

    // --- LÓGICA DO CARROSSEL ---
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
                indicators.forEach((indicator, index) => indicator.classList.toggle('active', index === currentIndex));
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
        const stopAutoSlide = () => clearInterval(autoSlide);
        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
                startAutoSlide();
            });
        });
        startAutoSlide();
    }

    // --- LÓGICA DOS FILTROS E BUSCA ---
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
            card.style.display = (matchesSearch && matchesFilter) ? 'flex' : 'none';
        });
    };

    if (searchBar) searchBar.addEventListener('keyup', filterProducts);
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterProducts();
            });
        });
    }

    // --- LÓGICA DA SACOLA (CARRINHO) ---
    const cartToggleButton = document.getElementById('cart-toggle-button');
    const mobileCartButton = document.getElementById('mobile-cart-button');
    const cartModal = document.getElementById('cart-modal');
    const closeModalButton = document.getElementById('close-modal-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const cartCountSpan = document.getElementById('cart-count');
    const checkoutButton = document.getElementById('checkout-btn');
    const addButtons = document.querySelectorAll('.add-to-cart-btn');

    let cart = JSON.parse(localStorage.getItem('adegaCart')) || [];

    const renderCart = () => {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Sua sacola está vazia.</p>';
        } else {
            cart.forEach((item, index) => {
                total += item.price * item.quantity;
                const itemHTML = `
                    <div class="cart-item">
                        <span>${item.name} (x${item.quantity})</span>
                        <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
                        <button class="remove-item-btn" data-index="${index}">&times;</button>
                    </div>`;
                cartItemsContainer.innerHTML += itemHTML;
            });
        }
        cartTotalSpan.textContent = total.toFixed(2);
        
        // --- LÓGICA DO CONTADOR ATUALIZADA ---
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        cartCountSpan.textContent = totalItems;
        
        if (totalItems > 0) {
            cartCountSpan.classList.add('visible');
        } else {
            cartCountSpan.classList.remove('visible');
        }
        // --- FIM DA LÓGICA DO CONTADOR ---

        localStorage.setItem('adegaCart', JSON.stringify(cart));
    };

    const addToCart = (name, price) => {
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) existingItem.quantity++;
        else cart.push({ name, price, quantity: 1 });
        renderCart();
    };

    const openCartModal = (e) => {
        e.preventDefault();
        closeMobileMenu(); // Garante que o menu mobile feche
        cartModal.style.display = 'flex';
    };

    const closeCartModal = () => cartModal.style.display = 'none';

    if (cartToggleButton) cartToggleButton.addEventListener('click', openCartModal);
    if (mobileCartButton) mobileCartButton.addEventListener('click', openCartModal);
    if (closeModalButton) closeModalButton.addEventListener('click', closeCartModal);
    window.addEventListener('click', (event) => {
        if (event.target === cartModal) closeCartModal();
    });

    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            const name = button.dataset.nomeProduto;
            const price = parseFloat(button.dataset.precoProduto);
            addToCart(name, price);

            // Guarda o texto original
            const originalText = button.textContent;
            
            // Muda o texto e desabilita para evitar cliques duplos
            button.textContent = 'Adicionado!';
            button.disabled = true;
            
            // Depois de 1.5 segundos, volta ao normal
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 650);
        });
    });

    cartItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item-btn')) {
            const index = parseInt(event.target.dataset.index, 10);
            const item = cart[index];
            if (item.quantity > 1) item.quantity--;
            else cart.splice(index, 1);
            renderCart();
        }
    });

    checkoutButton.addEventListener('click', () => {
        if (cart.length === 0) return alert("Sua sacola está vazia!");
        let message = "Olá! Gostaria de fazer o seguinte pedido:\n\n";
        cart.forEach(item => {
            message += `- ${item.name} (x${item.quantity}) - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
        });
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
        message += `\n*Total:* R$ ${total}`;
        const phoneNumber = "557193416929"; // Troque pelo seu número
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    });

    renderCart(); // Renderiza o carrinho ao carregar a página
});