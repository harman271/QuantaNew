window.addEventListener('load', () => {
  fetchData('home');
});

let count = 0;
const container = document.getElementById('container');
const searchresultspan = document.getElementById('searchresultspan');
const searcheditems = document.getElementById('searcheditems');
const loadingSpinner = document.getElementById('loading');

// Create sets to store unique titles and images
const uniqueTitles = new Set();
const uniqueImages = new Set();

async function fetchData(search) {
  count = 0;
  searchresultspan.innerText = count;
  loadingSpinner.style.display = 'block';
  
  try {
    const response = await fetch(`/fetchData?search=${encodeURIComponent(search)}`);
    const result = await response.json();

    loadingSpinner.style.display = 'none';

    console.log(result);

    if (result.success && result.data) {
      processNewsData(result.data, search);
    } else {
      console.error('No news data found.');
      alert("No results found");
      searcheditems.value = "";
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    alert("No results found");
  }
}

function processNewsData(data, search) {
  count = 0;
  container.innerHTML = '';

  if (data.top_news) {
    data.top_news.forEach(itemm => {
      itemm.news.forEach(item => {
        createNewsCard(item, search);
        searchresultspan.innerText = count;
      });
    });
  } else if (data.news) {
    data.news.forEach(item => {
      createNewsCard(item, search);
      searchresultspan.innerText = count;
    });
  } else {
    alert("No results found");
    searcheditems.value = "";
  }
}

function createNewsCard(item, search) {
  if (item.image) {
    // Check if the title or image already exists
    if (uniqueTitles.has(item.title) || uniqueImages.has(item.image)) {
      console.log(`Duplicate found: ${item.title}`);
      return; // Skip adding this card
    }

    searcheditems.innerText = search;

    const card = document.createElement('div');
    card.classList.add('card');

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('imagecontainer');

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.title;

    const anchor = document.createElement('a');
    anchor.href = item.url;
    anchor.target = '_blank';
    anchor.appendChild(img);

    img.onerror = () => {
      container.removeChild(card);
      count--;
      searchresultspan.innerText = count;
    };

    const content = document.createElement('div');
    content.classList.add('content');

    const title = document.createElement('div');
    title.classList.add('title');
    title.textContent = truncateText(item.title, 30);

    const description = document.createElement('div');
    description.classList.add('description');
    description.textContent = truncateText(item.text, 150);

    content.appendChild(title);
    content.appendChild(description);

    imageContainer.appendChild(anchor);
    card.appendChild(imageContainer);
    card.appendChild(content);
    container.appendChild(card);

    // Add title and image to the sets to track uniqueness
    uniqueTitles.add(item.title);
    uniqueImages.add(item.image);

    count++;
    searchresultspan.innerText = count;
  }
}

function truncateText(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

document.getElementById('searchInput').addEventListener('keypress', event => {
  if (event.key === 'Enter') {
    event.preventDefault();
    const query = event.target.value.trim();
    if (query) {
      fetchData(query);
    } else {
      alert("Enter some text");
      searcheditems.value = "";
    }
  }
});
