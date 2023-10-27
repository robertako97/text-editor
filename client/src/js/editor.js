import { getDb, postDb, deleteDb, putDb } from './database';
import { header } from './header';

export default class Editor {
  constructor() {
    // Check if CodeMirror is loaded
    if (typeof CodeMirror === 'undefined') {
      throw new Error('CodeMirror is not loaded');
    }

    this.editor = CodeMirror(document.querySelector('#main'), {
      value: '',
      mode: 'javascript',
      theme: 'monokai',
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      indentUnit: 2,
      tabSize: 2,
    });

    this.uniqueId = null; // Initialize with null, to be set by IndexedDB

    // Load data from IndexedDB and set it in the editor if uniqueId is available
    getDb()
      .then((data) => {
        console.info('Loaded data from IndexedDB, injecting into editor');

        // Ensure data is an array
        const dataArray = Array.isArray(data) ? data : [];

        // Find the first item in the data array (assuming it contains the latest content)
        const latestItem = dataArray.length > 0 ? dataArray[dataArray.length - 1] : null;

        if (latestItem) {
          this.uniqueId = latestItem.id;
          this.editor.setValue(latestItem.code);
        } else {
          this.uniqueId = Date.now().toString(); // Generate a new unique ID
          this.editor.setValue(header);
        }
      })
      .catch((error) => {
        console.error('Error loading data from IndexedDB:', error);
      });

    this.editor.on('change', () => {
      // Whenever the editor content changes, update or delete the content in IndexedDB
      const content = this.editor.getValue().trim();

      if (content === '') {
        // If the editor content is empty, delete the entry in IndexedDB if a uniqueId is available
        if (this.uniqueId) {
          deleteDb(this.uniqueId);
        }
      } else {
        // Otherwise, update content in IndexedDB using the uniqueId
        if (this.uniqueId) {
          putDb(this.uniqueId, content);
        } else {
          // If uniqueId is not available, generate a new one and save the content
          this.uniqueId = Date.now().toString();
          postDb(content);
        }
      }
    });
  }
}
