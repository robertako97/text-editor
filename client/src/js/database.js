import { openDB } from 'idb';

const DATABASE_NAME = 'jate';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'jate';
const INDEX_NAME = 'code';

const initdb = async () => {
  return openDB(DATABASE_NAME, DATABASE_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
        const store = db.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id', autoIncrement: true });
        store.createIndex(INDEX_NAME, 'code', { unique: false });
        console.log(`${DATABASE_NAME} database created`);
      }
    },
  });
};

export const getDb = async () => {
  const jateDb = await initdb();
  const tx = jateDb.transaction(OBJECT_STORE_NAME, 'readonly');
  const store = tx.objectStore(OBJECT_STORE_NAME);
  const request = store.getAll();
  const result = await request;
  console.log(`Retrieved data from ${DATABASE_NAME} database`, result);
  return result;
};

export const postDb = async (content) => {
  console.log('Post to the database');
  const jateDb = await initdb();
  const tx = jateDb.transaction(OBJECT_STORE_NAME, 'readwrite');
  const store = tx.objectStore(OBJECT_STORE_NAME);
  const request = store.add({ code: content });
  const result = await request;
  console.log('Code saved to the jate database', result);
};

export const getAllDb = async () => {
  console.log(`GET all code lines from the ${DATABASE_NAME} database`);
  const jateDb = await initdb();
  const tx = jateDb.transaction(OBJECT_STORE_NAME, 'readonly');
  const store = tx.objectStore(OBJECT_STORE_NAME);
  const request = store.getAll();
  const result = await request;
  console.log('result.value', result);
  return result;
};

export const getOneDb = async (id) => {
  console.log('GET from the database');
  const jateDb = await initdb();
  const tx = jateDb.transaction(OBJECT_STORE_NAME, 'readonly');
  const store = tx.objectStore(OBJECT_STORE_NAME);
  const request = store.get(id);
  const result = await request;
  console.log('result.value', result);
  return result;
};

export const deleteDb = async (id) => {
  console.log('DELETE from the database', id);
  const jateDb = await initdb();
  const tx = jateDb.transaction(OBJECT_STORE_NAME, 'readwrite');
  const store = tx.objectStore(OBJECT_STORE_NAME);
  const request = store.delete(id);
  const result = await request;
  console.log('result.value', result);
  return result;
};

export const putDb = async (id, content) => {
  console.log('PUT to the database');
  const jateDb = await initdb();
  const tx = jateDb.transaction(OBJECT_STORE_NAME, 'readwrite');
  const store = tx.objectStore(OBJECT_STORE_NAME);
  const request = store.put({ id: id, code: content });
  const result = await request;
  console.log('Code saved to the jate database', result);
};

initdb();
