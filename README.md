# Inventory Management CRUD API

- It is a CRUD API project with Tech Stack of `Node.js` `MongoDB` and `Express`
- It can perform all the basic databse operation like `Creat` `Read` `Update` and `Delete`
- we can pass the query params in the API to delete the Product

## Setting up project

- rename `.env.example` to `.env` and fill the required details
- run `npm install` to install all the required dependencies

## API Endpoint

###### POST /api/auth/createuser

- To create a new User

###### POST /api/auth/login

- To Login a existing User

###### POST /api/auth/resetpassword

- To reset the password of the existing User

###### PUT /api/user/update

- To update the existing user Details

###### POST /api/product/create

- To create new Product

###### GET /api/product/get

- To fetch all the Products

###### DELETE /api/product/delete/:id

- To delete the product using ID

###### DELETE /api/product/category/delete/:category

- To delete the all Product based perticular category
