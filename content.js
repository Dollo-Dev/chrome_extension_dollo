function createMemeButton() {
    console.log("Initializing createMemeButton...");
    const isProX = window.location.hostname.startsWith("pro.x.com");
    console.log("isProX:", isProX);
    if (isProX) {
        createButtonForProX();
    } else {
        createButtonForX();
    }
}

function createButtonForX() {
    console.log("createButtonForX called");

    const createOrShowButton = (targetDiv) => {
        if (!targetDiv) return console.log("No targetDiv found for x.com");
        if (targetDiv.querySelector('.meme-btn-container')) return console.log("Button already exists for x.com");

        const presentationDiv = targetDiv.querySelector('[role="presentation"]');
        if (!presentationDiv) return console.log("No presentation div found for x.com");

        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'meme-btn-container';
        buttonDiv.style.display = 'flex';
        buttonDiv.style.alignItems = 'center';
        buttonDiv.style.justifyContent = 'center';
        buttonDiv.style.margin = '0 8px';
        buttonDiv.style.cursor = 'pointer';
        buttonDiv.title = 'Insert meme';

        const img = document.createElement('img');
        img.src = chrome.runtime.getURL("dollo.png");
        img.width = 20;
        img.height = 20;
        img.style.cursor = "pointer";
        img.addEventListener('click', () => { console.log("Open modal x.com"); openMemeModal(); });

        buttonDiv.appendChild(img);
        presentationDiv.parentNode.insertBefore(buttonDiv, presentationDiv.nextSibling);
        console.log("Button added for x.com");
    };

    const addButtonToHome = () => {
        const targetDiv = document.querySelector('[data-testid="toolBar"]');
        if (targetDiv) createOrShowButton(targetDiv);
    };

    const observer = new MutationObserver(() => {
        addButtonToHome();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    addButtonToHome();
}

function createButtonForProX() {
    console.log("createButtonForProX called");

    const createOrShowButtonPro = (targetDiv) => {
        if (!targetDiv) return console.log("No targetDiv found for pro.x.com");
        if (targetDiv.querySelector('.meme-btn-container')) return console.log("Button already exists in this toolbar");

        const presentationDiv = targetDiv.querySelector('div[role="presentation"]');
        if (!presentationDiv) return console.log("No presentation div found in this toolbar");

        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'meme-btn-container';
        buttonDiv.style.display = 'flex';
        buttonDiv.style.alignItems = 'center';
        buttonDiv.style.justifyContent = 'center';
        buttonDiv.style.margin = '0 8px';
        buttonDiv.style.cursor = 'pointer';
        buttonDiv.title = 'Insert meme';

        const img = document.createElement('img');
        img.src = chrome.runtime.getURL("dollo.png");
        img.width = 20;
        img.height = 20;
        img.style.cursor = "pointer";
        img.addEventListener('click', () => { console.log("Open modal pro.x.com"); openMemeModal(); });

        buttonDiv.appendChild(img);
        presentationDiv.parentNode.insertBefore(buttonDiv, presentationDiv.nextSibling);
        console.log("Button added in this toolbar");
    };

    const addButtonToAllToolbars = () => {
        const toolbars = document.querySelectorAll('[data-testid="toolBar"]');
        if (!toolbars || toolbars.length === 0) return console.log("No toolbars found on pro.x.com");
        toolbars.forEach(toolbar => createOrShowButtonPro(toolbar));
    };

    const observer = new MutationObserver(() => {
        addButtonToAllToolbars();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    addButtonToAllToolbars();
}
// =================== INITIALIZE ===================
createMemeButton();

// =================== THEME DARK / LIGHT ===================
function applyThemeStyles() {
    const nightModeMatch = document.cookie.match(/night_mode=(\d+)/);
    const nightMode = nightModeMatch ? parseInt(nightModeMatch[1], 10) : 0;

    const modal = document.getElementById('meme-modal');
    const searchInput = document.getElementById('meme-search');
    const selectAllBtn = document.getElementById('select-all-btn');

    if (!modal) return;

    if (nightMode === 1) { // dark
        modal.style.backgroundColor = "#15202B";
        modal.style.color = "#ffffff";
        if (searchInput) searchInput.style.backgroundColor = "#15202B";
        if (searchInput) searchInput.style.color = "#ffffff";
        if (selectAllBtn) selectAllBtn.style.color = "#ffffff";
    } else if (nightMode === 2) { // darkdark
        modal.style.backgroundColor = "#000000";
        modal.style.color = "#ffffff";
        if (searchInput) searchInput.style.backgroundColor = "#000000";
        if (searchInput) searchInput.style.color = "#ffffff";
        if (selectAllBtn) selectAllBtn.style.color = "#ffffff";
    } else { // light
        modal.style.backgroundColor = "#ffffff";
        modal.style.color = "#000000";
        if (searchInput) searchInput.style.backgroundColor = "#ffffff";
        if (searchInput) searchInput.style.color = "#000000";
        if (selectAllBtn) selectAllBtn.style.color = "#000000";
    }
}

// =================== MODAL ===================
function openMemeModal() {
    if (document.getElementById('meme-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'meme-modal';
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.padding = '20px';
    modal.style.zIndex = '10000';
    modal.style.maxHeight = '70%';
    modal.style.overflowY = 'auto';
    modal.style.borderRadius = '10px';
    modal.style.boxShadow = '0px 4px 20px rgba(0,0,0,0.2)';

    // ---------- CLOSE BUTTON ----------
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.float = 'right';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.background = 'transparent';
    closeBtn.style.border = 'none';
    closeBtn.style.fontSize = '20px';
    closeBtn.style.color = '#2db37a';
    closeBtn.addEventListener('click', () => modal.remove());
    modal.appendChild(closeBtn);

    // ---------- FILTER CONTAINER ----------
    const filterContainer = document.createElement('div');
    filterContainer.style.display = 'flex';
    filterContainer.style.gap = '5px';
    filterContainer.style.marginBottom = '10px';
    filterContainer.id = 'filter-container';

    const selectAllBtn = document.createElement('button');
    selectAllBtn.textContent = 'Unselect All';
    selectAllBtn.id = 'select-all-btn';
    selectAllBtn.style.cursor = 'pointer';
    selectAllBtn.style.background = 'transparent';
    selectAllBtn.style.border = 'none';
    selectAllBtn.style.color = 'black';
    selectAllBtn.style.marginRight = '30px';
    selectAllBtn.dataset.state = 'all';
    filterContainer.appendChild(selectAllBtn);

    // Filtres
    const filters = ['Emote', 'Meme', '1/1', 'Gm', 'Gn'];
    filters.forEach(f => {
        const btn = document.createElement('button');
        btn.textContent = f;
        btn.style.cursor = 'pointer';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.padding = '5px 10px';
        btn.dataset.filter = f;
        btn.classList.add('filter-btn', 'selected');
        btn.style.background = '#2db37a';
        btn.style.color = '#fff';

        btn.addEventListener('click', () => {
            const isSelected = btn.classList.toggle('selected');
            btn.style.background = isSelected ? '#2db37a' : '#ccc';
            btn.style.color = isSelected ? '#fff' : '#666';
            renderMemes();
        });

        filterContainer.appendChild(btn);
    });

    selectAllBtn.addEventListener('click', () => {
        const allBtns = document.querySelectorAll('#filter-container button.filter-btn');
        const anySelected = Array.from(allBtns).some(b => b.classList.contains('selected'));
        const deselect = anySelected;
        allBtns.forEach(b => {
            b.classList.toggle('selected', !deselect);
            b.style.background = !deselect ? '#2db37a' : '#ccc';
            b.style.color = !deselect ? '#fff' : '#666';
        });
        selectAllBtn.textContent = deselect ? 'Select All' : 'Unselect All';
        selectAllBtn.dataset.state = deselect ? 'all' : 'none';
        renderMemes();
    });

    modal.appendChild(filterContainer);

    // ---------- SEARCH INPUT ----------
    const searchInput = document.createElement('input');
    searchInput.placeholder = 'Search...';
    searchInput.id = 'meme-search';
    searchInput.style.width = '100%';
    searchInput.style.marginBottom = '10px';
    searchInput.style.padding = '8px';
    searchInput.style.border = '1px solid #ccc';
    searchInput.style.borderRadius = '5px';
    searchInput.addEventListener('input', renderMemes);
    modal.appendChild(searchInput);

    // ---------- MEME CONTAINER ----------
    const memeContainer = document.createElement('div');
    memeContainer.id = 'meme-container';
    memeContainer.style.display = 'flex';
    memeContainer.style.flexWrap = 'wrap';
    modal.appendChild(memeContainer);

    document.body.appendChild(modal);

    // ---------- APPLY THEME ----------
    applyThemeStyles();

    // ---------- FETCH MEMES ----------
    let memesData = [];
    chrome.runtime.sendMessage({ action: "getMemes" }, response => {
        if (response.memes) {
            memesData = response.memes;
            renderMemes();
        } else {
            console.error(response.error);
        }
    });

    function renderMemes() {
        memeContainer.innerHTML = '';
        const activeFilters = Array.from(document.querySelectorAll('#filter-container button.filter-btn.selected')).map(b => b.dataset.filter);
        const query = searchInput.value.toLowerCase();
        const filteredMemes = memesData.filter(m =>
            activeFilters.length > 0 &&
            activeFilters.some(f => m.filtre.includes(f)) &&
            m.title.toLowerCase().includes(query)
        );

        if (filteredMemes.length === 0) {
            const noResult = document.createElement('div');
            noResult.textContent = 'No memes found';
            memeContainer.appendChild(noResult);
            return;
        }

        filteredMemes.forEach(meme => {
            const skeleton = document.createElement('div');
            skeleton.style.width = '100px';
            skeleton.style.height = '100px';
            skeleton.style.margin = '5px';
            skeleton.style.background = '#eee';
            skeleton.style.borderRadius = '8px';
            skeleton.className = 'skeleton';
            memeContainer.appendChild(skeleton);

            const img = document.createElement('img');
            img.src = meme.url;
            img.style.width = '100px';
            img.style.height = '100px';
            img.style.margin = '5px';
            img.style.cursor = 'pointer';
            img.style.objectFit = 'cover';
            img.title = meme.title;
            img.onload = () => skeleton.replaceWith(img);
            img.addEventListener('click', () => {
                insertMemeInTweet(meme.url);
                modal.remove();
            });
        });
    }
}

// =================== INSERT MEME ===================
function insertMemeInTweet(url) {
    waitForFileInput().then(fileInput => {
        chrome.runtime.sendMessage({ action: "downloadImage", url }, (res) => {
            if (!res || !res.array) return window.open(url, '_blank');
            try {
                const uint8 = new Uint8Array(res.array);
                const mimeType = res.type || guessMimeType(url);
                const extension = getExtensionFromMime(mimeType);
                const blob = new Blob([uint8], { type: mimeType });
                const file = new File([blob], "meme" + extension, { type: mimeType });

                const dt = new DataTransfer();
                dt.items.add(file);
                fileInput.files = dt.files;

                setTimeout(() => {
                    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                }, 50);
            } catch {
                window.open(url, '_blank');
            }
        });
    }).catch(() => window.open(url, '_blank'));
}

// =================== UTILITAIRES ===================
function waitForFileInput() {
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            const input = document.querySelector('input[type="file"][accept*="image"]');
            if (input) { clearInterval(interval); resolve(input); }
        }, 50);
        setTimeout(() => { clearInterval(interval); reject(); }, 5000);
    });
}

function guessMimeType(url) {
    if (url.endsWith(".png")) return "image/png";
    if (url.endsWith(".jpg") || url.endsWith(".jpeg")) return "image/jpeg";
    if (url.endsWith(".gif")) return "image/gif";
    return "application/octet-stream";
}

function getExtensionFromMime(mime) {
    switch(mime) {
        case "image/png": return ".png";
        case "image/jpeg": return ".jpg";
        case "image/gif": return ".gif";
        default: return "";
    }
}