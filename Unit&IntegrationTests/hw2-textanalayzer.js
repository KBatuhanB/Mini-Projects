
function textAnalayzer(text){
    if(typeof text !== "string"){
        throw new Error("Must be string");
    }

    const words = text.split(" ").filter(word => word !== "");

    if(words.length == 0){
        throw new Error("There is no input");
    }

    const wordsCount = words.length;

    let longestWord = "";
    let shortestWord = words[0];
    let wordFrequency = {};
    let maxFrequency = 0;
    let mostFrequentWord = "";

    words.forEach(word => {
        if (word.length > longestWord.length) {
            longestWord = word;
        }
        if (word.length < shortestWord.length) {
            shortestWord = word;
        }

        if(wordFrequency[word]){
            wordFrequency[word]++;
        }else{
            wordFrequency[word] = 1;
        }

        if (wordFrequency[word] > maxFrequency) {
            maxFrequency = wordFrequency[word];
            mostFrequentWord = word;
        }
    });

    let textType;
    if (text === text.toUpperCase()) {
        textType = "Uppercase";
    } else if (text === text.toLowerCase()) {
        textType = "Lowercase";
    } else {
        textType = "Mixed";
    }

    return {
        wordsCount,
        longestWord: { word: longestWord, length: longestWord.length },
        shortestWord: { word: shortestWord, length: shortestWord.length },
        mostFrequentWord: { word: mostFrequentWord, count: maxFrequency },
        textType
    };
}


module.exports = textAnalayzer;