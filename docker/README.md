This directory contains scripts and configurations for various Docker containers that may be used with
this application. This includes a Docker container for development (for local development and build server)
and a separate Docker container for running the published application in production.

# Running the containers

There is a `start` script in the projects root directory to get you started and make working with the 
command line and Docker a bit easier. The start script will ensure that the image is locally built and 
a container is up and running.

Note that depending on your host environment (ie Windows or *nix), you will execute the start command
slightly differently:

Windows
```
start.bat [script] [clean]
```

*nix
```
sh start.sh [script] [clean]
```

There are 2 optional arguments provided to the start script:

* [script] - This is the name of a script to run in the docker directory on start (ie start build). You can 
add additional scripts into the docker container and call them by name here.
* [clean] - This is an option you can pass to run the script and force a clean rebuild of the image (ie start clean or start build clean).

## (default)

```
start [clean]
```

This will use the `Dockerfile.dev` configuration to build a local development environment (if not already) then run 
the container, attach the local application directory on the host to the container and finally leave you at the 
command line with the application directory. You may now execute application commands from within the 
context of the container rather than the host.

## dev

```
start dev [clean]
```

Same as the above (default), but rather than leave you at the command line, this will execute the `dev.sh` script 
which will make sure all dependencies are installed and then run the application in development mode.

## build

```
start build [clean]
```

Same as the above (default), but rather than leave you at the command line, this will execute the `build.sh` script 
which will make sure all dependencies are installed and then test, build, document and finally publish a production 
ready Docker image using the `Dockerfile.prod` configuration.

If the build is successful, it will create a new production docker image for the application and save a new 
TGZ file to your project directory. You can run the newly saved image either locally or after deploying to a 
destination server:

```
docker load -i ./webpack-starter.tgz
docker run -p 8080:8080 -it --rm --name webpack-starter webpack-starter
```

Note, replace the first `8080` with the port to run on your host and also  
replace `webpack-starter` with the name of your application as specified
in the options for `docker.properties`.

# Options

There is a `docker.properties` file you can use to configure the way start scripts are executed.

## APP_NAME

Set this value to a unique name for your application. This will be used to create the Docker 
image and container names and should be unique per application. The default is webpack-starter.

## HOST_PORT

Set this value to the port number you want the development server to mount on the local host. The
default is 8080.

## APP_SERVER

Set this value to define which production docker container to use. There are currently 2 options:

### express

This is the default value, creates a NodeJS based Docker image and runs the application with the 
same express server used for development. This allows for full server-side execution of NodeJS 
and dynamic mocks.

### nginx

Use this option if you want to distribute a client-side only application that will host static 
content and not have any server-side execution. This is a fast, lighter weight option