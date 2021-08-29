//libs
const express = require("express");
const app = express();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const cookieSession = require('cookie-session');
//vars
const SERVER_PORT = 8000;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  // User.findById(id, function(err, user) {
    done(null, user);
  // });
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "...google__lient_id",
      clientSecret: "...google__client__secret",
      callbackURL: "http://localhost:8000/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(null, profile);
      // });
    }
  )
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieSession({
  name: 'passport-google-auth',
  keys: ['key1', 'key2']
}))

app.use(passport.initialize());
app.use(passport.session());

app.get("/test", (req, res) => {
  res.status(200).send("SUCCESSFULLY CONNECTED TO BACKEND");
});
app.get('/',(req,res)=>{res.send('THIS IS THE HOME PAGE!')});
app.get('/fail',(req,res)=>{res.send('GOOGLE AUTH FAILED')});
app.get('/success',(req,res)=>{
  console.log(req.user);
  res.send(`GOOGLE AUTH SUCCESS`)
})

app.get(
  "/google",
  passport.authenticate("google", {
    scope: ['profile','email']
  })
);

app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/fail" }),
  function (req, res) {
    res.redirect("/success");
  }
);

app.listen(SERVER_PORT, () => {
  console.log(`SUCCESSFULLY STARTED SERVER ON PORT ${SERVER_PORT}`);
});
