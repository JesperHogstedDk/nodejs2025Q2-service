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
[Images are uploaded here](https://hub.docker.com/repositories/iesper)
Make sure Docker Desktop is installed  
To run remote image in local Docker container
```CMD
docker run -dp 0.0.0.0:4000:4000 iesper/home-library
```
Then browse
```
http://localhost:4000
```
Remark that this image is only using memory database   
# Run using Docker Compose
Make sure Docker Desktop is installed  
### Usage
```CMD
docker compose up
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
docker compose down
```
### Check image size
```
docker image ls
REPOSITORY                TAG       IMAGE ID       CREATED         SIZE
home-library-service      dev       349e421a56e6   2 minutes ago    1.13GB
home-library-service-db   latest    e982a9c17b6e   35 minutes ago   617MB
home-library-service      prod      f3d3dcce6cdb   58 minutes ago   592MB
getting-started           latest    affa2cc63bf2   3 days ago       733MB
adminer                   latest    6c46ebc017ea   3 weeks ago      171MB
mysql                     8.0       4890b3247d48   7 weeks ago      1.06GB
nicolaka/netshoot         latest    a20c2531bf35   12 months ago    775MB

```
### Check database files and logs to be stored in volumes instead of container
#### Browse database files
```
\\wsl.localhost\docker-desktop\mnt\docker-desktop-disk\data\docker\volumes\nodejs2025q2-service_db_data\_data
```
#### Browse database log files
```
\\wsl.localhost\docker-desktop\mnt\docker-desktop-disk\data\docker\volumes\nodejs2025q2-service_db_logs\_data
```
### Create an npm script for vulnerabilities scanning 
Scan and get a report from the Trivy tool  
   ```cmd
   npm run scan:images
   ```
#### Install Trivy for Windows

1. **Download Trivy from GitHub Releases:**
   - Go to: [https://github.com/aquasecurity/trivy/releases](https://github.com/aquasecurity/trivy/releases)
   - Download the newest Windows `.zip`-file (ie `trivy_0.50.2_Windows-64bit.zip`).
   - Extract and place `trivy.exe` on your PATH (ie `C:\tools\trivy\trivy.exe`).

2. **Test Trivy is working:**
   ```cmd
   trivy --version
   ```

3. **Run:**
   ```cmd
   npm run scan:images
   ```
4. **View reports:**   
[home-library-service:prod image](trivy-home-library-service-prod.txt)  
[home-library-service:dev image](trivy-home-library-service-dev.txt)  
[home-library-service-db:latest image](trivy-home-library-service-db.txt)  
[adminer:latest image](trivy-adminer.txt)

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
Start and stop container  
[See commands in README-Docker.md](README-Docker.md)

Browse 
```
http://localhost:8000
```
Use these credentials   
```
System: PostgreSQL  
Server: db  
User: homelibrary_user  
Password: supersecret  
Database: homelibrary  
```
# Docker
See Docker installation and various commands used to develop with Docker in [README-Docker.md](README-Docker.md)

# Postgress
