# Featurization

### Running the backend

Prerequisites:

- Create a `.env` file with:
  ` REDIS_URL=redis://localhost:6379 `
- Run the redis docker container:
  `docker compose up`

Seed redis

```
npm run seed
```

Run app

```
cd nodeapp
npm start
```

The backend runs on port `4000`.

### Running the frontend

```
cd webapp
npm start
```

The frontend runs on port `3000`.

### Compiling Protobuf files

```
cd nodeapp
protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_opt=esModuleInterop=true --ts_proto_out=. ./src/protobuf/XXX.proto
```
