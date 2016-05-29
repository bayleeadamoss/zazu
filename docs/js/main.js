/**
 * Finds all the headers that can link to themselves and make them clickable.
 */
jQuery('.c-article__main.sidebar').find('h2, h3').filter('[id]').each(function() {
  var el = $(this);
  el.html('<a href="#' + el.attr('id') + '">' + el.text() + '</a>');
});
