# Express Better Async Wrap

[![NPM version](https://img.shields.io/npm/v/express-better-async-wrap.svg?style=flat-square)](https://www.npmjs.com/package/express-better-async-wrap)
![CircleCI](https://img.shields.io/circleci/project/github/lynxtaa/express-better-async-wrap.svg?style=flat-square)

Allows [fastify-like](https://www.fastify.io/docs/latest/Routes/#async-await) usage of async functions as Express router handlers.

Unlike [express-async-wrap](https://www.npmjs.com/package/express-async-wrap) it calls response.send with returned data automatically.

## Install

```bash
npm install express-better-async-wrap --save
```

## Usage

### Wrapping async route handler

```javascript
const wrap = require('express-better-async-wrap')

app.get('/data', wrap(async (req, res) => {
  const data = await getDataSomehow()
  return data
}))
```

**Warning:** You can't return `undefined`, otherwise `res.send` won't be called

### Responding inside route handler

```javascript
const wrap = require('express-better-async-wrap')

app.get('/file', wrap(async (req, res) => {
  await writeFile(path)
  res.sendFile(path)
}))
```

**Warning:** If you are responding inside route handler, you must return `undefined`

### Wrapping error handler middleware

```javascript
const wrap = require('express-better-async-wrap')

app.use(wrap(async (err, req, res, next) => {
  await doSomethingAsync()
  res.status(500).send('Something broke!')
}))
```

### Customizing response behaviour

Use the `wrap.custom` symbol to override default response behavior:

```javascript
const wrap = require('express-better-async-wrap')

const customWrap = fn => {
  const wrapped = wrap(fn)

  // Custom response handler
  // Will be called with (req, res, next)(data) if data is NOT undefined
  const customResponseHandler = (req, res, next) => data => res.send({ data })

  wrapped[wrap.custom] = customResponseHandler
  return wrapped
}

// Will respond with { data: users }
app.get('/users', customWrap(async (req, res) => {
  const users = await getUsers()
  return users
}))
```
