import React from 'react';
import './App.css';
import './css/Settings.css';
import { withRouter } from 'react-router';

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tagsetting: false,
            tagjoin: false,
            joinone: "",
            jointwo: "",
            tagdelete: false,
            deltag: "",
            tagalldelete: false,
            imagesetting: false,
            help: false,
            tags: []
        };
        this.getTagfetch();
    }

    render() {
        return (
            <div>
                <h1>Setting</h1><br></br>
                <div className="setting-area">
                    <span onClick={this.opentagsetting}>タグ ▽</span><br></br>
                    <div style={{ display: this.state.tagsetting ? '' : 'none' }}>
                        <button className="button-blue" onClick={this.opentagjoin}>タグ結合</button>
                        <button className="button-blue" onClick={this.opentagdelete}>タグ削除</button>
                        <button className="button-blue" onClick={this.opentagalldelete}>タグ全削除</button>
                        <div style={{ display: this.state.tagjoin ? '' : 'none' }}>
                            選択した二つのタグを結合します(一つ目のタグ名が使用されます)<br></br>
                            <select className="selectbox" onChange={e => this.tagjoinone(e)}>
                                {this.state.tags.map(tag => (
                                    <option key={tag.id}>{tag.name}</option>
                                ))}
                            </select>
                            +
                            <select className="selectbox" onChange={e => this.tagjointwo(e)}>
                                {this.state.tags.map(tag => (
                                    <option key={tag.id}>{tag.name}</option>
                                ))}
                            </select>
                            <button className="button-blue" onClick={this.jointag}>結合</button>
                        </div>
                        <div style={{ display: this.state.tagdelete ? '' : 'none' }}>
                            選択したタグを削除します<br></br>
                            <select className="selectbox" onChange={e => this.onChangedeltag(e)}>
                                {this.state.tags.map(tag => (
                                    <option key={tag.id}>{tag.name}</option>
                                ))}
                            </select>
                            <button className="button-blue" onClick={this.deletetag}>削除</button>
                        </div>
                        <div style={{ display: this.state.tagalldelete ? '' : 'none' }}>
                            タグをすべて削除します<br></br>
                            <button className="button-blue" onClick={this.deletealltag}>全削除</button>
                        </div>
                    </div>

                </div>
                <div className="setting-area">
                    <span onClick={this.openimagesetting}>画像 ▽</span><br></br>
                    <div style={{ display: this.state.imagesetting ? '' : 'none' }}>
                        <button className="button-blue" onClick={this.deleteallimage}>画像全削除</button>
                    </div>
                </div>
                <div className="setting-area">
                    <span onClick={this.openhelp}>ヘルプ ▽</span><br></br>
                    <div style={{ display: this.state.help ? '' : 'none' }}>
                        <button className="button-blue" >画像追加</button>
                        <button className="button-blue" >画像ダウンロード</button>
                        <button className="button-blue" >画像更新</button>
                        <button className="button-blue" >検索</button>
                        <button className="button-blue" >タグ</button>
                    </div>
                </div>

            </div>
        )
    }

    opentagsetting = () => {
        this.setState({
            tagsetting: !this.state.tagsetting
        });
    }
    opentagjoin = () => {
        this.setState({
            tagjoin: !this.state.tagjoin,
            tagdelete: false,
            tagalldelete: false
        });
    }
    tagjoinone = (e) => {
        this.setState({
            joinone: e.target.value
        })
    }
    tagjointwo = (e) => {
        this.setState({
            jointwo: e.target.value
        })
    }

    jointag = () => {
        //alert(this.state.joinone + ":" + this.state.jointwo)
        if (this.state.joinone !== this.state.jointwo) {
            if (window.confirm('タグを結合します')) {
                //１，２のidを取得
                const idone = this.getTagidByname(this.state.joinone);
                const idtwo = this.getTagidByname(this.state.jointwo);
                //タグー画像の関係を更新
                const data = {
                    one: idone,
                    tagid: idtwo
                }
                fetch("http://localhost:4000/jointagtoimage", {
                    method: 'POST', body: JSON.stringify(data), mode: 'cors',
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    }
                }).then((res) => {
                    //２番目タグを削除
                    fetch("http://localhost:4000/deletetags", {
                        method: 'POST', body: JSON.stringify(data), mode: 'cors',
                        headers: {
                            "Content-Type": "application/json; charset=utf-8"
                        }
                    }).then((res) => {
                        //タグ更新fetch
                        this.getTagfetch();
                    })
                })
                alert('結合しました');
            }

        } else {
            alert("タグが重複しています")
        }
    }
    opentagdelete = () => {
        this.setState({
            tagjoin: false,
            tagdelete: !this.state.tagdelete,
            tagalldelete: false
        });
    }

    onChangedeltag = (e) => {
        this.setState({
            deltag: e.target.value
        })
    }
    deletetag = () => {
        if (window.confirm('タグ [ ' + this.state.deltag + ' ] を削除しますか？')) {
            //id取得
            const tagid = this.getTagidByname(this.state.deltag);
            const data = {
                tagid: tagid
            }
            //タグ関係削除
            fetch("http://localhost:4000/deletetagtoimageBytagid", {
                method: 'POST', body: JSON.stringify(data), mode: 'cors',
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                }
            }).then((res) => {
                //タグ削除
                fetch("http://localhost:4000/deletetags", {
                    method: 'POST', body: JSON.stringify(data), mode: 'cors',
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    }
                }).then((res) => {
                    //タグ更新fetch
                    this.getTagfetch();
                })
            })
            alert('削除しました');
        }
    }
    opentagalldelete = () => {
        this.setState({
            tagjoin: false,
            tagdelete: false,
            tagalldelete: !this.state.tagalldelete
        });
    }
    openimagesetting = () => {
        this.setState({
            imagesetting: !this.state.imagesetting
        });
    }
    openhelp = () => {
        this.setState({
            help: !this.state.help
        });
    }

    deletealltag() {
        if (window.confirm('本当にすべてのタグを削除しますか？\n各画像に設定したタグも削除されます')) {
            //タグ関係全削除
            fetch("http://localhost:4000/deletetagtoimageall", {
                method: 'POST', mode: 'cors',
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                }
            }).then((res) => {
                //タグ全削除
                fetch("http://localhost:4000/deletetagall", {
                    method: 'POST', mode: 'cors',
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    }
                }).then((res) => {
                })
            })

            alert('削除しました');
        }
    }

    deleteallimage() {
        if (window.confirm('本当にすべての画像を削除しますか？')) {
            fetch("http://localhost:4000/deletetagtoimageall", {
                method: 'POST', mode: 'cors',
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                }
            }).then((res) => {
                fetch("http://localhost:4000/deleteimageall", {
                    method: 'POST', mode: 'cors',
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    }
                }).then((res) => {
                })
            });
            alert('削除しました');
        }
    }

    //タグfetch
    getTagfetch() {
        fetch("http://localhost:4000/tags")
            .then(response => response.json())
            .then(posts => {
                if (posts.length > 0) {
                    this.setState({
                        tags: posts,
                        joinone: posts[0].name,
                        jointwo: posts[0].name,
                        deltag: posts[0].name
                    })
                }
            });
    }

    //nameからタグid取得
    getTagidByname(name) {
        for (var i in this.state.tags) {
            if (name === this.state.tags[i].name) {
                return this.state.tags[i].id;
            }
        }
        return null;
    }
}

export default withRouter(Settings);