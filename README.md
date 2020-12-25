# Express Better Async Wrap

![CI/CD](https://github.com/lynxtaa/express-better-async-wrap/workflows/CI/CD/badge.svg) [![npm version](https://badge.fury.io/js/express-better-async-wrap.svg)](https://badge.fury.io/js/express-better-async-wrap) [![Codecov](https://img.shields.io/codecov/c/github/lynxtaa/express-better-async-wrap)](https://codecov.io/gh/lynxtaa/express-better-async-wrap)

Allows [fastify-like](https://www.fastify.io/docs/latest/Routes/#async-await) usage of async functions as Express router handlers.

Unlike [express-async-wrap](https://www.npmjs.com/package/express-async-wrap) it calls response.send with returned data automatically.

## Install

```bash
npm install express-better-async-wrap --save
```

## Usage

### Wrapping async route handler

```js
const { wrap } = require('express-better-async-wrap')

app.get(
  '/data',
  wrap(async (req, res) => {
    const data = await getDataSomehow()
    return data
  }),
)
```

**Warning:** You can't return `undefined`, otherwise `res.send` won't be called

### Responding inside route handler

```js
const { wrap } = require('express-better-async-wrap')

app.get(
  '/file',
  wrap(async (req, res) => {
    await writeFile(path)
    res.sendFile(path)
  }),
)
```

**Warning:** If you are responding inside route handler, you must return `undefined`

### Wrapping error handler middleware

```js
const { wrapError } = require('express-better-async-wrap')

app.use(
  wrapError(async (err, req, res, next) => {
    await doSomethingAsync()
    res.status(500).send('Something broke!')
  }),
)
```

### Usage with Typescript

```ts
import { wrap } from 'express-better-async-wrap'

app.put(
  '/user/:id',
  wrap<{
    Params: { id: string }
    Querystring: { throwIfNotFound?: string }
    Body: { name: string; age: number }
    ResBody: { user: User | null }
  }>(async (req, res) => {
    const user = await User.findOne(req.params.id)

    if (!user) {
      if (req.query.throwIfNotFound) {
        throw new Error('User not found')
      } else {
        return { user: null }
      }
    }

    await user.update({ name: req.body.name, age: req.body.age })

    return { user }
  }),
)
```
