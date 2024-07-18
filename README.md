# MERN Stack Live Chat App with Chatbot

This is a live chat application built using the MERN stack (MongoDB, Express, React, Node.js) and Socket.io for real-time communication. The app also includes a chatbot for automated responses.

## Features

- Real-time messaging using Socket.io
- Authentication (Sign up, Login, Logout)
- Chatbot for automated responses
- User-friendly interface built with React.js
- Data storage with MongoDB

## Technologies Used

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Real-time Communication:** Socket.io
- **Chatbot:** Integrated within the server logic

## Getting Started

These instructions will help you set up and run the project on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm (Node Package Manager)
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/mern-stack-socket-io.git
    ```

2. Navigate to the project directory:
    ```sh
    cd mern-stack-socket-io
    ```

3. Install server dependencies:
    ```sh
    cd server
    npm install
    ```

4. Install client dependencies:
    ```sh
    cd ../client
    npm install
    ```

### Configuration

1. Create a `.env` file in the `server` directory and add your MongoDB URI and other environment variables:
    ```env
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_secret_key
    ```

2. (Optional) Configure additional environment variables as needed for your setup.

### Running the Application

1. Start the MongoDB server if running locally:
    ```sh
    mongod
    ```

2. Start the backend server:
    ```sh
    cd server
    npm start
    ```

3. Start the frontend development server:
    ```sh
    cd ../client
    npm start
    ```

4. Open your browser and navigate to:
    ```
    http://localhost:3000
    ```

### Project Structure

- `client`: Contains the React frontend code
- `server`: Contains the Node.js backend code
- `models`: Mongoose models for MongoDB
- `routes`: Express routes
- `controllers`: Request handlers for routes

### Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature-name`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature-name`)
5. Create a new Pull Request

### License

This project is licensed under the MIT License.

---

Feel free to reach out if you have any questions or need further assistance.

Happy coding!
