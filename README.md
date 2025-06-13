# Home Library Service

## Description
This project is a Node.js/NestJS-based REST API for managing users, artists, albums, tracks, and favorites.

## Prerequisites
- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker - [Download & Install Docker Desktop](https://docs.docker.com/engine/install/) (Docker + Docker Compose)  
See more on Docker installation and various commands used to develop with Docker in [README-Docker.md](README-Docker.md)

## Postgress database
Will only run in container, no local installation nessesary.

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

Make sure database is running  
```sh
   npm run docker:dev:up
  ```
Run locally  
- **Development mode**  
```sh
  npm run start:dev
  ```

- **Production mode**
```sh
  npm run build
  npm run start
  ```
These commands runs the app locally using the database running in Docker container  

You can stop the container when done 
```sh
   npm run docker:dev:down
  ```


## API Usage

The API provides CRUD endpoints for Users, Artists, Albums, Tracks, and Favorites.

- **Swagger/OpenAPI documentation:**  
  Access API documentation at:  
```cmd
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
Also you can run end-to-end test. (Make sure api is up and running)
```sh
   npm run test
   ```

# Run Api in container using Docker Compose
Make sure Docker Desktop is installed  
### Usage
```CMD
npm run docker:up
```
Browser client  
```
http://localhost:4000
```
You should see logs in console vindow  
Stop containers press CTRL+C  
Remove containers
```CMD
npm run docker:down
```

### Check database files and logs to be stored in WSL volumes instead of container
#### Browse database files
```
\\wsl.localhost\docker-desktop\mnt\docker-desktop-disk\data\docker\volumes\nodejs2025q2-service_db_data\_data
```
#### Browse database log files
```
\\wsl.localhost\docker-desktop\mnt\docker-desktop-disk\data\docker\volumes\nodejs2025q2-service_db_logs\_data
```
### Npm script for vulnerabilities scanning 
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


## Docker Hub images
[Images are uploaded here](https://hub.docker.com/repositories/iesper)

