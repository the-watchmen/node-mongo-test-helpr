import config from 'config'
import debug from 'debug'
import assert from 'assert'
import mongodb from 'mongodb'
import _ from 'lodash'

const dbg = debug('app:mongo-test-helpr')

const autoSuffix = _.get(config, 'mongo.autoSuffix', '-auto')

export function dbName(db){
  return db.databaseName
}

export function isAutomatedTest(db){
  return dbName(db).endsWith(autoSuffix)
}

export function assertAutomatedTest(db){
  assert(isAutomatedTest(db), `db-name=${dbName(db)} requires suffix=${autoSuffix}`)
}

export async function initDb(db){
  dbg('init-db(%o)', dbName(db))
  assertAutomatedTest(db)
  return await db.dropDatabase()
}

export async function bulkInsert({db, collectionName, docs}){
  const bulk = db.collection(collectionName).initializeUnorderedBulkOp()
  docs.map((elt)=>{
    bulk.insert(elt)
  })
  const result = await bulk.execute()
  assert(result.ok)
}

export async function initFixture({db, collectionName, docs}) {
  await initDb(db)
  await bulkInsert({db, collectionName, docs})
}

export function isObjectId(value){
  return value instanceof mongodb.ObjectId
}
