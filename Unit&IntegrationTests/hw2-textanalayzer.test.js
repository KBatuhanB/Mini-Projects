const textAnalayzer = require('./hw2-textanalayzer');

describe("Test TextAnalayzer",()=>{
    test("Normal sentence",()=>{
        let sentence = "Merhaba ben Batuhan, ben bilgisayar muhendisligi ogrencisiyim.";
        const result = textAnalayzer(sentence);
        expect(result).toEqual({
            wordsCount: 7,
            longestWord: { word: 'ogrencisiyim.', length: 13 },
            shortestWord: { word: 'ben', length: 3 },
            mostFrequentWord: { word: 'ben', count: 2 },
            textType: 'Mixed'
        });
    });

    test("Enter not string",()=>{
        let sentence = 12;
        try{
            const result = textAnalayzer(sentence);
            throw new Error("Hata yok!")
        }catch(error){
            expect(error.message).toBe("Must be string")
        }
    });

    test("Enter empty sentence",()=>{
        let sentence = "";
        try{
            const result = textAnalayzer(sentence);
            throw new Error("Hata yok!")
        }catch(error){
            expect(error.message).toBe("There is no input")
        }
    });

    test("Shortest word",()=>{
        let sentence ="bir iki uc dort";
        const result = textAnalayzer(sentence);
        expect(result.shortestWord).toEqual({length: 2, word: 'uc'});
    });

    test("longest word",()=>{
        let sentence ="bir iki uc dort";
        const result = textAnalayzer(sentence);
        expect(result.longestWord).toEqual({length: 4, word: 'dort'});
    });

    test("Most frequanted word",()=>{
        let sentence ="bir bir iki uc dort";
        const result = textAnalayzer(sentence);
        expect(result.mostFrequentWord).toEqual({word: "bir", count: 2});
    });

    test("Upper case sentence",()=>{
        let sentence ="UPPERCASE SENTENCE";
        const result = textAnalayzer(sentence);
        expect(result.textType).toBe("Uppercase");
    });

    test("Lower case sentence",()=>{
        let sentence ="lowercase sentence";
        const result = textAnalayzer(sentence);
        expect(result.textType).toBe("Lowercase");
    });
});