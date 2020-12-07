const storeData = {
    bookmarks: [],
    adding: false,
    error: null,
    errorMessage: '',
    filter: 0
};

function findBookmarkById(id) {
    let foundItem = storeData.bookmarks.find(bookmark => bookmark.id === id);
    return foundItem;
}

function findAndUpdateBookmark(id, updateData) {
    let parsedData = JSON.parse(updateData);
    
    let foundItem = findBookmarkById(id);
    let index = storeData.bookmarks.findIndex(bookmark => bookmark.id === id);
    let mergedData = Object.assign(foundItem, parsedData);
    storeData.bookmarks.splice(index, 1, mergedData);
}

function toggleIsExpanded(id) {
    let foundItem = findBookmarkById(id);
    foundItem.expanded = !foundItem.expanded;
}

function toggleInEditMode(id) {
    let foundItem = findBookmarkById(id);
    foundItem.inEditMode = !foundItem.inEditMode;
}

function deleteBookmark(id) {
    let index = storeData.bookmarks.findIndex(bookmark => bookmark.id === id);
    storeData.bookmarks.splice(index, 1);
}

function setError(value) {
    storeData.error = value;
}

const createItem = function (bookmark) {
    bookmark.expanded = false;
    storeData.bookmarks.push(bookmark);
}

export default {
    storeData,
    createItem,
    deleteBookmark,
    toggleIsExpanded,
    toggleInEditMode,
    findAndUpdateBookmark,
    setError
}