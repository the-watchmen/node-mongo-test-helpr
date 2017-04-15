import assert from 'assert'
import test from 'ava'
import config from 'config'
import mongodb from 'mongodb'
import {
  dbName,
  isAutomatedTest,
  assertAutomatedTest,
  initDb,
  bulkInsert,
  initFixture,
  isObjectId
} from '../../src'

async function getDb() {
  const host = config.get('mongo.host')
  const dbName = config.get('mongo.db')
  // dbg('get-db: host=%o, port=%o, db=%o', host, port, dbName)
  const db = await mongodb.MongoClient.connect(`mongodb://${host}/${dbName}`)
  assert(db)
  return db
}

test('dbName', async t => {
  const db = await getDb()
  t.is(dbName(db), config.get('mongo.db'))
})

test('isAutomatedTest', async t => {
  const db = await getDb()
  t.truthy(isAutomatedTest(db))
})

test('assertAutomatedTest', async t => {
  const db = await getDb()
  t.notThrows(() => {
    assertAutomatedTest(db)
  })
})

test('initDb', async t => {
  const db = await getDb()
  t.notThrows(initDb(db))
})

test('initDb: assert', t => {
  t.throws(initDb({databaseName: 'nope'}))
})

test('bulkInsert', async t => {
  const db = await getDb()
  const collectionName = 'scratch'
  const docs = [{_id: 'foo'}, {_id: 'bar'}]
  await bulkInsert({db, docs, collectionName})
  const result = await db.collection(collectionName).find().toArray()
  t.deepEqual(result, docs)
})

test('initFixture', async t => {
  const db = await getDb()
  await (initDb(db))
  const collectionName = 'scratch'
  const docs = [{_id: 'foo'}, {_id: 'bar'}]
  await bulkInsert({db, docs, collectionName})
  await initFixture({db, docs, collectionName})
  const result = await db.collection(collectionName).find().sort({_id: -1}).toArray()
  t.deepEqual(result, docs)
})

test('isObjectId', t => {
  t.truthy(isObjectId(new mongodb.ObjectID()))
})
