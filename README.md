# Don't leave 'em hanging!

The goal is to give as many high fives and fist bumps as humanly possible.

If you're interested in how everything works behind the scenes and/or are interested in helping out, please consult the [DEVELOPMENT.md](DEVELOPMENT.md) file.

## Install

Clone this repository....
```bash
git clone https://github.com/rvdleun/dont-leave-em-hanging.git
```

Install the dependencies...
```bash
npm install
```

## Serve

To serve the files locally, run the following command...
```bash
npm run dev
```
The project will now be available on `http://localhost:8000` and will auto-refresh when any change is made.

Note that you will need serve the contents over https if you want to reach the server externally, else you won't be able to start the WebXR experience. [Ngrok](http://ngrok.io/) could help you here.

## Build

To build the project, run the following command...
```bash
npm run build
```
The result will be saved in the `dist` directory. Deploy the contents to your server.

## Directory structure

### public
Contains all the assets that will be available in the project.

### src
Contains all the Javascript files that will be minified after a build.
