<?php
// 도서별 다운로드 횟수를 downloads.json 파일 하나에 저장합니다.
// DB 설정 없이, PHP를 지원하는 일반 호스팅(호스트24 등)이면 바로 동작합니다.

header('Content-Type: application/json; charset=utf-8');

$dataFile = __DIR__ . '/downloads.json';
$bookId = isset($_GET['id']) ? preg_replace('/[^a-zA-Z0-9_\-]/', '', $_GET['id']) : '';

if ($bookId === '') {
    http_response_code(400);
    echo json_encode(['error' => 'missing id']);
    exit;
}

$counts = [];
if (file_exists($dataFile)) {
    $raw = file_get_contents($dataFile);
    $decoded = json_decode($raw, true);
    if (is_array($decoded)) {
        $counts = $decoded;
    }
}

if (!isset($counts[$bookId])) {
    $counts[$bookId] = 0;
}
$counts[$bookId] += 1;

// 여러 요청이 동시에 들어와도 안전하게 기록하기 위해 파일 잠금을 사용합니다.
$fp = fopen($dataFile, 'c+');
if ($fp && flock($fp, LOCK_EX)) {
    ftruncate($fp, 0);
    fwrite($fp, json_encode($counts));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
}

echo json_encode(['id' => $bookId, 'downloads' => $counts[$bookId]]);
