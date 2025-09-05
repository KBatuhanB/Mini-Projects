const { addBook, takeBook, listBooks, library, libraryDB, setInputQueue, rl } = require('./hw3-library');


describe('Library Tests', () => {
    
    // Her testten önce veri yapısını sıfırlıyoruz.
    beforeEach(() => {
        libraryDB.data = {
            books: [
                { id: 1001, name: "Olasiliksiz" },
                { id: 1002, name: "Empati" }
            ]
        };
        // Test modunda inputQueue’yu resetleyelim.
        setInputQueue(null);
    });

    // Tüm testler tamamlandıktan sonra readline arayüzünü kapatıyoruz.
    afterAll(() => {
        rl.close();
    });

    describe('addBook fonksiyonu', () => {
        test('Geçersiz (sayısal olmayan) ID girilince hata fırlatıyor mu?', async () => {
            // GIVEN: addBook için ilk input "abc" veriyoruz.
            setInputQueue(["abc"]);

            // WHEN: addBook fonksiyonundan dönmesini beklediğimiz hatayı resulta atıyoruz.
            const result = addBook();

            // THEN: result'ta dönen hata ile beklediğimiz hata aynı mı diye kontrol ediyoruz.
            await expect(result).rejects.toThrow("Geçersiz ID! Lütfen sadece rakam girin.");
        });

        test('Aynı ID ile kitap eklenmeye çalışıldığında hata fırlatıyor mu?', async () => {
            // GIVEN: İlk prompt "1001" (zaten var), ikinci prompt "Test Book".
            setInputQueue(["1001", "Test Book"]);

            // WHEN: addBook fonksiyonunu çalıştırıyoruz ve hatanın gelmesini bekliyoruz.
            const result = addBook();

            // THEN: Hata mesajının doğru olup olmadığını kontrol ediyoruz.
            await expect(result).rejects.toThrow("Bu kitap zaten var!");
        });

        test('Doğru girdi verildiğinde kitap veri yapısına ekleniyor mu?', async () => {
            // GIVEN: İlk prompt "2001" (ID), ikinci prompt "New Book" (kitap adı), üçüncü prompt ENTER (boş string).
            setInputQueue(["2001", "New Book", ""]);

            // WHEN: addBook fonksiyonunu çalıştırıyoruz.
            await addBook();

            // THEN: Kitaplar listesine yeni kitabın eklenip eklenmediğini kontrol ediyoruz.
            const books = libraryDB.getBooks();
            expect(books).toContainEqual({ id: 2001, name: "New Book" });
        });
    });

    describe('takeBook fonksiyonu', () => {
        test('Geçersiz (sayısal olmayan) ID girilince hata fırlatıyor mu?', async () => {
            // GIVEN: Geçersiz ID "abc" veriyoruz.
            setInputQueue(["abc"]);

            // WHEN: takeBook fonksiyonunu çalıştırıyoruz ve hatayı bekliyoruz.
            const result = takeBook();

            // THEN: Hata mesajının doğru olduğunu kontrol ediyoruz.
            await expect(result).rejects.toThrow("Geçersiz ID! Lütfen sadece rakam girin.");
        });

        test('Mevcut olmayan bir kitap ID girildiğinde hata fırlatıyor mu?', async () => {
            // GIVEN: "9999" ID mevcut değil.
            setInputQueue(["9999"]);

            // WHEN: takeBook fonksiyonunu çalıştırıyoruz ve hatayı bekliyoruz.
            const result = takeBook();

            // THEN: Hata mesajının doğru olup olmadığını kontrol ediyoruz.
            await expect(result).rejects.toThrow("Böyle bir kitap bulunamadı!");
        });

        test('Doğru girdi verildiğinde kitap veri yapısından siliniyor mu?', async () => {
            // GIVEN: "1001" ID mevcut, son prompt için ENTER (boş string) veriyoruz.
            setInputQueue(["1001", ""]);

            // WHEN: takeBook fonksiyonunu çalıştırıyoruz.
            await takeBook();

            // THEN: Kitap veri yapısında "1001" ID'li kitabın silinip silinmediğini kontrol ediyoruz.
            const books = libraryDB.getBooks();
            expect(books.find(book => book.id === 1001)).toBeUndefined();
        });
    });

    describe('listBooks fonksiyonu', () => {
        test('Kitaplar doğru şekilde listeleniyor mu?', async () => {
            // GIVEN: İlk olarak kitap ekleyelim. ID: "2001", Ad: "New Book".
            setInputQueue(["2001", "New Book", ""]);
            await addBook();

            // WHEN: Kitaplar eklenince, libraryDB.getBooks() fonksiyonunu kontrol edelim.
            const books = libraryDB.getBooks();

            // THEN: Yeni kitabın ve mevcut kitapların listede olup olmadığını kontrol ediyoruz.
            expect(books).toContainEqual({ id: 2001, name: "New Book" });
            expect(books).toContainEqual({ id: 1001, name: "Olasiliksiz" });
            expect(books).toContainEqual({ id: 1002, name: "Empati" });
        });

        test('Kitaplar doğru şekilde siliniyor mu?', async () => {
            // GIVEN: "1001" ID'li "Olasiliksiz" kitabını sileceğiz."1002" ID'li "Empati" kitabını sileceğiz.
            setInputQueue(["1001", "", "1002", "", ""]);
            await takeBook();
            await takeBook();

            // WHEN: Kitaplar silindikten sonra, listBooks fonksiyonunu çalıştırıyoruz.
            await listBooks();
            const books = libraryDB.getBooks();

            // THEN: Kitaplar listesi boş olmalı.
            expect(books).toHaveLength(0);
        });
    });

    describe('Library ekranı (menu) testi', () => {
        test('Geçersiz menü seçimi yapıldığında hata mesajı gösteriliyor mu?', async () => {
            // GIVEN: Kullanıcı "5" gibi geçersiz bir seçenek giriyor.
            setInputQueue(["5"]);

            // WHEN: library fonksiyonunu çalıştırıyoruz ve hatayı bekliyoruz.
            const result = library();

            // THEN: Hata mesajı doğru şekilde gösterilmeli.
            await expect(result).rejects.toThrow("Geçersiz bir numara girişi!");
        });
    }); 
});