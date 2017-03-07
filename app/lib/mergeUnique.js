module.exports = (needle, list) => {
  const haystack = list.slice(0)
  if (haystack.includes(needle)) {
    const index = haystack.indexOf(needle)
    haystack.splice(index, 1)
  }
  return [
    needle,
    ...haystack,
  ]
}
