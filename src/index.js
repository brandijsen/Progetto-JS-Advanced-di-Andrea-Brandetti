import axios from 'axios';
import _ from 'lodash';
import "./style.css"

// Import images
import alexandreDebieveImg from './assets/images/alexandre-debieve.jpg';
import antoineBeauvillainImg from './assets/images/antoine-beauvillain.jpg';
import nasaImg from './assets/images/nasa.jpg';
import nasa2Img from './assets/images/nasa2.jpg';
import markusSpiskeImg from './assets/images/markus-spiske.jpg';

// Array of images for header background
const images = [alexandreDebieveImg, antoineBeauvillainImg, markusSpiskeImg, nasa2Img, nasaImg];
let currentIndex = 0;

// Function to update the header background image
const updateHeaderBackground = () => {
  document.querySelector('header').style.backgroundImage = `url(${images[currentIndex]})`;
  currentIndex = (currentIndex + 1) % images.length;
};

// Change header background image every 4 seconds
setInterval(updateHeaderBackground, 4000);
updateHeaderBackground();

// API options for fetching new stories
const newStoriesOptions = {
  method: 'GET',
  url: `https://${process.env.RAPIDAPI_HOST}/newstories.json`,
  headers: {
    'x-rapidapi-key': process.env.RAPIDAPI_KEY,
    'x-rapidapi-host': process.env.RAPIDAPI_HOST
  }
};

// Function to fetch news details by ID
const fetchNewsDetails = async (id) => {
  try {
    const response = await axios.request({
      method: 'GET',
      url: `https://${process.env.RAPIDAPI_HOST}/item/${id}.json`,
      headers: newStoriesOptions.headers
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching news details:', error);
    return null;
  }
};

let currentIndexNews = 0;
const newsPerPage = 10;
let newsIds = [];

// Function to fetch initial data (news IDs)
const fetchData = async () => {
  try {
    const response = await axios.request(newStoriesOptions);
    newsIds = response.data;
    loadNews();
  } catch (error) {
    console.error('Error fetching news:', error);
  }
};

// Function to create a news item HTML
const createNewsItem = (news) => {
  if (!news) return '';
  const { title = 'No title available', url = '#', by: author = 'Unknown author', time } = news;
  const date = new Date(time * 1000);
  const dateString = date.toLocaleDateString();
  const timeString = date.toLocaleTimeString();
  return `
    <li>
      <a href="${url}" target="_blank" rel="noopener noreferrer">${title}</a>
      <p class="author">by <strong>${author}</strong></p>
      <p>on ${dateString} at ${timeString}</p>
    </li>
  `;
};

// Function to load news items
const loadNews = async () => {
  const newsDetails = await Promise.all(newsIds.slice(currentIndexNews, currentIndexNews + newsPerPage).map(fetchNewsDetails));
  const newsContainer = document.querySelector('.news-list_container');
  const newsList = newsContainer.querySelector('.news-list');
  newsList.innerHTML += newsDetails.map(createNewsItem).join('');
  currentIndexNews += newsPerPage;

  // Update visibility of "more" and "less" buttons
  document.querySelector('.more').style.display = currentIndexNews >= newsIds.length ? 'none' : 'block';
  document.querySelector('.less').style.display = currentIndexNews > newsPerPage ? 'block' : 'none';
};

// Function to load more news items
const loadMoreNews = async () => {
  const newsDetails = await Promise.all(newsIds.slice(currentIndexNews, currentIndexNews + newsPerPage).map(fetchNewsDetails));
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

  currentIndexNews += newsPerPage;

  // Update visibility of "more" and "less" buttons
  document.querySelector('.more').style.display = currentIndexNews >= newsIds.length ? 'none' : 'block';
  document.querySelector('.less').style.display = 'block';
};

// Function to remove the last news list container
const removeLastNewsList = () => {
  const newsContainers = document.querySelectorAll('.more-news-list_container');
  if (newsContainers.length > 0) {
    newsContainers[newsContainers.length - 1].remove();
    currentIndexNews -= newsPerPage;
  }

  // Update visibility of "more" and "less" buttons
  document.querySelector('.less').style.display = newsContainers.length <= 1 ? 'none' : 'block';
  document.querySelector('.more').style.display = 'block';
};

// Event listeners for "more" and "less" buttons
document.querySelector('.more').addEventListener('click', loadMoreNews);
document.querySelector('.less').addEventListener('click', removeLastNewsList);

// Fetch initial data
fetchData();
