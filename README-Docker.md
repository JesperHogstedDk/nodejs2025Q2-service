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
docker run -d -p 127.0.0.1:4000:4000 home-library
```

The -d flag (short for --detach) runs the container in the background. This means that Docker starts your container and returns you to the terminal prompt. Also, it does not display logs in the terminal.

The -p flag (short for --publish) creates a port mapping between the host and the container. The -p flag takes a string value in the format of HOST:CONTAINER, where HOST is the address on the host, and CONTAINER is the port on the container. The command publishes the container's port 4000 to 127.0.0.1:4000 (localhost:4000) on the host. Without the port mapping, you wouldn't be able to access the application from the host.

### Stop the container (and delete it)
Get the container-id of the contaioner
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
docker build -t home-library .
```
Tag the image
```CMD
docker tag home-library iesper/home-library
```
Then push to Docker Hub
```CMD
docker push iesper/home-library
```

## To run the app 
```CMD
docker run -dp 0.0.0.0:4000:4000 iesper/home-library
```


docker network create home-lib-app

<!-- docker run -d ^
    --network home-lib-app --network-alias postgres ^
    -v /custom/mount:/var/lib/postgresql/data ^
    -e POSTGRES_PASSWORD=mysecretpassword ^
    -e PGDATA=/var/lib/postgresql/data/pgdata ^
    postgres -->

<!-- docker run -it --network home-lib-app nicolaka/netshoot -->

docker run --name home-lib-app -e POSTGRES_PASSWORD=mysecretpassword -d postgres

docker run -it --rm --network home-lib-app postgres psql -h postgres -U postgres

# Use postgres/example user/password credentials

services:

  db:
    image: postgres
    restart: always
    # set shared memory limit when using docker compose
    shm_size: 128mb
    # or set shared memory limit when deploy via swarm stack
    #volumes:
    #  - type: tmpfs
    #    target: /dev/shm
    #    tmpfs:
    #      size: 134217728 # 128*2^20 bytes = 128Mb
    environment:
      POSTGRES_PASSWORD: mysecretpassword

  adminer:
    image: adminer
    restart: always
    ports:
      - 8080:8080
