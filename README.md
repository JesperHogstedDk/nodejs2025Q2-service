# Home Library Service

## Description
This project is a Node.js/NestJS-based REST API for managing users, artists, albums, tracks, and favorites.

## Installation for local use and development 

1. **Clone the repository**
   ```sh
   git clone https://github.com/JesperHogstedDk/nodejs2025Q2-service/tree/service/development
   cd nodejs2025Q2-service
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Create a `.env` file**
   - Copy `.env.example` to `.env` and adjust variables as needed (e.g., `PORT=4000`).

## Running the Application

- **Development mode**
  ```sh
  npm run start:dev
  ```

- **Production mode**
  ```sh
  npm run build
  npm start
  ```

## Usage

The API provides CRUD endpoints for Users, Artists, Albums, Tracks, and Favorites.

- **Swagger/OpenAPI documentation:**  
  When the server is running, access the documentation at:  
  ```
  http://localhost:4000/doc
  ```

### Example Endpoints

- `GET /user` – Get all users
- `POST /artist` – Create a new artist
- `GET /favs` – Get all favorites
- `POST /favs/track/:id` – Add a track to favorites

See the Swagger documentation for a complete overview of all endpoints and their usage.

## Testing

You can use tools like Postman or Swagger UI to test the API.

---

**Note:**  
This application uses in-memory storage. All data will be reset when the server restarts.


## Using Docker Hub
Make sure Docker Desktop is installed  
To run remote image in local Docker container
```CMD
docker run -dp 0.0.0.0:4000:4000 iesper/home-library
```
### Run using Docker Compose
Make sure Docker Desktop is installed  
Production
```CMD
docker compose -f docker-compose.prod.yaml up --build
```
Development
```CMD
docker compose -f docker-compose.dev.yaml up --build
```
You should see logs in console vindow  
Stop watching logs and stop containers CTRL+D  
Remove containers
Development
```CMD
docker compose -f docker-compose.dev.yaml down
```

# Docker
See Docker installation and various commands used to develop with Docker in [README-Docker.md](README-Docker.md)

# Postgress
