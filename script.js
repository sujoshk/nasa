// Global constants
const resultsNav = document.getElementById('resultsNav');
const favouritesNav = document.getElementById('favouritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');




// NASA API
const count = 10;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];

// The reason for using an object is that instead of looping through an array, we can use the key value and directly delete the item
let favourites = {};



function showContent(page) {
    console.log('PAGE: ', page)
    window.scrollTo({ top: 0, behavior: 'instant'});
    if(page === 'results') {
        resultsNav.classList.remove('hidden');
        favouritesNav.classList.add('hidden');
    } else {
        resultsNav.classList.add('hidden');
        favouritesNav.classList.remove('hidden');
    }
    loader.classList.add('hidden');
}



function createdDOMNodes(page) {


    // Object.values() is a function that allows you to iterate over an objects properties similar to that of an array. forEach() cannot be used over an object. In order to do the same use forEach() over Object.value(insertobject)
    const currentArray = page === 'results' ? resultsArray : Object.values(favourites);


    console.log('Current Array: ', page, currentArray);
    currentArray.forEach((result) => {
        // Card Container 
        const card = document.createElement('div');
        card.classList.add('card');
        
        // Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';

        // Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA picture of the day';
        
        // Lazy loading to improve performance
        image.loading = 'lazy';
        image.classList.add('card-img-top');

        // Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        // Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;

        // Save text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if (page === 'results') {
            saveText.textContent = 'Add to favourites';
            saveText.setAttribute('onclick', `saveFavourite('${result.url}')`);
        } else {
            saveText.textContent = 'Remove favourite';
            saveText.setAttribute('onclick', `removeFavourite('${result.url}')`);
        }


        // Card Text
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;

        // Footer Container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        
        // Date
        const date = document.createElement('strong');
        date.textContent = result.date;

        // Copyright
        const copyright = document.createElement('span');
        copyright.textContent = `${result.copyright ? result.copyright : ''}`;


        // Append
        // Use append when adding multiple elements to the parent container. Use appendchild when adding single element to the parent.
        footer.append(date, copyright, );
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        imagesContainer.appendChild(card);
    
    });
}

function updateDOM(page) {


    // Get favourites form localStorage
    if(localStorage.getItem('nasaFavourites')) {
        favourites = JSON.parse(localStorage.getItem('nasaFavourites'));
        console.log('Favourites from localStorage: ',favourites);
    }

    imagesContainer.textContent = '';

    createdDOMNodes(page);
    showContent(page);

}

// Get 10 images from NASA api
async function getNasaPictures() {
    // Show loader
    loader.classList.remove('hidden');
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
       
        updateDOM('results');
    } catch(error) {
        // Catch error here
        console.log(error)
        
    }
}

// Add result to favourites
function saveFavourite(itemUrl) {
    
    // loop through results array to select favourite
    resultsArray.forEach((item) => {
        if(item.url.includes(itemUrl) && !favourites[itemUrl]) {
            favourites[itemUrl] = item;
            // Show save confirmation for 2 seconds
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);


            // Set favourites in local storage
            localStorage.setItem('nasaFavourites', JSON.stringify(favourites));
        }
    });
}


function removeFavourite(itemUrl) {
   if(favourites[itemUrl]) {
       delete favourites[itemUrl];
   }
   localStorage.setItem('nasaFavourites', JSON.stringify(favourites));
   updateDOM('favourites');
}


// On Load
getNasaPictures();