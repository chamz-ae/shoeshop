$(document).ready(function() {
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
    let transactions = [
        { no: 1, name: "John Doe", product: "Sepatu A", date: "2024-10-22", status: "Selesai" },
        { no: 2, name: "Jane Smith", product: "Sepatu B", date: "2024-10-21", status: "Selesai" },
    ];

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
                            <button class="btn btn-primary add-to-cart" data-id="${product.id}">
                                <i class="fas fa-shopping-cart me-2"></i>Tambah ke Keranjang
                            </button>
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

    // Function untuk merender laporan transaksi
    function renderTransactions() {
        const transactionList = $('#transactionList');
        transactionList.empty();

        transactions.forEach(transaction => {
            transactionList.append(`
                <tr>
                    <td>${transaction.no}</td>
                    <td>${transaction.name}</td>
                    <td>${transaction.product}</td>
                    <td>${transaction.date}</td>
                    <td>${transaction.status}</td>
                </tr>
            `);
        });
    }

    // Event Handlers
    $(document).on('click', '.add-to-cart', function() {
        const productId = $(this).data('id');
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id: productId, quantity: 1 });
        }

        renderCart();
    });

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

    $(document).on('click', '.remove-from-cart', function() {
        const productId = $(this).data('id');
        cart = cart.filter(item => item.id !== productId);
        renderCart();
    });

    // Checkout process
    $('#checkoutButton').click(function() {
        if (cart.length === 0) {
            alert('Keranjang belanja kosong!');
            return;
        }

        // Buat data transaksi baru
        const orderData = {
            no: transactions.length + 1,
            name: "Customer", // Ganti dengan nama pelanggan jika ada input
            product: cart.map(item => {
                const product = products.find(p => p.id === item.id);
                return `${product.name} (x${item.quantity})`;
            }).join(', '),
            date: new Date().toISOString().split('T')[0],
            status: "Selesai"
        };

        transactions.push(orderData); // Simpan data transaksi
        alert('Pesanan berhasil dibuat!'); // Tampilkan pesan sukses
        cart = []; // Kosongkan keranjang
        renderCart(); // Perbarui tampilan keranjang
        renderTransactions(); // Perbarui tampilan laporan transaksi
    });

    // Render produk dan transaksi saat dokumen siap
    renderProducts();
    renderTransactions();
});
