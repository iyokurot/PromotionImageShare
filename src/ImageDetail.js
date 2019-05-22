import React, { Component } from 'react';
import { withRouter } from 'react-router';
import './css/ImageDetail.css';

class ImageDetail extends Component {
    constructor(props) {
        super(props);
        const { params } = this.props.match;
        const id = params.id
        this.state = {
            imageid: id,
            file: [],
            defaultTags: [],
            tags: [],
            newtag: ""
        };

        const data = {
            imageid: this.state.imageid
        };

        //画像取得
        fetch("http://localhost:4000/findimage", {
            method: 'POST', body: JSON.stringify(data), mode: 'cors',
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        })
            .then(response => response.json())
            .then(posts => this.setState({ file: posts }));
        //タグ一覧取得
        fetch("http://localhost:4000/tags")
            .then(response => response.json())
            .then(posts => this.setState({ defaultTags: posts }));
        //タグ関係取得

        //タグ取得


        this.test = this.test.bind(this);
        this.addtag = this.addtag.bind(this);
    }

    render() {

        return (
            <div>
                <h1>Image Detail</h1>
                <div className="details">
                    {this.state.file.map(image => (
                        <div className="imagedata" key={image.id}>
                            <div className="topImage" key={image.id}>
                                <img src={image.url} alt={image.name} className="img" key={image.id}></img>
                            </div>
                            <span>name:<input defaultValue={image.name}></input></span>
                            <span>size:{image.size}</span>
                            <a href={image.url} download>↓ダウンロード</a>
                        </div>
                    ))}


                    tags:{this.state.tags.map(tag => (
                        <span className="tag">#{tag} </span>
                    ))}
                    <input type="text" autoComplete="on" list="deftags" onChange={e => this.onChangeAddtag(e)}></input>

                    <datalist id="deftags">
                        {this.state.defaultTags.map(def => (
                            <option key={def.id} value={def.name}></option>
                        ))}
                    </datalist>


                    <button onClick={this.addtag}>#</button><br></br>

                    <button onClick={this.test} className="buttons">更新</button>
                    <button onClick={this.onDelete} className="buttons">削除</button>
                </div>
            </div>
        );
    }
    test() {
        alert("test message");
    }
    addtag() {
        if (!this.notIntags()) {
            this.setState({
                tags: this.state.tags.concat(this.state.newtag)
            })
            console.log(this.state.tags);
        }
    }

    notIntags() {
        return this.state.tags.includes(this.state.newtag);
    }

    onChangeAddtag(e) {
        this.setState({
            newtag: e.target.value
        });
    }

    onDelete = () => {
        //削除POST
        const data = {
            imageid: this.state.imageid
        };
        fetch("http://localhost:4000/deleteimage", {
            method: 'PUT', body: JSON.stringify(data), mode: 'cors',
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        })
            .then(response => response.json());

        alert("削除しました")
        this.props.history.push('/');
    }
}

export default withRouter(ImageDetail);