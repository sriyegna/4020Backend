const router = require("express").Router();
const AppleMobility = require("../model/AppleMobility");

const getAvg = (arr) => {
  const sum = arr.reduce((a, b) => a + b, 0);
  return sum / arr.length;
};

router.get("/apple", async (req, res) => {
  try {
    const { countryName, fromDate, toDate } = req.query;
    const regionOptions = await AppleMobility.find({
      countryName,
      geoType: "sub-region",
    }).distinct("regionName");

    const regions = {};

    for (let i = 0; i < regionOptions.length; i++) {
      regions[regionOptions[i]] = { walking: [], driving: [], transit: [] };
    }

    const data = await AppleMobility.find({
      countryName,
      geoType: "sub-region",
      date: { $gte: fromDate, $lt: toDate },
    });
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (row.transportationType === "walking") {
        regions[row.regionName].walking.push(row.value);
      } else if (row.transportationType === "transit") {
        regions[row.regionName].transit.push(row.value);
      } else {
        regions[row.regionName].driving.push(row.value);
      }
    }

    for (let i = 0; i < regionOptions.length; i++) {
      const region = regionOptions[i];
      regions[region].walking = (getAvg(regions[region].walking) - 100).toFixed(
        3
      );
      regions[region].transit = (getAvg(regions[region].transit) - 100).toFixed(
        3
      );
      regions[region].driving = (getAvg(regions[region].driving) - 100).toFixed(
        3
      );
    }

    return res.status(200).send(regions);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error getting data." });
  }
});

module.exports = router;
