const equation = process.argv.slice(-1)[0]

try {
  console.log(JSON.stringify([
    {value: eval(equation)},
    {value: eval(equation)},
    {value: eval(equation)},
  ]))
} catch (e) {}
