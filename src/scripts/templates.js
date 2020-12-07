import store from './store';

function generateStarRating(bookmark) {
    let starRating;
    let starChecked = bookmark.rating;
    let starUnchecked = 5 - starChecked;
    const starCheckedHtml = '✦';
    const starUncheckedHtml = '✧';
    starRating = starCheckedHtml.repeat(starChecked) + starUncheckedHtml.repeat(starUnchecked);
    return starRating;
};

function simpleBookmark(bookmark) {
   let rating = generateStarRating(bookmark);

    return `<li class="bookmark" data-bookmark-id="${bookmark.id}">
    <div id="bookmarkTitle" tabindex="0" role="button" aria-pressed="false">
    <h3>${bookmark.title}</h3>
    <h3>${rating}</h3></div>
    </li>`;
}

function expandedBookmark(bookmark) {
   let rating = generateStarRating(bookmark);

    return `<li class="bookmark" data-bookmark-id="${bookmark.id}">
    <div id="bookmarkTitle" tabindex="0" role="button" aria-pressed="false">
        <h3>${bookmark.title}</h3>
        <h3>${rating}</h3>
    </div> 
    <div id="bookmarkExpanded">
    <h4>Description:</h4>
    ${(bookmark.desc.length === 0) ? '<p>No description.</p>' : `<p>${bookmark.desc}</p>`}
      <div class="expanded-buttons">
        <button class="site-button" onclick="window.open(href='${bookmark.url}')">Visit Website</button>
        <button class="update-button">Edit</button>
        <button id="delete" class="delete-button">Delete</button>
      </div>
    </div>
    </li>`;
}

function generateBookmarkElement(bookmark) {
    if (bookmark.rating >= store.storeData.filter) {
      if (bookmark.inEditMode) {
        return generateUpdateBookmarkForm(bookmark)
      } else if (bookmark.expanded) {
        return expandedBookmark(bookmark);
      } else {
        return simpleBookmark(bookmark);
      }
    }    
}

function generateBookmarks(bookmarkList) {
    let bookmarks = bookmarkList.map(bookmark => generateBookmarkElement(bookmark));
    
    return `<section class="my-bookmarks">
    <div class="bookmark-controls">
      <button type="button" class="btn add-bookmark-btn js-add-new-bookmark">Add Bookmark</button>
      
      <label class="filter-label" for="rating-filter"></label>
      <select id="rating-filter" name="rating-filter" class="filter">
        <option value="" ${(store.storeData.filter === '0') ? 'selected' : ''}>Filter By Min. Rating</option>
        <option value="0">Clear Filter</option>
        <option value="1" ${(store.storeData.filter === '1') ? 'selected' : ''}>✦✧✧✧✧</option>
        <option value="2" ${(store.storeData.filter === '2') ? 'selected' : ''}>✦✦✧✧✧</option>
        <option value="3" ${(store.storeData.filter === '3') ? 'selected' : ''}>✦✦✦✧✧</option>
        <option value="4" ${(store.storeData.filter === '4') ? 'selected' : ''}>✦✦✦✦✧</option>
        <option value="5" ${(store.storeData.filter === '5') ? 'selected' : ''}>✦✦✦✦✦</option>
      </select>
    </div>
    
    <section id="bookmark-list">
      <ul class="bookmark-list">
        ${bookmarks.join('')}
      </ul>
    </section>
  </section>`;
}

function generateNewBookmarkForm() {
    return `<section id="addBookmark" class="my-bookmarks">
        <h2>Add a bookmark!</h2>
        <form id="bookmarkForm" class="new-bookmark-form">
            <label for="bookmark-title">Title:</label>
            <input type="text" id="bookmark-title" name="title" required>

            <label for="bookmark-url">Link:</label>
            <input type="url" id="bookmark-url" name="url" required>

            <label for="bookmark-description">Description:</label>
            <textarea type="text" id="bookmark-description" name="desc" style="resize: none;" ></textarea>

            <label for="rating">Rating:</label>
            <select name="rating" id="rating">
                <option value="" disabled selected>✧✧✧✧✧</option>
                <option value="1">✦✧✧✧✧</option>
                <option value="2">✦✦✧✧✧</option>
                <option value="3">✦✦✦✧✧</option>
                <option value="4">✦✦✦✦✧</option>
                <option value="5">✦✦✦✦✦</option>
            </select>

            <div class="form-buttons">
                <button type="button" class="btn cancel-btn js-cancel-new-bookmark">Cancel</button>
                <button type="submit" id="addBookmarkEntry" class="add-new-bookmark">Add bookmark</button>
            </div>
        </form>
    </section>`
}

function generateUpdateBookmarkForm(bookmark) {
  let rating = generateStarRating(bookmark);
  let bookmarkRating = `${bookmark.rating}`;

  return `<li class="update-bookmark" data-bookmark-id="${bookmark.id}">
  <div id="bookmarkTitle">
      <h3>${bookmark.title}</h3>
      <h3>${rating}</h3>
  </div> 
  <form id="updateBookmarkForm" class="update-bookmark-form">
      <label for="bookmark-title">Title:</label>
      <input type="text" id="bookmark-title" name="title" value="${bookmark.title}">

      <label for="bookmark-url">Link:</label>
      <input type="url" id="bookmark-url" name="url" value="${bookmark.url}">

      <label for="bookmark-description">Description:</label>
      <textarea type="text" id="bookmark-description" name="desc" style="resize: none;" required>${bookmark.desc}</textarea>

      <label for="rating">Rating:</label>
      <select name="rating" id="rating" required>
          <option value="" ${(bookmarkRating === '') ? 'selected' : ''}>✧✧✧✧✧</option>
          <option value="1" ${(bookmarkRating === '1') ? 'selected' : ''}>✦✧✧✧✧</option>
          <option value="2" ${(bookmarkRating === '2') ? 'selected' : ''}>✦✦✧✧✧</option>
          <option value="3" ${(bookmarkRating === '3') ? 'selected' : ''}>✦✦✦✧✧</option>
          <option value="4" ${(bookmarkRating === '4') ? 'selected' : ''}>✦✦✦✦✧</option>
          <option value="5" ${(bookmarkRating === '5') ? 'selected' : ''}>✦✦✦✦✦</option>
      </select>

      <div class="update-form-buttons">
          <button type="button" class="btn cancel-btn js-cancel-update-bookmark">Cancel</button>
          <button type="submit" id="updateBookmarkEntry" class="js-update-bookmark">Update</button>
      </div>
  </form>
</li>`
}

function generateError(message) {
    return `
        <section class="error-message">
          <p>${message}</p>
          <button class="btn" id="close-error">Close</button>
        </section>
      `;
}

export default {
    generateNewBookmarkForm,
    generateBookmarks,
    generateError
}