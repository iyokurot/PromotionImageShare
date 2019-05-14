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

                //console.log(this.state.images[0]);
            }).catch(e => console.log(e));

    }

    uploadImage = (file) => {
        console.log(file);
        /*
        const name = file.name;
        const path = file.path;
        const type = file.type;
        */

        return {
            file
        }
    }

    uploadaddImage() {
        if (this.state.images !== []) {
            const imagedata = new FormData();
            imagedata.append('addnewimage', this.state.images[0].file);

            fetch('http://localhost:4000/uploadimage',
                {
                    mode: 'cors', method: 'POST', body: imagedata
                })
                .then((Response) => {
                    alert("upload!");
                    //console.log(imagedata.addnewimage);
                    //console.log(this.state.images[0].file);
                }).catch((error) => {
                    alert("failed");
                });
            /*
            fetch('http://192.168.1.3/picture/',
                {
                    mode: 'cors', method: 'POST', body: imagedata
                })                
                */

        } else {
            alert("No image!")
        }

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
                            <div key={image.file.path}>
                                <li>
                                    <p>name:<input value={image.file.name}></input>
                                        file:{image.file.name},
                                        path:{image.file.path}
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

