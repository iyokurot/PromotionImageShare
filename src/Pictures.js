import React from 'react';
import './App.css';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

class Pictures extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            images: []
        };


        fetch("http://localhost:4000/images")
            .then(response => response.json())
            .then(posts => this.setState({ posts }));
    }
    render() {
        return (
            <div className="picture-select-area">{this.props.imgs.map(post => (
                <Link to={'/imagedetail/' + post.id} key={post.id}>
                    <div className="images" key={post.id}>
                        <div className="images-inner" key={post.id}>

                            <div className="image-sqare" key={post.id}>
                                <img src={post.url} alt={post.name} className="img" key={post.id}></img><br></br>
                            </div>
                        </div>
                        <span className="imagelinks">{post.name}</span>



                    </div>
                </Link>
            ))}
            </div>
        );
    }

    test() {
        console.log("tessss");
    }
}

export default withRouter(Pictures);