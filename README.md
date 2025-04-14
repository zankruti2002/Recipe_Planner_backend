Recipe Planner 

Overview:
The Recipe Planner is an application designed to help users efficiently manage and organize their favorite recipes. Users can browse and save recipes, create shopping lists based on selected meals, and keep track of their kitchen inventory. This tool is perfect for saving time and simplifying meal planning by providing an easy way to plan meals and ensure that the necessary ingredients are always on hand.

Features:
Browse All Recipes: Users can explore a wide selection of recipes.
Add and Store Favorite Recipes: Save your favorite recipes for quick access anytime.
View Recipe Details: Get detailed information about each recipe, including ingredients, instructions, and videos.
Add Items to the Shopping List: Easily add ingredients from recipes to your shopping list.
Track Kitchen Inventory: Users can add and manage items in their kitchen to keep track of available ingredients.
Secure User Accounts: Users can log in securely, update their information, and delete their account if needed.
User-Friendly Interface: The app is designed with a simple, intuitive interface, making it easy for users to navigate and plan their meals efficiently.

JWT Authentication and CRUD

User Authentication:

Utilizes React's useContext and useState hooks to manage the user's login state.
Upon user login, the backend verifies credentials and generates a JSON Web Token (JWT).
The JWT is stored in local storage, maintaining the user's authentication state across sessions.
For secured endpoints, the JWT is included in the Authorization header for subsequent requests, ensuring only authenticated users can access or modify resources.
CRUD Operations with Axios:

Full CRUD functionality is implemented using Axios to interact with the backend API.
Create: POST requests are used to add new recipes, create a user, log in, add items to shopping lists, and add my kitchen to the database.
Read: GET requests fetch all recipes, specific recipe details for display, all saved recipes, all shopping lists, and all kitchen items.
Update: PUT requests are sent to modify existing users to update their names and emails.
Delete: DELETE requests to remove saved recipes, delete user account, specific items, all items from the shopping list, and from the kitchen.
Error handling is integrated to manage potential issues during API interactions effectively.
Overall Integration:

The combination of JWT authentication and Axios for CRUD operations creates a secure and efficient way to manage user authentication and data within the Recipe Meal Planner application.


npm start
your server started at http://localhost:8000


npm run dev
Open the app in your browser at http://localhost:5173

Technologies Used
Frontend: React.js
Backend: Node.js, Express.js
Database: MongoDB

