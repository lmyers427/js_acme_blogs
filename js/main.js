const BASE_API_URL = "https://jsonplaceholder.typicode.com/";

function createElemWithText(element = "p", textContent = "", className) {
  let elem = document.createElement(element);
  elem.textContent = textContent;
  if (className) elem.setAttribute("class", className);
  return elem;
}

function createSelectOptions(users) {
  if (users == undefined || users == null) return undefined;
  let options = [];
  users.forEach((user) => {
    let option = document.createElement("option");
    option.setAttribute("value", user.id);
    option.textContent = user.name;
    options.push(option);
  });
  return options;
}

function toggleCommentSection(postId) {
  if (postId == undefined || postId == null) return undefined;
  let element = document.querySelector(`section[data-post-id="${postId}"]`);
  if (element) element.classList.toggle("hide");
  return element;
}

function toggleCommentButton(postId) {
  if (postId == undefined || postId == null) return undefined;
  let element = document.querySelector(`button[data-post-id="${postId}"]`);
  if (element) {
    element.textContent =
      element.textContent == "Show Comments"
        ? "Hide Comments"
        : "Show Comments";
  }
  return element;
}

function deleteChildElements(parentElement) {
  if (!parentElement?.tagName) return undefined;

  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
  return parentElement;
}

function addButtonListeners() {
  let buttons = document.querySelector("main").querySelectorAll("button");
  buttons.forEach((button) => {
    button.addEventListener(
      "click",
      function (e) {
        toggleComments(e, button.dataset.postId);
      },
      false
    );
    //console.log(button);
  });
  return buttons;
}

function removeButtonListeners() {
  let buttons = document.querySelector("main").querySelectorAll("button");
  buttons.forEach((button) => {
    button.removeEventListener(
      "click",
      function (e) {
        toggleComments(e, button.dataset.postId);
      },
      false
    );
    //console.log(button);
  });
  return buttons;
}

function createComments(comments) {
  if (comments == undefined || comments == null) return undefined;

  let fragment = document.createDocumentFragment();
  comments.forEach((comment) => {
    let article = document.createElement("article");
    article.append(createElemWithText("h3", comment.name));
    article.append(createElemWithText("p", comment.body));
    article.append(createElemWithText("p", `From: ${comment.email}`));
    fragment.append(article);
  });
  return fragment;
}

function populateSelectMenu(users) {
  if (users == undefined || users == null) return undefined;
  let menu = document.getElementById("selectMenu");
  let options = createSelectOptions(users);
  options.forEach((option) => menu.append(option));
  return menu;
}

async function getUsers() {
  const url = BASE_API_URL + "users";
  try {
    return fetch(url).then((response) => response.json());
  } catch (error) {
    console.error(error);
  }
}

async function getUserPosts(userId) {
  if (userId == undefined || userId == null) return undefined;
  const url = BASE_API_URL + `users/${userId}/posts`;
  try {
    return fetch(url).then((response) => response.json());
  } catch (error) {
    console.error(error);
  }
}

async function getUser(userId) {
  if (userId == undefined || userId == null) return undefined;
  const url = BASE_API_URL + `users/${userId}`;
  try {
    return fetch(url).then((response) => response.json());
  } catch (error) {
    console.error(error);
  }
}

async function getPostComments(postId) {
    if (postId == undefined || postId == null) return undefined;
    const url = BASE_API_URL + `posts/${postId}/comments`;
    try {
      return fetch(url).then((response) => response.json());
    } catch (error) {
      console.error(error);
    }
}


async function displayComments(postId) {
    if (postId == undefined || postId == null) return undefined;
    let section = document.createElement('section');
    section.dataset.postId = postId;
    section.classList.add('comments', 'hide');
    let comments = await getPostComments(postId);
    let fragment = await createComments(comments);
    section.append(fragment);
    return section;
}

async function createPosts(posts) {
    if (posts == undefined || posts == null) return undefined;
    let fragment = document.createDocumentFragment();
    for (let i = 0; i < posts.length; i++) {
        let post = posts[i];
        let article = document.createElement("article");
        article.append(createElemWithText("h2", post.title));
        article.append(createElemWithText("p", post.body));
        article.append(createElemWithText("p", `Post ID: ${post.id}`));
        let author = await getUser(post.userId);
        article.append(createElemWithText("p", 
        `Author: ${author.name} with ${author.company.name}`));
        article.append(createElemWithText("p", author.company.catchPhrase));
        let button = createElemWithText("button", "Show Comments")
        button.dataset.postId = post.id;
        article.append(button);
        let section = await displayComments(post.id);
        article.append(section);
        fragment.append(article);
    }
    return fragment;
}

async function displayPosts(posts) {
    let main = document.querySelector('main');
    let element;
    if (posts!= undefined && posts != null) { 
        element = await createPosts(posts);
        //console.log(element);
    }
    else {
    element = createElemWithText('p', "Select an Employee to display their posts.");
    element.classList.add('default-text');
    }
    main.append(element);
    return element;
}

function toggleComments(event, postId) {
    if (event == undefined || event == null || postId == undefined || postId == null) return undefined;

    let result = [];
    event.target.listener = true;
    result.push(toggleCommentSection(postId));
    result.push(toggleCommentButton(postId));
    return result;
}

async function refreshPosts(posts) {
    if (posts == undefined || posts == null) return undefined;
    let result = [];
    let main = document.querySelector('main');

    result.push(removeButtonListeners());
    result.push(deleteChildElements(main));
    result.push(await displayPosts(posts));
    result.push(addButtonListeners());

    return result;
}
async function selectMenuChangeEventHandler(event) {
    let userId = event?.target?.value || 1; 
    let posts = await getUserPosts(userId);
    let refreshPostsArray = await refreshPosts(posts);
    //console.log(result);
    return [userId, posts, refreshPostsArray];
}

async function initPage() {
    let users = await getUsers();
    let select = populateSelectMenu(users);
    return [users, select]
}
// a. Dependencies: getUsers, populateSelectMenu
// b. Should be an async function
// c. No parameters.
// d. Call await getUsers
// e. Result is the users JSON data
// f. Passes the users JSON data to the populateSelectMenu function
// g. Result is the select element returned from populateSelectMenu
// h. Return an array with users JSON data from getUsers and the select element
// result from populateSelectMenu: [users, select]

async function initApp() {
    initPage();
    let menu = document.getElementById('selectMenu');
    menu.addEventListener('change', selectMenuChangeEventHandler);
}
// a. Dependencies: initPage, selectMenuChangeEventHandler
// b. Call the initPage() function.
// c. Select the #selectMenu element by id
// d. Add an event listener to the #selectMenu for the “change” event
// e. The event listener should call selectMenuChangeEventHandler when the change
// event fires for the #selectMenu
// f. NOTE: All of the above needs to be correct for you app to function correctly.
// However, I can only test if the initApp function exists. It does not return anything.


document.addEventListener('DOMContentLoaded', initApp);