# AnimePulse Dashboard 🎌

<div align="center">

![AnimePulse](https://img.shields.io/badge/AnimePulse-Dashboard-ff69b4?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=for-the-badge)
![MySQL](https://img.shields.io/badge/mysql-8.0+-orange?style=for-the-badge)

**A modern, full-stack admin dashboard for managing anime content, posts, and community engagement.**

[Features](#features) • [Quick Start](#quick-start) • [Documentation](#documentation) • [API Reference](#api-reference) • [Contributing](#contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

AnimePulse Dashboard is a comprehensive content management system designed specifically for anime and manga communities. It provides a powerful admin interface for managing posts, categories, comments, subscribers, and analytics - all with a beautiful, responsive UI.

### Key Highlights

- 🎨 **Modern UI/UX** - Clean, responsive design with dark mode support
- 🔐 **Secure Authentication** - JWT-based authentication with role management
- 📊 **Analytics Dashboard** - Real-time insights and statistics
- 📝 **Content Management** - Full CRUD operations for posts and categories
- 💬 **Comment Moderation** - Manage and moderate user comments
- 👥 **Subscriber Management** - Track and manage newsletter subscribers
- ⚙️ **Settings Panel** - Customize site settings and preferences

---

## ✨ Features

### Frontend Features
- **Responsive Dashboard** - Mobile-first design that works on all devices
- **Dynamic Partials** - Reusable header and sidebar components
- **Real-time Updates** - Live data updates without page refresh
- **Rich Text Editor** - Create and edit posts with formatting
- **Image Upload** - Featured image support for posts
- **Analytics Visualization** - Charts and graphs for data insights
- **User Profile Management** - Edit profile, avatar, and preferences
- **Theme Switching** - Light and dark mode support

### Backend Features
- **RESTful API** - Well-structured API endpoints
- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access** - Admin and editor role management
- **MySQL Database** - Robust relational database
- **Input Validation** - Server-side validation and sanitization
- **Error Handling** - Comprehensive error handling
- **CORS Support** - Configurable cross-origin requests
- **Request Logging** - Morgan middleware for request logging

---

## 🛠 Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **JavaScript (ES6+)** - Vanilla JavaScript for interactivity
- **Font Awesome** - Icon library
- **Google Fonts** - Custom typography

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MySQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v9.0.0 or higher) - Comes with Node.js
- **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/)
- **Git** - [Download](https://git-scm.com/)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/animepulse-dashboard.git
cd animepulse-dashboard
```

### 2. Set Up the Database

```bash
# Login to MySQL
mysql -u root -p

# Run the setup script
source server/setup.sql

# Or manually import
mysql -u root -p < server/setup.sql
```

### 3. Install Backend Dependencies

```bash
cd server
npm install
```

### 4. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
# See Configuration section below
```

### 5. Start the Backend Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The API server will start on `http://localhost:3000`

### 6. Open the Frontend

Simply open `project/login.html` in your browser or use a local server:

```bash
# Using Python
cd project
python -m http.server 8080

# Using Node.js http-server
npx http-server project -p 8080
```

Then navigate to `http://localhost:8080/login.html`

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=animepulse

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this

# CORS Configuration
CORS_ORIGIN=*

# Server Configuration (Optional)
PORT=3000
NODE_ENV=development
```

> ⚠️ **Security Note**: Always use strong, unique values for `JWT_SECRET` in production. Never commit your `.env` file to version control.

### Database Configuration

The `setup.sql` script creates the following tables:
- `users` - Admin and editor accounts
- `posts` - Blog posts and articles
- `categories` - Post categories
- `comments` - User comments on posts
- `subscribers` - Newsletter subscribers
- `settings` - Application settings

---

## 📖 Usage

### Default Login Credentials

After running the setup script, you can create an admin user through the API or directly in the database. There are no default credentials for security reasons.

### Creating Your First Admin User

Use the registration endpoint or manually insert into the database:

```sql
INSERT INTO users (name, email, password_hash, role) 
VALUES ('Admin', 'admin@animepulse.com', '$2a$10$...', 'admin');
```

> **Note**: Use bcrypt to hash the password before inserting.

### Workflow

1. **Login** - Access the login page and authenticate
2. **Dashboard** - View analytics and recent activity
3. **Create Content** - Add posts, categories, and manage content
4. **Moderate** - Review and approve comments
5. **Analyze** - Check analytics and subscriber metrics
6. **Configure** - Adjust settings and preferences

---

## 📁 Project Structure

```
animepulse-dashboard/
├── project/                    # Frontend application
│   ├── assets/
│   │   ├── css/               # Stylesheets
│   │   │   ├── styles.css     # Main styles
│   │   │   ├── login.css      # Login page styles
│   │   │   └── ...
│   │   └── js/                # JavaScript files
│   │       ├── layout.js      # Layout and partials
│   │       ├── auth.js        # Authentication
│   │       └── ...
│   ├── partials/              # Reusable components
│   │   ├── header.html        # Header component
│   │   └── sidebar.html       # Sidebar component
│   ├── home.html              # Dashboard page
│   ├── login.html             # Login page
│   ├── create-post.html       # Create post page
│   ├── manage-posts.html      # Manage posts page
│   ├── categories.html        # Categories page
│   ├── comments.html          # Comments page
│   ├── subscribers.html       # Subscribers page
│   ├── analytics.html         # Analytics page
│   ├── profile.html           # User profile page
│   └── settings.html          # Settings page
│
├── server/                    # Backend application
│   ├── src/
│   │   ├── main/
│   │   │   ├── app.js        # Express app configuration
│   │   │   └── db.js         # Database connection
│   │   ├── middlewares/
│   │   │   └── auth.js       # Authentication middleware
│   │   ├── routes/
│   │   │   ├── index.js      # Route aggregator
│   │   │   ├── auth.js       # Authentication routes
│   │   │   ├── posts.js      # Posts routes
│   │   │   ├── categories.js # Categories routes
│   │   │   ├── comments.js   # Comments routes
│   │   │   ├── subscribers.js # Subscribers routes
│   │   │   ├── analytics.js  # Analytics routes
│   │   │   ├── profile.js    # Profile routes
│   │   │   └── settings.js   # Settings routes
│   │   └── index.js          # Server entry point
│   ├── .env.example          # Example environment variables
│   ├── package.json          # Dependencies and scripts
│   └── setup.sql             # Database schema
│
├── .gitignore                # Git ignore rules
├── LICENSE                   # License file
├── README.md                 # This file
└── API_DOCUMENTATION.md      # Detailed API documentation
```

---

## 📚 API Reference

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Quick Reference

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

#### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

#### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

#### Comments
- `GET /api/comments` - Get all comments
- `PUT /api/comments/:id` - Update comment status
- `DELETE /api/comments/:id` - Delete comment

#### Subscribers
- `GET /api/subscribers` - Get all subscribers
- `POST /api/subscribers` - Add subscriber
- `DELETE /api/subscribers/:id` - Delete subscriber

#### Analytics
- `GET /api/analytics` - Get analytics data

#### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile

#### Settings
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings

---

## 📸 Screenshots

> Add screenshots of your application here

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- The open-source community

---

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact via email
- Check the [API Documentation](./API_DOCUMENTATION.md)

---

<div align="center">

**Made with ❤️ for the anime community**

⭐ Star this repo if you find it helpful!

</div>
