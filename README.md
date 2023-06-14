# Spice Republic

<p align="center">
  <img src="app/public/images/logo.svg" alt="Spice Republic Logo">
</p>

Spice Republic is a comprehensive order screen application designed specifically for restaurants. It provides a user-friendly interface for managing orders efficiently and effectively. This repository contains the source code for both the frontend and backend of the application, which are built using Next.js, Tailwind CSS, SQLite, and Go. The project also includes Docker support for easy containerization.

## 🚀 Features

- **Order management:** Spice Republic enables restaurant staff to manage incoming orders effectively, facilitating a streamlined workflow.
- **User-friendly interface:** The application offers an intuitive and easy-to-use interface, ensuring a smooth user experience for restaurant staff.
- **Next.js and Tailwind CSS:** The frontend is built using Next.js, a popular React framework, and styled with Tailwind CSS, providing a responsive and visually appealing design.
- **SQLite and Go:** The backend of Spice Republic utilizes SQLite as the database management system and Go as the programming language, ensuring a robust and efficient server-side implementation.
- **Docker support:** The project supports Docker, allowing for easy deployment and containerization of the application.

## 🛠️ Installation

To set up Spice Republic locally, follow these steps:

1. Clone the repository:

   ```
   git clone https://github.com/anggakharisma/spice-republic.git
   ```

2. Navigate to the project directory:

   ```
   cd spice-republic
   ```

3. Install the dependencies for the frontend:

   ```
   cd app
   {pnpm, yarn, npm} install
   ```

4. Install the dependencies for the backend:

   ```
   cd app
   go mod download
   ```

## ⚙️ Configuration

Before running the application, you need to configure a few settings:

1. Create a `.env` file in the `frontend` directory and specify the following environment variables:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```

## 🚀 Usage

To start the Spice Republic application, follow these steps:

1. In the `frontend` directory, run the following command:

   ```
   pnpm run dev
   ```

   This will start the development server for the frontend.

2. In the `backend` directory, run the following command:

   ```
   cd api
   go run main.go
   ```

   This will start the backend server.
   Check app README.md for more information, like docker usage

3. Open your browser and visit `http://localhost:3000` to access Spice Republic.

## 👥 Contributing

Contributions to Spice Republic are welcome! If you find any issues or have suggestions for improvement, please feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 👏 Acknowledgments

We would like to acknowledge the following open-source projects and libraries that were used in the development of

 Spice Republic:

- Next.js: [https://nextjs.org](https://nextjs.org)
- Tailwind CSS: [https://tailwindcss.com](https://tailwindcss.com)
- SQLite: [https://www.sqlite.org](https://www.sqlite.org)
- Go: [https://golang.org](https://golang.org)
- Docker: [https://www.docker.com](https://www.docker.com)
