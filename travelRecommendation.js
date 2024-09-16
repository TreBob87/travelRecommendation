// script.js

let recommendationsData = {};

document.addEventListener('DOMContentLoaded', () => {
    fetch('travel_recommendation_api.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            recommendationsData = data;
            // Optionally display all recommendations on page load
            // displayAllRecommendations();
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });

    // Add event listener to the Search button
    const searchButton = document.getElementById('search-button');
    searchButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent form submission
        performSearch();
    });

    // Add event listener to the Reset button
    const resetButton = document.querySelector('button[type="reset"]');
    resetButton.addEventListener('click', () => {
        const container = document.getElementById('recommendations-container');
        container.innerHTML = '';
        // Clear the search field
        document.getElementById('search-field').value = '';
    });
});

// Function to perform the search
function performSearch() {
    const searchInput = document.getElementById('search-field').value.toLowerCase().trim();

    if (!searchInput) {
        alert('Please enter a keyword to search.');
        return;
    }

    const container = document.getElementById('recommendations-container');
    container.innerHTML = '';

    let filteredRecommendations = [];

    if (searchInput === 'beach' || searchInput === 'beaches') {
        filteredRecommendations = recommendationsData.beaches || [];
    } else if (searchInput === 'temple' || searchInput === 'temples') {
        filteredRecommendations = recommendationsData.temples || [];
    } else if (searchInput === 'country' || searchInput === 'countries') {
        recommendationsData.countries.forEach(country => {
            const countryInfo = {
                name: country.name,
                imageUrl: country.cities[0].imageUrl,
                description: `Explore the beautiful country of ${country.name}.`,
                timeZone: country.cities[0].timeZone
            };
            filteredRecommendations.push(countryInfo);
        });
    } else {
        container.innerHTML = `<p>No results found for "${searchInput}". Please try "beach", "temple", or "country".</p>`;
        return;
    }

    if (filteredRecommendations.length >= 2) {
        displayRecommendations(filteredRecommendations);
    } else {
        container.innerHTML = `<p>Not enough results found for "${searchInput}".</p>`;
    }
}

// Function to display recommendations on the page
function displayRecommendations(recommendations) {
    const container = document.getElementById('recommendations-container');
    container.innerHTML = ''; // Clear existing content

    recommendations.forEach(item => {
        // Create elements
        const card = document.createElement('div');
        card.classList.add('recommendation-card');

        const img = document.createElement('img');
        img.src = item.imageUrl;
        img.alt = item.name;

        const name = document.createElement('h3');
        name.textContent = item.name;

        const description = document.createElement('p');
        description.textContent = item.description;

        // Create a time element
        const time = document.createElement('p');
        time.classList.add('local-time');

        // Get the current time in the specified time zone
        const options = {
            timeZone: item.timeZone,
            hour12: true,
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };
        const localTime = new Date().toLocaleTimeString('en-US', options);
        time.textContent = `Current time: ${localTime}`;

        // Append elements to the card
        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(description);
        card.appendChild(time);

        // Append card to the container
        container.appendChild(card);
    });
}
