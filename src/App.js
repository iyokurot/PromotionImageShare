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
    this.state = {
      posts: [],
      images: [],
      str: "test"
    };

    fetch("http://localhost:4000/tags")
      .then(response => response.json())
      .then(posts => this.setState({ posts }));

    fetch("http://localhost:4000/images")
      .then(response => response.json())
      .then(posts => this.setState({ images: posts }));
    this.alltag = this.alltag.bind(this);
  }

  render() {
    return (
      <div>
        <Menu />
        <div className="App">
          <div className="tag-select-area">
            <ul>
              <li key="all">
                <button onClick={this.alltag}>すべてのタグ</button>
              </li>
              {this.state.posts.map(post => (
                <li key={post.id}>
                  <button onClick={this.serchtag.bind(this, post.id)}>#{post.name}</button>
                </li>
              ))}
            </ul>
          </div>
          <Pictures imgs={this.state.images} />
        </div>
      </div>
    );
  }
  serchtag = (tagid) => {
    //タグ関係からimageid取得
    const data = {
      tagid: tagid
    }
    fetch("http://localhost:4000/gettagtoimageBytag", {
      method: 'POST', body: JSON.stringify(data), mode: 'cors',
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    })
      .then(response => response.json())
      .then(post => {
        //idリストから画像選択
        if (post.length > 0) {
          var imgids = [];
          for (var i in post) {
            imgids.push(post[i].imageid);
          }
          //画像取得
          const imgdata = {
            imageid: imgids
          }
          fetch("http://localhost:4000/findimagemulti", {
            method: 'POST', body: JSON.stringify(imgdata), mode: 'cors',
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            }
          })
            .then(response => response.json())
            .then(post => {
              this.setState({
                images: post
              })
            });
        } else {
          this.setState({
            images: []
          })
        }
      });


  }

  alltag() {
    fetch("http://localhost:4000/images")
      .then(response => response.json())
      .then(posts => this.setState({ images: posts }));
  }
}





export default Apps;