import axios from 'axios';
import "./style.css"


// Importa le immagini
import danGoldImg from './assets/images/dan-gold.jpg';
import alexandreDebieveImg from './assets/images/alexandre-debieve.jpg';
import arnoldFranciscaImg from './assets/images/arnold-francisca.jpg';
import antoineBeauvillainImg from './assets/images/antoine-beauvillain.jpg';
import alexKnightImg from './assets/images/alex-knight.jpg'
import antonPonomarevImg from './assets/images/anton-ponomarev.jpg'
import hansonLuImg from './assets/images/hanson-lu.jpg'
import lukeChesserImg from './assets/images/luke-chesser.jpg'
import nasaImg from './assets/images/nasa.jpg'
import thisisengineering1Img from './assets/images/thisisengineering1.jpg'
import thisisengineering2Img from './assets/images/thisisengineering2.jpg'
import thisisengineering3Img from './assets/images/thisisengineering3.jpg'

const page = document.body;

function createAndAppendElements(container, elements) {
elements.forEach(element => {
const el = document.createElement(element.type);
if (element.id) el.id = element.id;
if (element.className) el.className = element.className;
if (element.textContent) el.textContent = element.textContent;
if (element.src) el.src = element.src;
container.appendChild(el);
if (element.children) {
  createAndAppendElements(el, element.children);
}

});
}

// Define the structure for header, main section, and footer
const sections = [
{
type: 'header',
id: 'header',
children: [
{ type: 'h1', id: 'title', textContent: 'TechFeed' },
{ type: 'p', id: 'description', textContent: 'Discover the latest in technology with TechFeed. From groundbreaking innovations to emerging trends, stay informed and inspired by the ever-evolving world of tech. Explore new products, insightful analysis, and captivating stories, all at your fingertips.' },
//{ type: 'div', id: 'images-container' }
]
},
{
type: 'div',
id: 'images-container',
children: [
{ type: 'img', id: 'img1', src: danGoldImg },
{ type: 'img', id: 'img2', src: alexandreDebieveImg },
{ type: 'img', id: 'img3', src: arnoldFranciscaImg },
{ type: 'img', id: 'img4', src: antoineBeauvillainImg }
]
},
{
type: 'main',
id: 'main-section'
},
{
type: 'button',
id: 'btn',
textContent: 'Load More'
},
{
type: 'footer',
id: 'footer',
textContent: 'Andrea Brandetti Frontend Developer'
}
];

// Create and append the elements defined in the sections array
createAndAppendElements(page, sections);

const images = [
danGoldImg, alexandreDebieveImg, arnoldFranciscaImg, antoineBeauvillainImg,
alexKnightImg, antonPonomarevImg, hansonLuImg, lukeChesserImg,
nasaImg, thisisengineering1Img, thisisengineering2Img, thisisengineering3Img
];

function getRandomImage(excludeImages) {
let image;
do {
image = images[Math.floor(Math.random() * images.length)];
} while (excludeImages.includes(image));
return image;
}

function rotateImages() {
const imageElements = document.querySelectorAll('#images-container img');
const currentImages = Array.from(imageElements).map(img => img.src);

imageElements.forEach(img => {
const newImage = getRandomImage(currentImages);
img.src = newImage;
currentImages.push(newImage); // Keep track of images already in use
});
}

setInterval(rotateImages, 3000);






const options = {
  method: 'GET',
  url: `https://${process.env.RAPIDAPI_HOST}/newstories.json`,
  headers: {
    'x-rapidapi-key': process.env.RAPIDAPI_KEY,
    'x-rapidapi-host': process.env.RAPIDAPI_HOST
  }
};

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
