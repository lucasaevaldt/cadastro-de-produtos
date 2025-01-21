// Array para armazenar e manter os produtos
let products = JSON.parse(localStorage.getItem('products')) || [];

const modal = document.getElementById('product-modal');
const openModalBtn = document.querySelector('.js-open-modal');
const closeModalBtn = document.querySelector('.close-modal');
const clearListBtn = document.querySelector('.js-clear-list');

openModalBtn.addEventListener('click', () => modal.classList.add('active'));
closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});
clearListBtn.addEventListener('click', clearList);

function saveProduct() {
    if (!validateForm()) return;

    const product = {
        id: Date.now(),
        name: document.getElementById('name').value.trim(),
        description: document.getElementById('description').value.trim(),
        price: parseFloat(document.getElementById('price').value),
        available: document.querySelector('input[name="available"]:checked').value === 'true'
    };

    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
    updateProductList();
    closeModal();
}

function validateForm() {
    const fields = {
        name: document.getElementById('name'),
        description: document.getElementById('description'),
        price: document.getElementById('price')
    };

    let isValid = true;

    document.querySelectorAll('.error-message').forEach((errorElement) => errorElement.textContent = '');
    document.querySelectorAll('.error').forEach((inputElement) => inputElement.classList.remove('error'));

    if (!fields.name.value.trim()) {
        document.getElementById('name-error').textContent = 'Nome do produto é obrigatório.';
        fields.name.classList.add('error');
        isValid = false;
    }
    if (!fields.description.value.trim()) {
        document.getElementById('description-error').textContent = 'Descrição do produto é obrigatória.';
        fields.description.classList.add('error');
        isValid = false;
    }
    if (!fields.price.value || fields.price.value <= 0) {
        document.getElementById('price-error').textContent = 'Preço inválido.';
        fields.price.classList.add('error');
        isValid = false;
    }

    return isValid;
}

function updateProductList() {
    const productList = document.getElementById('product-list');
    
    if (products.length === 0) {
        productList.innerHTML = `
            <div class="empty-list">
                <img src="./img/add-icon.svg" alt="add">
                <h3>Nenhum produto cadastrado</h3>
                <p>Clique no botão "Adicionar Novo Produto" para começar a criar sua lista de produtos.</p>
            </div>
        `;
        return;
    }

    // Ordenar produtos por preço (do menor para o maior)
    products.sort((a, b) => a.price - b.price);

    productList.innerHTML = `
        <table class="product-table">
            <thead>
                <tr>
                    <th>Nome do produto</th>
                    <th>Preço</th>
                </tr>
            </thead>
            <tbody>
                ${products.map(product => `
                    <tr class="product-row">
                        <td>
                            <div class="product-info">
                                <h4>${product.name} (${product.available ? 'Disponível' : 'Indisponível'})</h4>
                                <p class="product-description">${product.description}</p>
                            </div>
                        </td>
                        <td>
                            <div class="price-actions">
                                <span>R$ ${product.price.toFixed(2)}</span>
                                <button onclick="deleteProduct(${product.id})">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 16 16" fill="none" stroke="#ABAFBA" stroke-linecap="round" stroke-linejoin="round" id="Trash--Streamline-Lucide" height="16" width="16"><desc>Trash Streamline Icon: https://streamlinehq.com</desc>
                                        <path d="M1.875 3.75h11.25" stroke-width="1"></path>
                                        <path d="M11.875 3.75v8.75c0 0.625 -0.625 1.25 -1.25 1.25H4.375c-0.625 0 -1.25 -0.625 -1.25 -1.25V3.75" stroke-width="1"></path>
                                        <path d="M5 3.75V2.5c0 -0.625 0.625 -1.25 1.25 -1.25h2.5c0.625 0 1.25 0.625 1.25 1.25v1.25" stroke-width="1"></path>
                                    </svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function deleteProduct(id) {
    products = products.filter(product => product.id !== id);
    localStorage.setItem('products', JSON.stringify(products));
    updateProductList();
}

function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('description').value = '';
    document.getElementById('price').value = '';
    document.querySelector('input[name="available"][value="true"]').checked = true;
}

function closeModal() {
    modal.classList.remove('active');
    clearForm();
}

function clearList() {
    if (products.length > 0 && confirm('Tem certeza que deseja limpar toda a lista?')) {
        products = [];
        localStorage.removeItem('products');
        updateProductList();
    }
}

// Inicializa a lista de produtos
updateProductList();