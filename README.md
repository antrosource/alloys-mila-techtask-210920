# Ukufu Tech Task

This task has been implemented in node.js. Specifically tested with v14.3.0 but anything above v10 should work

## Usage

1. To install Node.js, you can get the binaries at https://nodejs.org/en/ or use nvm. https://github.com/nvm-sh/nvm

2. With node.js installed, install the dependencies via npm.

```bash
# at the root of the project

$ npm install
```

### Using Docker

A Dockerfile is provided at the root folder.

You can build an image

```bash
docker build -t "ukufutask:v1" .
```

This image can then run using the `docker run` command.  
**NOTE:** The image exposes port 8080, where the http server should be listening on.

### HTTP Requests

A `GET` request to `/lunch` will return a list of available recipes. The response looks like this.

```json
{
  "recipes": [
    "Ham and Cheese Toastie",
    "Salad",
    ...
  ]
}
```

## Tests

This project uses `jest` as the test runner.

```bash
$ npm test
```
