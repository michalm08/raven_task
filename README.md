## Running the Project

### 1. Clone the repository:

```bash
git clone 'https://github.com/michalm08/raven_task.git'
```

### 2. Client-side setup:
Navigate to the client directory and run:
```bash
npm install
npm start
```

### 3. Server-side setup:
Navigate to the server directory and run:
```bash
npm install
npm start
```
This will start the server with nodemon enabled, so any changes made will automatically refresh the server.

## Database Information

This project utilizes a test cluster with a database named `parkingTask` available at:

[ParkingTask Database - Live Test](http://live-test.ravendb.net/studio/index.html#databases/documents?&database=parkingTask)

If the database is deleted, you will receive the following alert:
'Failed to load area. DatabaseDoesNotExistException'

In this case, you will need to manually add a database named `parkingTask` to continue using the project.
