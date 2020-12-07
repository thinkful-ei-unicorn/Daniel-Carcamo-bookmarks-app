import $ from 'jquery';

import store from './store';
import api from './api';
import templates from './templates';

$.fn.extend({
    serializeJson: function () {
        const formData = new FormData(this[0]);
        const o = {};
        formData.forEach((val, name) => o[name] = val);
        return JSON.stringify(o);
    }
});

function handleAddBookmarkClicked() {
    $('main').on('submit', '.new-bookmark-form', function (event) {
        event.preventDefault();
        let newBookmarkInfo = $(event.target).serializeJson();
               
        api.createBookmark(newBookmarkInfo)
        .then(newBookmarkInfo => {
            store.createItem(newBookmarkInfo);
            store.storeData.adding = !store.storeData.adding;
            render();
        })
        .catch((error) => {
            renderError();
        });
    });
};

function handleAddNewBookmarkClicked() {
    $('main').on('click', '.js-add-new-bookmark', function (event) {
        event.preventDefault();
        store.storeData.adding = !store.storeData.adding;
        render();
    });
}

function handleCancelNewBookmarkClicked() {
    $('main').on('click keypress', '.js-cancel-new-bookmark', (event) => {
        store.storeData.adding = !store.storeData.adding;
        render();
    });
}

function handleExpandBookmark() {
    $('main').on('click keypress', '.bookmark', function (event) {
       if (event.which === 13 || event.type === 'click') {
            let bookmarkId = $(event.currentTarget).data('bookmark-id');
            store.toggleIsExpanded(bookmarkId);
            render();
       }
   });
}

function handleDeleteBookmark() {
    $('main').on('click keypress', '.delete-button', function (event) {
        if (event.which === 13 || event.type === 'click') {
            event.preventDefault();
            let bookmarkId = $(event.target).closest('.bookmark').data('bookmark-id');

            api.deleteBookmark(bookmarkId)
                .then(() => {
                    store.deleteBookmark(bookmarkId);
                    render();
                })
                .catch(() => {
                    renderError();
                })
        }
    });
}

function handleVisitSite() {
    $('main').on('click keypress', '.site-button', function (event) {
        if (event.which === 13 || event.type === 'click') {
            event.preventDefault();
            document.getElementById('url').click();
            render();
        }
    });
}

function handleFilterSelection() {
    $('main').on('change', '.filter', function (event) {
        let filter = $('.filter').val();
        store.storeData.filter = filter;
        render();
    });
}

function handleEditClicked() {
    $('main').on('click keypress', '.update-button', function (event) {
        if (event.which === 13 || event.type === 'click') {
            event.preventDefault();
            let bookmarkId = $(event.target).closest('.bookmark').data('bookmark-id');
            store.toggleInEditMode(bookmarkId);
            render();
        }
    });
}

function handleCancelEditClicked() {
    $('main').on('click keypress', '.js-cancel-update-bookmark', (event) => {
      let bookmarkId = $(event.target).closest('.update-bookmark').data('bookmark-id');
      store.toggleInEditMode(bookmarkId);
      store.toggleIsExpanded(bookmarkId);
      render();
    });
}

function handleUpdateBookmarkClicked() {
    $('main').on('submit', '#updateBookmarkForm', function (event) {
        event.preventDefault();
        let bookmarkId = $(event.target).closest('.update-bookmark').data('bookmark-id');
        let updatedBookmarkInfo = $(event.target).serializeJson();

        api.updateBookmark(bookmarkId, updatedBookmarkInfo)
        .then(() => {            
            store.findAndUpdateBookmark(bookmarkId, updatedBookmarkInfo);
            store.toggleInEditMode(bookmarkId);
            render();   
        })
        .catch(error => {
            renderError();
        } );
    });
};

function handleCloseError() {
    $('main').on('click', '#close-error', () => {
      store.setError(false);
      renderError();
    });
}
  
function eventHandlers() {
    handleAddBookmarkClicked();
    handleAddNewBookmarkClicked();
    handleCancelNewBookmarkClicked();
    handleExpandBookmark();
    handleDeleteBookmark();
    handleVisitSite();
    handleFilterSelection();
    handleEditClicked();
    handleUpdateBookmarkClicked();
    handleCancelEditClicked();
    handleCloseError();
}

function renderError() {
    if (store.storeData.error) {
        const errorElement = templates.generateError(store.storeData.errorMessage);
        $('.error-message').html(errorElement);
    } else {
        $('.error-message').empty();
    }
    handleCloseError();
}

function render() {
    renderError();

    const bookmarks = [...store.storeData.bookmarks];
    let bookmarksPage = '';

    if (!store.storeData.adding) {
        bookmarksPage = templates.generateBookmarks(bookmarks);
        $('main').html(bookmarksPage);
    } else {
        bookmarksPage = templates.generateNewBookmarkForm();
        $('main').html(bookmarksPage);
    }
}

export default {
    render,
    eventHandlers
};