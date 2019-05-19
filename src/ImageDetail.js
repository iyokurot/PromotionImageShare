import React, { Component } from 'react';

export default class ImageDetail extends Component {
    constructor(props) {
        super(props);
        const { params } = this.props.match;
        const id = params.id
        this.state = {
            imageid: id,
            file: []
        };
        const formdata = new FormData();
        formdata.append('imageid', this.state.imageid);
        fetch("http://localhost:4000/findimage", {
            method: 'POST', body: formdata, mode: "cors"
        })
            .then(response => response.json())
            .then(posts => this.setState({ file: posts }));


        this.test = this.test.bind(this);
    }

    render() {
        return (
            <div>
                <h1>Image Detail</h1>
                {this.state.file.map(image => (
                    <img src={image.url} alt={image.name} className="img" key={image.id}></img>
                ))}

                <button onClick={this.test}>{this.state.imageid}</button>
            </div>
        );
    }
    test() {
        console.log(this.state.file);
    }
}