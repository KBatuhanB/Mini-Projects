
function isNumber(a,b){
    if(typeof a != 'number' || typeof b != 'number' ){
        throw new Error('Must be digit');
    }
}

function multiplication (a,b){
    isNumber(a,b);
    return a*b;
}

function division(a,b){
    isNumber(a,b);
    if(b === 0){
        throw new Error('Cannot be 0')
    }
    return a/b;
}

function subtract(a,b){
    isNumber(a,b);
    return a-b;
}

function add(a,b){
    isNumber(a,b);
    return a+b;
}
module.exports = { add, division, multiplication, subtract };