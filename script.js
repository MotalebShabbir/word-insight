(function() {
    const searchInput = document.getElementById('searchInput');
    const searchWrapper = document.getElementById('searchWrapper');
    const resultCard = document.getElementById('resultCard');
    const notFound = document.getElementById('notFound');
    const body = document.body;

    // DOM elements for result fields
    const displayWord = document.getElementById('displayWord');
    const lemmaEl = document.getElementById('lemma');
    const rankEl = document.getElementById('rank');
    const wordFreqEl = document.getElementById('wordFreq');
    const lemmaFreqEl = document.getElementById('lemmaFreq');
    const posEl = document.getElementById('pos');
    const inputWordEl = document.getElementById('inputWord');

    // Part of Speech mapping
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

    // Load JSON
    fetch('words.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            wordData = data;
        })
        .catch(error => {
            console.error('Failed to load words.json:', error);
            notFound.textContent = '⚠️ Could not load dictionary data. Please try again later.';
            notFound.classList.add('visible');
            body.classList.add('search-active'); // to show the area
            searchWrapper.classList.add('fixed');
        });

    // Activate fixed mode when input focused or has text
    function activateFixedMode() {
        if (!searchWrapper.classList.contains('fixed')) {
            searchWrapper.classList.add('fixed');
            body.classList.add('search-active');
        }
    }

    // Deactivate fixed mode only if input is empty and not focused (optional, you might keep it fixed)
    function deactivateFixedMode() {
        if (searchInput.value.trim() === '' && document.activeElement !== searchInput) {
            // Optional: return to centered state when input is cleared and loses focus
            // For better UX we can keep fixed once activated, but here we allow returning to center
            searchWrapper.classList.remove('fixed');
            body.classList.remove('search-active');
            resultCard.classList.remove('visible');
            notFound.classList.remove('visible');
        }
    }

    searchInput.addEventListener('focus', activateFixedMode);
    searchInput.addEventListener('input', activateFixedMode);
    searchInput.addEventListener('blur', deactivateFixedMode);

    // Search handler with debounce
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
        // Show loader or just wait
        debounceTimer = setTimeout(() => {
            performSearch(query);
        }, 300);
    });

    // Also handle enter key immediately (optional)
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            clearTimeout(debounceTimer);
            performSearch(searchInput.value);
        }
    });

    // If user clears input, hide results
    searchInput.addEventListener('input', (e) => {
        if (e.target.value.trim() === '') {
            resultCard.classList.remove('visible');
            notFound.classList.remove('visible');
        }
    });
})();
