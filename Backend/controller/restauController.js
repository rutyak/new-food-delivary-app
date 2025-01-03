require("dotenv").config();
const restaurant_url = process.env.REACT_APP_RESTAURANTS_API_URL;
const axios = require("axios");

const restauController = async (req, res) => {
    try {
      const { lat, lng } = req.query;
  
      if (!lat || !lng) {
        return res
          .status(400)
          .json({ message: "Latitude and longitude are required." });
      }
  
      const headers = {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        Referer: "https://www.swiggy.com/",
        Accept: "application/json",
      };
  
      const response = await axios.get(
        `${restaurant_url}&lat=${lat}&lng=${lng}`,
        { headers }
      );
  
      res
        .status(200)
        .json({ message: "Fetched data successfully", data: response?.data?.data });
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
  }

module.exports = restauController;