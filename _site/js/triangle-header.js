(function () {
  window.addEventListener('resize', debounce(createIt))
  var header = document.getElementById('header')
  var triangles

  function debounce (fn) {
    var timeout
    return function () {
      if (timeout) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(fn, 100)
    }
  }

  function createIt () {
    if (triangles) {
      header.removeChild(triangles)
    }
    triangles = Trianglify({
      height: 205,
      width: header.offsetWidth,
      x_colors: ['#BFF3E9', '#88DFCE', '#5CC7B2', '#39AB95', '#1F9780'],
    }).canvas()
    header.appendChild(triangles)
  }
  createIt()
})()
