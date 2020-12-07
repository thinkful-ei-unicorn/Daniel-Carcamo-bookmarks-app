const baseUrl = 'https://thinkful-list-api.herokuapp.com/danielc/bookmarks';

function deleteBookmark(id) {
    return listApiFetch(`${baseUrl}/${id}`, {
        method: 'DELETE'
    });
}

function updateBookmark(id, bookmarkData) {
    return listApiFetch(`${baseUrl}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: bookmarkData
    });
}

function createBookmark(newBookmarkInfo) {
    return listApiFetch(`${baseUrl}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: newBookmarkInfo
    });
}

function getBookmarks() {
    return listApiFetch(`${baseUrl}`);
}

function listApiFetch(...args) {
    let error;

    return fetch(...args)
        .then(response => {
            if (!response.ok) {
                error = {
                    code: response.status
                };
            }
            return response.json();
        })
        .then(data => {
            if (error) {
                error.message = data.message;
                return Promise.reject(error);
            }
            return data;

        });
};


export default {
    getBookmarks,
    createBookmark,
    updateBookmark,
    deleteBookmark
}