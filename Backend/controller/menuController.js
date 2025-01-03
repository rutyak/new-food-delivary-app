require("dotenv").config();
const menu_url = process.env.REACT_APP_MENU_API_URL;
const axios = require("axios");

const menuController = async (req, res) => {
  try {
    const { lat, lng, id } = req.query;
    
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

    res
      .status(200)
      .json({ message: "Data fetched successfully", data: response?.data?.data });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = menuController;
