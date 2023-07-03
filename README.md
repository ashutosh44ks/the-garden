# The Garden
Welcome to "The Garden," your go-to platform for all things academic. As a student at College of Technology, GBPUAT, you know that success in your studies requires access to quality resources and support. That's why we've created "The Garden," a place where you can find all the tools you need to excel in your classes. Whether you're looking for detailed notes, previous year exam questions, or the latest syllabus updates, you'll find everything you need here. So why wait? Explore "The Garden" today and take your academic journey to the next level!

Note - This app is NOT affiliated to College of Technology, GBPUAT in any way or form. 

### Tech Stack Used
- MERN Stack - MongoDB, Mongoose, Express.js, React JS, Node.js, Tailwind CSS

### Deployement
The project is deployed on Render.com (https://thegarden.onrender.com).
Limitations of deployment due to using free version deployment option of Render.com
- The first API call might take a minute to complete as render.com starts a new server then
- File storage is cleaned after each server session

### How to run the project in local
1. Clone this repository's dev branch
2. Install node modules in root, client & server
3. Add .env file in server directory with the following variables ```DATABASE_URL, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, FRONTEND_URL```
    - I use mongo db locally so it's ```mongodb://127.0.0.1/the-garden``` for me
    - Frontend by default goes on port 3000 so that'll be ```http://localhost:3000```
4. Similarly for client dir, create a .env file with ```REACT_APP_BASE_API_URL``` which should take default port 3001 of server i.e. ```http://localhost:3001```
4. In root directory run command ```npm run dev```
