
var chalkbox = require('./safe');

chalkbox.setTheme({
  custom: ['red', 'underline']
});

console.log(chalkbox.custom('test'));
