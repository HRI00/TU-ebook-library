# 전자책 서가 페이지

인터넷 아카이브 스타일을 참고한, 심플하고 화이트한 톤의 전자책/PDF 라이브러리 페이지입니다.

## 파일 구성

- `index.html` — 도서 목록 (검색 · 정렬 · 표지 · 다운로드 수 스탬프)
- `viewer.html` — 개별 도서 상세 + PDF 미리보기 + 다운로드
- `style.css` / `script.js` / `viewer.js` — 스타일과 동작
- `books.json` — **여기만 수정하면 됩니다.** 책 목록 데이터
- `count.php` — 다운로드 클릭 시 횟수를 서버에 실제로 기록 (DB 없이 JSON 파일에 저장)
- `downloads.json` — count.php가 자동 생성/갱신하는 집계 파일 (직접 수정할 필요 없음)
- `books/` — 실제 PDF 파일을 넣는 폴더 (현재는 데모용 임시 PDF)
- `covers/` — 실제 표지 이미지를 넣고 싶을 때 사용하는 폴더 (지금은 비워둬도 자동으로 색상 표지가 생성됩니다)

## 책 추가/수정하는 방법

`books.json`을 열어서 아래 형식으로 항목을 추가/수정하면 됩니다.

```json
{
  "id": "book07",
  "title": "책 제목",
  "author": "저자 또는 발행처",
  "file": "books/새파일.pdf",
  "cover": "",
  "date": "2026-07-01",
  "downloads": 0
}
```

- `cover`를 비워두면(`""`) 제목을 기반으로 색상 표지가 자동 생성됩니다.
- 실제 표지 이미지를 쓰려면 `covers/` 폴더에 이미지를 넣고 `"cover": "covers/파일명.jpg"`로 지정하세요.
- `id`는 각 책마다 겹치지 않게만 정하면 됩니다.

## 호스트24에 올리는 방법

1. 이 폴더 전체(`index.html`, `viewer.html`, `style.css`, `script.js`, `viewer.js`, `books.json`, `count.php`, `books/`, `covers/`)를 그대로 웹 루트(`public_html` 등)에 업로드
2. `books/` 폴더의 데모 PDF를 실제 PDF로 교체하고 `books.json`의 `file` 경로를 맞춰주기
3. 호스트24가 PHP를 지원한다면 `count.php`가 자동으로 동작해서 다운로드 수가 실제로 올라갑니다. (대부분의 일반 호스팅은 PHP 지원)
4. 기존 홈페이지 배너의 링크(href)를 이 페이지의 `index.html` 주소로 연결

## 로컬에서 미리 확인하는 방법

`fetch`로 `books.json`을 불러오기 때문에, 그냥 파일을 더블클릭해서 열면(`file://`) 브라우저 보안 정책 때문에 목록이 안 뜰 수 있습니다. 아래처럼 간단한 로컬 서버를 켜서 확인하세요.

```bash
cd ebook-library
python3 -m http.server 8000
```

그 다음 브라우저에서 `http://localhost:8000` 접속.
