import React from 'react';
import './App.css';

import AddImage from './AddImage';
import Menu from './Menu';
import Pictures from './Pictures'
import ImageDetail from './ImageDetail';
import { BrowserRouter, Route, Link } from 'react-router-dom';

const Apps = () => (
  <BrowserRouter>
    <div>

      <h1>Promotion images sharing </h1>
      <Link to='/'>top</Link>
      <Route exact path='/' component={App} />
      <Route path='/addimage' component={AddImage} />
      <Route path='/imagedetail/:id' component={ImageDetail} />


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
        <div className="App">
          <div className="tag-select-area">
            <ul>
              {this.state.posts.map(post => (
                <li key={post.id}>
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





export default Apps;