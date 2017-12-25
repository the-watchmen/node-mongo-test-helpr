import test from 'ava'
import mongodb from 'mongodb'

test('connect', async t => {
  const dbName = 'my-db'
  const client = await mongodb.MongoClient.connect(`mongodb://localhost/${dbName}`)
  const db = client.db(dbName)
  t.is(db.databaseName, dbName)
})
