var hbs = require ('handlebars');
//helper
hbs.registerHelper ('isSelected_genre', function (select, id) {
  return select === id ? 'selected' : '';
});
hbs.registerHelper ('isSelected_prodution', function (select, id) {
  return select === id ? 'selected' : '';
});
hbs.registerHelper ('isSelected_category', function (select, options) {
  return options
    .fn (this)
    .replace (new RegExp (' value="' + select + '"'), '$& selected="selected"');
});
