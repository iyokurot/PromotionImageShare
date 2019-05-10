import React from 'react';
import './App.css';

import AddImage from './AddImage';
import Menu from './Menu';
import { BrowserRouter, Route, Link } from 'react-router-dom';

const Apps = () => (
  <BrowserRouter>
    <div>

      <h1>Promotion images sharing </h1>
      <Link to='/'>top</Link>
      <Route exact path='/' component={App} />
      <Route path='/addimage' component={AddImage} />


    </div>
  </BrowserRouter>
)

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { posts: [] };

    fetch("http://localhost:4000/posts")
      .then(response => response.json())
      .then(posts => this.setState({ posts }));
  }

  render() {
    return (
      <div>
        <Menu />
        <div class="App">
          <div class="tag-select-area">
            <ul>
              {this.state.posts.map(post => (
                <li>
                  <button onClick={this.serchtag.bind(this, post.name)}>#{post.name}</button>
                </li>
              ))}
            </ul>
          </div>
          <Pictures />
        </div>
      </div>
    );
  }
  serchtag = (tag) => {
    alert(tag);
  }
}

class Pictures extends React.Component {
  constructor(props) {
    super(props);
    this.state = { posts: [] };

    fetch("http://localhost:4000/images")
      .then(response => response.json())
      .then(posts => this.setState({ posts }));
  }
  render() {
    return (
      <div class="picture-select-area">{this.state.posts.map(post => (
        <div class="images">
          <div class="images-inner">

            <div class="image-sqare">
              <img src={post.url} class="img"></img><br></br>
            </div>
          </div>
          <a href={post.url} download>{post.name}</a>
        </div>
      ))}
      </div>
    );
  }
}



export default Apps;