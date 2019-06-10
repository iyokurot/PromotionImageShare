import React from 'react';

class Help extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            helplist: [
                { id: 0, name: "画像追加" },
                { id: 1, name: "画像ダウンロード" },
                { id: 2, name: "画像更新" },
                { id: 3, name: "検索" },
                { id: 4, name: "タグ" }
            ]
        }
        this.gethelplist();
    }
    render() {
        return (
            <div>
                {(() => {
                    if (this.props.num === "0") {
                        return (
                            <HelpAddimage />
                        );
                    } else if (this.props.num === "1") {
                        return (
                            <HelpDounloadimage />
                        );
                    } else if (this.props.num === "2") {
                        return (
                            <HelpUpdateimage />
                        );
                    } else if (this.props.num === "3") {
                        return (
                            <HelpSerch />
                        );
                    } else if (this.props.num === "4") {
                        return (
                            <HelpUsetag />
                        );
                    } else {
                        return <span>wrong</span>
                    }
                })()}

            </div>
        );
    }

    gethelplist() {
        this.props.helplist(this.state.helplist);
    }


}
class HelpAddimage extends React.Component {
    render() {
        return (
            <div>
                <h2>画像の追加方法</h2>
                <span>画像を追加するには右上の「AddImage」ボタンを押します</span>
            </div>
        )
    }
}
class HelpDounloadimage extends React.Component {
    render() {
        return (
            <div>
                <h2>画像のダウンロード方法</h2>
            </div>
        )
    }
}
class HelpUpdateimage extends React.Component {
    render() {
        return (
            <div>
                <h2>画像の更新方法</h2>
            </div>
        )
    }
}
class HelpSerch extends React.Component {
    render() {
        return (
            <div>
                <h2>検索方法</h2>
            </div>
        )
    }
}
class HelpUsetag extends React.Component {
    render() {
        return (
            <div>
                <h2>タグの使い方</h2>
            </div>
        )
    }
}

export default Help;