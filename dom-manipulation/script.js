const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const quotes = [
    {text: "When you give complete editorial control of your life to Him, possible becomes the plotline", category: "Life" },
    {text: "Hope your blessings are on hold until you're aligned with your destiny, so you don't miss out on them", category: "Life"},
    {text: "A winner is a loser that tried one more time", category: "Motivational"},
    {text: "You need to remember that the world is bigger than our world and the possibilities are bigger than our experiences", category: "Motivational"},
];

localStorage.setItem('quotes', JSON.stringify(quotes));

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


document.getElementById('newQuote').addEventListener('click', showRandomQuote);


showRandomQuote();


const addQuote = () => {
    // Use .value to get the values from input elements
    const newQuoteTextValue = newQuoteText.value;
    const newQuoteCategoryValue = newQuoteCategory.value;
    
    if (newQuoteTextValue && newQuoteCategoryValue) {
        quotes.push({text: newQuoteTextValue, category: newQuoteCategoryValue});
        localStorage.setItem('quotes', JSON.stringify(quotes));
        // Clear the input fields
        newQuoteText.value = '';
        newQuoteCategory.value = '';
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

document.getElementById('exportQuotes').addEventListener('click', quoteExports);

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
