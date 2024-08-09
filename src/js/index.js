import axios from 'axios';
import _ from 'lodash';
import "../css/style.css";

// API options for fetching new stories
const newStoriesOptions = {
  method: 'GET',
  url: `https://yc-hacker-news-official.p.rapidapi.com/newstories.json`,
  headers: {
    'x-rapidapi-key': process.env.RAPIDAPI_KEY,
    'x-rapidapi-host': 'yc-hacker-news-official.p.rapidapi.com'
  }
};

// Function to fetch news details by ID
async function fetchNewsDetails(id) {
  try {
    const response = await axios.request({
      method: 'GET',
      url: `https://yc-hacker-news-official.p.rapidapi.com/item/${id}.json`,
      headers: newStoriesOptions.headers
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching news details:', error);
    return null;
  }
}

let currentIndexNews = 0;
const newsPerPage = 10;
let newsIds = [];

// Function to fetch initial data (news IDs)
async function fetchData() {
  try {
    const response = await axios.request(newStoriesOptions);
    newsIds = response.data;
    loadNews(false);
  } catch (error) {
    console.error('Error fetching news:', error);
  }
}

// Function to create a news item HTML
function createNewsItem(news, index) {
  if (!news) return '';
  const title = _.get(news, 'title', 'No title available');
  const url = _.get(news, 'url', '#');
  const author = _.get(news, 'by', 'Unknown author');
  const time = _.get(news, 'time', 0);
  const date = new Date(time * 1000);
  const dateString = date.toLocaleDateString();
  const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `
    <li style="--animation-delay: ${index * 0.1}s">
      <a href="${url}" target="_blank" rel="noopener noreferrer">${title}</a>
      <p class="author">by <strong>${author}</strong></p>
      <p class="date">on ${dateString} at ${timeString}</p>
    </li>
  `;
}

// Combined function to load news items and handle more news
async function loadNews(isMore = false) {
  const newsDetails = await Promise.all(newsIds.slice(currentIndexNews, currentIndexNews + newsPerPage).map(fetchNewsDetails));
  if (isMore) {
    const newsContainer = document.createElement('div');
    newsContainer.classList.add('more-news-list_container');
    const indexParagraph = document.createElement('p');
    indexParagraph.classList.add('index');
    const startIndex = currentIndexNews + 1;
    const endIndex = Math.min(currentIndexNews + newsPerPage, newsIds.length);
    indexParagraph.textContent = `${startIndex}-${endIndex} of ${newsIds.length}`;
    newsContainer.appendChild(indexParagraph);
    const newsList = document.createElement('ul');
    newsList.innerHTML = newsDetails.map(createNewsItem).join('');
    newsContainer.appendChild(newsList);
    document.querySelector('.main').appendChild(newsContainer);
  } else {
    const newsContainer = document.querySelector('.news-list_container');
    const newsList = newsContainer.querySelector('.news-list');
    newsList.innerHTML += newsDetails.map(createNewsItem).join('');
  }
  currentIndexNews += newsPerPage;

  // Update visibility of "more" and "less" buttons
  updateButtonVisibility();
}

// Combined function to update button visibility
function updateButtonVisibility() {
  const moreButton = document.querySelector('.more');
  const lessButton = document.querySelector('.less');

  moreButton.style.display = currentIndexNews >= newsIds.length ? 'none' : 'block';
  lessButton.style.display = currentIndexNews > newsPerPage ? 'block' : 'none';
}

// Function to remove the last news list container
function removeLastNewsList() {
  const newsContainers = document.querySelectorAll('.more-news-list_container');
  if (newsContainers.length > 0) {
    newsContainers[newsContainers.length - 1].remove();
    currentIndexNews -= newsPerPage;
  }

  // Update visibility of "more" and "less" buttons
  updateButtonVisibility();
}

// Event listeners for "more" and "less" buttons
document.querySelector('.more').addEventListener('click', () => loadNews(true));
document.querySelector('.less').addEventListener('click', removeLastNewsList);

// Fetch initial data
fetchData();
