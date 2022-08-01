# XRPLDatamartEngine

Datamart Engine based on XRPL

## Project Setup

1. Clone:

```
git clone https://github.com/narendrapayyala/XRPLDatamartEngine.git
cd XRPLDatamartEngine
```

2. Run cp .sample-env .env file to copy example file to .env
   Then edit your .env file with DB credentials and other settings.

3. `npm install`

4. `npm start`

## API Information

Access default reports

1. Get Balance:

Json: `http://localhost:3000/xrpl/get-balance`

CSV: `http://localhost:3000/xrpl/get-balance/csv`

PDF: `http://localhost:3000/xrpl/get-balance/pdf`

2. Sycn reports to different DB

Test Connection: `http://localhost:3000/xrpl/db/connection`

Sync Data: `http://localhost:3000/xrpl/db/sync`

3. Transactions: `https://localhost:3000/xrpl/transactions/{Address}`

#### Demo URL:

```
https://xrpl-demo-api.herokuapp.com/xrpl/get-balance
Method: POST
Body: {
  "accounts": [
    "<Address>",
    "<Address>"
  ],
  "ds_date":"28-10-2021",
}
```

```
https://xrpl-demo-api.herokuapp.com/xrpl/get-balance/csv
Method: POST
Body: {
  "accounts": [
    "<Address>",
    "<Address>"
  ],
  "ds_date":"28-10-2021",
}
```

```
https://xrpl-demo-api.herokuapp.com/xrpl/get-balance/pdf
Method: POST
Body: {
  "accounts": [
    "<Address>",
    "<Address>"
  ],
  "ds_date":"28-10-2021",
}
```

```
https://xrpl-demo-api.herokuapp.com/xrpl/db/connection
Method: POST
Body: {
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "user": "root",
  "password": "root",
  "database": "test"
}
```

```
https://xrpl-demo-api.herokuapp.com/xrpl/db/sync
Method: POST
Body:{
  "type: "mysql"
  "host": "localhost",
  "port": 3306,
  "user": "root",
  "password": "root",
  "database": "test",
  "ds_date":"28-10-2021",
  "accounts": [
    "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w"
  ]
}
```

```
https://xrpl-demo-api.herokuapp.com/xrpl/transactions/{Address}
Method: GET
```
