const params = new URLSearchParams(location.search);
const bookId = params.get('id');

const titleEl = document.getElementById('bookTitle');
const authorEl = document.getElementById('bookAuthor');
const frame = document.getElementById('pdfFrame');
const downloadBtn = document.getElementById('downloadBtn');
const countEl = document.getElementById('downloadCount');

let currentBook = null;

function formatCount(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

fetch('books.json')
  .then(res => res.json())
  .then(books => {
    currentBook = books.find(b => b.id === bookId);
    if (!currentBook) {
      titleEl.textContent = '책을 찾을 수 없어요';
      return;
    }
    titleEl.textContent = currentBook.title;
    authorEl.textContent = currentBook.author || '';
    frame.src = currentBook.file;
    countEl.textContent = formatCount(currentBook.downloads || 0);
  });

downloadBtn.addEventListener('click', async () => {
  if (!currentBook) return;

  // count.php가 있는 서버(PHP 지원 호스팅)에서는 실제 집계 파일에 기록됩니다.
  // 로컬 테스트 등 PHP가 없는 환경에서는 브라우저 저장소로 대체 집계합니다.
  let newCount = (currentBook.downloads || 0) + 1;
  try {
    const res = await fetch(`count.php?id=${encodeURIComponent(currentBook.id)}`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      newCount = data.downloads;
    } else {
      throw new Error('count.php unavailable');
    }
  } catch (e) {
    const key = `dl_${currentBook.id}`;
    const local = Number(localStorage.getItem(key) || 0) + 1;
    localStorage.setItem(key, local);
    newCount = (currentBook.downloads || 0) + local;
  }

  countEl.textContent = formatCount(newCount);

  const a = document.createElement('a');
  a.href = currentBook.file;
  a.download = '';
  document.body.appendChild(a);
  a.click();
  a.remove();
});
