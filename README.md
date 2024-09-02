#  Airbean - Gruppuppgift_node_basgrupp1
###  Created by Dylan, Eric, Jonathan, Marina, Shahin, Sofia
Link to document: https://docs.google.com/document/d/1s3K9dKXD69TZhR_Ufa98Wu0PPgqFp-YzjAf2Fx0z-jM/edit?usp=sharing

###  The description of the task:
In this group work, you will create an API for the web app Airbean where you can order coffee and have it delivered via drone (drones are not included in the task). ATTENTION! You do not need to do any frontend, only the backend is your task.  


###  Follow these steps to run the project:
**1. Clone git-repo**
- Open your terminal/console and run this command git clone <repo-url>

**2. Navigate to project:**
- Run the command: cd <project folder>

**3. Install dependencies:**
- Run the npm install command to install all necessary dependencies needed.

**4. Start server:**
- Use nodemon . command to run the server || npm run dev.

**5. Start your api application and use the urls below to test the project**


###  Base url:
http://localhost:8000/api/

###  Menu:
http://localhost:8000/api/company/menu  
Method: GET

###  Company info:
http://localhost:8000/api/company/companyInfo  
Method: GET

###  Create order:
http://localhost:8000/api/order/createOrder  
Method: POST

Add query params Key: userId and the Value: {userId} when creating the order as a registered user.

Go to the "Body" tab (in Postman or Insomnia).
Select "JSON" as the format.
Paste your JSON structure into the json field.

Example of JSON structure for creating several orders:  
```json
[
{
"id": 1,
"title": "Bryggkaffe",
"desc": "Bryggd på månadens bönor.",
"price": 39
},
{
"id": 2,
"title": "Caffè Doppio",
"desc": "Bryggd på månadens bönor.",
"price": 49
}
]
```

Will give the user the response: "Your order id: 000."

###  Send order:  
http://localhost:8000/api/order/sendOrder/:orderId  
Method: POST  

To complete your order use sendOrder with your order id. Order will be sent to completedOrder.db. You can then see order history and order status.

###  Get cart:
http://localhost:8000/api/order/getCart/:orderId  
Method: GET  

When you create an order in CreateOrder you’ll receive an orderId. Copy that orderId and paste it at the end of the URL. For example, if you receive a response of orderId 349 then paste it like this. http://localhost:8000/api/order/getCart/349

###  Add item cart:
http://localhost:8000/api/order/addItemCart/:orderId  
Method: PUT  

If you want to add something in your cart then you can use this method.
Almost like you did in getCart you’ll have to paste your orderId at the end of the URL.
In the body tab in insomnia/postman. Take note that it’s very important that you choose something from the menu.js file otherwise you’ll receive: error: "Items must match menu". Go to: Vs Code >> services >> menu.js to see the menu list or make a get request: http://localhost:8000/api/company/menu

###  Delete item:
http://localhost:8000/api/order/deleteItem/:orderId?itemId=<ProductID>  
Method: DELETE  

Go to the "Parameters" tab (in Postman or Insomnia).
Add query params key: itemId and the value: {itemId} when deleting an item from the order.
Order confirmation:
http://localhost:8000/api/order/orderConfirmation/:orderId
Method: GET
\*Must be done after calling sendOrder.

###  Create user:
http://localhost:8000/api/users/signup    
Method: POST  

Go to the "Body" tab (in Postman or Insomnia).
Select "JSON" as the format.
Paste your JSON structure into the json field.

Example of JSON structure for creating users:
```json
{
"username": "user",
"password": "test123"
}
```
Will give the user this response:
```json
{
"message": "User created.",
"user": {
"id": "randomlyGeneratedNumbersAndLetters987",
"username": "user"
}
}
```

\*You will need the ID to create orders as a user and to retrieve your order history.

###  Login user:
http://localhost:8000/api/users/login  
Method: POST  

Go to the "Body" tab (in Postman or Insomnia).
Select "JSON" as the format.
Paste your JSON structure into the json field.

Example of JSON structure for logging in users:
```json
{
"username": "user",
"password": "test123"
}
```

Will give the user this response:  
```json
{
"message": "Login successful. Logged in user: user. Id: “randomlyGeneratedNumbersAndLetters987"
}
```

\*You will need the ID to create orders as a user and to retrieve your order history.

###  Logout user:
http://localhost:8000/api/users/logout  
Method: POST  

###  Order history for registered users:
http://localhost:8000/api/order/orderHistory/:userId  
Method: GET

Will give the user this response:
```json
{
"orderHistory": [
{
"orderId": "000",
"estDelivery": "11:28",
"newOrder": [
{
"id": 1,
"title": "Bryggkaffe",
"desc": "Bryggd på månadens bönor.",
"price": 39
}
],
"userId": "randomlyGeneratedNumbersAndLetters987",
"_id": "randomlyGeneratedNumber"
}
]
}
```

### Admin - add product:
http://localhost:8000/api/admin/product/add
Method: POST

Go to the "Body" tab (in Postman or Insomnia).
Select "JSON" as the format.
Paste your JSON structure into the json field.

Example of JSON structure for adding product:
```json
{
"title": "Some product",
"desc": "Some description",
"price": 5
}
```
Will give the user this response:
```json
{
"message": "Product added.",
"product": {
"_id": 1,
"title": "Some product",
"desc": "Some description",
"price": 5,
"createdAt": 1725213423000,
"modifiedAt": 1725213423000
}
}
```

###  Admin - update product:
http://localhost:8000/api/admin/product/update 
Method: PATCH  

Go to the "Body" tab (in Postman or Insomnia).
Select "JSON" as the format.
Paste your JSON structure into the json field.

Example of JSON structure for updating products:
```json
{
"_id": 1,
"title": "Some other product"
}
```
Will give the user this response:
```json
{
"updateStatus": true
}
```

\*Any product field (title, desc, price) could be changed with this request. Returns updateStatus: false with HTTP statuscode 404 if an invalid is was sent.

###  Admin - delete product:
http://localhost:8000/api/admin/product/delete/:productId
Method: DELETE  

Will give the user this response:
```json
{
"deleteStatus": true
}
```

\*Returns deleteStatus: false with HTTP statuscode 404 if an invalid id was sent.

###  Admin - add campaign offer:
http://localhost:8000/api/admin/campaignOffer/add
Method: POST

Go to the "Body" tab (in Postman or Insomnia).
Select "JSON" as the format.
Paste your JSON structure into the json field.

Example of JSON structure for updating products:
```json
{
"ids": [1, 2],
"price": 50
}
```
Will give the user this response:
```json
{
"message": "Campaign added.",
"campaign": {
    "_id": 1,
    "ids": [1, 2],
    "price": 50
}
}
```

\*The ids array must be a set of valid product ids from the menu.