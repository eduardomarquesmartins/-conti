// A variável 'giftList' já deve estar carregada via gifts.js
// Se não estiver, inicializa como vazio para evitar erro
if (typeof giftList === 'undefined') {
    var giftList = [];
    console.error("Erro: gifts.js não foi carregado corretamente.");
}

const cardsGrid = document.getElementById('cards-grid');
const modal = document.getElementById('modal');
const closeModalBtn = document.querySelector('.close-modal');
const modalTitle = document.getElementById('modal-title');


// Renderizar os cards
function renderCards() {
    if (!cardsGrid) return;
    cardsGrid.innerHTML = '';
    giftList.forEach((gift, index) => {
        const card = document.createElement('div');
        card.className = 'card';

        // Garante compatibilidade se o objeto vier com nomes diferentes (manter flexibilidade)
        const title = gift.title || "Presente";
        const price = gift.price || gift.totalValue || 0;
        const image = gift.image || gift.imageUrl || "";
        const contributed = gift.contributed || 0;
        const remaining = Math.max(0, price - contributed);

        const formattedTotal = price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const formattedRemaining = remaining.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        // Calcula porcentagem de contribuição
        const percentage = price > 0 ? Math.min(100, (contributed / price) * 100) : 0;
        const isComplete = remaining <= 0;

        // Lista de contribuidores para exibir no card
        let contributorsHtml = '';
        if (gift.contributors && gift.contributors.length > 0) {
            const recentContributors = gift.contributors.slice(-3); // Últimos 3
            contributorsHtml = `
                <div class="card-contributors">
                    <span class="contributors-label">💝 Contribuíram:</span>
                    ${recentContributors.map(c => `<span class="contributor-name">${c.name}</span>`).join(', ')}
                    ${gift.contributors.length > 3 ? `<span class="more-contributors">+${gift.contributors.length - 3}</span>` : ''}
                </div>
            `;
        }

        card.innerHTML = `
            <div class="card-image-container">
                <img src="${image}" class="card-image" alt="${title}" onerror="this.src='https://placehold.co/400x300/e0e0e0/555555?text=Sem+Foto'">
                ${isComplete ? '<div class="card-badge-complete">✅ COMPLETO</div>' : ''}
            </div>
            <div class="card-content">
                <h3 class="card-title">${title}</h3>
                <div>
                    <p class="card-price">${formattedTotal}</p>
                    <p class="card-remaining ${isComplete ? 'remaining-complete' : ''}">Valor restante: ${formattedRemaining}</p>
                    ${percentage > 0 && !isComplete ? `
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${percentage}%"></div>
                        </div>
                        <p class="progress-text">${percentage.toFixed(0)}% arrecadado</p>
                    ` : ''}
                </div>
                <button class="btn-primary" onclick="openModal(${index})">${isComplete ? '💕 Ver detalhes' : 'Quero apoiar este casal'}</button>
            </div>
        `;
        cardsGrid.appendChild(card);
    });
}

// Abrir modal
window.openModal = function (index) {
    console.log("Abrindo modal para o item:", index);
    const gift = giftList[index];

    if (!gift) {
        console.error("Presente não encontrado!");
        return;
    }

    // Grava o índice do presente atual para uso posterior
    currentGiftIndex = index;

    // Compatibilidade de propriedades
    const title = gift.title || "Presente";
    const price = gift.price || gift.totalValue || 0;
    const contributed = gift.contributed || 0;
    const remaining = Math.max(0, price - contributed);

    if (modalTitle) modalTitle.textContent = title;

    const formattedTotal = price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const formattedRemaining = remaining.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const elTotal = document.getElementById('modal-total');
    const elRemaining = document.getElementById('modal-remaining');
    const elName = document.getElementById('contributor-name');
    const elAmount = document.getElementById('contribution-amount');
    const pixSection = document.getElementById('pix-section');
    const noContribEl = document.querySelector('.no-contributions');

    if (elTotal) elTotal.textContent = formattedTotal;
    if (elRemaining) elRemaining.textContent = formattedRemaining;

    // Limpa campos anteriores
    if (elName) {
        elName.value = '';
        elName.style.border = '';
    }
    if (elAmount) {
        elAmount.value = '';
        elAmount.style.border = '';
    }
    if (pixSection) pixSection.classList.add('hidden');

    // Atualiza lista de contribuições no modal
    const listEl = document.getElementById('contributions-list');
    if (gift.contributors && gift.contributors.length > 0) {
        if (noContribEl) noContribEl.style.display = 'none';
        if (listEl) {
            listEl.classList.remove('hidden');
            listEl.innerHTML = '';
            gift.contributors.forEach(c => {
                const li = document.createElement('li');
                li.innerHTML = `<span class="contrib-name">${c.name}</span><span class="contrib-amount">R$ ${c.amount.toFixed(2).replace('.', ',')}</span>`;
                listEl.appendChild(li);
            });
        }
    } else {
        if (noContribEl) noContribEl.style.display = 'block';
        if (listEl) {
            listEl.classList.add('hidden');
            listEl.innerHTML = '';
        }
    }

    if (modal) {
        modal.classList.remove('hidden');
    }
}


// ============================================
// Configuração PIX - ALTERE AQUI SEUS DADOS
// ============================================
const PIX_CONFIG = {
    chavePix: 'fazopixprocasamento@gmail.com', // Sua chave PIX (CPF, CNPJ, email, telefone ou aleatória)
    nomeRecebedor: 'LUIZ FERNANDO BARBOSA DE OLIVEIRA', // Nome do recebedor (máx 25 caracteres)
    cidade: 'PORTO ALEGRE', // Cidade do recebedor
};

// ============================================
// Configuração EmailJS - NOTIFICAÇÕES
// ============================================
const EMAILJS_CONFIG = {
    serviceId: 'service_lgt8gdm',
    templateId: 'template_blva38a',
    publicKey: 'prVb_5bopEjX90DjT'
};

// ============================================
// Configuração Firebase - PERSISTÊNCIA DE DADOS
// ============================================
const firebaseConfig = {
    apiKey: "AIzaSyAuEUSFGnyjl2Gn4eAJLW6Be4js631Cw24",
    authDomain: "casamento-conti.firebaseapp.com",
    projectId: "casamento-conti",
    storageBucket: "casamento-conti.firebasestorage.app",
    messagingSenderId: "67866225468",
    appId: "1:67866225468:web:9f248595b83aec9bfecc39"
};

// Inicializa Firebase
let db = null;
(function () {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        console.log('✅ Firebase inicializado com sucesso!');
        // Carrega dados salvos
        loadContributionsFromFirebase();
    } else {
        console.warn('⚠️ Firebase SDK não carregado');
    }
})();

// Função para salvar contribuição no Firebase
function saveContributionToFirebase(giftIndex, contribution) {
    if (!db) {
        console.warn('Firebase não disponível');
        return Promise.reject('Firebase não disponível');
    }

    return db.collection('contributions').add({
        giftIndex: giftIndex,
        giftTitle: giftList[giftIndex]?.title || 'Presente',
        donorName: contribution.name,
        amount: contribution.amount,
        date: contribution.date,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then((docRef) => {
        console.log('✅ Contribuição salva no Firebase:', docRef.id);
        return docRef;
    }).catch((error) => {
        console.error('❌ Erro ao salvar no Firebase:', error);
        throw error;
    });
}

// Função para carregar contribuições do Firebase
function loadContributionsFromFirebase() {
    if (!db) {
        console.warn('Firebase não disponível para carregar dados');
        return;
    }

    db.collection('contributions').orderBy('timestamp', 'desc').get()
        .then((querySnapshot) => {
            console.log(`📥 Carregando ${querySnapshot.size} contribuições do Firebase...`);

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const giftIndex = data.giftIndex;

                if (giftIndex !== undefined && giftList[giftIndex]) {
                    const gift = giftList[giftIndex];

                    // Inicializa se necessário
                    if (!gift.contributed) gift.contributed = 0;
                    if (!gift.contributors) gift.contributors = [];

                    // Verifica se já existe (evita duplicatas)
                    const exists = gift.contributors.some(c =>
                        c.name === data.donorName &&
                        c.amount === data.amount &&
                        c.date === data.date
                    );

                    if (!exists) {
                        gift.contributed += data.amount;
                        gift.contributors.push({
                            name: data.donorName,
                            amount: data.amount,
                            date: data.date
                        });
                    }
                }
            });

            // Re-renderiza os cards com os dados carregados
            renderCards();
            console.log('✅ Dados do Firebase carregados com sucesso!');
        })
        .catch((error) => {
            console.error('❌ Erro ao carregar do Firebase:', error);
        });
}

// Inicializa EmailJS
(function () {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        console.log('✅ EmailJS inicializado com sucesso!');
    } else {
        console.warn('⚠️ EmailJS SDK não carregado');
    }
})();

// Função para enviar email de notificação
function sendNotificationEmail(giftName, donorName, amount) {
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS não disponível');
        return Promise.reject('EmailJS não disponível');
    }

    const templateParams = {
        gift_name: giftName,
        donor_name: donorName,
        amount: amount.toFixed(2).replace('.', ','),
        date: new Date().toLocaleString('pt-BR')
    };

    return emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams
    ).then(function (response) {
        console.log('✅ Email enviado com sucesso!', response);
        return response;
    }).catch(function (error) {
        console.error('❌ Erro ao enviar email:', error);
        throw error;
    });
}

// Variável global para armazenar o índice do presente atual
let currentGiftIndex = null;

// Função para gerar código PIX EMV (BR Code)
function generatePixCode(valor, descricao) {
    const chavePix = PIX_CONFIG.chavePix;
    const nomeRecebedor = PIX_CONFIG.nomeRecebedor.substring(0, 25);
    const cidade = PIX_CONFIG.cidade.substring(0, 15);

    // Formata valor para 2 casas decimais
    const valorFormatado = valor.toFixed(2);

    // Monta o payload conforme especificação BR Code/PIX
    let payload = '';

    // Payload Format Indicator
    payload += '000201';

    // Merchant Account Information - PIX
    const gui = '0014BR.GOV.BCB.PIX';
    const chave = '01' + String(chavePix.length).padStart(2, '0') + chavePix;
    const mai = gui + chave;
    payload += '26' + String(mai.length).padStart(2, '0') + mai;

    // Merchant Category Code
    payload += '52040000';

    // Transaction Currency (986 = BRL)
    payload += '5303986';

    // Transaction Amount
    if (valor > 0) {
        payload += '54' + String(valorFormatado.length).padStart(2, '0') + valorFormatado;
    }

    // Country Code
    payload += '5802BR';

    // Merchant Name
    payload += '59' + String(nomeRecebedor.length).padStart(2, '0') + nomeRecebedor;

    // Merchant City
    payload += '60' + String(cidade.length).padStart(2, '0') + cidade;

    // Additional Data Field (Transaction ID)
    const txId = '***'; // ID da transação
    const addField = '05' + String(txId.length).padStart(2, '0') + txId;
    payload += '62' + String(addField.length).padStart(2, '0') + addField;

    // CRC16 Placeholder
    payload += '6304';

    // Calcula CRC16
    const crc = calculateCRC16(payload);
    payload += crc;

    return payload;
}

// Função para calcular CRC16 (CCITT-FALSE)
function calculateCRC16(str) {
    let crc = 0xFFFF;
    for (let i = 0; i < str.length; i++) {
        crc ^= str.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            if (crc & 0x8000) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc = crc << 1;
            }
        }
        crc &= 0xFFFF;
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
}

// Função para extrair valor numérico do campo formatado
function parseMoneyValue(str) {
    if (!str) return 0;
    // Remove "R$ " e pontos de milhar, substitui vírgula por ponto
    const cleaned = str.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
}

// Simula ir para pagamento (PIX)
window.showPixStep = function () {
    console.log("Clique detectado em showPixStep");

    const elName = document.getElementById('contributor-name');
    const elAmount = document.getElementById('contribution-amount');

    // Remove estilos de erro anteriores
    elName.style.border = '';
    elAmount.style.border = '';

    let hasError = false;

    if (!elName || !elName.value.trim()) {
        elName.style.border = '2px solid red';
        hasError = true;
    }
    if (!elAmount || !elAmount.value.trim()) {
        elAmount.style.border = '2px solid red';
        hasError = true;
    }

    if (hasError) {
        if (!elName.value.trim()) {
            elName.focus();
            return; // Bloqueia se não preencheu
        }
        if (!elAmount.value.trim()) {
            elAmount.focus();
            return;
        }
    }

    // Obtém valores
    const nomeDoador = elName.value.trim();
    const valorContribuicao = parseMoneyValue(elAmount.value);

    if (valorContribuicao <= 0) {
        elAmount.style.border = '2px solid red';
        elAmount.focus();
        alert('Por favor, insira um valor válido para contribuição.');
        return;
    }

    // Gera código PIX
    const codigoPix = generatePixCode(valorContribuicao, nomeDoador);

    // Atualiza o campo de código PIX
    const pixCodeInput = document.getElementById('pix-code');
    if (pixCodeInput) {
        pixCodeInput.value = codigoPix;
    }

    // Gera QR Code usando API externa
    const qrCodeImg = document.getElementById('qr-code-img');
    if (qrCodeImg) {
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(codigoPix)}`;
        qrCodeImg.src = qrUrl;
    }

    // Mostra seção PIX
    const elPix = document.getElementById('pix-section');
    if (elPix) {
        elPix.classList.remove('hidden');
        // Força scroll suave para a seção do PIX
        setTimeout(() => {
            elPix.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }

    // Mostra aviso para lembrar de confirmar pagamento
    setTimeout(() => {
        alert('⚠️ IMPORTANTE!\n\nApós realizar o PIX, clique no botão "Confirmar Pagamento" para registrar sua contribuição! 💕');
    }, 500);

    console.log('PIX gerado para:', nomeDoador, 'Valor:', valorContribuicao);
}

// Função para copiar código PIX
window.copyPixCode = function () {
    const pixCodeInput = document.getElementById('pix-code');
    const feedback = document.getElementById('copy-feedback');

    if (pixCodeInput && pixCodeInput.value) {
        navigator.clipboard.writeText(pixCodeInput.value).then(() => {
            // Mostra feedback de copiado
            if (feedback) {
                feedback.classList.remove('hidden');
                setTimeout(() => {
                    feedback.classList.add('hidden');
                }, 2500);
            }

            // Muda texto do botão temporariamente
            const btnCopy = document.getElementById('btn-copy-pix');
            if (btnCopy) {
                const originalText = btnCopy.innerHTML;
                btnCopy.innerHTML = '✅ Copiado!';
                btnCopy.style.backgroundColor = '#22c55e';
                setTimeout(() => {
                    btnCopy.innerHTML = originalText;
                    btnCopy.style.backgroundColor = '';
                }, 2000);
            }
        }).catch(err => {
            console.error('Erro ao copiar:', err);
            // Fallback para browsers antigos
            pixCodeInput.select();
            document.execCommand('copy');
            if (feedback) {
                feedback.classList.remove('hidden');
                setTimeout(() => feedback.classList.add('hidden'), 2500);
            }
        });
    }
}

// Função para confirmar pagamento e atualizar card
window.confirmPayment = function () {
    const elName = document.getElementById('contributor-name');
    const elAmount = document.getElementById('contribution-amount');

    const nomeDoador = elName ? elName.value.trim() : 'Anônimo';
    const valorContribuicao = parseMoneyValue(elAmount ? elAmount.value : '0');

    if (currentGiftIndex !== null && giftList[currentGiftIndex]) {
        const gift = giftList[currentGiftIndex];

        // Inicializa campos se não existirem
        if (!gift.contributed) gift.contributed = 0;
        if (!gift.contributors) gift.contributors = [];

        // Adiciona contribuição
        gift.contributed += valorContribuicao;
        gift.contributors.push({
            name: nomeDoador,
            amount: valorContribuicao,
            date: new Date().toLocaleDateString('pt-BR')
        });

        // Atualiza a lista de contribuições no modal
        updateContributionsList(gift);

        // Salva contribuição no Firebase
        const contribution = {
            name: nomeDoador,
            amount: valorContribuicao,
            date: new Date().toLocaleDateString('pt-BR')
        };
        saveContributionToFirebase(currentGiftIndex, contribution)
            .then(() => {
                console.log('💾 Contribuição salva no Firebase!');
            })
            .catch((error) => {
                console.warn('⚠️ Não foi possível salvar no Firebase:', error);
            });

        // Re-renderiza os cards para atualizar valores
        renderCards();

        // Envia email de notificação para os noivos
        const giftTitle = gift.title || 'Presente';
        sendNotificationEmail(giftTitle, nomeDoador, valorContribuicao)
            .then(() => {
                console.log('📧 Email de notificação enviado!');
            })
            .catch((error) => {
                console.warn('⚠️ Não foi possível enviar email, mas a contribuição foi registrada:', error);
            });

        // Mostra mensagem de sucesso
        alert(`🎉 Obrigado, ${nomeDoador}!\n\nSua contribuição de R$ ${valorContribuicao.toFixed(2).replace('.', ',')} foi registrada com sucesso!\n\nOs noivos agradecem de coração! 💕`);

        // Fecha modal
        const modal = document.getElementById('modal');
        if (modal) modal.classList.add('hidden');
    } else {
        alert('❌ Erro ao registrar contribuição. Por favor, tente novamente.');
    }
}

// Função para atualizar lista de contribuições no modal
function updateContributionsList(gift) {
    const listEl = document.getElementById('contributions-list');
    const noContribEl = document.querySelector('.no-contributions');

    if (gift.contributors && gift.contributors.length > 0) {
        if (noContribEl) noContribEl.style.display = 'none';
        if (listEl) {
            listEl.classList.remove('hidden');
            listEl.innerHTML = '';
            gift.contributors.forEach(c => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${c.name}</strong> - R$ ${c.amount.toFixed(2).replace('.', ',')} <small>(${c.date})</small>`;
                listEl.appendChild(li);
            });
        }
    }
}

// Fechar modal
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        if (modal) modal.classList.add('hidden');
        document.body.style.overflow = '';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        if (modal) modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
});

// Mascara valor
const elAmount = document.getElementById('contribution-amount');
if (elAmount) {
    elAmount.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, "");
        value = (value / 100).toFixed(2) + "";
        value = value.replace(".", ",");
        value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        e.target.value = "R$ " + value;
    });
}

// Inicializar Cards
renderCards();

// ============================================
// Animação Global Unificada (Corações, Presentes, Laços)
// ============================================

function createGlobalAnimation() {
    // Usa o container global
    let container = document.getElementById('hearts-container');

    // Se não existir, tenta criar ou usar fallback
    if (!container) {
        container = document.createElement('div');
        container.id = 'hearts-container';
        container.classList.add('hearts-container'); // Usa a mesma classe de antes
        document.body.prepend(container);
    }

    // Lista de ícones permitidos (Sem a sacola 🛍️)
    // \u2764 = Coração
    const icons = ['\u2764', '🎁', '🎀'];

    const itemCount = 30; // Quantidade de elementos flutuando

    for (let i = 0; i < itemCount; i++) {
        const item = document.createElement('div');
        item.classList.add('floating-heart'); // Reusa a classe de animação base

        // Escolhe um ícone aleatório
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
        item.innerHTML = randomIcon;

        // Posição horizontal aleatória
        item.style.left = Math.random() * 100 + 'vw';

        // Tamanho aleatório
        const size = Math.random() * 20 + 15 + 'px';
        item.style.fontSize = size;

        // Duração da animação aleatória (velocidade)
        const durationValue = Math.random() * 10 + 10; // 10 a 20s
        item.style.animationDuration = durationValue + 's';

        // Delay negativo = começa já animado (espalhado na tela)
        // Gera um valor entre -20s e 0s
        const delay = (Math.random() * 20 - 20) + 's';
        item.style.animationDelay = delay;

        // Variação de cor para ficar interessante (opcional, mas o CSS pode definir cor base)
        if (randomIcon === '\u2764') {
            item.style.color = '#e57373'; // Vermelho suave
        } else {
            item.style.opacity = '0.7'; // Presentes um pouco mais visíveis
            item.style.color = 'inherit'; // Mantém cor original do emoji
        }

        container.appendChild(item);
    }
}

// Inicia animações ao carregar
createGlobalAnimation();


