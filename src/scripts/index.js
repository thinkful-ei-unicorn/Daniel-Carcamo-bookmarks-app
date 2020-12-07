import $ from 'jquery';
import 'normalize.css';
import '../styles/style.css';

import api from './api';
import bookmarks from './bookmarks';
import store from './store';


function main() {
    api.getBookmarks()
        .then(bookmarksList => {
            for (let i = 0; i < bookmarksList.length; i++) {
                store.createItem(bookmarksList[i]);
            }
            bookmarks.render();
        });
    bookmarks.eventHandlers();
};


$(main);