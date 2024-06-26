---
title: Docker Deployment Guide
description: A step-by-step guide on how to deploy the self-hosted Stellar Chat application using Docker containers. Follow our detailed instructions for containerizing your application, setting up the Docker environment, and deploying it to your preferred hosting environment.
---

Docker images can be found [here](https://hub.docker.com/u/ktutak). Make sure Docker and Docker Compose plugin are installed. 

Find installation instructions [here](https://docs.docker.com/engine/install/).

1. Create the `StellarChat` directory:

```bash
mkdir StellarChat && cd StellarChat
```

2. Download the `.env.example` file:

Using `wget`:

```bash
wget https://raw.githubusercontent.com/ktutak1337/Stellar-Chat/main/docker/.env.example
```

or using `curl`

```bash
curl -O https://raw.githubusercontent.com/ktutak1337/Stellar-Chat/main/docker/.env.example
```

3. Create your `.env` file by copying and adjusting the `.env.example` file:

```bash
cp .env.example .env
```

Edit the .env file with your specific values.

Alternatively, you can create a file named `.env` and copy the content below into it:

```bash
API_URL=<your_backend_url>  
MONGO_DATABASE=StellarChat # Keep this value or change as desired
MONGO_INITDB_ROOT_USERNAME=<your_mongodb_username>
MONGO_INITDB_ROOT_PASSWORD=<your_mongodb_password>
QDRANT_ENDPOINT=http://stellar-chat-qdrant:6333
SEQ_URL=http://stellar-chat-seq:5341
SEQ_API_KEY=<your_seq_api_key>
SEQ_ADMIN_PASSWORD=<your_seq_admin_password>
CORS_ALLOWED_ORIGINS=*
OPENAI_API_KEY=<your_openai_api_key>
```

4. Download the `docker-compose.yaml` file:

Using `wget`:

```bash
wget https://raw.githubusercontent.com/ktutak1337/Stellar-Chat/main/docker/docker-compose.yaml
```

or using `curl`

```bash
curl -O https://raw.githubusercontent.com/ktutak1337/Stellar-Chat/main/docker/docker-compose.yaml
```

Alternatively, you can create a file named `docker-compose.yaml` and copy the content below into it:

```yaml
services:
  webapp:
    image: ktutak/stellarchat-web:latest
    container_name: stellarchat-web
    hostname: stellar-chat-web
    restart: unless-stopped
    environment:
      - API__URL=${API_URL}
    ports:
      - 7080:7080
    networks:
      - stellarchat-network
    depends_on:
      - webapi

  webapi:
    image: ktutak/stellarchat-api:latest
    container_name: stellarchat-api
    hostname: stellar-chat-api
    restart: unless-stopped
    environment:
      - OPENAI__API_KEY=${OPENAI_API_KEY}
      - MONGO__CONNECTION_STRING=mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@stellar-chat-mongo:27017
      - MONGO__DATABASE=${MONGO_DATABASE}
      - QDRANT__ENDPOINT=${QDRANT_ENDPOINT}
      - SEQ__URL=${SEQ_URL}
      - SEQ__API_KEY=${SEQ_API_KEY}
      - CORS__ALLOWED_ORIGINS=${CORS_ALLOWED_ORIGINS}
    ports:
      - 8080:8080
    networks:
      - stellarchat-network
    volumes:
      - webapi_data:/app/_data
    depends_on:
      - mongodb
      - qdrant

  mongodb:
    image: mongo
    container_name: stellarchat-mongo
    hostname: stellar-chat-mongo
    restart: unless-stopped
    environment:
    - MONGO_INITDB_ROOT_USERNAME=${MONGO_INITDB_ROOT_USERNAME}
    - MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD}     
    ports:
      - 27017:27017
    networks:
      - stellarchat-network
    volumes:
      - mongo_data:/data/db
  
  seq:
    image: datalust/seq 
    container_name: stellarchat-seq
    hostname: stellar-chat-seq
    restart: unless-stopped
    environment:
      - ACCEPT_EULA=Y
      # - SEQ_FIRSTRUN_ADMINPASSWORDHASH=${SEQ_ADMIN_PASSWORD}
    networks:
      - stellarchat-network
    ports:
      - 5341:80
    volumes:
      - seq_data:/data
  
  qdrant:
    image: qdrant/qdrant:latest
    container_name: stellarchat-qdrant
    hostname: stellar-chat-qdrant
    restart: unless-stopped
    networks:
      - stellarchat-network
    ports:
      - 6333:6333
    volumes:
      - qdrant_data:/data

networks:
  stellarchat-network:
    driver: bridge

volumes:
  webapi_data:
  seq_data:
  mongo_data:
  qdrant_data:

```

5. Run Docker Compose:

```bash
docker-compose up -d
```

## Environment Variables

- `API_URL`: URL for the StellarChat backend API (e.g., http://localhost:7123).
- `MONGO_DATABASE`: Name of the MongoDB database (default: StellarChat).
- `MONGO_INITDB_ROOT_USERNAME`: MongoDB root username.
- `MONGO_INITDB_ROOT_PASSWORD`: MongoDB root password.
- `QDRANT_ENDPOINT`: URL for Qdrant vector search engine (http://stellar-chat-qdrant:6333).
- `SEQ_URL`: URL for Seq logging server (http://stellar-chat-seq:5341).
- `SEQ_API_KEY`: API key for Seq.
- `SEQ_ADMIN_PASSWORD`: Admin password for Seq.
- `CORS_ALLOWED_ORIGINS`: Allowed origins for CORS (e.g., * or http://localhost:7080).

**Model Keys**
- `OPENAI_API_KEY`: Key for accessing OpenAI services.

Enjoy using Stellar Chat! 🚀