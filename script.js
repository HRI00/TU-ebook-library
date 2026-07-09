const grid = document.getElementById('grid');
const template = document.getElementById('cardTemplate');
const searchInput = document.getElementById('searchInput');
const resultCount = document.getElementById('resultCount');
const emptyState = document.getElementById('emptyState');
const sortButtons = document.querySelectorAll('.sort-btn');

let books = [];
let currentSort = 'downloads';
let currentQuery = '';

// 표지 이미지가 없는 책은 제목을 기반으로 은은한 색을 만들어 대체 표지로 씁니다.
function coverColor(title) {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 60 + 150; // 150~210: 청록~파랑 계열로 톤을 통일
  return `hsl(${hue} 32% 32%)`;
}

function formatCount(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

function render(list) {
  grid.innerHTML = '';
  list.forEach(book => {
    const node = template.content.cloneNode(true);
    const card = node.querySelector('.card');
    const cover = node.querySelector('.cover');
    card.href = `viewer.html?id=${encodeURIComponent(book.id)}`;

    if (book.cover) {
      cover.style.backgroundImage = `url(${book.cover})`;
      cover.style.backgroundSize = 'cover';
      cover.style.backgroundPosition = 'center';
    } else {
      cover.style.background = coverColor(book.title);
    }

    node.querySelector('.cover-title').textContent = book.title;
    node.querySelector('.title').textContent = book.title;
    node.querySelector('.author').textContent = book.author || '';
    grid.appendChild(node);
  });

  resultCount.textContent = `${list.length}권`;
  emptyState.hidden = list.length !== 0;
}

function applyFilters() {
  let list = books.filter(b => b.title.toLowerCase().includes(currentQuery.toLowerCase()));

  list.sort((a, b) => {
    if (currentSort === 'downloads') return (b.downloads || 0) - (a.downloads || 0);
    if (currentSort === 'date') return new Date(b.date) - new Date(a.date);
    if (currentSort === 'title') return a.title.localeCompare(b.title, 'ko');
    return 0;
  });

  render(list);
}

searchInput.addEventListener('input', e => {
  currentQuery = e.target.value.trim();
  applyFilters();
});

sortButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    sortButtons.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    currentSort = btn.dataset.sort;
    applyFilters();
  });
});

fetch('books.json')
  .then(res => res.json())
  .then(data => {
    books = data;
    applyFilters();
  })
  .catch(() => {
    resultCount.textContent = '도서 목록을 불러오지 못했어요';
  });
