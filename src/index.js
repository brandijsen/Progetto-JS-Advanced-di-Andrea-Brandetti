import axios from 'axios';

// Funzione per ottenere i dettagli di una singola notizia
const fetchNewsDetails = async (id) => {
  const detailOptions = {
    method: 'GET',
    url: `https://${process.env.RAPIDAPI_HOST}/item/${id}.json`,
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': process.env.RAPIDAPI_HOST
    }
  };
  try {
    const response = await axios.request(detailOptions);
    return response.data;
  } catch (error) {
    console.error('Error fetching news details:', error);
    return null;
  }
};

const fetchData = async () => {
  const options = {
    method: 'GET',
    url: `https://${process.env.RAPIDAPI_HOST}/newstories.json`,
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': process.env.RAPIDAPI_HOST
    }
  };

  try {
    const response = await axios.request(options);
    const newsIds = response.data.slice(0, 10); // Prendi i primi 10 ID delle notizie

    // Ottieni i dettagli delle notizie
    const newsPromises = newsIds.map(id => fetchNewsDetails(id));
    const newsDetails = await Promise.all(newsPromises);

    // Aggiorna il DOM con le notizie
    const newsList = document.getElementById('news-list');
    newsDetails.forEach(news => {
      if (news) {
        const newsItem = document.createElement('li');
        const newsLink = document.createElement('a');
        newsLink.href = news.url;
        newsLink.textContent = news.title;
        newsLink.target = "_blank"; // Apri il link in una nuova scheda
        newsItem.appendChild(newsLink);
        newsList.appendChild(newsItem);
      }
    });

  } catch (error) {
    console.error('Error fetching news:', error);
  }
};

fetchData();
