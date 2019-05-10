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
    }
    handleOnDrop = (files) => {

        this.setState({ isUploading: true });
        Promise.all(files.map(file => this.uploadImage(file)))
            .then(images => {
                this.setState({
                    isUploading: false,
                    images: this.state.images.concat(images)
                });

                console.log(images);
                console.log(this.state.images);
            }).catch(e => console.log(e));

    }

    uploadImage(file) {
        console.log(file.name);
        const name = file.name;

        return {
            name,
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
                    {this.state.images.map(image =>
                        <div>
                            <p>name:{image.name}</p>
                        </div>
                    )}
                </div>
                <input type="text" placeholder="ファイル名"></input>
                <input type="number"></input>

                <button>Add</button>
            </div>
        );
    }


}

