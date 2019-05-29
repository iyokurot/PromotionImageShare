import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

import './css/AddImage.css';

export default class AddImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isUploading: false,
            images: [],
            file2ndname: "",
            fileexist: false
        };
        this.handleOnDrop = this.handleOnDrop.bind(this);
        this.uploadaddImage = this.uploadaddImage.bind(this);
    }
    handleOnDrop = (files) => {
        this.setState({ isUploading: true, fileexist: true });
        Promise.all(files.map(file => this.uploadImage(file)))
            .then(images => {
                this.setState({
                    isUploading: false,
                    images: this.state.images.concat(images),
                    file2ndname: images[0].file.name
                });
                console.log(images[0].file.size);

            }).catch(e => console.log(e));

    }

    handleOnChange(e) {
        this.setState({
            file2ndname: e.target.value
        });
    }


    uploadImage = (file) => {
        //console.log(file);
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
        if (this.state.fileexist) {
            const imagedata = new FormData();
            imagedata.append('addnewimage', this.state.images[0].file);
            imagedata.append('imageTitle', this.state.file2ndname);

            fetch('http://localhost:4000/uploadimage',
                {
                    mode: 'cors', method: 'POST', body: imagedata
                })
                .then((Response) => {
                    alert("upload!");
                    //console.log(imagedata.addnewimage);
                    //console.log(this.state.images[0].file);
                    this.setState({
                        images: [],
                        file2ndname: "",
                        fileexist: false
                    })
                }).catch((error) => {
                    alert("failed");
                });

        } else {
            alert("No image!")
        }
    }

    testprint() {
        console.log(this.state.file2ndname);
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
                                <li className="filelist">
                                    <p>name:<input type="text" defaultValue={image.file.name}
                                        onChange={e => this.handleOnChange(e)}></input>
                                        file : {image.file.name}
                                    </p>
                                    tags:<button onClick={() => this.testprint()}>+</button>
                                </li>
                            </div>
                        )}
                    </ul>
                </div>

                <button id="imageadd-button" onClick={this.uploadaddImage}>Add</button>
            </div>
        );
    }


}

