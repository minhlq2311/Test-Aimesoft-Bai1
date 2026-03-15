self.onmessage = (e) => {

  const text = e.data;

  // kiểm tra ký tự hợp lệ
  if (!/^[a-zA-Z.,\s]+$/.test(text)) {
    return self.postMessage({ error: "Invalid characters in file" });
  }

  // chuẩn hóa text
  const words = text
    .toLowerCase()
    .replace(/[.,]/g, "")
    .split(/\s+/);

  const map = {};

  // đếm số lần xuất hiện
  words.forEach(word => {
    if (!word) return;
    map[word] = (map[word] || 0) + 1;
  });

  const uniqueCount = Object.keys(map).length;

  if (uniqueCount < 3) {
    return self.postMessage({
      error: "File must contain at least 3 different words"
    });
  }

  // lấy top 3
  const top3 = Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([word, count]) => ({ word, count }));

  self.postMessage({ uniqueCount, top3 });
};