import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

import './css/AddImage.css';

export default class AddImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isUploading: false,
            images: [],
            file2ndname: [],//ニックネーム
            fileexist: false,
            defaultTags: [],//全タグ
            newtag: "",
            tags: []
        };

        //タグ一覧取得
        fetch("http://localhost:4000/tags")
            .then(response => response.json())
            .then(posts => this.setState({ defaultTags: posts }));

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
                    file2ndname: this.state.file2ndname.concat(images[0].file.name)
                });
            }).catch(e => console.log(e));

    }

    handleOnChange(e) {
        const name = e.target.name;
        for (var i in this.state.images) {
            if (name === this.state.images[i].file.name) {
                const array = this.state.file2ndname.slice();
                array[i] = e.target.value;
                this.setState({
                    file2ndname: array
                });
            }
        }
    }
    onChangeTag(e) {
        this.setState({
            newtag: e.target.value
        })
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
            //ファイル名重複確認
            this.imagealreadyexist();
        } else {
            alert("No image!")
        }
    }

    imagealreadyexist() {
        const data = {
            name: this.state.images[0].file.name
        };
        //画像取得
        fetch("http://localhost:4000/findimageByfilename", {
            method: 'POST', body: JSON.stringify(data), mode: 'cors',
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        })
            .then(response => response.json())
            .then(image => {
                if (image.length === 0) {
                    this.imagepost();
                } else {
                    alert("Deplication")
                }

            })
    }
    imagepost() {
        const imagedata = new FormData();
        imagedata.append('addnewimage', this.state.images[0].file);
        imagedata.append('imageTitle', this.state.file2ndname[0]);

        fetch('http://localhost:4000/uploadimage',
            {
                mode: 'cors', method: 'POST', body: imagedata
            })
            .then((Response) => {
                //タグ関係登録
                this.addtagtoimage();

                this.setState({
                    images: [],
                    file2ndname: [],
                    fileexist: false,
                })
                alert("upload!");
            })
            .catch((error) => {
                alert("failed");
            });

    }

    addtagtoimage() {
        const data = {
            name: this.state.images[0].file.name
        };
        //画像取得
        fetch("http://localhost:4000/findimageByfilename", {
            method: 'POST', body: JSON.stringify(data), mode: 'cors',
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        })
            .then(response => response.json())
            .then(image => {
                const imageid = image[0].id;
                //タグ関係登録
                for (var i in this.state.tags) {
                    var tagid = this.getTagidByname(this.state.tags[i].name);
                    var data = {
                        imageid: imageid,
                        tagid: tagid
                    }
                    fetch("http://localhost:4000/addtagtoimage", {
                        method: 'POST', body: JSON.stringify(data), mode: 'cors',
                        headers: {
                            "Content-Type": "application/json; charset=utf-8"
                        }
                    })
                        .then(response => {
                            response.json();
                            this.setState({
                                tags: []
                            })
                        })
                }
            });
    }

    getTagidByname(name) {
        for (var i in this.state.defaultTags) {
            if (name === this.state.defaultTags[i].name) {
                return this.state.defaultTags[i].id;
            }
        }
        return false;
    }

    testprint() {
        console.log(this.state.newtag);
    }

    onClickAddtag(e) {
        console.log(e.target.name);
        if (this.state.newtag !== "") {
            //新規タグか
            if (this.notIndefault()) {
                //タグ追加
                const data = {
                    newtag: this.state.newtag
                };
                fetch("http://localhost:4000/addtags", {
                    method: 'POST', body: JSON.stringify(data), mode: 'cors',
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    }
                }).then((res) => {
                    //タグ更新
                    //タグ一覧取得
                    fetch("http://localhost:4000/tags")
                        .then(response => response.json())
                        .then(posts => this.setState({ defaultTags: posts }));
                })
            }
            //同一タグが含まれているか
            if (this.notIntags()) {
                const nt = {
                    name: this.state.newtag
                }
                this.setState({
                    tags: this.state.tags.concat(nt)
                });
            }
        }
    }
    deletetag(e) {
        const tagname = e.target.value;
        //tagから削除
        const renewtags = this.state.tags.filter(n => {
            return n.name !== tagname;
        });
        this.setState({
            tags: renewtags
        });
    }

    notIndefault() {
        var bool = true;
        for (var i in this.state.defaultTags) {
            if (this.state.defaultTags[i].name === this.state.newtag) {
                bool = false;
            }
        }
        return bool;
    }
    notIntags() {
        var bool = true;
        for (var i in this.state.tags) {
            if (this.state.tags[i].name === this.state.newtag) {
                bool = false;
            }
        }
        return bool;
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
                                        name={image.file.name}
                                        onChange={e => this.handleOnChange(e)}></input>
                                        file : {image.file.name}
                                    </p>
                                    tags:
                                    {this.state.tags.map(tag => (
                                        <span className="tag" key={tag.name}>#{tag.name}<button value={tag.name} onClick={e => this.deletetag(e)}>×</button> </span>
                                    ))}
                                    <input type="text" autoComplete="on" list="deftags" onChange={e => this.onChangeTag(e)}></input>
                                    <button id="addtag" name={image.file.name} onClick={e => this.onClickAddtag(e)}>+</button>
                                </li>
                            </div>
                        )}
                    </ul>
                    <datalist id="deftags">
                        {this.state.defaultTags.map(def => (
                            <option key={def.id} value={def.name}></option>
                        ))}
                    </datalist>
                </div>

                <button id="imageadd-button" onClick={this.uploadaddImage}>Add</button>
            </div>
        );
    }


}

