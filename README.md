##MICROSERVICE APPLICATION

To start the service:
```
docker-compose up
```

To start the tests (depend on mongodb container):
```
npm run test
```

### Gateway

- GET /cars

**Query parameters:**
    mark: string,
    color: string,
    currency: ["usd", "eur"],
    limit: number

### Cars Generator
- GET /cars/generator

**Query parameters:**
    count: number
    
- GET /cars

**Query parameters:**
    mark: string,
    color: string,
    currency: number,
    limit: number
    
- GET /cars/:id

**Query parameters:**
    currency: ["usd", "eur"]

- POST /cars

**Body parameters:**
    mark: string,
    color: string,
    price: number
    
- PUT /car/:id

**Body parameters:**
    mark: string,
    color: string,
    price: number
    
- DELETE /car
- DELETE /car/:id
