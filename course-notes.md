## Installing and Setting Up Prisma for Development

- Install prisma as a global dependency:
  `$ sudo npm install -g prisma`
- Create an app on Heroku, go to Configure Addons and search for Heroku Postgres. Add an instance to the app.
- Download and install Docker Community Edition.
- Install a GUI (such as pgAdmin) for interacting with the Postgresql database.
  - Link to database on Heroku by going to Heroku app, selecting Settings and View Credentials..., then copying info into GUI to create new server.
- Inside project, install prisma by running `$ prisma init [folder]`

## Setting Up Production Prisma Environment

- At https://app.prisma.io, select Servers, then Add Server. Go through the steps to create a new server.
- Once the server is created, add a new database to it, hosted on Heroku
- Once the database has been created, click on the new server, then click View on Heroku for the database.
