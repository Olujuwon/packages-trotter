# Debian/Ubuntu Software Packages Trotter

Displays information about software packages on a debian and or ubuntu systems via HTML user interface. On any debian 
and or ubuntu system, this information can be found in a status file in the directory `/var/lib/dpkg/status`. 

## Demo

[Demo](https://status-file.herokuapp.com/) is hosted in Heroku

## Getting started

Clone the project:

```
git clone https://github.com/Olujuwon/packages-trotter.git
```

Install dependencies:
```
cd packages-trotter && npm/yarn install
```

## Get it up and running

The software checks OS type, uses `/var/lib/dpkg/status` if found and if not found, 
it uses a sample file containing packages information from a real status file.

```
npm start
```

The default port is 8080 so navigate to localhost:8080
