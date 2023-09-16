# The Garden
Welcome to "The Garden," your go-to platform for all things academic. As a student at the College of Technology, GBPUAT, you know that success in your studies requires access to quality resources and support. That's why we've created "The Garden," a place where you can find all the tools you need to excel in your classes. Whether you're looking for detailed notes, previous year exam questions, or the latest syllabus updates, you'll find everything you need here. So why wait? Explore "The Garden" today and take your academic journey to the next level!

Note - This app is NOT affiliated with the College of Technology, GBPUAT in any way or form. 

### Tech Stack Used
- MongoDB (MongoDB Atlas for production)
- Node.js
- Mongoose (For MongoDB object modeling in node.js)
- Multer (Used in legacy branch, stores files in local)
- Express.js
- React JS
- Tailwind CSS
- Firebase Storage (Used currently, stores files in cloud)

### Deployment
The project is deployed on Render.com (https://thegarden.onrender.com).

Limitations of deployment due to using the free version deployment option of Render.com
- It might take 15-30 for render.com to start the server if the server has become inactive.
- Look for small popup in bottom left, it indicates if backend has started or not

### How to run the project in local
1. Clone this repository's dev branch
2. Install node modules in root, client & server
3. Add .env file in the server directory with the following variables ```DATABASE_URL, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, FRONTEND_URL```
    - DATABASE_URL can be  ```mongodb://127.0.0.1/the-garden``` for running it locally otherwise get your MongoDB atlas db URL
    - The front-end by default goes on port 3000 so that'll be ```http://localhost:3000```
4. Similarly for client dir, create a .env file with ```REACT_APP_BASE_API_URL``` which should take default port 3001 of the server i.e. ```http://localhost:3001```
   - If NOT using ```legacy-dev``` branch then you should add firebase config items there
       - REACT_APP_FIREBASE_API_KEY
       - REACT_APP_FIREBASE_AUTH_DOMAIN
       - REACT_APP_FIREBASE_PROJECT_ID
       - REACT_APP_FIREBASE_STORAGE_BUCKET
       - REACT_APP_FIREBASE_MESSAGING_SENDER_ID
       - REACT_APP_FIREBASE_APP_ID
       - REACT_APP_FIREBASE_MEASUREMENT_ID
4. In the root directory run the command ```npm run dev```
