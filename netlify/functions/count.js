const { getStore } = require('@netlify/blobs');

// 도서별 다운로드 횟수를 Netlify Blobs(내장 저장소)에 기록합니다.
// 별도 DB 설정 없이, Netlify에 배포하면 자동으로 동작합니다.
exports.handler = async (event) => {
  const id = (event.queryStringParameters && event.queryStringParameters.id || '')
    .replace(/[^a-zA-Z0-9_-]/g, '');

  if (!id) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'missing id' }),
    };
  }

  const store = getStore('downloads');
  const current = (await store.get(id, { type: 'json' })) || 0;
  const next = current + 1;
  await store.setJSON(id, next);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, downloads: next }),
  };
};
