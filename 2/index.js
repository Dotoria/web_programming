console.log('웹 찍어먹기 세미나!');

// let a = "안녕하세요";
// a = 2;

// console.log(a);

// const b = "hi!";
// b = "bye!";

// console.log(b);

// let a = "1234"; // string
// let b = 2; // number
// let c = 3.2; // number
// let d = true; // boolean
// let e = [] // object (dynamic)
// let f = {} // object (dictionary, map)
// let f1 = {
//     a: 2,
//     b: "hi",
//     c: {
//         a: null,
//     },
// };
// let g = null; // null
// let h = undefined; // undefined

const a = 2 - "3"; // type coersion (type conversion)
console.log(a);
// {} - true = NaN (not a number) --> type: number

function log(message) {
    console.log(message, arguments[1]);
}

log("Hello World!", "안녕.");

const showAlert = (message) => {
    alert(message);
};

// showAlert("Hello, World!")

// different in using 'this' parameter


const doSomething = (func, message) => {
    func(message);
}

doSomething(console.log, "Hello world!");

const aa = 2 < 3;
console.log(aa);
const bb = 3 == "3";
console.log(bb);
const cc = 4 === "4"; // + type comparision
console.log(cc);

// element
const aaa = window.document.getElementById('a');
aaa.addEventListener("click", () => {
    console.log("a를 누름");
});
// +querySelector, +getClass