import db from "../db/database.js";
import menu from "../services/menu.js";
import createDeliveryTime from "../services/createDeliveryTime.js";

// To delete a product from the order
const deleteItem = async (req, res) => {
  const orderId = req.params.orderId;
  const itemId = parseInt(req.query.itemId, 10);

  try {
    // Finds the order in the database
    const orderData = await db["order"].findOne({ orderId });

    // If order is not found in database
    if (!orderData) {
      return res.status(404).json({
        order: orderId,
        error: "Order not found, please enter a valid order id.",
      });
    }

    // Finds the item in the order
    const itemIndex = orderData.newOrder.findIndex(
      (item) => item.id === itemId
    );

    // If the product cant be found in the order
    if (itemIndex === -1) {
      return res.status(404).json({
        itemId,
        error: "Product not found, please enter a valid product id.",
      });
    }

    //  Removes the item from the order
    const removedData = orderData.newOrder.splice(itemIndex, 1)[0];

    // Creates a new order with the removed item but with the same order id
    await db["order"].update(
      { orderId: orderId },
      { $set: { newOrder: orderData.newOrder } }
    );

    // If every item gets removed from the order, the order will be deleted
    if (orderData.newOrder.length === 0) {
      await db["order"].remove({
        orderId,
      });
    }

    // Returns the removed item and a message. If an error occurs, a status 500 will be returned instead
    return res
      .status(200)
      .json({ removedData, message: "The product is removed" });
  } catch (error) {
    console.error(
      "An error occurred while trying to remove the product:",
      error
    );

    return res.status(500).json({ message: "Internal server error." });
  }
};

// Creates order
const createOrder = async (req, res) => {
  // Creates unique ID for order
  const orderId = Math.floor(Math.random() * (999 - 100) + 100);
  // Makes order ID into a string
  const myOrderId = orderId.toString();

  // Checks if data is an array or just an object
  const newOrder = Array.isArray(req.body) ? req.body : [req.body];

  // Error handling for input information from user
  for (let order of newOrder) {
    const { id, title, desc, price } = order;
    if (id == null || title == null || desc == null || price == null) {
      return res.status(400).json({
        error: "Each order must contain id, title, desc, and price.",
      });
    }

    let itemFound = false;
    for (let item of menu) {
      if (
        item._id === order.id &&
        item.title === order.title &&
        item.desc === order.desc &&
        item.price === order.price
      ) {
        itemFound = true;
        break;
      }
    }

    if (!itemFound) {
      return res.status(400).json({
        error: "Items must match menu.",
      });
    }
  }

  try {
    // Adds estimated delivery to object
    const { userId } = req.query;
    if (userId === undefined) {
      console.log(`Order created as a guest.`);
    } else {
      // Checks if user ID exists in database
      const userExists = await db["users"].findOne({ _id: userId });

      if (!userExists) {
        return res.status(400).send("Incorrect user id");
      }
    }

    //Inserts created data into database

    await db["order"].insert({
      orderId: myOrderId,
      estDelivery: createDeliveryTime(),
      newOrder,
      userId: userId,
    });
    // Returns order ID for created order
    return res.status(201).json(`Your order id: ${myOrderId}`);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Error adding new order." });
  }
};

// Retrieve an order by its ID
const getCart = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await db["order"].findOne({ orderId: orderId });
    // Error if there is no order with certain ID
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    const { estDelivery, ...removeEstDelivery } = order;
    // If no error then respond status 200
    return res.status(200).json(removeEstDelivery);
  } catch (error) {
    console.log("Error retrieving orders:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// To add a product to the order
const addItemCart = async (req, res) => {
  const { orderId } = req.params;
  const updatedItems = Array.isArray(req.body) ? req.body : [req.body];

  for (let order of updatedItems) {
    const { id, title, desc, price } = order;
    if (!id || !title || !desc || !price) {
      return res.status(400).json({
        error: "Each order must contain id, title, desc and price",
      });
    }
    let itemFound = false;

    for (let item of menu) {
      if (
        item._id === id &&
        item.title === title &&
        item.desc === desc &&
        item.price === price
      ) {
        itemFound = true;
        break;
      }
    }

    if (!itemFound) {
      return res.status(400).json({
        error: "Items must match menu",
      });
    }
  }

  try {
    const existingOrder = await db["order"].findOne({ orderId });
    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    await db["order"].update(
      { orderId },
      { $push: { newOrder: updatedItems[0] } }
    );
    return res
      .status(200)
      .json({ message: "Order has been updated successfully", orderId });
  } catch (error) {
    console.error("Error updating order");

    return res.status(500).send({ error: "Error updating order" });
  }
};

const orderConfirmation = async (req, res) => {
  // Receives order ID as parameter from user
  const { orderId } = req.params;
  // Looks for order ID in database
  try {
    const orderData = await db["completedOrder"].findOne({ orderId: orderId });
    // Error handling for order id
    if (!orderData) {
      return res.status(404).send({ error: "Order not found." });
    }
    // Returns estimated delivery time for order
    return res.status(200).json({
      message: `Your estimated delivery time is ${orderData.estDelivery}.`,
    });
  } catch (error) {
    return res.status(500).send({ error: "Error finding order id." });
  }
};

// Marks an order as complete by moving it from the order-database to complete-database
const sendOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const orderData = await db.order.findOne({ orderId: orderId });
    if (!orderData) {
      return res.status(404).send({ error: "Order not found." });
    }
    const updateData = await db.completedOrder.insert(orderData);
    const deletedData = await db.order.remove(orderData, { multi: true });
    return res.status(200).json({
      message: `Your order is complete. Order id: ${orderId}.`,
    });
  } catch (error) {
    return res.status(500).send({ error: "Error finding order id." });
  }
};

// Retrieves order history for a specific user
const orderHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const userOrders = await db.completedOrder.find({ userId: userId });
    if (userOrders.length === 0) {
      return res
        .status(404)
        .send({ error: "Order history not found for this user." });
    }
    return res.status(200).json({
      orderHistory: userOrders,
    });
  } catch (error) {
    return res.status(500).send({ error: "Error finding order history." });
  }
};

export {
  createOrder,
  orderConfirmation,
  addItemCart,
  deleteItem,
  sendOrder,
  orderHistory,
  getCart,
};
