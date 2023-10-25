import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

/**
 * Adds content to the database.
 * @param {Object} content - The content to be added to the database.
 * @returns {Promise<void>}
 */
export const putDb = async (content) => {
  const db = await initdb();
  const tx = db.transaction('jate', 'readwrite');
  const store = tx.objectStore('jate');
  await store.add(content);
  await tx.done;
  console.log('Content added to jate database');
};

/**
 * Retrieves all the content from the database.
 * @returns {Promise<Array>} - An array containing all the content from the database.
 */
export const getDb = async () => {
  const db = await initdb();
  const tx = db.transaction('jate', 'readonly');
  const store = tx.objectStore('jate');
  const allContent = await store.getAll();
  return allContent;
};

initdb();
