// Support TS requires using our server tsconfig. Otherwise, models don't work
// require('ts-node').register({project: 'tsconfig.server.json'})

import * as R from 'ramda'
import path from 'path'
import {env} from '@src/environment'
import repl from 'repl'

const projectRequire = (relativeRequire: any) => require(path.join(path.resolve(__dirname, '..'), relativeRequire))

const e = env()

/**
 * Inject models into REPL context
 */

// Add values to this object if you want them to be available in the console
const customReplContext = {env, e}

// Merge all model exports in via Object.assign so we don't have to update this file when we add new models
const models = projectRequire('./src/models')

Object.assign(customReplContext, models)

// List of injected variables for the welcome message
const injectedValuesList = Object.keys(customReplContext)
  .map(key => `   - ${key}`)
  .join('\n')

console.log(`Welcome to the bloomiq-aggregator REPL!`)
console.log(`The following values are already available in the REPL for you:\n`)
console.log(injectedValuesList)
console.log()

/**
 * Inject helpers into REPL context
 */
const utils = projectRequire('./src/lib/util')

const helpers = {
  utils: {
    sign: (digest: any, privateKey: any) => utils.ethSig(digest, privateKey),
  },
}

Object.assign(customReplContext, helpers)

const listNestedMethods = (chunk: any, level = 1) => {
  if (typeof chunk !== 'object') return
  R.keys(chunk).map((k: any) => {
    const indent = '   '.repeat(level)
    console.log(`${indent}- ${k}`)
    listNestedMethods(chunk[k], level + 1)
  })
}

console.log('Along with these helpers:\n')
listNestedMethods(helpers)
console.log()

/**
 * Initialize REPLs
 */

const replSession = repl.start({
  prompt: `bloomiq-aggregator (${process.env.NODE_ENV})> `,
})

// Inject our customReplContext into the env so they are avaialable top level
Object.keys(customReplContext).forEach((key: string) => {
  // replSession.context already has things in it like `console` so you can do `console.log`
  // As a precaution, we should throw an error if we accidentally clobber
  if (key in replSession.context) {
    throw new Error(`${key} is already set in replSession.context! You'll need to give it another name`)
  }

  replSession.context[key] = customReplContext[key]
})
