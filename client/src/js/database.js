import { openDB } from 'idb';

// Initialize the database and object store with an index.
const initdb = async () => {
  return openDB('jate', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('jate')) {
        const store = db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
        store.createIndex('code', 'code', { unique: false });
        console.log('jate database created');
      }
    },
  });
};

// Save code content to the database.
export const postDb = async (content) => {
  const jateDb = await initdb();
  const tx = jateDb.transaction('jate', 'readwrite');
  const store = tx.objectStore('jate');
  await store.add({ code: content });
};

// Get all code lines from the database.
export const getDb = async () => {
  const jateDb = await initdb();
  const tx = jateDb.transaction('jate', 'readonly');
  const store = tx.objectStore('jate');
  const request = store.getAll();
  return request;
};


export const getAllDb = async () => {
  console.log('GET all code lines from the database');
  const jateDb = await initdb();
  const tx = jateDb.transaction('jate', 'readonly');
  const store = tx.objectStore('jate');
  const request = store.getAll();
  const result = await request;
  console.log('result.value', result);
  return result;
};

export const getOneDb = async (id) => {
  console.log('GET from the database');
  const jateDb = await initdb();
  const tx = jateDb.transaction('jate', 'readonly');
  const store = tx.objectStore('jate');
  const request = store.get(id);
  const result = await request;
  console.log('result.value', result);
  return result;
};

export const deleteDb = async (id) => {
  console.log('DELETE from the database', id);
  const jateDb = await initdb();
  const tx = jateDb.transaction('jate', 'readwrite');
  const store = tx.objectStore('jate');
  const request = store.delete(id);
  const result = await request;
  console.log('result.value', result);
  return result;
};

export const putDb = async (id, content) => {
  console.log('PUT to the database');
  const jateDb = await initdb();
  const tx = jateDb.transaction('jate', 'readwrite');
  const store = tx.objectStore('jate');
  const request = store.put({ id: id, code: content });
  const result = await request;
  console.log('Code saved to the jate database', result);
};
initdb();
