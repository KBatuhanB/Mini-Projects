const calculateCartTotal = require("./hw5-cart")

describe('calculateCartTotal', () => {
    test('should return zero values and empty items for an empty cart', () => {
        //GİVEN: boş array veriyoruz.
        const cartItem = ([]);

        //WHEN: fonksiyonu cagriyoruz.
        const result = calculateCartTotal(cartItem);

        //THEN: Degerlerın 0 olmasını bekliyoruz.
        expect(result).toEqual({
            total: 0,
            discountApplied: 0,
            finalTotal: 0,
            items: []
        })
    });

    test('should calculate total for a single item with name', () => {
        //GİVEN: bir item veriyoruz.
        const cartItem = ([{ name: "ItemName", price: 100 }]);

        //WHEN: fonksiyonu cagriyoruz.
        const result = calculateCartTotal(cartItem);

        //THEN: Total degerini kontrol ediyoruz.
        expect(result).toEqual({
            total: 100,
            discountApplied: 0,
            finalTotal: 100,
            items: [{ name: "ItemName", price: 100, quantity: 1, subtotal: 100 }]
        })
    });

    test('should calculate total with multiple items, quantities, and names', () => {
        //GİVEN: birden fazla item veriyoruz.
        const cartItem = ([
            { name: "ItemName1", price: 100, quantity: 2 },
            { name: "ItemName2", price: 200, quantity: 1 }
        ]);

        //WHEN: fonksiyonu cagriyoruz.
        const result = calculateCartTotal(cartItem);

        //THEN: Total degerini kontrol ediyoruz.
        expect(result).toEqual({
            total: 400,
            discountApplied: 0,
            finalTotal: 400,
            items: [
                { name: "ItemName1", price: 100, quantity: 2, subtotal: 200 },
                { name: "ItemName2", price: 200, quantity: 1, subtotal: 200 }
            ]
        })
    });

    test('should apply 10% discount with SAVE10 code and keep item details', () => {
        //GİVEN: bir item ve bir indirim kodu veriyoruz.
        const cartItem = ([{ name: "ItemName", price: 100, quantity: 4 }]);
        const discount = "SAVE10";

        //WHEN: fonksiyonu cagriyoruz.
        const result = calculateCartTotal(cartItem, discount);

        //THEN: toplam üzerinden %10 indirim uygulanmış olmalı.
        expect(result).toEqual({
            total: 400,
            discountApplied: 40,
            finalTotal: 360,
            items: [{ name: "ItemName", price: 100, quantity: 4, subtotal: 400 }]
        })
    });

    test('should apply 20% discount with save20 code and preserve names', () => {
        //GİVEN: bir item ve SAVE20 indirim kodu veriyoruz.
        const cartItem = ([
            { name: "ItemName1", price: 100, quantity: 2 },
            { name: "ItemName2", price: 200, quantity: 1 }
        ]);
        const discount = "SAVE20";

        //WHEN: fonksiyonu cagriyoruz.
        const result = calculateCartTotal(cartItem, discount);

        //THEN: toplam üzerinden %20 indirim uygulanmış olmalı.
        expect(result).toEqual({
            total: 400,
            discountApplied: 80,
            finalTotal: 320,
            items: [
                { name: "ItemName1", price: 100, quantity: 2, subtotal: 200 },
                { name: "ItemName2", price: 200, quantity: 1, subtotal: 200 }
            ]
        })
    });

    test('should apply shipping discount with FREESHIP for total >= 50', () => {
        //GİVEN: toplamı 50 ve üzerinde olan bir sepet ve FREESHIP indirim kodu veriyoruz.
        const cartItem = ([{ name: "ItemName", price: 30, quantity: 2 }]);
        const discount = "FREESHIP";

        //WHEN: fonksiyonu cagriyoruz.
        const result = calculateCartTotal(cartItem, discount);

        //THEN: FREESHIP indirim kodu ile sabit 10 TL indirim uygulanacağını varsayıyoruz.
        expect(result).toEqual({
            total: 60,
            discountApplied: 5,
            finalTotal: 55,
            items: [{ name: "ItemName", price: 30, quantity: 2, subtotal: 60 }]
        })
    });

    test('should not apply shipping discount with FREESHIP for total < 50', () => {
        //GİVEN: toplamı 50'den az olan bir sepet ve FREESHIP indirim kodu veriyoruz.
        const cartItem = ([{ name: "ItemName", price: 20, quantity: 2 }]);
        const discount = "FREESHIP";

        //WHEN: fonksiyonu cagriyoruz.
        const result = calculateCartTotal(cartItem, discount);

        //THEN: toplam 50'den az olduğu için FREESHIP indirim uygulanmamalı.
        expect(result).toEqual({
            total: 40,
            discountApplied: 0,
            finalTotal: 40,
            items: [{ name: "ItemName", price: 20, quantity: 2, subtotal: 40 }]
        })
    });

    test('should throw error for non-array input', () => {
        //GİVEN: dizi olmayan bir input veriyoruz.
        const cartItem = "bu bir dizi degil";
        
        //WHEN,THEN: fonksiyonu cagriyoruz ve hata bekliyoruz.
        expect(() => calculateCartTotal(cartItem)).toThrow('cartItems must be an array');
    });

    test('should throw error for item missing name', () => {
        //GİVEN: item objesinde name alanı bulunmuyor.
        const cartItem = ([{ price: 100, quantity: 1 }]);

        //WHEN,THEN: fonksiyonu cagriyoruz ve hata bekliyoruz.
        expect(() => calculateCartTotal(cartItem)).toThrow('Invalid item in cart: price and name are required');
    });

    test('should throw error for invalid price in cart', () => {
        //GİVEN: item objesinde price alani hatalı .
        const cartItem = ([{ name: "ItemName", price: -100, quantity: 1 }]);

        //WHEN: fonksiyonu cagriyoruz ve hata bekliyoruz.
        expect(() => calculateCartTotal(cartItem)).toThrow('Invalid item in cart: price and name are required');
    });
});
