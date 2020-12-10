const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

const appleMobility = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  geoType: {
    type: String,
    required: true,
  },
  countryName: {
    type: String,
    required: true,
  },
  regionName: {
    type: String,
    required: false,
  },
  transportationType: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: false,
  },
});

module.exports = mongoose.model("AppleMobility", appleMobility);
