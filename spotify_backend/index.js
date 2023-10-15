const express = require("express");
const mongoose = require("mongoose");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const User = require("./models/User");
const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/song");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://admin:" +
      process.env.MONGO_PASSWORD +
      "@cluster0.82bc9kp.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to Mongo ! ");
  })
  .catch((err) => {
    console.error(`Error while connecting to mongo ${err} `);
  });

// setup passport-jwt
let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY ;
passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    User.findOne({ _id: jwt_payload.identifier }, function (err, user) {
      // done(error, doesTheUserExist)
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    });
  })
);



app.use("/auth", authRoutes);
app.use("/song", songRoutes);

app.listen(port, () => {
  console.log("App is running on port " + port);
});
