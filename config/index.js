// Simulasi data dari database
const products = [
    {
        id: 1,
        name: "Nike Air Max",
        price: 1500000,
        image: "image/picture-1.webp",
        description: "Sepatu running dengan teknologi Air Max"
    },
    {
        id: 2,
        name: "Adidas Ultraboost",
        price: 2000000,
        image: "image/picture-2.webp",
        description: "Sepatu lifestyle dengan teknologi Boost"
    },
    {
        id: 3,
        name: "Puma RS-X",
        price: 1800000,
        image: "image/picture-3.webp",
        description: "Sepatu retro dengan desain modern"
    }
];

let cart = [];

// Function untuk memformat harga
function formatPrice(price) {
    return new Intl.NumberFormat('id-ID').format(price);
}

// Function untuk merender produk
function renderProducts() {
    const productList = $('#productList');
    productList.empty();

    products.forEach(product => {
        productList.append(`
            <div class="col-md-4 mb-4">
                <div class="card product-card h-100">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text mt-auto"><strong>Rp. ${formatPrice(product.price)}</strong></p>
                    </div>
                </div>
            </div>
        `);
    });
}

// Function untuk merender keranjang
function renderCart() {
    const cartItems = $('#cartItems');
    cartItems.empty();
    let total = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        const itemTotal = product.price * item.quantity;
        total += itemTotal;

        cartItems.append(`
            <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                <div>
                    <h6 class="mb-0">${product.name}</h6>
                    <small class="text-muted">Rp. ${formatPrice(product.price)} x ${item.quantity}</small>
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-primary me-2 update-quantity" data-id="${item.id}" data-action="decrease">-</button>
                    <span>${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-primary ms-2 update-quantity" data-id="${item.id}" data-action="increase">+</button>
                    <button class="btn btn-sm btn-danger ms-3 remove-from-cart" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `);
    });

    $('#cartTotal').text(formatPrice(total));
    $('#cartCount').text(cart.reduce((sum, item) => sum + item.quantity, 0));
}

// Event Handlers
$(document).ready(function() {
    // Render products
    renderProducts();

    // Smooth scroll untuk navigasi
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $(this.hash);
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 70
            }, 1000);
        }
    });

    // Active link pada navigasi
    $(window).on('scroll', function() {
        const scrollPosition = $(window).scrollTop();

        $('section').each(function() {
            const top = $(this).offset().top - 100;
            const bottom = top + $(this).outerHeight();

            if (scrollPosition >= top && scrollPosition <= bottom) {
                const id = $(this).attr('id');
                $('nav a').removeClass('active');
                $(`nav a[href="#${id}"]`).addClass('active');
            }
        });
    });

    // Add to cart
    $(document).on('click', '.add-to-cart', function() {
        const productId = $(this).data('id');
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id: productId, quantity: 1 });
        }

        renderCart();
        
        // Tampilkan notifikasi
        const productName = products.find(p => p.id === productId).name;
        showNotification(`${productName} ditambahkan ke keranjang!`);
    });

    // Update quantity
    $(document).on('click', '.update-quantity', function() {
        const productId = $(this).data('id');
        const action = $(this).data('action');
        const item = cart.find(item => item.id === productId);

        if (item) {
            if (action === 'increase') {
                item.quantity += 1;
            } else {
                item.quantity -= 1;
                if (item.quantity <= 0) {
                    cart = cart.filter(i => i.id !== productId);
                }
            }
            renderCart();
        }
    });

    // Remove from cart
    $(document).on('click', '.remove-from-cart', function() {
        const productId = $(this).data('id');
        cart = cart.filter(item => item.id !== productId);
        renderCart();
    });

    // Show cart modal
    $('#cartButton').click(function() {
        $('#cartModal').modal('show');
    });

    // Contact form submission
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        const formData = {
            name: $('#name').val(),
            email: $('#email').val(),
            message: $('#message').val()
        };

        // Simulasi pengiriman data ke server
        console.log('Mengirim pesan:', formData);
        showNotification('Pesan Anda telah terkirim! Kami akan segera menghubungi Anda.');
        this.reset();
    });

    // Checkout process
    $('#checkoutButton').click(function() {
        if (cart.length === 0) {
            showNotification('Keranjang belanja kosong!', 'error');
            return;
        }

        // Simulasi pengiriman data ke server
        const orderData = {
            items: cart.map(item => {
                const product = products.find(p => p.id === item.id);
                return {
                    ...item,
                    productName: product.name,
                    price: product.price,
                    subtotal: product.price * item.quantity
                };
            }),
            total: cart.reduce((sum, item) => {
                const product = products.find(p => p.id === item.id);
                return sum + (product.price * item.quantity);
            }, 0),
            orderDate: new Date().toISOString()
        };

        // Simulasi AJAX request ke server
        console.log('Mengirim order:', orderData);
        showNotification('Terima kasih atas pembelian Anda! Order sedang diproses.');
        cart = [];
        renderCart();
        $('#cartModal').modal('hide');
    });
});

// Function untuk menampilkan notifikasi
function showNotification(message, type = 'success') {
    const notification = $(`
        <div class="position-fixed top-0 end-0 p-3" style="z-index: 1070">
            <div class="toast align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        </div>
    `).appendTo('body');

    const toast = new bootstrap.Toast(notification.find('.toast'), {
        delay: 3000
    });
    toast.show();

    notification.on('hidden.bs.toast', function() {
        notification.remove();
    });
}
// Handle login form
$('#loginForm').on('submit', function(e) {
    e.preventDefault();
    $.ajax({
        type: 'POST',
        url: 'login_process.php',
        data: $(this).serialize(),
        dataType: 'json',
        success: function(response) {
            if(response.status === 'success') {
                location.reload();
            } else {
                alert(response.message);
            }
        }
    });
});

// Handle register form
$('#registerForm').on('submit', function(e) {
    e.preventDefault();
    $.ajax({
        type: 'POST',
        url: 'register_process.php',
        data: $(this).serialize(),
        dataType: 'json',
        success: function(response) {
            if(response.status === 'success') {
                alert(response.message);
                $('#registerModal').modal('hide');
                $('#loginModal').modal('show');
            } else {
                alert(response.message);
            }
        }
    });
});