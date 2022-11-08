// tests based on:
// https://dev.to/piczmar_0/serverless-authorizers---custom-rest-authorizer-16

import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { BASE_URL } from '../../config.js'
import { setup, teardown } from '../../_testHelpers/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('request authorizer tests', () => {
  beforeEach(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  afterEach(() => teardown())

  function doTest(params) {
    const { description, expected, options, path, status } = params
    it(description, async () => {
      const url = new URL(path, BASE_URL)

      const response = await fetch(url, options)
      assert.equal(response.status, status)

      const json = await response.json()
      assert.deepEqual(json, expected)
    })
  }

  describe('authorizer with payload format 1.0', () => {
    ;[
      {
        description: 'should respond with Allow policy',
        expected: {
          status: 'Authorized',
        },
        options: {
          headers: {
            Authorization: 'Bearer fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5a',
          },
        },
        path: '/user1',
        status: 200,
      },

      {
        description: 'should respond with Deny policy',
        expected: {
          error: 'Forbidden',
          message: 'User is not authorized to access this resource',
          statusCode: 403,
        },
        options: {
          headers: {
            Authorization: 'Bearer fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5b',
          },
        },
        path: '/user1',
        status: 403,
      },

      {
        description: 'should fail with an Unauthorized error',
        expected: {
          error: 'Unauthorized',
          message: 'Unauthorized',
          statusCode: 401,
        },
        options: {
          headers: {
            Authorization: 'Bearer fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5c',
          },
        },
        path: '/user1',
        status: 401,
      },
    ].forEach(doTest)
  })

  describe('authorizer with payload format 2.0', () => {
    ;[
      {
        description: 'should respond with Allow policy',
        expected: {
          status: 'Authorized',
        },
        options: {
          headers: {
            Authorization: 'Bearer fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5a',
          },
        },
        path: '/user2',
        status: 200,
      },

      {
        description: 'should respond with Deny policy',
        expected: {
          error: 'Forbidden',
          message: 'User is not authorized to access this resource',
          statusCode: 403,
        },
        options: {
          headers: {
            Authorization: 'Bearer fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5b',
          },
        },
        path: '/user2',
        status: 403,
      },

      {
        description: 'should fail with an Unauthorized error',
        expected: {
          error: 'Unauthorized',
          message: 'Unauthorized',
          statusCode: 401,
        },
        options: {
          headers: {
            Authorization: 'Bearer fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5c',
          },
        },
        path: '/user2',
        status: 401,
      },
    ].forEach(doTest)
  })

  describe('authorizer with payload format 2.0 with simple responses enabled', () => {
    ;[
      {
        description: 'should respond with isAuthorized true',
        expected: {
          status: 'Authorized',
        },
        options: {
          headers: {
            AuthorizationSimple: 'Bearer fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5a',
          },
        },
        path: '/user2simple',
        status: 200,
      },

      {
        description: 'should respond with isAuthorized false',
        expected: {
          error: 'Forbidden',
          message: 'User is not authorized to access this resource',
          statusCode: 403,
        },
        options: {
          headers: {
            AuthorizationSimple: 'Bearer fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5b',
          },
        },
        path: '/user2simple',
        status: 403,
      },

      {
        description: 'should fail with an Unauthorized error',
        expected: {
          error: 'Unauthorized',
          message: 'Unauthorized',
          statusCode: 401,
        },
        options: {
          headers: {
            AuthorizationSimple: 'Bearer fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5c',
          },
        },
        path: '/user2simple',
        status: 401,
      },
    ].forEach(doTest)
  })
})