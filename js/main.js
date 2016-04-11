jQuery(document).ready(function() {
  jQuery('.c-article__main.sidebar').find('h1, h2, h3, h4, h5, h6').each(function() {
    var el = $(this);
    if (!el.attr('id')) { return; }
    el.html('<a href="#' + el.attr('id') + '">' + el.text() + '</a>');
  });
});
