# Portfolio Backend API

REST API for the portfolio website.

## Base URL
```
http://localhost:8000
```

## Auth Endpoints
```
POST /api/v1/users/login
POST /api/v1/users/logout
```

## Portfolio Endpoints
```
GET    /api/v1/portfolio        # get latest portfolio
GET    /api/v1/portfolio/all    # list all portfolio documents
GET    /api/v1/portfolio/:id    # get by id
POST   /api/v1/portfolio        # create
PUT    /api/v1/portfolio/:id    # replace by id
PATCH  /api/v1/portfolio/:id    # update by id
DELETE /api/v1/portfolio/:id    # delete by id
```

## Notes
- Portfolio payload can be sent as `{ "data": { ... } }` or directly as `{ ... }`.
- The admin UI uses the login endpoint for basic access control.