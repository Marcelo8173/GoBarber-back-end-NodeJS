# GoBarber-back-end-NodeJS
Backend of a scheduling service
This project is an appointment for beauty services called GoBarber
It is created in nodeJS and uses concepts of: authentication with bcrypt and jwt; ORM with sequelize and postgresql relational database, and no relational database (mongoDB)

*** Init ***
To start just use the command yarn dev or npm dev (yarn is recommended),
and also yarn queue, to run the email queue

*** Database ***

you need three docker images to run the application

1. docker postgres image
2. docker mongo image
3. docker redis image

*** Migration ***

use the command: yarn sequelize db:migrate
this command starts the mongo and postgres database
- the redis database is initialized when an appointment is canceled

*** Email ***

the email service used is mailtrap.io, it is only for development environment.
you need to create an account on the Mailtrap.io website and pass the settings inside the file redis in config
