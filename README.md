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
   npm ci
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

<!-- **Note:**  
This application uses in-memory storage. All data will be reset when the server restarts. -->


# Docker Hub
Make sure Docker Desktop is installed  
To run remote image in local Docker container
```CMD
docker run -dp 0.0.0.0:4000:4000 iesper/home-library
```
# Run using Docker Compose
Make sure Docker Desktop is installed  
### Usage
```CMD
docker compose -f docker-compose.yaml up
```
Browser client  
```
http://localhost:4000
```
You should see logs in console vindow  
Stop watching logs press CTRL+C  
Stop containers CTRL+D  
Remove containers
```CMD
docker compose -f docker-compose.yaml down
```
### Check image size
```
docker image ls
REPOSITORY             TAG       IMAGE ID       CREATED         SIZE
home-library-service   latest    8eb5875c6711   6 minutes ago   592MB
getting-started        latest    affa2cc63bf2   2 days ago      733MB
postgres               16        47053cd4ee3f   2 weeks ago     617MB
adminer                latest    6c46ebc017ea   3 weeks ago     171MB
mysql                  8.0       4890b3247d48   7 weeks ago     1.06GB
nicolaka/netshoot      latest    a20c2531bf35   12 months ago   775MB
```

## Docker Development container
Development with container
```CMD
docker compose -f docker-compose.dev.yaml up
```
You should see logs in console vindow 
```console
v View in Docker Desktop   o View Config   w Enable Watch
[12:57:11 PM] Starting compilation in watch mode...
home-library-service  | 
home-library-service  | [12:57:18 PM] Found 0 errors. Watching for file changes.
home-library-service  | 
home-library-service  | [Nest] 39  - 06/07/2025, 12:57:19 PM     LOG [NestFactory] Starting Nest application...
home-library-service  | [Nest] 39  - 06/07/2025, 12:57:19 PM     LOG [InstanceLoader] TypeOrmModule dependencies initialized +64ms
home-library-service  | [Nest] 39  - 06/07/2025, 12:57:19 PM     LOG [InstanceLoader] AppModule dependencies initialized +0ms
home-library-service  | [Nest] 39  - 06/07/2025, 12:57:19 PM     LOG [InstanceLoader] ArtistModule dependencies initialized +0ms
...
home-library-service  | [Nest] 39  - 06/07/2025, 12:57:19 PM     LOG [RouterExplorer] Mapped {/favs/artist/:id, DELETE} route +0ms
home-library-service  | [Nest] 39  - 06/07/2025, 12:57:19 PM     LOG [NestApplication] Nest application successfully started +3ms
home-library-service  | Application is running on: http://[::1]:4000
```
Remember to press w to enable Watch (change some code in a file will be reflected in the running app)  
Stop watching logs press CTRL+C 
Stop containers CTRL+D  
Remove containers  
```CMD
docker compose -f docker-compose.dev.yaml down
```
#### Home Library Service app
Browser client  
```
http://localhost:4000
```
#### Adminer
A PostgresSql data base admin tool 
```
http://localhost:8000
```
Logon screen to database  
System: PostgreSQL  
Server: db  
User: homelibrary_user  
Password: supersecret  
Database: homelibrary  

# Docker
See Docker installation and various commands used to develop with Docker in [README-Docker.md](README-Docker.md)

# Postgress
