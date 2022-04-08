const postContainer = document.getElementById('posts');
const loader = document.querySelector('.loader');
const input = document.getElementById('filter');

// we have originaly 100 post in this api and we want it to devide to 5 post per load so...

let limit = 5;

// and we have various pages

let page = 1;

// fetch the API
// beacuse we want the loader to wait untill all 5 post are fetched, we need to use async function

async function getPosts () {
    const respond = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`);
    const data = await respond.json();
    return data;
}

//  now we can show the posts in DOM dynamicly, but we need to delete the HTML code for post

async function showPosts() {
    const posts = await getPosts();
    posts.forEach(post => {
        // delete the html and make a new, dynamic one
        const postEl = document.createElement('div');
        postEl.classList.add('post');
        postEl.innerHTML = `
        <div class="number">${post.id}</div>
        <div class="post-info">
            <h2 class="post-title">${post.title}</h2>
            <p class="post-body">
            ${post.body}
            </p>
        </div>
        `;
        postContainer.append(postEl);
    });
}
// show loader
function showLoading() {
    loader.classList.add('show');
    setTimeout(() => {
        loader.classList.remove('show');
        setTimeout(() => {
            page++;
            showPosts();
        }, 2000);
    }, 1000);
}

// add search ability through the posts

function filterPosts(e) {
    // console.log(e.target.value);

    const term = e.target.value.toUpperCase(); //what user in typing
    const posts = document.querySelectorAll('.post'); //the post that we made in showPosts()

    posts.forEach(post => {
        const title = post.querySelector('.post-title').innerText.toUpperCase();

        // const body = post.querySelector('.post-body').innerText.toUpperCase(); use this if you want to apply filter to the body of the posts!

        if (title.indexOf(term) > -1) {
            // attach the query that user in typing to the title of the posts. you can also add body.indexOf(term) > -1 for the body as well
            post.style.display = 'flex';
        }else {
            post.style.display = 'none';
        }
    })
}
// determine the right amount of scroll to show the loader

showPosts();

window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 5) {
        // the formula above could be usefull in other cases as well.
        showLoading();
    }
})
input.addEventListener('input', filterPosts);