const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
const helper = require('./helper.js');

const handlePost = (e, onPostAdded) => {
  e.preventDefault();
  helper.hideError();

  const content = e.target.querySelector('#postContent').value;

  if (!content) {
    helper.handleError('All fields are required!');
    return false;
  }

  helper.sendPost(e.target.action, { content }, onPostAdded);
  return false;
};

const PostForm = (props) => {
  return(
    <form id='postForm'
          onSubmit={(e) => handlePost(e, props.triggerReload)}
          name='postForm'
          action='/maker'
          method='POST'
          className='postForm'
    >
      <input id='postContent' type='text' name='content' placeholder='Any thoughts?' />
      <input className='makePostSubmit' type='submit' value="Post!" />
    </form>
  )
};

const PostList = (props) => {
  const [posts, setPosts] = useState(props.posts);

  useEffect(() => {
    const loadPostsFromServer = async () => {
      const response = await fetch('/getPosts');
      const data = await response.json();
      setPosts(data.posts);
    };
    loadPostsFromServer();
  }, [props.reloadPosts]);

  if (posts.length === 0) {
    return (
      <div className='postList'>
        <h3 className='emptyPost'>No Posts Yet!</h3>
      </div>
    );
  }

  const postNodes = posts.map(post => {
    return (
      <div key={(post.id)} className='post'>
        <p className='postName'>{post.content}</p>
      </div>
    );
  });

  return(
    <div className='postList'>
      {postNodes}
    </div>
  );
};

const App = () => {
  const [reloadPosts, setReloadPosts] = useState(false);

  return (
    <div>
      <div id='makePost'>
          <PostForm triggerReload={() => setReloadPosts(!reloadPosts)} />
      </div>
      <div id='posts'>
          <PostList posts={[]} reloadPosts={reloadPosts} />
      </div>
    </div>
  );
};

const init = () => {
  const root = createRoot(document.getElementById('app'));
  root.render( <App /> );
};

window.onload = init;
