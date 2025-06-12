# Docker

### Install docker 
On Windows download Docker Desktop  
[Docker Desktop for Windows - x86_64](https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe?utm_source=docker&utm_medium=webreferral&utm_campaign=docs-driven-download-win-amd64)    

Install with PowerShell
```powershell
Start-Process 'Docker Desktop Installer.exe' -Wait install
```
Install with Windows Command Prompt
```cmd
start /w "" "Docker Desktop Installer.exe" install
```
Install with bash
```bash
"Docker Desktop Installer.exe" install
```

## Develop with Docker Development container
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
#### Home Library Service app
Browser client  
```
http://localhost:4000
```

Stop watching logs press CTRL+C 
Stop containers CTRL+D  
Remove containers  
```CMD
docker compose -f docker-compose.dev.yaml down
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
## Build image and push to to Docker Hub
When development is ready
```
npm run docker:build
```
If image is fine 
```
npm run docker:push
```
************ The end of the in scopre documentation *********************  

## Various Docker image related commands
### Add file .dockerignore (Is allready done in the root folder og the application)
Files and folder that should not be added to docker  

### Add Docker file (Is allready done in the root folder og the application)
This Dockerfile starts off with a node:lts-alpine base image, a light-weight Linux image that comes with Node.js and the Yarn package manager pre-installed. It copies all of the source code into the image, installs the necessary dependencies, and starts the application.  

### Build the image.
```cmd
docker build -t home-library .
```

The docker build command uses the Dockerfile to build a new image. You might have noticed that Docker downloaded a lot of "layers". This is because you instructed the builder that you wanted to start from the node:lts-alpine image. But, since you didn't have that on your machine, Docker needed to download the image.

After Docker downloaded the image, the instructions from the Dockerfile copied in your application and used yarn to install your application's dependencies. The CMD directive specifies the default command to run when starting a container from this image.

Finally, the -t flag tags your image. Think of this as a human-readable name for the final image. Since you named the image home-library, you can refer to that image when you run a container.

The . at the end of the docker build command tells Docker that it should look for the Dockerfile in the current directory.

### Start the container locally 
Run your container using the docker run command and specify the name of the image:
```cmd
docker run -d -p 127.0.0.1:4000:4000 home-library-service
docker run -dp 0.0.0.0:8080:8080 adminer
```

The -d flag (short for --detach) runs the container in the background. This means that Docker starts your container and returns you to the terminal prompt. Also, it does not display logs in the terminal.

The -p flag (short for --publish) creates a port mapping between the host and the container. The -p flag takes a string value in the format of HOST:CONTAINER, where HOST is the address on the host, and CONTAINER is the port on the container. The command publishes the container's port 4000 to 127.0.0.1:4000 (localhost:4000) on the host. Without the port mapping, you wouldn't be able to access the application from the host.

### Stop the container (and delete it)
Get the container-id of the container
```CMD
docker ps
```
Stop container
```CMD
docker stop <container-id>
```
Delete container
```CMD
docker rm <container-id> 
```

## Develop with Docker development container locally
To start a container based on the home-library image
```CMD
docker run -dp 127.0.0.1:4000:4000 ^
    -w /app --mount "type=bind,src=%cd%,target=/app" ^
    home-library ^
    sh -c "yarn install && yarn run dev"
```

### Watch the log
```CMD
docker logs <container-id>
```
Where container-id is the id of the home-library image

### Exit watching the log
```CDM
CTRL+C
```

# Docker Hub
## To share the app on Docker Hub (allready done)
Build the local image 
```CMD
docker build -t home-library-service .
```
Login
```
docker login
```
Tag the image
```CMD
docker tag home-library iesper/home-library
docker tag home-library-service:dev iesper/home-library-service:dev
```
Then push to Docker Hub
```CMD
docker push iesper/home-library
docker push iesper/home-library-service:dev
```

## To run the app 
```CMD
docker run -dp 0.0.0.0:4000:4000 iesper/home-library
```

Remove volumes
docker compose down -v
docker image prune -a
docker volume prune
docker network prune  

With enforce build
docker compose up --build

docker compose build


docker tag home-library-service:app iesper/home-library-service:app
docker push iesper/home-library-service:app


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
