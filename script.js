(function() {
    const searchInput = document.getElementById('searchInput');
    const resultCard = document.getElementById('resultCard');
    const notFound = document.getElementById('notFound');

    // DOM elements for result fields
    const displayWord = document.getElementById('displayWord');
    const lemmaEl = document.getElementById('lemma');
    const rankEl = document.getElementById('rank');
    const wordFreqEl = document.getElementById('wordFreq');
    const lemmaFreqEl = document.getElementById('lemmaFreq');
    const posEl = document.getElementById('pos');
    const inputWordEl = document.getElementById('inputWord');

    let wordData = [];

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
        });

    // Search handler
    function search(query) {
        const trimmedQuery = query.trim().toLowerCase();
        if (!trimmedQuery) {
            resultCard.classList.remove('visible');
            notFound.classList.remove('visible');
            return;
        }

        const found = wordData.find(item => item.word.toLowerCase() === trimmedQuery);

        if (found) {
            // Populate the card
            displayWord.textContent = found.word;
            lemmaEl.textContent = found.lemma || '—';
            rankEl.textContent = found.lemRank || '—';
            wordFreqEl.textContent = found.wordFreq ? Number(found.wordFreq).toLocaleString() : '—';
            lemmaFreqEl.textContent = found.lemFreq ? Number(found.lemFreq).toLocaleString() : '—';
            posEl.textContent = found.PoS || '—';
            inputWordEl.textContent = found.word;

            resultCard.classList.add('visible');
            notFound.classList.remove('visible');
        } else {
            resultCard.classList.remove('visible');
            notFound.classList.add('visible');
        }
    }

    // Event listeners
    searchInput.addEventListener('input', (e) => search(e.target.value));
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') search(e.target.value);
    });
})();
