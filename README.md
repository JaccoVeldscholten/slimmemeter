[![Docker Build & Deploy](https://github.com/JaccoVeldscholten/SlimmeMeterDashboard/actions/workflows/docker.yml/badge.svg)](https://github.com/JaccoVeldscholten/SlimmeMeterDashboard/actions/workflows/docker.yml)
[![Arduino Dummy Meter](https://github.com/JaccoVeldscholten/SlimmeMeterDashboard/actions/workflows/arduino.yml/badge.svg)](https://github.com/JaccoVeldscholten/SlimmeMeterDashboard/actions/workflows/arduino.yml)

# Smart Sensor P1 Reader

This project has been developed to read the smart meter (DSMR) meters. The DSMR meters are used in the Netherlands and Belgium.

To get a nice overview on a website, a Dashboard has been written in React. The API for communication is via a REST API. This API is written in NodeJS. MongoDB is used to store the meter values. This can be hosted via MongoDB or you can use your own hosting.

A hardware technical part has also been made. A solution with a Raspberry Pi (Zero W) or a self-designed printed circuit board. 

## Hardware

There are 2 variants to use for the hardware to read the P1 meter

### Raspberry Pi with P1 USB

This option can be used for any type of DSMR meter. Via the USB dongle it is possible to call the python script from the hardware folder. It then makes POST requests to the REST API. A disadvantage of this method is that you have to use a power supply and the Raspberry Pi requires more energy than a custom circuit board.

More information about the hardware can be found under the folder hardware.

### P1 Meter PCB developed

A meter with a version higher than DSMR 4, it is possible to request power from the meter itself to power the reader. By using an RJ11 it is possible to connect this printed circuit board. Just like the Raspberry Pi, it will send POST Requests to the API.

![render](/images/comp.png)

More information about the hardware can be found under the folder hardware.



## Setup
Setting up the system can be done easily with docker compose.

Initially, files must be modified with the correct links. More information can be found in the component folder.
- Frontend
- Backend (REST API)

Starting up is possible in 3 ways. NPM, Docker or Kubernetes.
The recommended way is using Docker / Kubernetes.

However, the data must be modified in the /env folder. This should contain the corrosive MongoDB data

- backend.env user & password mongodb
- frontend.env for setting the right API Url
- mongo.env for self-hosting with docker/kubernetes

#### Access
After setup its possible to route to the following ports

| Port | Description                                               |
|------|-----------------------------------------------------------|
| 3010 | Backend API Port. This port is used by default.           |
| 3000 | Frontend Port for Dashboard. This port is used by default |

### NPM
Setting up with NPM is easy. If you want to use mongoDB, you will have to set it up yourself. Docker can do this automatically.
Navigate to the component's folder, then run the following commands:


```python
# From /backend
npm install 
npm start

# From /frontend
npm install
npm i react
npm i react-scripts
npm start
```

### Docker
Setting up with docker is recommended. Because this configuration has been tested.
To start the frontend and backend both at the same time, you can run the following commands from the root directory. Docker must be installed.
```python
# From /
docker-compose up
```
### Kubernetes
Setting up with kubernetes is easy. Use the Deploy.yaml and Service.yaml found in the root directory.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
The project may at all times be copied and used where necessary. There is absolutely no warranty on the system. It is as it is.

[MIT](https://choosealicense.com/licenses/mit/)
