# Debian/Ubuntu Software Packages Trotter

Displays information about software packages on a debian and or ubuntu systems via HTML user interface. On any debian 
and or ubuntu system, this information can be found in a status file in the directory `/var/lib/dpkg/status`. 

## Version 
`0.0.1`

## Demo

[Demo]() 

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

## API

1. `localhost:8080/` : Renders the names of all os packages contained in the status file, each name is rendered 
as a link that can be clicked. In the background it uses the class Parser to parse the status file content into JSON format
before passing the JSON data to the templates for rendering.


2. `localhost:8080/:ospackageName` : Renders detailed information about a clicked os package name on the index page. Also
uses the class Parser in the background. 


## Parser

A class that is initialized with the string value of the data contained in the status file. It exposes the API 
`parseOsPackageFields` which does not take any params but returns a Promise that resolves with an array of OS packages.

#### Example data return from calling `parseOsPackageFields`

```
[
    {
        name: string,
        description: string,
        depends: string,
        reverseDepends: string
    }
]
```

## File reader

Reading the status file from the system is done using the `readFileFromPath` method. Depends on `node:fs` and `node:os`
Checks the OS type to determine which file to render. If the OS type is Linux, it reads the file from `/var/lib/dpkg/status`
and if not, it uses `sample.txt` included with the code. The content of the `sample.txt` file is copied from a status file
on a debian system. `readFileFromPath` returns a Promise that resolves with a `string`.

## Server

The server uses `Fastify`. A Node.js framework that provides high performant (can serve up to 30,000 req/sec), extensible,
logging out of the box, developer friendly and Typescript ready features. [Readmore](https://www.fastify.io/)

For rendering HTML user interface, `Liquidjs` is used. Liquid provides templates that are highly readable, fault-tolerant,
with zero dependency and Typescript strict. [Readmore](https://liquidjs.com/index.html)

## Testing

Unit testing is done using `Node tap`. [Readmore](https://node-tap.org/)

## Design process

A snapshot of notes and diagrams used in the system design process are shown below. 

![IMG_7396.webp](design-snap-shots%2FIMG_7396.webp)
![IMG_7397.webp](design-snap-shots%2FIMG_7397.webp)
![IMG_7398.webp](design-snap-shots%2FIMG_7398.webp)
![IMG_7399.webp](design-snap-shots%2FIMG_7399.webp)
![IMG_7400.webp](design-snap-shots%2FIMG_7400.webp)
![IMG_7401.webp](design-snap-shots%2FIMG_7401.webp)