require("dotenv").config();
const menu_url = process.env.REACT_APP_MENU_API_URL;
const axios = require("axios");

const cache = new Map();

const CACHE_EXPIRATION_TIME = 10 * 60 * 1000; // 10 minutes

const menuController = async (req, res) => {
  try {
    const { lat, lng, id } = req.query;

    if (!lat || !lng || !id) {
      return res
        .status(400)
        .json({ message: "Latitude, longitude, and restaurant ID are required." });
    }

    const cacheKey = `${lat}-${lng}-${id}`;

    if (cache.has(cacheKey)) {
      const cachedData = cache.get(cacheKey);

      if (Date.now() - cachedData.timestamp < CACHE_EXPIRATION_TIME) {
        console.log("Serving data from cache");
        return res.status(200).json({
          message: "Data fetched successfully (cached)",
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

    const response = await axios.get(
      `${menu_url}&lat=${lat}&lng=${lng}&catalog_qa=undefined&submitAction=ENTER&restaurantId=${id}`,
      { headers }
    );

    const responseData = response?.data?.data;
    cache.set(cacheKey, { data: responseData, timestamp: Date.now() });

    res.status(200).json({
      message: "Data fetched successfully",
      data: responseData,
    });
  } catch (error) {
    console.error(error);

    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = menuController;
