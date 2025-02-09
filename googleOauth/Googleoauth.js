const passport = require("passport");
const UserModel = require("../models/UserModel");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const jwt = require("jsonwebtoken");
const { generateUniquiId } = require("../utils/Helper");
const bcrypt = require("bcrypt");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALL_BACK_URL,
    },
    async (accessToken, refreshToken, profile, callback) => {
      try {
        const email = profile.emails?.[0]?.value; // Extract email properly

        if (!email) {
          return callback(new Error("Login failed: No email found"), null);
        }

        let user = await UserModel.findOne({ where: { email } });

        if (!user) {
          const id = generateUniquiId();
          const password = id + email;
          const hashpassword = await bcrypt.hash(password, 10);
          const user = {
            email,
            id,
            password: hashpassword,
            name: profile.displayName,
          };

          const saveuser = await UserModel.create(user);

          const accesstoken = jwt.sign(
            { userid: saveuser.id },
            process.env.USER_PRIVATE_KEY,
            { expiresIn: "5m" }
          );

          const refreshtoken = jwt.sign(
            { userid: saveuser.id },
            process.env.USER_PRIVATE_KEY,
            { expiresIn: "1d" }
          );

          return callback(null, {
            userid: saveuser.id,
            accesstoken,
            refreshtoken,
          });
        }

        // Generate tokens
        const accesstoken = jwt.sign(
          { userid: user.id },
          process.env.USER_PRIVATE_KEY,
          { expiresIn: "5m" }
        );

        const refreshtoken = jwt.sign(
          { userid: user.id },
          process.env.USER_PRIVATE_KEY,
          { expiresIn: "1d" }
        );

        return callback(null, { userid: user.id, accesstoken, refreshtoken });
      } catch (error) {
        return callback(error, null);
      }
    }
  )
);
