# Proa Weather API (Backend)

This is the backend application for the Proa coding challenge. It is built with **NestJS**, uses **SQLite** via **TypeORM**, and exposes weather station data through a JSON API.

## Features

- Import weather station, variable, and measurement data from CSV files
- Seed database using a custom service
- Expose weather station data via REST endpoints
- Include latest measurement values per station
- Filter stations by Australian state

## Tech Stack

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [SQLite](https://www.sqlite.org/index.html)
- [CSV Parser](https://www.npmjs.com/package/csv-parser)

## Getting Started

### 1. Clone the repository

```
git clone https://github.com/nxurhan/proa-api.git
cd proa-api
```

### 2. Install dependencies
```
npm install
```

### 3. Run the server
```
npm run start:dev
```

###  Seed the Database (for current or new files)
To import CSV files into the database:

CSV files located in the /data folder:

weather_stations.csv

variables.csv

data_<id>.csv (for measurements)

Run the seed script:
```
npm run seed
```

### API Endpoints
Get All Weather Stations with Latest Measurements
GET /weather-stations

Filter by State
GET /weather-stations/by-state?state=VIC
Response json
~~~
[
  {
    "id": 1,
    "ws_name": "Cohuna North",
    "site": "Cohuna Solar Farm",
    "portfolio": "Enel Green Power",
    "state": "VIC",
    "latitude": -35.88,
    "longitude": 144.21,
    "latestMeasurements": [
      {
        "long_name": "Global Horizontal Irradiance",
        "unit": "W/m²",
        "value": 895,
        "timestamp": "2023-08-29T03:00:00.000Z"
      }
    ]
  }
]
~~~

### Project Structure
~~~
├── data/
│   ├── weather_stations.csv
│   ├── variables.csv
│   ├── data_1.csv ... data_10.csv
├── seed/
│   └── seed.service.ts
├── src/
│   ├── entities/
│   │   ├── weather-station.entity.ts
│   │   ├── variable.entity.ts
│   │   └── measurement.entity.ts
│   ├── weather-stations/
│   │   ├── weather-stations.module.ts
│   │   ├── weather-stations.controller.ts
│   │   └── weather-stations.service.ts
│   ├── app.module.ts
│   ├── app.controller.ts
|   └── main.ts
├── weather.db
├── README.md
~~~
