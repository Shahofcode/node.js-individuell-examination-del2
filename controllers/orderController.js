import db from "../db/database.js";
import menu from "../services/menu.js";
import createDeliveryTime from "../services/createDeliveryTime.js";

let cart = [];

// vi får eventuellt byta ut productId senare beroende vad id:t från ordern heter
const deleteItem = async (req, res) => {
  try {
    const { productId } = req.body;

    // Kontrollera att productId är tillgängligt
    if (!productId) {
      return res.status(400).json({ message: "Produkt-ID saknas" });
    }

    // Hitta indexet för produkten i korgen baserat på productId
    const productIndex = cart.findIndex((product) => product.id === productId);
    if (productIndex === -1) {
      return res
        .status(404)
        .json({ message: "Produkten finns inte i kundvagnen" });
    }

    // Ta bort den specifika produkten från korgen
    cart.splice(productIndex, 1);

    res
      .status(200)
      .json({ message: "Produkten har tagits bort från kundvagnen" });
  } catch (error) {
    console.error("Fel vid bortttagning av produkt:", error);
    return res.status(500).json({ message: "Internt serverfel" });
  }
};

//Unique order ID (Math random kontrolleras )
//Order time 15 min - 45 min (Math random)

const createOrder = async (req, res) => {
  //Creates unique id for order
  const orderId = Math.floor(Math.random() * (999 - 100) + 100);
  //Makes order id into a string
  const myOrderId = orderId.toString();

  //Checks if data is an array or just an object
  const newOrder = Array.isArray(req.body) ? req.body : [req.body];

  //Error handling for input information from user
  for (let order of newOrder) {
    const { id, title, desc, price } = order;
    if (id == null || title == null || desc == null || price == null) {
      return res.status(400).json({
        error: "Each order must contain id, title, desc, and price",
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
        error: "Items must match menu",
      });
    }
  }

  try {
    //Adds estimated delivery to object
    console.log("Request query:", req.query);
    const userId = req.query.userId;
    if (!userId) {
      console.log("User ID not provided");
    } else {
      // Kolla om användarID finns i databasen
      const userExists = await db["users"].findOne({ _id: userId });

      if (!userExists) {
        console.log("User ID does not exist in database");
      } else {
        console.log("User ID exists in database");
      }
    }
    //Inserts created data into database
    await db["order"].insert({
      orderId: myOrderId,
      estDelivery: createDeliveryTime(),
      newOrder,
      userId: userId,
    });
    //Returns order id for created order
    return res.status(201).json(`Your order id: ${myOrderId}`);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Error adding new order" });
  }
};

const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await db["order"].findOne({ orderId: orderId });
    //Error if there is no order with certain id.
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const { estDelivery, ...removeEstDelivery } = order;
    // If no error then respond status 200.
    return res.status(200).json(removeEstDelivery);
  } catch (error) {
    console.log("Error retrieving orders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// För att lägga till en produkt i ordern
const changeOrder = async (req, res) => {
  // För felhantering
  // console.log(`id: ${id}, title: ${title}, desc: ${desc}, price: ${price}`);

  // För att hämta data ifrån bodyn.
  const { id, title, desc, price } = req.body;

  // Skapa en loop som loopar igenom varje "order"/"produkt" i bodyn
  for (let order of req.body) {
    // Om någon av dessa saknas i bodyn så returneras ett felmeddelande.
    const { id, title, desc, price } = order;

    if (id == null || title == null || desc == null || price == null) {
      return res
        .status(400)
        .json({ error: "Each order must contain id, title, desc, and price" });
    }
  }

  // Om allt finns i bodyn så körs koden nedanför.
  try {
    // Hämtar data ifrån databasen och lägger in i variabeln updateData.
    const updateData = await db.order.insert(req.body);

    // Returnerar en status 200 och skickar med updateData.
    return res.status(200).json(updateData);
  } catch (error) {
    return res.status(500).send({ error: "Error updating order" });
  }
};

const getOrderStatus = async (req, res) => {
  //Receives order id as parameter from user
  const { orderId } = req.params;
  //Looks for order id in database
  try {
    const orderData = await db["completeOrder"].findOne({ orderId: orderId });
    //Error handling for order id
    if (!orderData) {
      return res.status(404).send({ error: "Order not found" });
    }
    //returns estimated delivery time for order
    return res.status(200).json({
      message: `Your estimated delivery time is ${orderData.estDelivery}`,
    });
  } catch (error) {
    return res.status(500).send({ error: "Error finding order id" });
  }
};

const completeOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const orderData = await db.order.findOne({ orderId: orderId });
    if (!orderData) {
      return res.status(404).send({ error: "Order not found" });
    }
    const updateData = await db.completeOrder.insert(orderData);
    const deletedData = await db.order.remove(orderData, { multi: true });
    return res.status(200).json({
      message: `Your order is complete. Order id: ${orderId}`,
    });
  } catch (error) {
    return res.status(500).send({ error: "Error finding order id" });
  }
};

const orderHistory = async (req, res) => {
  const userId = req.query.userId;

  try {
    const userOrders = await db.completeOrder.find({ userId: userId });
    if (!userOrders) {
      return res
        .status(404)
        .send({ error: "Order history not found for this user" });
    }
    return res.status(200).json({
      orderHistory: userOrders,
    });
  } catch (error) {
    return res.status(500).send({ error: "Error finding order history" });
  }
};

export {
  createOrder,
  getOrderStatus,
  changeOrder,
  deleteItem,
  completeOrder,
  orderHistory,
  getOrder,
};
