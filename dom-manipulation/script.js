const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteText = document.getElementById('newQuoteText').value;
const newQuoteCategory = document.getElementById('newQuoteCategory').value;
const quotes = [
    {text: "When you give complete editorial control of your life to Him, possible becomes the plotline", category: "Life" },
    {text: "Hope your blessings are on hold until you're aligned with your destiny, so you don't miss out on them", category: "Life"},
    {text: "A winner is a loser that tried one more time ", category: "Motivational"},
    {text: "You need to remember that the world is bigger than our world and the possibilities are bigger than our experiences", category: "Motivational"},
];

showRandomQuote =>{
    const randomIndex = Math.floor(Math.random()* quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`
}

// createAddQuoteForm =>{

// }

addQuote =>{
    if (newQuoteText && newQuoteCategory){
        quotes.push({text: newQuoteText, category: newQuoteCategory});
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCatefory').value = '';       
        alert('Quote added successfully');
    } else {
        alert('Please enter both a quote and a category');
    }    
}

document.getElementById('newQuoteText').addEventListener('click', showRandomQuote);
showRandomQuote();
