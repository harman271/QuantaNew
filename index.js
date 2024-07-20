window.addEventListener('load', () => {
  fetchData('https://api.worldnewsapi.com/top-news?source-country=in&language=en', 'India');
});

let count = 0;

async function fetchData(url, search) {
  count = 0;
  const container = document.getElementById('container');
  const searchresultspan = document.getElementById('searchresultspan');
  searchresultspan.innerText = count;
  const searcheditems = document.getElementById('searcheditems');
  searcheditems.innerText="";
  const apiKey = '2dd75c8da8ca46368966099abbe852a2';

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    container.innerHTML = '';

    if (data) {
      processNewsData(data, search);
    } else {
      console.error('No news data found.');
      searcheditems.innerText = 'No results found';
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function processNewsData(data, search){
  const container = document.getElementById('container');
  const searcheditems = document.getElementById('searcheditems');
  const searchresultspan = document.getElementById('searchresultspan');

  if (data.top_news){
  console.log(data);
    data.top_news.forEach(itemm => {
      itemm.news.forEach(item => {
        createNewsCard(item, search, container, searchresultspan, searcheditems);
      });
    });
  } else if (data.news) {
    data.news.forEach(item => {
      createNewsCard(item, search, container, searchresultspan, searcheditems);
    });
  } else {
    searcheditems.innerText = 'No results found';
  }
}

function createNewsCard(item, search, container, searchresultspan, searcheditems) {
  if (item.image && item.image !== "") {
    searcheditems.innerText = search;
    count++;
    searchresultspan.innerText = count;

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
    }
  }
});

function fetchNews(topics){
  if(topics=='home'){
    fetchData('https://api.worldnewsapi.com/top-news?source-country=in&language=en', 'India');
  }
  else{
    const url = `https://api.worldnewsapi.com/search-news?text=${topics}&language=en`;
    fetchData(url,topics);
  }
}
