# Goosechase

The take-home test for full-stack engineers applying to Goosechase

## OVerview

This is a simple REST API that implements the following endpoints:

- `POST /api/v1/games` – create a new game
- `GET /api/v1/games` – list all games
- `GET /api/v1/games/:gid` – find a game by its ID
- `GET /api/v1/games/:gid/missions` – list all of a games's missions 
- `POST /api/v1/games/:gid/missions` – create a new mission for a game
- `GET /api/v1/games/:gid/missions/:mid` – find a mission by its ID and its associated game's ID

## Usage

The application is dockerised, which means to start it and its database server simply execute:

```shell
docker-compose up
```

To run the tests, first, ensure the database server is running (e.g., using the above command), then execute:

```shell
npm test
```

## Design

- models – value objects for data encapsulation / transfer
- controllers – request orchestration
- services – business logic / processes
- repositories – data persistence
- test – automated tests (only end-to-end so far)