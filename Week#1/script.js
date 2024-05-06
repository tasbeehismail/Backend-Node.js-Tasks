/* ----------------------- Question #1 ----------------------- */
function sum (num1, num2) {
    console.log(num1 + num2);
}
//sum(1, 3);

/* ----------------------- Question #2 ----------------------- */
function isPalindrome(initial){
    let reversed = "";
    for(let i = initial.length - 1; i >= 0; i--){
        reversed += initial.at(i);
    }
    if(reversed == initial){
        console.log("YES");
    }else{
        console.log("NO");
    }
}
// isPalindrome("level");

/* ----------------------- Question #3 ----------------------- */
let name = "Tasbeeh";
let reversedName = name.split("").reverse().join("");
//console.log(reversedName);

/* ----------------------- Question #4 ----------------------- */
function printEvens(numbers){
    const evens = [];
    let j = 0;
    for(let i = 0; i < numbers.length; i++){
        if(!(numbers[i] % 2)){
            evens[j++] = numbers[i];
        }
    }
    return evens;
}
// const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// const result = printEvens(numbers);
// console.log(result);

/* ----------------------- Question #5 ----------------------- */
// Method-1: 
// Object
let person = {
    firstName:"Tasbeeh", 
    lastName:"Ismail", 
    age:50
};
let p1 = {...person};
p1.id = "CS-3123";
console.log(p1);
console.log(person);
// Array
let x = [["A", "B", "C"], 2, 3];
let y = [...x]
y.push(4);
//console.log(x);
//console.log(y);

// Method-2: 
// Object
let p2 = JSON.parse(JSON.stringify(person));
p2.id = "CS-3123";
//console.log(p2);
//console.log(person);
// Array
let z = JSON.parse(JSON.stringify(x));
z.push(4);
//console.log(x);
//console.log(z);
/* ----------------------- Question #6 ----------------------- */
function reverse(initial){
    let reversed = "";
    for(let i = initial.length - 1; i >= 0; i--){
        reversed += initial.at(i);
    }
    console.log(reversed);
}
// reverse("Tasbeeh");

/* ----------------------- Question #7 ----------------------- */
function sumNumbers(numbers){
    let sum = 0;
    for(let i = 0; i < numbers.length; i++){
        sum += numbers[i];
    }
    console.log(sum);
}
//const numbers = [1, 2, 3, 4, 5];
//sumNumbers(numbers);

/* ----------------------- Question #8 ----------------------- */
function getFactorial(num){
    let fact = 1;
    for(let i = 1; i <= num; i++){
        fact *= i;
    }
    return fact;
}
// console.log(getFactorial(5));

/* ----------------------- Question #9 ----------------------- */
function getAverage(numbers){
    let sum = 0, n = numbers.length;
    for(let i = 0; i < n; i++){
        sum += numbers[i];
    }
    let avg = sum / n;
    return avg;
}
//const numbers = [1, 2, 3, 4, 5];
//console.log(getAverage(numbers));

/* ----------------------- Question #10 ----------------------- */
function find(numbers, target){
    let idx = -1, n = numbers.length;
    for(let i = 0; i < n; i++){
        if(numbers[i] == target){
            idx = i;
            break;
        }
    }
    return idx;

}
//const numbers = [1, 2, 3, 4, 5];
//console.log(find(numbers, 4));

/* ----------------------- Question #11 ----------------------- */
// -> There are many methods, like using ASCII code but the simple one is:
function isInteger(variable){
    return variable % 1 === 0; // both equality of value and equality of data type
}
// console.log(isInteger(10));
// console.log(isInteger(-10));
// console.log(isInteger(10.11));
// console.log(isInteger("abc"));
// console.log(isInteger('A'));

/* ----------------------- Question #12 ----------------------- */
function toDays(age){
    return age * 365; // approximately
}
// console.log(toDays(10));

/* ----------------------- Question #13 ----------------------- */
// Explaining:
// Callback Function is function called in another function, meaning passed as an argument to another function

// Example:
function sum(num1, num2){
    console.log(num1 + num2);
}
sum(1, 2);

// -> callback
function sum1(num1, num2, print){
    let ans = num1 + num2;
    print(ans);
}
sum1(1, 2, function(res){
    console.log(res);
});