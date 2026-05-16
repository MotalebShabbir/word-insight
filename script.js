(function() {
    const searchInput = document.getElementById('searchInput');
    const searchWrapper = document.getElementById('searchWrapper');
    const contentArea = document.getElementById('contentArea');
    const resultCard = document.getElementById('resultCard');
    const notFound = document.getElementById('notFound');
    const body = document.body;

    const displayWord = document.getElementById('displayWord');
    const lemmaEl = document.getElementById('lemma');
    const rankEl = document.getElementById('rank');
    const wordFreqEl = document.getElementById('wordFreq');
    const lemmaFreqEl = document.getElementById('lemmaFreq');
    const posEl = document.getElementById('pos');
    const inputWordEl = document.getElementById('inputWord');

    const posMap = {
        'a': 'Article',
        'c': 'Conjunction',
        'd': 'Determiner',
        'e': 'Existential there',
        'i': 'Preposition',
        'j': 'Adjective',
        'm': 'Number',
        'n': 'Noun',
        'p': 'Pronoun',
        'r': 'Adverb',
        'u': 'Interjection',
        'v': 'Verb',
        'x': 'Negation'
    };

    let wordData = [];
    let debounceTimer;

    fetch('words.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => { wordData = data; })
        .catch(error => {
            console.error('Failed to load words.json:', error);
            notFound.textContent = '⚠️ Could not load dictionary data. Please try again later.';
            notFound.classList.add('visible');
            body.classList.add('search-active');
            searchWrapper.classList.add('fixed');
            updateContentPadding();
        });

    // Dynamically adjust content area top padding based on fixed search bar height
    function updateContentPadding() {
        if (searchWrapper.classList.contains('fixed')) {
            const height = searchWrapper.offsetHeight;
            contentArea.style.paddingTop = height + 'px';
        } else {
            contentArea.style.paddingTop = '';
        }
    }

    function activateFixedMode() {
        if (!searchWrapper.classList.contains('fixed')) {
            searchWrapper.classList.add('fixed');
            body.classList.add('search-active');
            updateContentPadding();
        }
    }

    function deactivateFixedMode() {
        if (searchInput.value.trim() === '' && document.activeElement !== searchInput) {
            searchWrapper.classList.remove('fixed');
            body.classList.remove('search-active');
            resultCard.classList.remove('visible');
            notFound.classList.remove('visible');
            contentArea.style.paddingTop = '';
        }
    }

    searchInput.addEventListener('focus', activateFixedMode);
    searchInput.addEventListener('input', activateFixedMode);
    searchInput.addEventListener('blur', deactivateFixedMode);

    // On window resize, recalculate padding if fixed
    window.addEventListener('resize', () => {
        if (searchWrapper.classList.contains('fixed')) {
            updateContentPadding();
        }
    });

    function performSearch(query) {
        const trimmedQuery = query.trim().toLowerCase();
        if (!trimmedQuery) {
            resultCard.classList.remove('visible');
            notFound.classList.remove('visible');
            return;
        }
        const found = wordData.find(item => item.word.toLowerCase() === trimmedQuery);
        if (found) {
            displayWord.textContent = found.word;
            lemmaEl.textContent = found.lemma || '—';
            rankEl.textContent = found.lemRank || '—';
            wordFreqEl.textContent = found.wordFreq ? Number(found.wordFreq).toLocaleString() : '—';
            lemmaFreqEl.textContent = found.lemFreq ? Number(found.lemFreq).toLocaleString() : '—';
            posEl.textContent = posMap[found.PoS] || found.PoS || '—';
            inputWordEl.textContent = found.word;

            resultCard.classList.add('visible');
            notFound.classList.remove('visible');
        } else {
            resultCard.classList.remove('visible');
            notFound.classList.add('visible');
        }
    }

    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value;
        if (query.trim() === '') {
            resultCard.classList.remove('visible');
            notFound.classList.remove('visible');
            return;
        }
        debounceTimer = setTimeout(() => performSearch(query), 300);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            clearTimeout(debounceTimer);
            performSearch(searchInput.value);
        }
    });
})();
