# AnimePulse API Documentation

## Table of Contents

- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Endpoints](#endpoints)
  - [Authentication](#authentication-endpoints)
  - [Posts](#posts-endpoints)
  - [Categories](#categories-endpoints)
  - [Comments](#comments-endpoints)
  - [Subscribers](#subscribers-endpoints)
  - [Analytics](#analytics-endpoints)
  - [Profile](#profile-endpoints)
  - [Settings](#settings-endpoints)

---

## Overview

The AnimePulse API is a RESTful API that provides endpoints for managing anime content, user authentication, and analytics. All responses are returned in JSON format.

### API Version
- **Current Version**: 1.0.0
- **Protocol**: HTTP/HTTPS
- **Response Format**: JSON

---

## Base URL

```
http://localhost:3000/api
```

For production, replace with your deployed API URL.

---

## Authentication

The API uses **JWT (JSON Web Token)** for authentication. Protected endpoints require a valid JWT token in the Authorization header.

### Getting a Token

1. Login via the `/api/auth/login` endpoint
2. Include the returned token in subsequent requests

### Using the Token

Include the token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

### Token Payload

The JWT token contains:
```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "admin"
}
```

---

## Error Handling

### Error Response Format

All errors follow this structure:

```json
{
  "error": "Error message description"
}
```

### HTTP Status Codes

| Status Code | Description |
|------------|-------------|
| `200` | Success |
| `201` | Created successfully |
| `400` | Bad request - Invalid input |
| `401` | Unauthorized - Invalid credentials or missing token |
| `403` | Forbidden - Insufficient permissions |
| `404` | Not found - Resource doesn't exist |
| `500` | Internal server error |

---

## Rate Limiting

Currently, there are no rate limits implemented. Consider implementing rate limiting in production environments.

---

## Endpoints

### Authentication Endpoints

#### Login

Authenticate a user and receive a JWT token.

**Endpoint:** `POST /api/auth/login`

**Authentication Required:** No

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "admin",
    "avatar_url": "https://example.com/avatar.jpg"
  }
}
```

**Error Responses:**
- `400` - Missing email or password
- `401` - Invalid credentials
- `500` - Login failed

**Example:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@animepulse.com",
    "password": "password123"
  }'
```

---

### Posts Endpoints

#### Get All Posts

Retrieve all posts with category information.

**Endpoint:** `GET /api/posts`

**Authentication Required:** No

**Query Parameters:** None

**Success Response (200):**
```json
[
  {
    "id": 1,
    "title": "Top 10 Anime of 2024",
    "status": "published",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z",
    "featured_image_url": "https://example.com/image.jpg",
    "tags": "anime,2024,top10",
    "category_id": 1,
    "category_name": "Anime Reviews"
  }
]
```

**Error Responses:**
- `500` - Failed to fetch posts

---

#### Get Single Post

Retrieve a specific post by ID.

**Endpoint:** `GET /api/posts/:id`

**Authentication Required:** No

**URL Parameters:**
- `id` (integer) - Post ID

**Success Response (200):**
```json
{
  "id": 1,
  "title": "Top 10 Anime of 2024",
  "content": "Full post content here...",
  "featured_image_url": "https://example.com/image.jpg",
  "tags": "anime,2024,top10",
  "status": "published",
  "category_id": 1,
  "author_id": 1,
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `404` - Post not found
- `500` - Failed to fetch post

---

#### Create Post

Create a new post.

**Endpoint:** `POST /api/posts`

**Authentication Required:** Yes

**Request Body:**
```json
{
  "title": "New Post Title",
  "content": "Post content here...",
  "category_id": 1,
  "status": "draft",
  "featured_image_url": "https://example.com/image.jpg",
  "tags": "tag1,tag2,tag3"
}
```

**Required Fields:**
- `title` (string)
- `content` (string)

**Optional Fields:**
- `category_id` (integer) - Defaults to null
- `status` (enum: 'draft', 'published') - Defaults to 'draft'
- `featured_image_url` (string) - Defaults to null
- `tags` (string) - Comma-separated tags, defaults to null

**Success Response (201):**
```json
{
  "id": 2,
  "title": "New Post Title",
  "content": "Post content here...",
  "category_id": 1,
  "status": "draft",
  "featured_image_url": "https://example.com/image.jpg",
  "tags": "tag1,tag2,tag3",
  "author_id": 1,
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `400` - Title and content are required
- `401` - Unauthorized
- `500` - Failed to create post

---

#### Update Post

Update an existing post.

**Endpoint:** `PUT /api/posts/:id`

**Authentication Required:** Yes

**URL Parameters:**
- `id` (integer) - Post ID

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "category_id": 2,
  "status": "published",
  "featured_image_url": "https://example.com/new-image.jpg",
  "tags": "updated,tags"
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "title": "Updated Title",
  "content": "Updated content...",
  "category_id": 2,
  "status": "published",
  "featured_image_url": "https://example.com/new-image.jpg",
  "tags": "updated,tags",
  "author_id": 1,
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-16T14:20:00.000Z"
}
```

**Error Responses:**
- `401` - Unauthorized
- `404` - Post not found
- `500` - Failed to update post

---

#### Delete Post

Delete a post.

**Endpoint:** `DELETE /api/posts/:id`

**Authentication Required:** Yes

**URL Parameters:**
- `id` (integer) - Post ID

**Success Response (200):**
```json
{
  "success": true
}
```

**Error Responses:**
- `401` - Unauthorized
- `404` - Post not found
- `500` - Failed to delete post

---

### Categories Endpoints

#### Get All Categories

Retrieve all categories.

**Endpoint:** `GET /api/categories`

**Authentication Required:** No

**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "Anime Reviews",
    "slug": "anime-reviews",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

**Error Responses:**
- `500` - Failed to fetch categories

---

#### Create Category

Create a new category.

**Endpoint:** `POST /api/categories`

**Authentication Required:** Yes

**Request Body:**
```json
{
  "name": "New Category",
  "slug": "new-category"
}
```

**Required Fields:**
- `name` (string)
- `slug` (string) - URL-friendly identifier

**Success Response (201):**
```json
{
  "id": 4,
  "name": "New Category",
  "slug": "new-category",
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `400` - Name and slug are required
- `401` - Unauthorized
- `500` - Failed to create category

---

#### Update Category

Update an existing category.

**Endpoint:** `PUT /api/categories/:id`

**Authentication Required:** Yes

**URL Parameters:**
- `id` (integer) - Category ID

**Request Body:**
```json
{
  "name": "Updated Category Name",
  "slug": "updated-slug"
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "name": "Updated Category Name",
  "slug": "updated-slug",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `401` - Unauthorized
- `404` - Category not found
- `500` - Failed to update category

---

#### Delete Category

Delete a category.

**Endpoint:** `DELETE /api/categories/:id`

**Authentication Required:** Yes

**URL Parameters:**
- `id` (integer) - Category ID

**Success Response (200):**
```json
{
  "success": true
}
```

**Error Responses:**
- `401` - Unauthorized
- `404` - Category not found
- `500` - Failed to delete category

---

### Comments Endpoints

#### Get All Comments

Retrieve all comments with post information.

**Endpoint:** `GET /api/comments`

**Authentication Required:** No

**Success Response (200):**
```json
[
  {
    "id": 1,
    "post_id": 1,
    "author_name": "John Doe",
    "author_email": "john@example.com",
    "content": "Great article!",
    "status": "approved",
    "created_at": "2024-01-15T10:30:00.000Z",
    "post_title": "Top 10 Anime of 2024"
  }
]
```

**Error Responses:**
- `500` - Failed to fetch comments

---

#### Create Comment

Create a new comment.

**Endpoint:** `POST /api/comments`

**Authentication Required:** No

**Request Body:**
```json
{
  "post_id": 1,
  "author_name": "Jane Doe",
  "author_email": "jane@example.com",
  "content": "Interesting perspective!"
}
```

**Required Fields:**
- `post_id` (integer)
- `author_name` (string)
- `content` (string)

**Optional Fields:**
- `author_email` (string)

**Success Response (201):**
```json
{
  "id": 2,
  "post_id": 1,
  "author_name": "Jane Doe",
  "author_email": "jane@example.com",
  "content": "Interesting perspective!",
  "status": "pending",
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `400` - Missing required fields
- `500` - Failed to create comment

---

#### Update Comment

Update a comment (typically for moderation).

**Endpoint:** `PUT /api/comments/:id`

**Authentication Required:** Yes

**URL Parameters:**
- `id` (integer) - Comment ID

**Request Body:**
```json
{
  "status": "approved",
  "content": "Updated comment content"
}
```

**Status Values:**
- `pending` - Awaiting moderation
- `approved` - Approved for display
- `spam` - Marked as spam

**Success Response (200):**
```json
{
  "id": 1,
  "post_id": 1,
  "author_name": "John Doe",
  "author_email": "john@example.com",
  "content": "Updated comment content",
  "status": "approved",
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `401` - Unauthorized
- `404` - Comment not found
- `500` - Failed to update comment

---

#### Delete Comment

Delete a comment.

**Endpoint:** `DELETE /api/comments/:id`

**Authentication Required:** Yes

**URL Parameters:**
- `id` (integer) - Comment ID

**Success Response (200):**
```json
{
  "success": true
}
```

**Error Responses:**
- `401` - Unauthorized
- `404` - Comment not found
- `500` - Failed to delete comment

---

### Subscribers Endpoints

#### Get All Subscribers

Retrieve all newsletter subscribers.

**Endpoint:** `GET /api/subscribers`

**Authentication Required:** No

**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "status": "active",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
]
```

**Error Responses:**
- `500` - Failed to fetch subscribers

---

#### Add Subscriber

Add a new subscriber.

**Endpoint:** `POST /api/subscribers`

**Authentication Required:** No

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Required Fields:**
- `email` (string)

**Optional Fields:**
- `name` (string)

**Success Response (201):**
```json
{
  "id": 2,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "status": "active",
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `400` - Email is required
- `500` - Failed to create subscriber

---

#### Update Subscriber

Update subscriber information.

**Endpoint:** `PUT /api/subscribers/:id`

**Authentication Required:** Yes

**URL Parameters:**
- `id` (integer) - Subscriber ID

**Request Body:**
```json
{
  "name": "Updated Name",
  "status": "inactive"
}
```

**Status Values:**
- `active` - Active subscriber
- `inactive` - Unsubscribed

**Success Response (200):**
```json
{
  "id": 1,
  "name": "Updated Name",
  "email": "john@example.com",
  "status": "inactive",
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `401` - Unauthorized
- `404` - Subscriber not found
- `500` - Failed to update subscriber

---

#### Delete Subscriber

Delete a subscriber.

**Endpoint:** `DELETE /api/subscribers/:id`

**Authentication Required:** Yes

**URL Parameters:**
- `id` (integer) - Subscriber ID

**Success Response (200):**
```json
{
  "success": true
}
```

**Error Responses:**
- `401` - Unauthorized
- `404` - Subscriber not found
- `500` - Failed to delete subscriber

---

### Analytics Endpoints

#### Get Analytics Summary

Retrieve analytics summary including counts and time series data.

**Endpoint:** `GET /api/analytics/summary`

**Authentication Required:** No

**Success Response (200):**
```json
{
  "counts": {
    "posts": 42,
    "comments": 156,
    "subscribers": 89,
    "categories": 5
  },
  "timeseries": [
    {
      "date": "2024-01-09",
      "count": 3
    },
    {
      "date": "2024-01-10",
      "count": 5
    },
    {
      "date": "2024-01-11",
      "count": 2
    },
    {
      "date": "2024-01-12",
      "count": 7
    },
    {
      "date": "2024-01-13",
      "count": 4
    },
    {
      "date": "2024-01-14",
      "count": 6
    },
    {
      "date": "2024-01-15",
      "count": 8
    }
  ]
}
```

**Description:**
- `counts` - Total counts for each entity type
- `timeseries` - Daily post creation counts for the last 7 days

**Error Responses:**
- `500` - Failed to fetch analytics summary

---

### Profile Endpoints

#### Get User Profile

Get the authenticated user's profile.

**Endpoint:** `GET /api/profile`

**Authentication Required:** Yes

**Success Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "admin",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

**Error Responses:**
- `401` - Unauthorized
- `500` - Failed to fetch profile

---

#### Update User Profile

Update the authenticated user's profile.

**Endpoint:** `PUT /api/profile`

**Authentication Required:** Yes

**Request Body:**
```json
{
  "name": "Updated Name",
  "avatar_url": "https://example.com/new-avatar.jpg"
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "name": "Updated Name",
  "email": "john@example.com",
  "role": "admin",
  "avatar_url": "https://example.com/new-avatar.jpg"
}
```

**Error Responses:**
- `401` - Unauthorized
- `500` - Failed to update profile

---

### Settings Endpoints

#### Get Settings

Get application settings.

**Endpoint:** `GET /api/settings`

**Authentication Required:** Yes

**Success Response (200):**
```json
{
  "id": 1,
  "site_name": "AnimePulse",
  "theme": "dark",
  "notifications_enabled": 1
}
```

**Error Responses:**
- `401` - Unauthorized
- `500` - Failed to fetch settings

---

#### Update Settings

Update application settings.

**Endpoint:** `PUT /api/settings`

**Authentication Required:** Yes

**Request Body:**
```json
{
  "site_name": "AnimePulse Pro",
  "theme": "light",
  "notifications_enabled": true
}
```

**Theme Values:**
- `light` - Light theme
- `dark` - Dark theme

**Success Response (200):**
```json
{
  "id": 1,
  "site_name": "AnimePulse Pro",
  "theme": "light",
  "notifications_enabled": 1
}
```

**Error Responses:**
- `401` - Unauthorized
- `500` - Failed to update settings

---

## Code Examples

### JavaScript (Fetch API)

```javascript
// Login
const login = async () => {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'admin@animepulse.com',
      password: 'password123'
    })
  });
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
};

// Get posts with authentication
const getPosts = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3000/api/posts', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};

// Create a post
const createPost = async (postData) => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3000/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(postData)
  });
  return await response.json();
};
```

### cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@animepulse.com","password":"password123"}'

# Get posts
curl http://localhost:3000/api/posts

# Create post (with authentication)
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "New Post",
    "content": "Post content...",
    "status": "published"
  }'
```

---

## Changelog

### Version 1.0.0 (Current)
- Initial API release
- Authentication with JWT
- CRUD operations for posts, categories, comments, subscribers
- Analytics endpoints
- Profile and settings management

---

## Support

For issues or questions:
- Open an issue on GitHub
- Contact: benkacem.ibrahim.dev@gmail.com

---

**Last Updated:** December 2024
