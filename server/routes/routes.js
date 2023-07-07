const express = require('express');
const router = express.Router();
const pathModule = require('path');
const redirectLoggedIn = require('../middlewares/loggedInRedirect');


const { auth } = require('../middlewares/auth'); // Update import statement

// Define your routes dynamically
const pages = [
  { path: '/', page: 'land', useAuthMiddleware: false },
  { path: '/about', page: 'about', useAuthMiddleware: true },
  { path: '/10th-grade', page: '10th-grade', useAuthMiddleware: true },
  { path: '/11th-grade', page: '11th-grade', useAuthMiddleware: true },
  { path: '/12th-grade', page: '12th-grade', useAuthMiddleware: true },
  { path: '/404', page: '404', useAuthMiddleware: false },
  { path: '/4042', page: '4042', useAuthMiddleware: false },
  { path: '/7th-grade', page: '7th-grade', useAuthMiddleware: true },
  { path: '/8th-grade', page: '8th-grade', useAuthMiddleware: true },
  { path: '/9th-grade', page: '9th-grade', useAuthMiddleware: true },
  { path: '/Library', page: 'Library', useAuthMiddleware: true },
  { path: '/Universityapplications', page: 'Universityapplications', useAuthMiddleware: true },
  { path: '/abt-sat', page: 'abt-sat', useAuthMiddleware: true },
  { path: '/baccalaureate', page: 'baccalaureate', useAuthMiddleware: true },
  { path: '/bluebook', page: 'bluebook', useAuthMiddleware: true },
  { path: '/contacts', page: 'contacts', useAuthMiddleware: false },
  { path: '/faq', page: 'faq', useAuthMiddleware: false },
  { path: '/signup-successful', page: 'signup-successful', useAuthMiddleware: false },
  { path: '/khanacademy', page: 'khanacademy', useAuthMiddleware: true },
  { path: '/land', page: 'land', useAuthMiddleware: false },
  { path: '/login', page: 'login', useAuthMiddleware: false },
  { path: '/login', page: 'login', useAuthMiddleware: false },
  { path: '/sat-pdf', page: 'sat-pdf', useAuthMiddleware: true },
  { path: '/sat', page: 'sat', useAuthMiddleware: true },
  { path: '/signup', page: 'signup', useAuthMiddleware: false },
  { path: '/testimonials', page: 'testimonials', useAuthMiddleware: false },
  { path: '/toefl', page: 'toefl', useAuthMiddleware: true },
  { path: '/untitled', page: 'untitled', useAuthMiddleware: true }
];



// Route handler for the login page
router.get('/login', redirectLoggedIn, (req, res) => {
  // Render the login page
  res.render('login', { error: req.query.error });
});

// Route handler for the signup page
router.get('/signup', redirectLoggedIn, (req, res) => {
  // Render the signup page
  res.render('signup', { error: req.query.error });
});

pages.forEach(({ path, page, useAuthMiddleware }) => {
  const routeMiddleware = useAuthMiddleware ? auth : [];
  router.get(path, routeMiddleware, (req, res) => {
    const viewPath = path === '/' ? 'land' : page;
    const fullPath = path === '/' ? 'land' : page;

    res.render(fullPath, { error: req.query.error }, (err, html) => {
      if (err) {
        console.error(`Error rendering ${viewPath}:`, err);
        res.status(404).render('4042');
      } else {
        res.send(html);
      }
    });
  });
});


module.exports = router;
