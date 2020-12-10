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

    const max = {
      driving: Number.MIN_VALUE,
      transit: Number.MIN_VALUE,
      walking: Number.MIN_VALUE,
    };

    const min = {
      driving: Number.MAX_VALUE,
      transit: Number.MAX_VALUE,
      walking: Number.MAX_VALUE,
    };

    for (let i = 0; i < regionOptions.length; i++) {
      const region = regionOptions[i];
      walking = getAvg(regions[region].walking) - 100;
      max.walking = max.walking < walking ? walking : max.walking;
      min.walking = min.walking < walking ? min.walking : walking;
      regions[region].walking = walking
        ? (getAvg(regions[region].walking) - 100).toFixed(3)
        : null;
      transit = getAvg(regions[region].transit) - 100;
      max.transit = max.transit < transit ? transit : max.transit;
      min.transit = min.transit < transit ? min.transit : transit;
      regions[region].transit = transit
        ? (getAvg(regions[region].transit) - 100).toFixed(3)
        : null;
      driving = getAvg(regions[region].driving) - 100;
      max.driving = max.driving < driving ? driving : max.driving;
      min.driving = min.driving < driving ? min.driving : driving;
      regions[region].driving = driving
        ? (getAvg(regions[region].driving) - 100).toFixed(3)
        : null;
    }

    return res.status(200).send({ regions, max, min });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error getting data." });
  }
});

module.exports = router;
