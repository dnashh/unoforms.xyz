# Unoforms.xyz
Open Source Form Handling Software with an API and Dashboard
Built with NodeJS and Sveltekit + TailwindCSS

# Video Demo

https://github.com/dnashh/unoforms.xyz/assets/77490109/2ada88d3-eba5-4ff1-af0b-144de7688fcb

# Installation

> Before Installation make sure you have access to a Postgres Database either locally or hosted somewhere. And Add the credentials as env in the dockerfile. Postgres ENV variables are prefixed with PG. (eg: PGHOST, PGDATABASE etc) 

 1. Clone the Repository
 1. Make sure that you have docker Installed on your PC / Server
 1. Run the Following Commands

    ``` bash
        # To build the Docker Image
        docker build -t unoforms.xyz

        # To run the built image
        docker run -p 9000:9000 --network="host" unoforms.xyz
    ```
 1. Now the App is running at http://localhost:9000 
