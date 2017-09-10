// app/routes.js

const cors = require('cors')
const baseAPI = '/api/v1';

module.exports = function(app, passport) {
    
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    // app.get('/', function(req, res) {
        //     res.render('index.ejs'); // load the index.ejs file
        // });
        app.use(cors())

      app.get('/', function(request, response) {
        console.log("we made it to the root and redirect!")
        // response.send('Backend is up and running!')
        response.redirect('https://charliecorrigan.github.io/3dqueue')
      })
  
      // =====================================
      // LOGIN ===============================
      // =====================================
      // show the login form
      app.get('/login', function(req, res) {
        console.log("we hit app.get login")
        
          // render the page and pass in any flash data if it exists
        response.redirect('https://charliecorrigan.github.io/3dqueue/login')
        
      });
  
      // process the login form
      // app.post('/login', do all our passport stuff here);
      
      // =====================================
      // SIGNUP ==============================
      // =====================================
      // show the signup form
      // app.get('/signup', function(req, res) {
  
      //     // render the page and pass in any flash data if it exists
      //   response.redirect('https://charliecorrigan.github.io/3dqueue/signup')
        
      // });
  
      // process the signup form
      // app.post('/signup', do all our passport stuff here);
  // process the signup form
    //   app.post('/api/v1/admins',
    // function(req, res){
    //     console.log("OH MY GOD WE MADE IT TO A BACKEND CONSOLE")
    //     console.log(req.body)
    // }), passport.authenticate('local-signup');

  
      // =====================================
      // PROFILE SECTION =====================
      // =====================================
      // we will want this protected so you have to be logged in to visit
      // we will use route middleware to verify this (the isLoggedIn function)

  
      // =====================================
      // LOGOUT ==============================
      // =====================================
      app.get('/logout', function(req, res) {
          req.logout();
          res.redirect('/');
      });
  };
  
  // route middleware to make sure a user is logged in
  function isLoggedIn(req, res, next) {
  
      // if user is authenticated in the session, carry on 
      if (req.isAuthenticated())
          return next();
  
      // if they aren't redirect them to the home page
      res.redirect('/');
  }