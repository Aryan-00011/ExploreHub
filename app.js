require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");

const User = require("./models/user");

const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");

const MONGO_URL = process.env.ATLASDB_URL;

// MongoDB Connection
async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Session Config
const sessionOptions = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// Passport Config
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global Variables
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Home Route
app.get("/", (req, res) => {
  res.render("home");
});



// AI Travel Assistant Route
app.post("/ai-trip-plan", async (req, res) => {
  try {
    const { location, country } = req.body;

    const plan = `
🌅 Morning:
Visit the top attractions in ${location}.

🍽️ Afternoon:
Enjoy famous local food and cafes.

🛍️ Evening:
Explore shopping markets and nearby landmarks.

🌙 Night:
Experience local culture and nightlife.

📍 Destination:
${location}, ${country}

💡 Travel Tip:
Carry water, keep local cash, and check weather updates before traveling.
`;

    res.json({ plan });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      plan: "Unable to generate travel plan right now.",
    });
  }
});

// Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// 404 Route
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});




// Server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});