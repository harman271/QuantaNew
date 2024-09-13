window.addEventListener('contextmenu',event=>{
  alert("Right Click is not allowed");
  event.preventDefault();
})
window.addEventListener('load', () => {
  fetchNews('home');
});
var count = 0;
const apiKeys = ['7c3260f46aa74dd9b08f8cd8b5b5d942'];
let currentApiKeyIndex = 0;
const container = document.getElementById('container');
const searchresultspan = document.getElementById('searchresultspan');
const searcheditems = document.getElementById('searcheditems');
const loadingSpinner = document.getElementById('loading');

async function fetchData(url, search) {
  count = 0;
  searchresultspan.innerText = count;
  loadingSpinner.style.display = 'block';
  
  for (let attempt = 0; attempt < apiKeys.length; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-api-key': apiKeys[currentApiKeyIndex]
        }
      });

      if (!response.ok) {
        if (response.status === 401) {  
          console.warn(`Unauthorized for API key ${currentApiKeyIndex + 1}. Trying next key...`);
          currentApiKeyIndex = (currentApiKeyIndex + 1) % apiKeys.length;
          continue; 
        } else if (response.status === 402) { 
          console.warn(`Rate limit exceeded for API key ${currentApiKeyIndex + 1}. Trying next key...`);
          currentApiKeyIndex = (currentApiKeyIndex + 1) % apiKeys.length;
          continue; 
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      }
      const data = await response.json();
      container.innerHTML = '';
      loadingSpinner.style.display = 'none';

      if (data && (data.top_news || data.news)) {
        processNewsData(data, search);
        return;
      } else {
        console.error('No news data found.');
        loadingSpinner.style.display = 'none';
        searcheditems.innerText = '';
        alert("No results founds")
        searcheditems.value="";
        return;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      loadingSpinner.style.display = 'none';
      searcheditems.innerText = '';
      alert("No reults found");
      return;
    }
  }
}

function processNewsData(data, search) {
  count=0;
  if (data.top_news) {
    if(data.top_news==""){
      const url = 'https://api.worldnewsapi.com/search-news?text=India&language=en';
      fetchData(url,'India');
    }
    else{
    data.top_news.forEach(itemm => {
      itemm.news.forEach(item => {
        createNewsCard(item, search);
        searchresultspan.innerText = count;
      });
    });
  } 
}
  else if (data.news) {
    count=0;
    data.news.forEach(item => {
      createNewsCard(item, search);
      searchresultspan.innerText = count;
    });
  } else {
    searcheditems.innerText = '';
    alert("No results found");
    searcheditems.value="";
  }
}

function createNewsCard(item, search) {
  if (item.image && item.image !== '') {
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

    count++;
    searchresultspan.innerText = count;
  }
}
function truncateText(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

document.getElementById('searchInput').addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    const query = event.target.value.trim();
    if (query) {
      const url = `https://api.worldnewsapi.com/search-news?text=${query}&language=en`;
      fetchData(url, query);
    } else {
      alert("Enter some text");
      searcheditems.value="";
    }
  }
});

function fetchNews(topics){
  if(topics=='home'){
    fetchData('https://api.worldnewsapi.com/top-news?source-country=in&language=en', 'India');
  }
  else{
    const url = `https://api.worldnewsapi.com/search-news?text=${topics}&language=en&earliest-publish-date=2024-04-01`;
    fetchData(url,topics);
  }
}
