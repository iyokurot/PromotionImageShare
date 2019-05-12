import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

import './css/AddImage.css';

export default class AddImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isUploading: false,
            images: []
        };
        this.handleOnDrop = this.handleOnDrop.bind(this);
        this.uploadaddImage = this.uploadaddImage.bind(this);
    }
    handleOnDrop = (files) => {

        this.setState({ isUploading: true });
        Promise.all(files.map(file => this.uploadImage(file)))
            .then(images => {
                this.setState({
                    isUploading: false,
                    images: this.state.images.concat(images)
                });

                console.log(this.state.images);
            }).catch(e => console.log(e));

    }

    uploadImage = (file) => {
        console.log(file.name);
        const name = file.name;

        return {
            name,
        }
    }

    uploadaddImage() {
        if (this.state.images != null) {
            const imagedata = new FormData();
            imagedata.append('addnewimage', this.state.images);

            fetch('http://localhost:4000/uploadimage',
                { mode: 'cors', method: 'POST', body: imagedata })

        }
        alert("upload!")
    }

    render() {
        return (
            <div>
                <h1>Add Image!</h1>
                <div style={{ width: 960, margin: '20px auto' }}>
                    <Dropzone onDrop={this.handleOnDrop} accept="image/*">
                        {({ getRootProps, getInputProps }) => (
                            <div id="drop" {...getRootProps()}>
                                <input {...getInputProps()} />
                                {this.state.isUploading ?
                                    <div>ファイルをアップロードしています</div> :
                                    <div>ここに画像をドラックまたはクリック</div>}
                            </div>
                        )}
                    </Dropzone>



                </div>
                <div>
                    files
                <hr></hr>
                    <ul>
                        {this.state.images.map(image =>
                            <div>
                                <li>
                                    <p>name:<input value={image.name}></input>
                                        file:{image.name}
                                    </p>
                                    tags:<button>+</button>
                                </li>
                            </div>
                        )}
                    </ul>
                </div>

                <button onClick={this.uploadaddImage}>Add</button>
            </div>
        );
    }


}

