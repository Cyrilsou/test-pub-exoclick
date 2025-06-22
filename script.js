// script.js
function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomDate(maxDaysBack = 30) {
    const now = new Date();
    now.setDate(now.getDate() - Math.floor(Math.random() * maxDaysBack));
    // Format français « 15 juillet 2024 »
    return now.toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
}

const loremSentences = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Integer semper, risus vitae pharetra efficitur, erat erat gravida libero, sit amet vehicula purus lorem non magna.",
    "Suspendisse potenti. Curabitur non bibendum justo.",
    "Aenean tincidunt augue eget mi pulvinar, nec volutpat nisl ullamcorper.",
    "Proin finibus augue sit amet lectus feugiat, non dictum nisi gravida.",
    "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.",
    "Nam ac ligula id magna feugiat imperdiet.",
    "Quisque feugiat augue eget tortor ultricies, sed faucibus leo hendrerit.",
    "Donec vitae lorem blandit, sollicitudin lorem sed, aliquet metus.",
    "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
];

function generateLoremSentences(count = 4) {
    let txt = '';
    for (let i = 0; i < count; i++) {
        txt += getRandomItem(loremSentences) + ' ';
    }
    return txt.trim();
}

// Constantes images
const IMG_W = 400;
const IMG_H = 240;

function generateRandomArticles(count = 40) {
    const titleStarts = ['Révolution', 'Exploration', 'Analyse', 'Découverte', 'Avenir', 'Comparatif', 'Guide', 'Test', 'Dossier', 'Décryptage'];
    const titleSubjects = ['de l\'IA', 'du Web3', 'des Smartphones', 'de la Cybersécurité', 'du Cloud Gaming', 'du Métaverse', 'des Réseaux 6G', 'des Voitures autonomes', 'des Objets connectés', 'de la Réalité Virtuelle'];
    const subjectKeywords = {
        "de l'IA": 'artificial-intelligence',
        'du Web3': 'blockchain',
        'des Smartphones': 'smartphone',
        'de la Cybersécurité': 'cybersecurity',
        'du Cloud Gaming': 'cloud-gaming',
        'du Métaverse': 'metaverse',
        'des Réseaux 6G': '6g',
        'des Voitures autonomes': 'self-driving-car',
        'des Objets connectés': 'iot',
        'de la Réalité Virtuelle': 'virtual-reality'
    };
    const authors = ['Jean Dupont', 'Marie Curie', 'Pierre Martin', 'Sophie Durand', 'Marc Robert'];
    const categories = ['Actualités', 'Dossiers', 'Tests'];

    const generated = [];
    for (let i = 0; i < count; i++) {
        const subject = getRandomItem(titleSubjects);
        const title = `${getRandomItem(titleStarts)} ${subject}`;
        const category = getRandomItem(categories);
        const author = getRandomItem(authors);
        const date = generateRandomDate();
        const keyword = subjectKeywords[subject] || category.toLowerCase();
        const imageUrl = `https://source.unsplash.com/${IMG_W}x${IMG_H}/?${encodeURIComponent(keyword)}`;
        const content = generateLoremSentences(6);
        generated.push({ title, category, author, date, imageUrl, content });
    }
    return generated;
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("Le site de test est prêt ! Chargement du contenu dynamique.");

    const articles = generateRandomArticles(80); // Génère 80 articles par session

    // Recherche du conteneur principal : priorité à #main-content, sinon le premier <main>
    const mainContent = document.getElementById('main-content') || document.querySelector('main');
    if (mainContent) {
        const path = window.location.pathname.split("/").pop();
        let articlesToRender = [];
        let pageTitle = '';

        const shuffleArray = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        if (path === 'index.html' || path === '') {
            articlesToRender = shuffleArray([...articles]);
            pageTitle = 'Les Derniers Articles';
        } else if (path === 'actualites.html') {
            articlesToRender = articles.filter(a => a.category === 'Actualités');
            pageTitle = 'Toutes les Actualités';
        } else if (path === 'dossiers.html') {
            articlesToRender = articles.filter(a => a.category === 'Dossiers');
            pageTitle = 'Nos Dossiers Approfondis';
        } else if (path === 'tests.html') {
            articlesToRender = articles.filter(a => a.category === 'Tests');
            pageTitle = 'Nos Derniers Tests Produits';
        }
        
        renderPage(mainContent, articlesToRender, pageTitle);
    }

    // Gestion du bandeau de cookies
    const cookieBanner = document.getElementById('cookie-consent-banner');
    const acceptCookieBtn = document.getElementById('accept-cookie');

    if (cookieBanner && acceptCookieBtn) {
        if (!getCookie('cookie_consent_accepted')) {
            setTimeout(() => {
                cookieBanner.classList.add('active');
            }, 2000);
        }

        acceptCookieBtn.addEventListener('click', () => {
            setCookie('cookie_consent_accepted', 'true', 365);
            cookieBanner.classList.remove('active');
        });
    }

    // === Insertion dynamique de nouveaux emplacements pub ===
    insertSidebarHalfPageAd();
    setTimeout(insertFloatingAd, 4000);
});

function renderPage(container, articles, title) {
    container.innerHTML = `
        <div id="leaderboard-ad-container" class="ad-placeholder ad-leaderboard">
            Publicité Leaderboard 970x250
        </div>
        <h2>${title}</h2>
    `;

    const articlesContainer = document.createElement('div');
    container.appendChild(articlesContainer);

    if (articles.length === 0) {
        articlesContainer.innerHTML = '<p>Aucun article à afficher dans cette catégorie pour le moment.</p>';
        return;
    }

    articles.forEach((article, index) => {
        const articleEl = document.createElement('article');

        const adHtml = `
            <div class="ad-placeholder ad-in-article">
                Publicité In-Article 300x250
            </div>
        `;

        const firstSentenceEnd = article.content.indexOf('.') + 1;
        let contentP1 = '';
        let contentP2 = '';

        if (firstSentenceEnd > 0 && firstSentenceEnd < article.content.length) {
            contentP1 = article.content.substring(0, firstSentenceEnd);
            contentP2 = article.content.substring(firstSentenceEnd).trim();
        } else {
            contentP1 = article.content;
        }

        const fallbackUrl = `https://picsum.photos/seed/${encodeURIComponent(article.title.replace(/\s+/g, '-'))}/${IMG_W}/${IMG_H}`;

        const articleBodyHtml = `
            <p>${contentP1}</p>
            ${contentP2 ? adHtml + `<p>${contentP2}</p>` : ''}
        `;

        articleEl.innerHTML = `
            <img src="${article.imageUrl}" alt="Image pour ${article.title}" onerror="this.onerror=null;this.src='${fallbackUrl}';" loading="lazy">
            <div class="article-content">
                <div class="article-meta">
                    <span>Par <strong>${article.author}</strong></span>
                    <span>Le ${article.date}</span>
                    <span>Catégorie : <a href="${article.category.toLowerCase()}.html">${article.category}</a></span>
                </div>
                <h2>${article.title}</h2>
                ${articleBodyHtml}
                <a href="#" class="read-more">Lire la suite...</a>
                <div class="social-share">
                    <span>Partager :</span>
                    <a href="#" title="Partager sur Facebook"><img src="https://img.icons8.com/color/32/000000/facebook-new.png" alt="Facebook"></a>
                    <a href="#" title="Partager sur Twitter"><img src="https://img.icons8.com/color/32/000000/twitter--v1.png" alt="Twitter"></a>
                    <a href="#" title="Partager sur LinkedIn"><img src="https://img.icons8.com/color/32/000000/linkedin.png" alt="LinkedIn"></a>
                </div>
            </div>
        `;
        articlesContainer.appendChild(articleEl);

        // Insérer une publicité rectangulaire tous les 3 articles
        if ((index + 1) % 3 === 0) {
            const adEl = document.createElement('div');
            adEl.className = 'ad-placeholder';
            adEl.style.width = '300px';
            adEl.style.height = '250px';
            adEl.style.margin = '30px auto';
            adEl.innerHTML = 'Publicité 300x250';
            articlesContainer.appendChild(adEl);
        }
    });
}

// Fonctions utilitaires pour les cookies
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// === Insertion dynamique de nouveaux emplacements pub ===
function insertSidebarHalfPageAd() {
    const sidebar = document.querySelector('aside');
    if (!sidebar) return;
    // Ne pas ajouter si déjà présent
    if (sidebar.querySelector('.ad-halfpage')) return;

    const widget = document.createElement('div');
    widget.className = 'widget';
    widget.innerHTML = `
        <h3>Publicité Premium</h3>
        <div class="ad-placeholder ad-halfpage">Demi-page 300x600</div>
    `;
    // On place la demi-page après la première publicité, sinon en tête
    const firstWidget = sidebar.querySelector('.widget');
    if (firstWidget && firstWidget.nextSibling) {
        sidebar.insertBefore(widget, firstWidget.nextSibling);
    } else {
        sidebar.appendChild(widget);
    }
}

function insertFloatingAd() {
    if (document.querySelector('.floating-ad')) return; // déjà présent
    const floating = document.createElement('div');
    floating.className = 'ad-placeholder floating-ad';
    floating.innerHTML = `
        <span class="floating-ad-close" title="Fermer">&times;</span>
        Bannière flottante 300x250
    `;
    document.body.appendChild(floating);
    const closeBtn = floating.querySelector('.floating-ad-close');
    closeBtn.addEventListener('click', () => {
        floating.classList.add('hidden');
    });
}

// Vous pourrez ajouter ici des scripts plus complexes pour le test de publicités,
// par exemple pour charger des publicités de manière dynamique ou pour simuler
// le comportement d'un utilisateur. 