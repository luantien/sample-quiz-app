# quiz-socket-api

## Project Setup
- At root directory launch local `redis` docker container
```sh
docker compose up -d
```

- At `app` location, run:
```sh
npm install
```

## Run the API Services
- At `app` location, run:
```sh
npm run app
```

## Some information on how it look
- Before joinning a room, a host need to create the room code.

![QuizApp1](/docs/img/quiz_app_1.png)

- After joinning a room, other players can see each other, the host can see all participants.

![QuizApp2](/docs/img/quiz_app_2.png)

- A sample api service logs when player join and leave the room.

![QuizApp3](/docs/img/quiz_app_3.png)