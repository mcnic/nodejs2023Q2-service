# Home Library Service

# Docker Install and Testing

```
cp .env.example .env
npm run docker:clear
npm run docker:up
```

or `npm run docker:upd` for daemon mode, in this case You can use `npm run docker:logs` for view container logs

## Testing

`npm run docker:test:auth`
`npm run docker:test:refresh`

## Docker scout for vulnerabilities scanning

- local install & run

```
curl -fsSL https://raw.githubusercontent.com/docker/scout-cli/main/install.sh -o install-scout.sh
sh install-scout.sh

'nmp run scan' or 'docker scout cves mcnic/rs-nest-service-app
```

- run scanning in container `npm docker:scan`

## Clering container and all unused docker's data

`npm run docker:clear`

- for clearing all unused containers & volumes run `npm run docker:prune`

# Fix trouble with start
If on start container appiere error like
```
initdb: error: directory "/var/lib/postgresql/data" exists but is not empty
...
initdb: hint: If you want to create a new database system, either remove or empty the directory "/var/lib/postgresql/data" or run initdb with an argument other than "/var/lib/postgresql/data".
...
Error: P1001: Can't reach database server at `db`:`5432`
```

p.s. May be docket don't start becouse conflict of names containers. For resolve shuld be make change name this container to unique.
docker-compose.yaml:
```
version: '3.8'
services:
  db:
    build:
      context: ./db
      dockerfile: ./Dockerfile
    restart: unless-stopped
    environment:
      - POSTGRES_USER=${PG_USER}
      - POSTGRES_PASSWORD=${PG_PASSWORD}
      - POSTGRES_DB=${PG_NAME}
      - PGDATA=/var/lib/postgresql/data/db-nest-api/
    volumes:
      - pgdata:/var/lib/postgresql/data
      - pglog:/var/lib/postgresql/data/log
    command:
      [
        'postgres',
        '-c',
        'logging_collector=on',
        '-c',
        'log_directory=/var/lib/postgresql/data/log',
        '-c',
        'log_statement=all',
      ]
    networks:
      - my_network
    ports:
      - ${PG_PORT}:${PG_PORT}

  app:
    image: mcnic/rs-nest-service-app
    restart: unless-stopped
    env_file:
       - .env
    environment:
      - DATABASE_URL=${DATABASE_URL}
    ports:
      - ${PORT}:${PORT}
    depends_on:
      - db
    networks:
      - my_network
    volumes:
      # - ./logs:/usr/src/app/logs
      - ./src:/app/src
    command: ['npm', 'run', 'migrate:start:dev']

  pgadmin:
    image: dpage/pgadmin4
    restart: on-failure
    container_name: pgadmin4
    environment:
      - PGADMIN_DEFAULT_EMAIL=${PGADMIN_DEFAULT_EMAIL}
      - PGADMIN_DEFAULT_PASSWORD=${PGADMIN_DEFAULT_PASSWORD}
      - PGADMIN_LISTEN_PORT=80
    ports:
      - '8080:80'
    volumes:
      - pgadmin-data:/var/lib/pgadmin
    depends_on:
      - db
    networks:
      - my_network

volumes:
  pgdata:
  pglog:
  pgadmin-data:
  node_modules:
  # logs:

networks:
  my_network:
    driver: bridge
```


- remove old contariners:
```
docker compose rm
```

- build new containers and start:
```
docker compose up --build
```


## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm install
```

## Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser

- OpenAPI documentation by typing http://localhost:4000/api/.
- Pgadmin `http://localhost:8080`

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging

### Swagger

after run node, open web page http://localhost:4000/api/

## Manuals

### Containers

run postgres container:

```
cd db
docker build -t pgres .
docker run -it --rm -p 5432:5432 -e POSTGRES_PASSWORD=postgres pgres
```

shell in docker container `docker compose exec db sh`

may be add '-d' key for daemon mode

container for main app container:

```
docker build -t node-service .
docker run -it --rm -p 4000:4000 -v ./src:/app/src node-service
```

### Test database:

`psql -h localhost -p 5432 -U postgres -d postgres -W`

run all containers: `docker compose up`

### Pgadmin:

1. `http://localhost:8080` with login `PGADMIN_DEFAULT_EMAIL` and password `PGADMIN_DEFAULT_PASSWORD` from .env
1. add server. Hostname may be found: run `docker inspect <postgres container's id> |grep Hostname`, e.g. a043d2f46a82.
   Login and password - from .env

### Migration

`npx prisma migrate dev`

to add new migration `npx prisma migrate dev --name "init"`

to seed `npx prisma db seed`

### Share

for clear all cache `docker system prune -a`
show log watch `docker compose logs -f`, or once `docker logs <container>`
