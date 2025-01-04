require("dotenv").config();
const restaurant_url = process.env.REACT_APP_RESTAURANTS_API_URL;
const axios = require("axios");

const cache = new Map();

const CACHE_EXPIRATION_TIME = 10 * 60 * 1000; // 10 minutes

const restauController = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required." });
    }

    const cacheKey = `${lat}-${lng}`;

    if (cache.has(cacheKey)) {
      const cachedData = cache.get(cacheKey);

      if (Date.now() - cachedData.timestamp < CACHE_EXPIRATION_TIME) {
        console.log("Serving data from cache");
        return res.status(200).json({
          message: "Fetched data successfully (cached)",
          data: cachedData.data,
        });
      } else {
        cache.delete(cacheKey);
      }
    }

    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      Referer: "https://www.swiggy.com/",
      Accept: "application/json",
    };

    const response = await axios.get(`${restaurant_url}&lat=${lat}&lng=${lng}`, {
      headers,
    });

    const responseData = response?.data?.data;
    cache.set(cacheKey, { data: responseData, timestamp: Date.now() });

    res.status(200).json({
      message: "Fetched data successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error in fetching data:", error);

    if (error.response) {
      return res.status(error.response.status).json({
        message: "Error from the external API",
        error: error.response.data || error.response.statusText,
      });
    }

    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = restauController;
