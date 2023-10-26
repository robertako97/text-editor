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

    // Load data from IndexedDB and set it in the editor
    getDb()
      .then((data) => {
        console.info('Loaded data from IndexedDB, injecting into editor');

        // Ensure data is an array
        const dataArray = Array.isArray(data) ? data : [];

        // Extract the 'code' property from each object and join them into a single string
        const content = dataArray.map((item) => item.code).join('\n');

        this.editor.setValue(content || header);
      })
      .catch((error) => {
        console.error('Error loading data from IndexedDB:', error);
      });

    this.editor.on('change', () => {
      // Whenever the editor content changes, update or delete the content in IndexedDB
      const content = this.editor.getValue().trim();

      if (content === '') {
        // If the editor content is empty, delete the entry in IndexedDB
        deleteDb('unique_id'); // Replace 'unique_id' with an appropriate ID
      } else {
        // Otherwise, update content in IndexedDB using a unique ID
        putDb('unique_id', content); // Replace 'unique_id' with an appropriate ID
      }
    });
  }
}
