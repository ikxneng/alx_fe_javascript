const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');

const quotes = [
    {text: "When you give complete editorial control of your life to Him, possible becomes the plotline", category: "Life" },
    {text: "Hope your blessings are on hold until you're aligned with your destiny, so you don't miss out on them", category: "Life"},
    {text: "A winner is a loser that tried one more time", category: "Motivational"},
    {text: "You need to remember that the world is bigger than our world and the possibilities are bigger than our experiences", category: "Motivational"},
];
const storedQuotes = localStorage.getItem('quotes');
if (storedQuotes){
    quotes = JSON.stringify(storedQuotes);
}

let conflicts = [];

const populateCategories= () => {
    const categories = ['all', ...new Set(quotes.map(quote => quote.category))];
    categoryFilter.innerHTML = categories.map(category => `<option value="${category}">${category}</option>`).join('');
    const savedCategory = localStorage.getItem('selectedCategory');
    if (savedCategory) {
        categoryFilter.value = savedCategory;
        filterQuotes();
    } else {
        showRandomQuote();
    }
};

const showRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
};

const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');

if (lastViewedQuote){
    const quote = JSON.parse(lastViewedQuote);
    quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
} else {
    showRandomQuote();
}

showRandomQuote();

const createAddQuoteForm = (parentElement) => {

    const quoteTextInput = document.createElement('input');
    quoteTextInput.type = 'text';
    quoteTextInput.id = 'newQuoteText';
    quoteTextInput.placeholder = 'Enter a new quote';


    const quoteCategoryInput = document.createElement('input');
    quoteCategoryInput.type = 'text';
    quoteCategoryInput.id = 'newQuoteCategory';
    quoteCategoryInput.placeholder = 'Enter quote category';

    const addQuoteButton = document.createElement('button');
    addQuoteButton.id = 'addQuoteButton';
    addQuoteButton.textContent = 'Add Quote';

    parentElement.appendChild(quoteTextInput);
    parentElement.appendChild(quoteCategoryInput);
    parentElement.appendChild(addQuoteButton);

    addQuoteButton.addEventListener('click', addQuote);
};

async function fetchQuotesFromServer() {

    try{
        await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify(newQuoteText),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
    });

    } catch (error){
        console.error('Error posting new quote:', error);
    }

}

const syncQuotes = async () => {
    console.log('Syncing quotes with server...');
    await fetchQuotes();
    console.log('Sync complete.');
};

const addQuote = () => {
    // Use .value to get the values from input elements
    const newQuoteTextValue = newQuoteText.value.trim();
    const newQuoteCategoryValue = newQuoteCategory.value.trim();
    
    if (newQuoteTextValue && newQuoteCategoryValue) {
        const newQuote = {text: newQuoteTextValue, category: newQuoteCategoryValue} 
        quotes.push(newQuote);
        localStorage.setItem('quotes', JSON.stringify(quotes));

        // Clear the input fields
        newQuoteText.value = '';
        newQuoteCategory.value = '';
        populateCategoryDropDown();
        alert('Quote added successfully');
     } else {
        alert('Please enter both a quote and a category');
    }

};

const quoteExports = () => {
    const quotesJson = JSON.stringify(quotes, null , 2);
    const blob = new Blob([quotesJson], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
};


function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }

  const filterQuotesByCategory = (category) => {
    return category === 'all' ? quotes : quotes.filter(quote => quote.category === category);
};

const displayNotification = (message) => {
    alert(message); 
};

const displayConflictNotification = (conflictCount) => {
    const userChoice = confirm(`${conflictCount} conflicts detected. Would you like to resolve them manually?`);
    if (userChoice) {
        displayConflictResolutionUI();
    } else {
        alert('Server data has been prioritized.');
    }
};

const displayConflictResolutionUI = () => {
    const conflictContainer = document.getElementById('conflictContainer');
    conflictContainer.innerHTML = conflicts.map((conflict, index) => `
        <div>
            <p>Conflict ${index + 1}:</p>
            <p><strong>Local:</strong> ${conflict.local.text} (${conflict.local.category})</p>
            <p><strong>Server:</strong> ${conflict.server.text} (${conflict.server.category})</p>
            <button onclick="resolveConflict(${index}, 'local')">Keep Local</button>
            <button onclick="resolveConflict(${index}, 'server')">Keep Server</button>
        </div>
    `).join('');
};

const resolveConflict = (index, choice) => {
    if (choice === 'local') {
        quotes = quotes.map(q => q.text === conflicts[index].server.text ? conflicts[index].local : q);
    }
    conflicts.splice(index, 1);
    if (conflicts.length === 0) {
        localStorage.setItem('quotes', JSON.stringify(quotes));
        alert('All conflicts resolved.');
        document.getElementById('conflictContainer').innerHTML = '';
    } else {
        displayConflictResolutionUI();
    }
};


const filterQuotes = () => {
    const selectedCategory = categoryFilter.value;
    localStorage.setItem('selectedCategory', selectedCategory);
    const filteredQuotes = filterQuotesByCategory(selectedCategory);
    if (filteredQuotes.length > 0) {
        quoteDisplay.innerHTML = filteredQuotes.map(quote => `<p>${quote.text}</p><p><em>${quote.category}</em></p>`).join('');
    } else {
        quoteDisplay.innerHTML = '<p>No quotes available for this category.</p>';
    }
};

document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('exportQuotes').addEventListener('click', quoteExports);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);

setInterval(syncQuotes, 60000);

populateCategoryDropDown();
