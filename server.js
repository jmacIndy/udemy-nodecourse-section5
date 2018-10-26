const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use((req, res, next) => {
   var now = new Date().toString();
   var log = `${now}: ${req.method} ${req.url}`;

   console.log(log);
   fs.appendFile('server.log', log + '\n', (err) => {
      if (err) {
         console.log('Unable to append to server log');
      }
   });

   next();
});

// commenting this out - example of how to shut down site for maintenance
// app.use((req, res, next) => {
//
//     res.render('maintenance.hbs', {
//       pageTitle: 'Maintenance'
//    });
//
//    // note that next() is not called; so the app cannot use any other handlers
//
// });

// this has to be here, or static pages can be displayed, even though
// maintenance mode is on
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
   return text.toUpperCase();
});

app.get('/', (req, res) => {
   res.render('home.hbs', {
      pageTitle: 'Home Page',
      welcomeMessage: 'Hi, you have reached the home page!'
   });
});

app.get('/about', (req, res) => {
   res.render('about.hbs', {
      pageTitle: 'About Page'
   });
});

app.get('/projects', (req, res) => {
   res.render('projects.hbs', {
      pageTitle: 'Projects Page'
   });
});

app.get('/bad', (req, res) => {
   res.send({
      errorMessage: 'Unable to fulfill request.'
   });
});

app.listen(port, () => {
   console.log(`Server is up on port ${port}`);
});
