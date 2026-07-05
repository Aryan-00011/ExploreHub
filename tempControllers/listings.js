const Listing = require("../models/listing");

const stateImages = {
  // ─── EXISTING STATES ───────────────────────────────────────────────────────

  "Uttar Pradesh": "https://images.unsplash.com/photo-1561359313-0639aad49ca6?auto=format&fit=crop&w=1200&q=80",
  // Taj Mahal, Agra

  "Rajasthan": "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
  // Rajasthan desert / fort

  "Maharashtra": "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=1200&q=80",
  // Gateway of India / Mumbai

  "Gujarat": "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80",
  // Rann of Kutch / Gujarat

  "Kerala": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
  // Kerala backwaters

  "Uttarakhand": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
  // Himalayas, Uttarakhand

  "Himachal Pradesh": "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
  // Himachal Pradesh mountains

  "Punjab": "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
  // Golden Temple, Amritsar

  "Bihar": "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=1200&q=80",
  // Mahabodhi Temple / Bihar (replacing broken source.unsplash URL)

  "Madhya Pradesh": "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=1200&q=80",
  // Khajuraho / MP

  "West Bengal": "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1200&q=80",
  // Howrah Bridge / Kolkata

  "Tamil Nadu": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
  // Tamil Nadu temple

  "Karnataka": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80",
  // Mysore Palace / Karnataka

  "Andhra Pradesh": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
  // Andhra Pradesh landscape

  "Telangana": "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=1200&q=80",
  // Charminar / Hyderabad

  // ─── NEW STATES (Fixed & Verified) ─────────────────────────────────────────

  "Goa": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
  // Goa beach (Palolem) — verified ✅

  "Odisha": "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=80",
  // Jagannath Temple, Puri — verified ✅

  "Jharkhand": "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?auto=format&fit=crop&w=1200&q=80",
  // Forest/waterfall landscape, Jharkhand — verified ✅

  "Chhattisgarh": "https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?auto=format&fit=crop&w=1200&q=80",
  // Lush forest waterfall, central India — verified ✅

"Assam": "https://images.pexels.com/photos/30379176/pexels-photo-30379176.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80",
  // Kaziranga National Park wildlife, Assam — verified ✅

  "Meghalaya": "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
  // Living Root Bridge, Nongriat, Meghalaya — verified ✅

"Jammu & Kashmir": "https://images.pexels.com/photos/12750077/pexels-photo-12750077.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80",
  // Dal Lake / Srinagar, Kashmir — verified ✅ (fixes duplicate of West Bengal)

  "Ladakh": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
  // Pangong Lake, Ladakh — verified ✅
};



// INDEX
module.exports.index = async (req, res) => {

  const { state,  location } = req.query;

  let filter = {};

  // Category Filter
  // State Filter
if (state) {
  filter.state = state;
}

  // Price Filter
  

  // Location Search
  if (location) {
    filter.location = {
      $regex: location,
      $options: "i",
    };
  }

  const allListings = await Listing.find(filter);

  // Sorting


  // Unique States
  const states = [
    ...new Set(
      allListings
        .filter((item) => item.state)
        .map((item) => item.state)
    ),
  ];

  console.log("States:", states);

  res.render("listings/index.ejs", {
  allListings,
  states,
  stateImages
});
};

// NEW FORM
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// CREATE
module.exports.createListing = async (req, res) => {

  try {

    const newListing = new Listing(req.body.listing);

    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    // Temporary coordinates (Delhi)
    newListing.geometry = {
      type: "Point",
      coordinates: [77.2090, 28.6139],
    };

    newListing.owner = req.user._id;

    await newListing.save();

    req.flash("success", "New Destination Added!");

    res.redirect(`/listings/${newListing._id}`);

  } catch (err) {

    console.log(err);

    req.flash("error", err.message);

    res.redirect("/listings/new");

  }

};
// SHOW
module.exports.showListing = async (req, res) => {

  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", {
    listing,
  });
};

// EDIT FORM
module.exports.renderEditForm = async (req, res) => {

  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image?.url || "";

  if (originalImageUrl) {
    originalImageUrl = originalImageUrl.replace(
      "/upload",
      "/upload/w_250"
    );
  }

  res.render("listings/edit.ejs", {
    listing,
    originalImageUrl,
  });
};

// UPDATE
module.exports.updateListing = async (req, res) => {

  const { id } = req.params;

  const listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true }
  );

  if (req.file) {

    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };

    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

// DELETE
module.exports.destroyListing = async (req, res) => {

  const { id } = req.params;

  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};