/**
 * Finds all the headers that can link to themselves and make them clickable.
 */

var selector = '.c-article__main.sidebar h2[id], .c-article__main.sidebar h3[id]'
var headers = document.querySelectorAll(selector)
var headerLength = headers.length

for (var i = 0; i < headerLength; ++i) {
  var header = headers[i]
  var link = document.createElement('a')
  link.href = '#' + header.id
  link.innerText = header.innerText
  header.innerText = ''
  header.appendChild(link)
}
