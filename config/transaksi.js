// Checkout process
$('#checkoutButton').click(function() {
    if (cart.length === 0) {
        showNotification('Keranjang belanja kosong!', 'error');
        return;
    }

    // Simulasi data pesanan
    const customerName = $('#name').val() || 'Nama Pelanggan'; // Ambil dari form atau default
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
        orderDate: new Date().toISOString(),
    };

    // Simpan transaksi
    const transaction = {
        no: transactions.length + 1,
        name: customerName,
        product: orderData.items.map(item => item.productName).join(', '),
        date: new Date().toLocaleDateString(),
        status: "Selesai"
    };

    transactions.push(transaction);

    // Tampilkan notifikasi
    showNotification('Terima kasih atas pembelian Anda! Order sedang diproses.');

    // Reset keranjang dan render ulang
    cart = [];
    renderCart();
    $('#cartModal').modal('hide');
    
    // Render transaksi ke tabel laporan
    renderTransactions();
});

// Render transaksi
function renderTransactions() {
    const transactionList = $("#transactionList");
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
