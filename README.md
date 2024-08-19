# Attendance App

Welcome to the **Attendance App**!

The Attendance App offers a simple yet effective solution for tracking, managing, and reporting student attendance. Designed with a focus on ease of use and a lightweight, intuitive interface, this app provides a straightforward approach to attendance management without unnecessary complexity.

Built using modern technologies, the Attendance App ensures a seamless user experience while remaining lightweight and easy to navigate. Whether you need to record daily attendance, manage class schedules, or generate basic reports, this app delivers essential functionality with minimal effort.

Key features include a responsive dashboard, efficient attendance management, and user-friendly interfaces—all crafted to make attendance tracking as straightforward as possible. Experience a practical and user-friendly tool that makes attendance management simple and efficient.

## 🖼️ Screenshots

Below are some screenshots of the Attendance App in action:

### Desktop View

The desktop view showcases the Attendance App's full feature set on larger screens. This view provides a detailed and organized interface, enabling efficient management and overview of attendance data with ample space for interactive elements and comprehensive tools.

![image](https://github.com/user-attachments/assets/a66fedb8-5576-4e07-8df5-7c6eaeace15e)

![image](https://github.com/user-attachments/assets/d7a5d965-2821-419d-8c52-1556dc77691d)

![image](https://github.com/user-attachments/assets/ce42fe5f-9bb6-4f89-9ddb-cf9e831d62df)

![image](https://github.com/user-attachments/assets/07ba50dc-b840-4722-9815-982377e5e13c)

### Mobile View

The Mobile View demonstrates how the Attendance App adapts to smaller screens. This view maintains a streamlined interface, making it easy to use the app on the go.

![image](https://github.com/user-attachments/assets/5b5e8410-22f9-4ed8-a9f9-64dcccb58db5)

![image](https://github.com/user-attachments/assets/e2f86676-e7c0-4954-9685-32805fd77a0e)

![image](https://github.com/user-attachments/assets/7305f667-9110-4ec2-b04d-c13741e35973)

![image](https://github.com/user-attachments/assets/c7962a73-7288-4c93-b3da-63080d83bd7c)

![image](https://github.com/user-attachments/assets/fa4b5ef9-d31d-4679-9e4e-a1a8aaffd886)


## 📚 Table of Contents

- [🌟 Features](#-features)
- [🛠️ Technology Stack](#-technology-stack)
- [📦 Modules](#-modules)
  - [Dashboard](#dashboard)
  - [Attendance](#attendance)
  - [Class, Session, and Student Management](#class-session-and-student-management)
  - [User Management](#user-management)
  - [Insights](#insights)
- [⚙️ Installation and Setup](#-installation-and-setup)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
  - [Build and Deploy (Optional)](#build-and-deploy-optional)
- [🔍 Troubleshooting](#-troubleshooting)
  - [Common Issues](#common-issues)
  - [For Additional Help](#for-additional-help)
- [📄 License](#-license)
- [👤 Credits](#-credits)

## 🌟 Features

The Attendance App is designed with a focus on simplicity and efficiency, offering a lightweight and user-friendly experience. Here’s what you can expect:

- **Dashboard**: Provides a clean snapshot of key attendance metrics, such as total students, classes, and current attendance status. Admins can post important notices to keep everyone informed and engaged.
- **Attendance Management**: Easily record and manage attendance for specific dates, classes, and sessions with an intuitive interface.
- **Class, Session, and Student Management**: Add, update, and track classes, sessions, and students effortlessly. Data is synchronized across the application, ensuring consistency and accuracy.
- **User Management**: Admins can manage user roles effectively, including Admin, Auditor, and User, with streamlined controls.
- **Insights and Reporting**: Generate detailed and insightful reports to analyze attendance trends and gain valuable insights with minimal effort.
- **Light/Dark Mode**: Enjoy a personalized viewing experience with the ability to switch between light and dark themes. User preferences are saved for convenience.
- **Mobile-Friendly Design**: Optimized for various devices and screen sizes, ensuring a seamless experience on both mobile and desktop.
- **Advanced Data Tables**: Leveraging `material-react-table` for enhanced functionality, including:
  - Refresh
  - Export to CSV
  - Search and filter
  - Column visibility and sorting
  - Full-screen view
  - Row density toggling

With its lightweight design and simple yet powerful features, the Attendance App is designed to make attendance management straightforward and efficient for all users.

## 🛠️ Technology Stack

The Attendance App leverages a modern tech stack to provide a robust and efficient application. Here’s an overview of the technologies used:

- **Frontend:**
  - **[Next.js](https://nextjs.org/)**: A powerful React framework that enables server-side rendering, static site generation, and other advanced features to create a fast and dynamic user interface.
  - **[React](https://reactjs.org/)**: A popular JavaScript library for building user interfaces, allowing for the creation of reusable UI components and a seamless user experience.

- **Backend:**
  - **[MongoDB](https://www.mongodb.com/)**: A NoSQL database that provides a flexible and scalable solution for data storage. It handles a variety of data types and structures, making it ideal for managing complex datasets and relationships.

- **ORM:**
  - **[Prisma](https://www.prisma.io/)**: An Object-Relational Mapping (ORM) tool that simplifies database interactions. It provides type-safe queries and schema management, making it easier to work with databases while reducing the likelihood of errors.

- **Deployment:**
  - **[Vercel](https://vercel.com/)**: A platform designed for hosting and deploying modern web applications. It integrates seamlessly with Next.js, offering features like continuous deployment, serverless functions, and automatic scaling to ensure your app runs smoothly in production.

This combination of technologies ensures a powerful, efficient, and scalable application, from development to deployment.

## 📦 Modules

### Dashboard

The Dashboard provides an overview of key metrics:
- Total present, absent, and on leave today
- Total number of students
- Total number of classes

Admins can post and edit notices visible to all users.

### Attendance

Manage attendance records:
- Mark student attendance for specific dates, classes, and sessions.
- Track student presence, absence, and leave status.

### Class, Session, and Student Management

Handle all aspects of class and student management:
- **Classes**: Create, update, and manage class details.
- **Sessions**: Schedule and manage class sessions.
- **Students**: Add, modify, and monitor student information.

### User Management

Admin features include:
- Adding and managing users with roles:
  - **Admin**: Full access to all features and settings.
  - **Auditor**: View-only access with permissions for supervision and insights.
  - **User**: Access to manage classes, students, and attendance without user management capabilities.

### Insights

Generate and view detailed reports:
- Track student attendance over specified periods.
- Filter reports by class and session as needed.

## ⚙️ Installation and Setup

Follow these steps to set up the Attendance App on your local machine:

### Prerequisites

Before you start, make sure you have the following installed:
- **[Node.js](https://nodejs.org/)**: This is required to run the app and comes with npm (Node Package Manager). You need Node.js version 14.x or higher.
- **[npm](https://www.npmjs.com/)**: This is included with Node.js and is used to manage project dependencies. Alternatively, you can use [Yarn](https://classic.yarnpkg.com/), which is an optional package manager that some developers prefer.

### Getting Started

1. **Clone the Repository**

    Start by cloning the Attendance App repository to your local machine. Open your terminal and run:
    ```bash
    git clone [url]
    ```
    Replace `[url]` with the URL of the repository. This command creates a copy of the project on your computer.

2. **Navigate to the Project Directory**

    Move into the project directory where the cloned files are located:
    ```bash
    cd attendance-app
    ```

3. **Install Project Dependencies**

    Install the necessary libraries and packages required for the app to run. You can use either npm or Yarn:
    
    - With npm:
      ```bash
      npm install
      ```
    
    - With Yarn:
      ```bash
      yarn install
      ```
    
    This command will download and install all dependencies listed in the `package.json` file.

4. **Set Up Environment Variables**

    The app requires certain environment variables to function correctly. Create a `.env` file in the root of the project if it doesn’t already exist, and add the following variables:
    
    - `DATABASE_URL`: This should be your MongoDB connection string. You can get this from your MongoDB provider.
    - `NEXTAUTH_SECRET`: This is a secure key used by NextAuth for authentication. You can generate a secure key using a command like:
      ```bash
      openssl rand -base64 32
      ```
    
    Make sure to replace these placeholders with your actual values.

5. **Run Database Migrations**

    If your project uses Prisma for ORM (Object-Relational Mapping), you need to apply database migrations to set up the schema:
    
    - With npm:
      ```bash
      npx prisma migrate dev
      ```
    
    - With Yarn:
      ```bash
      yarn prisma migrate dev
      ```
    
    This command will apply any pending database schema changes.

6. **Start the Development Server**

    Launch the app in development mode. This will start a local server where you can view and interact with the app:
    
    - With npm:
      ```bash
      npm run dev
      ```
    
    - With Yarn:
      ```bash
      yarn dev
      ```

7. **Open and View the Application**

    After starting the development server, open your web browser and go to [http://localhost:3000](http://localhost:3000) to see the app in action.

### Build and Deploy (Optional)

If you want to prepare the app for production or deploy it to a server, follow these additional steps:

8. **Build for Production**

    To create a production-ready build of the app, which optimizes it for performance:
    
    - With npm:
      ```bash
      npm run build
      ```
    
    - With Yarn:
      ```bash
      yarn build
      ```
    
    This command generates static files that are ready to be deployed.

9. **Start the Production Server**

    To run the production build of the app:
    
    - With npm:
      ```bash
      npm start
      ```
    
    - With Yarn:
      ```bash
      yarn start
      ```
    
    This starts the server using the optimized production build.

10. **Deploy to Vercel**

    To deploy your app, you can use Vercel’s deployment platform. You can either use the [Vercel CLI](https://vercel.com/docs/concepts/cli) or deploy directly through the Vercel dashboard. For an easy deployment experience, follow the instructions on the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme). For more details, check the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

By following these steps, you should be able to set up and run the Attendance App locally. If you encounter any issues or have questions, feel free to reach out or consult the provided documentation.

Feel free to adjust these instructions based on your specific setup or additional requirements!

## 🔍 Troubleshooting

### Common Issues

If you encounter problems while installing or setting up the Attendance App, consider the following solutions:

- **Installation or Setup Problems:**
  - **Verify Node.js and npm/Yarn Versions**: Make sure you have the correct version of Node.js (v14.x or higher) and npm (or Yarn) installed. You can check your versions with:
    ```bash
    node -v
    ```
    ```bash
    npm -v
    ```
    ```bash
    yarn -v
    ```
  - **Check Environment Variables**: Ensure your `.env` file is properly configured. Verify that all required environment variables (such as `DATABASE_URL` and `NEXTAUTH_SECRET`) are correctly set and match the expected values.

- **Database Connection Issues:**
  - **Verify Connection String**: Check that your `DATABASE_URL` in the `.env` file is accurate and properly formatted for MongoDB.
  - **Database Accessibility**: Confirm that your MongoDB instance is running and accessible from your development environment.

- **Migration Errors:**
  - **Run Migrations Again**: If Prisma migrations fail, try running them again. Check for any error messages and consult the Prisma [troubleshooting guide](https://www.prisma.io/docs/troubleshooting) for help.

### For Additional Help

If you need further assistance, here are some resources that might help:

- **Next.js Documentation**:
  - For framework-specific guidance and best practices, visit the [Next.js Documentation](https://nextjs.org/docs).
  - Explore the [Next.js interactive tutorial](https://nextjs.org/learn) to get hands-on experience.
  - Check out the [Next.js GitHub repository](https://github.com/vercel/next.js/) for additional resources and community support.

- **Prisma Documentation**:
  - For issues related to ORM and database interactions, refer to the [Prisma Documentation](https://www.prisma.io/docs).

- **GitHub Issues**:
  - If you’re still having trouble, you can open an issue on the [GitHub repository](https://github.com/yourusername/attendance-app/issues) for personalized assistance from the community or maintainers.

## 📄 License

This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute the code under the terms of this license. For more details, please refer to the [LICENSE](LICENSE) file in the repository.

## 👤 Credits

This project was developed and is maintained solely by [Nicholas Lee](https://github.com/nicholaslhq). All aspects of the design, development, and implementation have been carried out independently.

Special thanks to:

- **[ChatGPT](https://www.openai.com/chatgpt)**: For providing assistance and guidance throughout the development process.
- **[Stack Overflow](https://stackoverflow.com/)**: For the invaluable community support and solutions that helped resolve various technical challenges.

If you have any questions, feedback, or suggestions, please raise an issue on the [GitHub repository](https://github.com/nicholaslhq/attendance-app/issues). I welcome any input and will do my best to address your concerns.

Thank you for checking out the Attendance App!
