import db from "../db/database.js";
import menu from "../services/menu.js";
import airbeanInfo from "../services/companyInfo.js";

// Get menu
const getMenu = async (req, res) => {
  try {
    const menuData = await db["company"].findOne({ type: "menu" });

    if (!menuData) {
      const insertedData = await db["company"].insert({
        type: "menu",
        data: menu,
      });
      return res.status(201).json(insertedData);
    } else {
      return res.status(200).json(menuData);
    }
  } catch (err) {
    return res.status(500).send({ error: "Error accessing menu" });
  }
};

// Get information about the company
const getCompanyInfo = async (req, res, next) => {
  try {
    // Retrieves data from database
    const companyData = await db["company"].findOne({ type: "airbeanInfo" });
    if (!companyData) {
      // Inserts data into database
      const insertedData = await db["company"].insert({
        type: "airbeanInfo",
        data: airbeanInfo,
      });
      return res.status(201).json(insertedData);
    } else {
      return res.status(201).json(companyData);
    }
  } catch (err) {
    return res.status(500).send({ error: "Error accessing company info" });
  }
};

export { getMenu, getCompanyInfo };
