const { MongoClient } = require('mongodb');

const uri =
  'mongodb+srv://jaiswalshivam364_db_user:Jph8IY0UY369Ihyi@cluster1.mdug7im.mongodb.net/?appName=Cluster1';
async function run() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connected');
    await client.close();
  } catch (e) {
    console.error(e);
  }
}

run();
