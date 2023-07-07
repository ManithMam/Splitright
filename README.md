# SplitRight

## Members

| Full name | Student short | Matriculation number
| ------ | ------ | ------ |
| Aleksandra Gidionova | ag186 |43365|
| Antti-Pekka Kuivalainen | ak366 | 5010497 |
| Arda Uslu | au023 | 5010615 |
| Isaac Morales | im050 | 44904 |
| Manith Mam | mm334 | 43361 |
| Valentin Schiffner | vs116 | 43327 |


## Short project abstract (only one or two sentences)

Fun way to share expenses with friends. With a simple game with three different modes (Communist, Lucky, Random), friends join a lobby and await the _**thrilling**_ moment to discover how much each of them will have to pay.

## Getting started guide

### Start

1. copy the **.example.env** in the same directory and rename it to **.env**
1. `docker compose up`

### Generate demo data / populate the database

POST http://localhost:3000/populateDb (no body, no token)

### Where to open 
 - frontend 1: http://localhost:3001
 - frontend 2: http://localhost:3002
 - frontend 3: http://localhost:3003

### Login credentials
- **username**: `jenny123`, `sam99`, `rose98`, `peter1506`, `debby777`, `john00`
- **password**: `password`

### Additional

**Swagger UI:** http://localhost:3000/api

## Testing

### Frontend

- **Component & Unit test**: 
  - **GameInfoBox.tsx** and **Login.tsx**
  - `npx jest --coverage`
- **e2e**: 
  - for **login and logout**
  - `npx cypress open`

### Backend

- **Unit Tests:**
  - for **accounts.service.ts** (didn't test the controller since it only calls the service)
  - `npm test -- --coverage`

- **e2e**: 
  - for **Account** (backend\test\accounts.e2e-spec.ts)
  - `npm run test:e2e`
