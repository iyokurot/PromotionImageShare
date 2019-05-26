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
            renewNickname: "",//新しい名前
            defaultTags: [],//全タグ
            tagtoimage: [],//タグとイメージ関係
            deftags: [],//すでに設定されているタグ
            tags: [],//設定タグ
            newtag: "",//追加するタグ
            deldeftags: []//設定されているタグから削除するidリスト
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
            .then(posts => this.setState({
                file: posts,
                renewNickname: posts[0].name
            }));
        //タグ一覧取得
        fetch("http://localhost:4000/tags")
            .then(response => response.json())
            .then(posts => this.setState({ defaultTags: posts }));
        //タグ関係取得
        fetch("http://localhost:4000/gettagtoimage", {
            method: 'POST', body: JSON.stringify(data), mode: 'cors',
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        })
            .then(response => response.json())
            .then(posts => {
                this.setState({ tagtoimage: posts });

                if (posts.length > 0) {
                    //タグ取得
                    fetch("http://localhost:4000/gettags", {
                        method: 'POST', body: JSON.stringify(posts), mode: 'cors',
                        headers: {
                            "Content-Type": "application/json; charset=utf-8"
                        }
                    })
                        .then(response => response.json())
                        .then(posts => {
                            this.setState({
                                deftags: posts,
                                tags: posts
                            });
                        });
                }
            });



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
                            <span>name:<input defaultValue={image.name} onChange={e => this.onChangename(e)}></input></span>
                            <span>size:{image.size}</span>
                            <a href={image.url} download>↓ダウンロード</a>
                        </div>
                    ))}


                    tags:{this.state.tags.map(tag => (
                        <span className="tag" key={tag.name}>#{tag.name}<button value={tag.name} onClick={e => this.deletetag(e)}>×</button> </span>
                    ))}
                    <input type="text" autoComplete="on" list="deftags" onChange={e => this.onChangeAddtag(e)}></input>

                    <datalist id="deftags">
                        {this.state.defaultTags.map(def => (
                            <option key={def.id} value={def.name}></option>
                        ))}
                    </datalist>


                    <button onClick={this.addtag}>#</button><br></br>

                    <button onClick={this.onUpdate} className="buttons">更新</button>
                    <button onClick={this.onDelete} className="buttons">削除</button>
                </div>
            </div>
        );
    }
    test() {
        alert("test message");
    }
    onChangename(e) {
        this.setState({
            renewNickname: e.target.value
        });
    }
    addtag() {
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
                id: "n",
                name: this.state.newtag
            }
            this.setState({
                tags: this.state.tags.concat(nt)
            })
        }
    }
    deletetag(e) {
        console.log(e.target.value);
        const tagname = e.target.value;
        //deftagにあるか
        if (!this.notIndeftags(tagname)) {
            const tagid = this.getTagidByname(tagname);
            //あれば削除リストへ
            this.setState({
                deldeftags: this.state.deldeftags.concat(tagid)
            });
        }
        //tagから削除
        const renewtags = this.state.tags.filter(n => {
            return n.name !== tagname;
        });
        this.setState({
            tags: renewtags
        });
    }

    notIndeftags(name) {
        var bool = true;
        for (var i in this.state.deftags) {
            if (this.state.deftags[i].name === name) {
                bool = false;
            }
        }
        return bool;
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

    onChangeAddtag(e) {
        this.setState({
            newtag: e.target.value
        });
    }
    onUpdate = () => {
        //ニックネームの更新
        if (this.state.file[0].name !== this.state.renewNickname) {
            var renewdata = {
                imageid: this.state.imageid,
                nickname: this.state.renewNickname
            }
            fetch("http://localhost:4000/updateimage", {
                method: 'POST', body: JSON.stringify(renewdata), mode: 'cors',
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                }
            })
                .then(response => response.json());
        }


        //既存tag関係の削除
        if (this.state.deldeftags.length > 0) {
            var deldata = {
                imageid: this.state.imageid,
                idlist: this.state.deldeftags
            }
            fetch("http://localhost:4000/deletetagtoimage", {
                method: 'POST', body: JSON.stringify(deldata), mode: 'cors',
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                }
            })
                .then(response => response.json());
        }

        //idがｎのものループ
        for (var n in this.state.tags) {
            if (this.state.tags[n].id === "n") {
                //deftagからtagid取得
                var tagid = this.getTagidByname(this.state.tags[n].name);
                //fetchでtag関係post
                var data = {
                    imageid: this.state.imageid,
                    tagid: tagid
                };
                fetch("http://localhost:4000/addtagtoimage", {
                    method: 'POST', body: JSON.stringify(data), mode: 'cors',
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    }
                })
                    .then(response => response.json())
            }
        }
        alert("更新しました")
    }

    getTagidByname(name) {
        for (var i in this.state.defaultTags) {
            if (name === this.state.defaultTags[i].name) {
                return this.state.defaultTags[i].id;
            }
        }
        return false;
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
            .then(response => response.json())
            .then(posts => {
                alert("削除しました")
                this.props.history.push('/');
            });


    }
}

export default withRouter(ImageDetail);