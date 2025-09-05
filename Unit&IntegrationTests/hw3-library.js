const readline = require('readline');

class LibraryDB {
  constructor() {
    // Başlangıç verilerini bir listede tutuyoruz
    this.data = {
      books: [
        { id: 1001, name: "Olasiliksiz" },
        { id: 1002, name: "Empati" }
      ]
    }
  }

  getBooks() {
    return this.data.books
  }

  addBook(book) {
    this.data.books.push(book)
  }

  removeBookById(id) {
    const index = this.data.books.findIndex(book => book.id === id)
    if (index === -1) return false
    this.data.books.splice(index, 1)
    return true
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const libraryDB = new LibraryDB();

// Test modunda, asenkron beklemeyi bypass etmek için kullanılacak cevap kuyruğu
let inputQueue = null;

/**
 * Test modunda, readline sorularına verilecek cevapları belirleyen diziyi ayarlar.
 * Üretim ortamında inputQueue boş (null) olduğunda normal readline çalışır.
 */
function setInputQueue(queue) {
    if (Array.isArray(queue)) {
        inputQueue = queue.slice();
    } else {
        inputQueue = null;
    }
}

async function ask(question) {
  if (inputQueue && inputQueue.length > 0) {
    // Test modunda: cevap hemen dönsün.
    return Promise.resolve(inputQueue.shift());
  } else {
    return new Promise(resolve => {
      rl.question(question, answer => resolve(answer));
    });
  }
}

async function library() {
  while (true) {
    console.clear();
    console.log("📚 KÜTÜPHANE MENÜSÜ\n1- Kitap Al\n2- Kitap Ver\n3- Kitapları Göster\n4- Çıkış");
    const choiceStr = await ask("Seciminiz: ");
    const choice = Number(choiceStr);
    isNumber(choice);

    switch (choice) {
      case 1:
        await takeBook();
        break;
      case 2:
        await addBook();
        break;
      case 3:
        await listBooks();
        break;
      case 4:
        console.log("Programdan çıkılıyor...");
        process.exit(0);
      default:
        throw new Error("Geçersiz bir numara girişi!");
    }
  }
}

async function addBook() {
  const idStr = await ask("Kitap ID'sini giriniz: ");
  const ID = Number(idStr);
  isNumber(ID);
  const bookName = await ask("Kitap adını giriniz: ");

  const existingBook = libraryDB.getBooks().find(book => book.id === ID);
  if (existingBook) {
    console.log("❗ Bu kitap zaten var!");
    throw new Error("Bu kitap zaten var!");
  } else {
    const book = { id: ID, name: bookName };
    libraryDB.addBook(book);
    console.log("✅ Kitap eklendi.");
  }
  await ask("Devam etmek için ENTER'a basınız...");
}

async function takeBook() {
  const idStr = await ask("Kitap ID'sini giriniz: ");
  const ID = Number(idStr);
  isNumber(ID);
  const success = libraryDB.removeBookById(ID);
  if (!success) {
    console.log("❗ Böyle bir kitap bulunamadı!");
    throw new Error("Böyle bir kitap bulunamadı!");
  } else {
    console.log("✅ Kitap silindi.");
  }
  await ask("Devam etmek için ENTER'a basınız...");
}

async function listBooks() {
  console.clear();
  const books = libraryDB.getBooks();
  if (books.length === 0) {
    console.log("📂 Kitap bulunamadı.");
  } else {
    console.log("📚 Kitaplar:");
    books.forEach(book => console.log(`ID: ${book.id}, Ad: ${book.name}`));
  }
  await ask("\nDevam etmek için ENTER'a basınız...");
}

function isNumber(ID) {
  if (isNaN(ID) || typeof ID !== 'number') {
    throw new Error("Geçersiz ID! Lütfen sadece rakam girin.");
  }
}

library();

module.exports = { library, addBook, takeBook, listBooks, libraryDB, ask, setInputQueue, rl };
