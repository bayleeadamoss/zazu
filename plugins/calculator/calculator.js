const equation = process.argv.slice(-1)[0];

console.log(JSON.stringify([
    {value: eval(equation)},
]));
