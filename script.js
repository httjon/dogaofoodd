document.addEventListener('DOMContentLoaded', () => {
    
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuDropdown = document.getElementById('mobile-menu-dropdown');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileMenuBtn && mobileMenuDropdown) {
        mobileMenuBtn.addEventListener('click', () => {
            const isHidden = mobileMenuDropdown.classList.contains('hidden');
            if (isHidden) {
                mobileMenuDropdown.classList.remove('hidden');
                setTimeout(() => {
                    mobileMenuDropdown.classList.remove('opacity-0', '-translate-y-2');
                    mobileMenuDropdown.classList.add('opacity-100', 'translate-y-0');
                }, 10);
            } else {
                mobileMenuDropdown.classList.remove('opacity-100', 'translate-y-0');
                mobileMenuDropdown.classList.add('opacity-0', '-translate-y-2');
                setTimeout(() => {
                    mobileMenuDropdown.classList.add('hidden');
                }, 300);
            }
            
            
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileMenuDropdown.classList.contains('hidden')) {
                icon.setAttribute('data-lucide', 'menu');
            } else {
                icon.setAttribute('data-lucide', 'x');
            }
            lucide.createIcons();
        });

       
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuDropdown.classList.remove('opacity-100', 'translate-y-0');
                mobileMenuDropdown.classList.add('opacity-0', '-translate-y-2');
                setTimeout(() => {
                    mobileMenuDropdown.classList.add('hidden');
                }, 300);
                const icon = mobileMenuBtn.querySelector('i');
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            });
        });
    }

    
    const mainHeader = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            mainHeader.classList.add('py-2', 'bg-dark/95', 'shadow-2xl');
            mainHeader.classList.remove('py-4', 'bg-dark/80');
        } else {
            mainHeader.classList.remove('py-2', 'bg-dark/95', 'shadow-2xl');
            mainHeader.classList.add('py-4', 'bg-dark/80');
        }
    });

  
    const cartToggle = document.getElementById('cart-toggle-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartClose = document.getElementById('cart-close');
    const cartOverlay = document.getElementById('cart-overlay');
    const goToMenu = document.getElementById('go-to-menu');

    const toggleCart = () => {
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.toggle('active');
            cartOverlay.classList.toggle('active');
            document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
        }
    };

    if (cartToggle) cartToggle.addEventListener('click', toggleCart);
    if (cartClose) cartClose.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);
    if (goToMenu) {
        goToMenu.addEventListener('click', (e) => {
            e.preventDefault();
            toggleCart();
            const menuSection = document.getElementById('menu');
            if (menuSection) {
                menuSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

   
    const categoryBtns = document.querySelectorAll('.category-btn');
    const sections = document.querySelectorAll('.menu-category');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                
                categoryBtns.forEach(b => b.classList.remove('active'));
                
                btn.classList.add('active');

                
                window.scrollTo({
                    top: targetSection.offsetTop - 140, 
                    behavior: 'smooth'
                });
            }
        });
    });

   
    window.addEventListener('scroll', () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        categoryBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('href') === `#${current}`) {
                btn.classList.add('active');
            }
        });
    });

   
    let cart = [];
    const cartItemsContainer = document.getElementById('cart-items');
    const cartEmptyMsg = document.getElementById('cart-empty');
    const cartTotalValue = document.getElementById('cart-total-value');
    const checkoutBtn = document.getElementById('checkout-btn');
    const sendWhatsappBtn = document.getElementById('send-whatsapp-btn');
    const checkoutForm = document.getElementById('checkout-form');
    const backToCartBtn = document.getElementById('back-to-cart');
    const cartNotes = document.getElementById('cart-notes');
    const orderNotesInput = document.getElementById('order-notes');

    function updateCart() {
        
        const items = cartItemsContainer.querySelectorAll('.cart-item');
        items.forEach(item => item.remove());

        if (cart.length === 0) {
            cartEmptyMsg.style.display = 'flex';
            checkoutBtn.disabled = true;
            cartTotalValue.textContent = 'R$ 0,00';
            if (cartNotes) cartNotes.style.display = 'none';
            return;
        }

        cartEmptyMsg.style.display = 'none';
        checkoutBtn.disabled = false;
        if (cartNotes) cartNotes.style.display = 'block';

        let total = 0;

        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                    </div>
                    <button class="remove-item" onclick="removeItem(${index})">
                        <i data-lucide="trash-2" size="18"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
            total += item.price * item.quantity;
        });

        cartTotalValue.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        lucide.createIcons();
    }

    window.changeQty = (index, delta) => {
        cart[index].quantity += delta;
        if (cart[index].quantity < 1) {
            removeItem(index);
        } else {
            updateCart();
        }
    };

    window.removeItem = (index) => {
        cart.splice(index, 1);
        const count = document.querySelector('.cart-count');
        count.textContent = cart.length;
        updateCart();
    };

    
    const addBtns = document.querySelectorAll('.add-to-cart-btn');
    const cartCount = document.querySelector('.cart-count');

    addBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const productName = btn.getAttribute('data-name');
            const productPrice = parseFloat(btn.getAttribute('data-price'));

           
            const existingItem = cart.find(item => item.name === productName);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    name: productName,
                    price: productPrice,
                    quantity: 1
                });
            }

            
            const originalText = btn.textContent;
            btn.textContent = "Adicionado!";
            btn.classList.add('added');
            
            
            cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);

            
            cartCount.style.transform = 'scale(1.5)';
            setTimeout(() => {
                cartCount.style.transform = 'scale(1)';
            }, 200);

            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.classList.remove('added');
            }, 1000);

            updateCart();
        });
    });

   
    checkoutBtn.addEventListener('click', () => {
        cartItemsContainer.style.display = 'none';
        checkoutForm.style.display = 'block';
        checkoutBtn.style.display = 'none';
        sendWhatsappBtn.style.display = 'block';
    });

    backToCartBtn.addEventListener('click', () => {
        cartItemsContainer.style.display = 'block';
        checkoutForm.style.display = 'none';
        checkoutBtn.style.display = 'block';
        sendWhatsappBtn.style.display = 'none';
    });

    
    sendWhatsappBtn.addEventListener('click', () => {
        const nameInput = document.getElementById('customer-name');
        const addressInput = document.getElementById('customer-address');
        const paymentSelect = document.getElementById('payment-method');

        nameInput.value = nameInput.value.trim();
        addressInput.value = addressInput.value.trim();

        if (!nameInput.checkValidity()) {
            nameInput.reportValidity();
            nameInput.focus();
            return;
        }

        if (!addressInput.checkValidity()) {
            addressInput.reportValidity();
            addressInput.focus();
            return;
        }

        const name = nameInput.value;
        const address = addressInput.value;
        const payment = paymentSelect.value;
        const notes = orderNotesInput ? orderNotesInput.value.trim() : '';

        let itemsText = "";
        cart.forEach(item => {
            itemsText += `* ${item.name} x ${item.quantity}\n`;
        });

        const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        
        const notesText = notes ? `\n\nObservações: ${notes}` : '';
        const message = `Pedido - Dogão do Gordão\n\nNome: ${name}\nEndereço: ${address}\nPagamento: ${payment}\n\nItens:\n${itemsText}\nTotal: R$ ${total.toFixed(2).replace('.', ',')}${notesText}`;
        
        const encodedMessage = encodeURIComponent(message);
        const phone = "5511999999999"; 
        
        window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
    });

    
    const ctaScrollBtn = document.querySelector('.btn-cta-scroll');
    if (ctaScrollBtn) {
        ctaScrollBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = ctaScrollBtn.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 140,
                    behavior: 'smooth'
                });
            }
        });
    }

    
    const allButtons = document.querySelectorAll('.btn, .add-to-cart-btn, .qty-btn');
    allButtons.forEach(btn => {
        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'scale(0.95)';
        });
        btn.addEventListener('mouseup', () => {
            btn.style.transform = '';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
});