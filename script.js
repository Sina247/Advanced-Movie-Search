const API_KEY = '3df474dc';
const searchForm = document.getElementById('searchForm');
const titleInput = document.getElementById('titleInput');
const typeSelect = document.getElementById('typeSelect');
const yearInput = document.getElementById('yearInput');
const results = document.getElementById('results');
const statusMessage = document.getElementById('statusMessage');

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const type = typeSelect.value;
  const year = yearInput.value.trim();

  if (!title) return;

  results.innerHTML = '';
  statusMessage.textContent = 'Loading...';

  try {
    let url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(title)}`;
    if (type) url += `&type=${type}`;
    if (year) url += `&y=${year}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.Response === 'True') {
      const movies = data.Search.slice(0, 25);
      const detailedMovies = await Promise.all(movies.map(m => fetchDetails(m.imdbID)));
      statusMessage.textContent = '';
      displayMovies(detailedMovies);
    }

    else {
      statusMessage.textContent = `❌ ${data.Error}`;
    }
  }

  catch (error) {
    statusMessage.textContent = '❌ Error fetching data. Please try again.';
  }
});

async function fetchDetails(imdbID) {
  const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=short`);
  const data = await res.json();
  return data;
}

function displayMovies(movies) {
  results.innerHTML = '';

  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.className = "bg-gray-800 rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105";

    movieCard.innerHTML = `
      <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x445?text=No+Image'}" alt="${movie.Title}" class="w-full h-64 object-cover" />

      <div class="p-4">
        <h2 class="text-lg font-semibold truncate" title="${movie.Title}">${movie.Title}</h2>

        <p class="text-sm text-gray-400">Year: ${movie.Year}</p>

        <p class="text-sm text-gray-400">Type: ${movie.Type}</p>

        <p class="text-sm text-gray-400">Genre: ${movie.Genre || 'N/A'}</p>

        <p class="text-sm text-yellow-400 font-semibold">IMDb: ${movie.imdbRating !== 'N/A' ? movie.imdbRating : '–'}</p>
      </div>
    `;

    results.appendChild(movieCard);
  });
}
