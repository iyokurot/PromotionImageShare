import React from 'react';
import './App.css';
import './css/Menu.css';
import { withRouter } from 'react-router';


class Menu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            serchname: "",
            img: [],
            nowrender: ""
        };



        this.serchClick = this.serchClick.bind(this);
    }

    render() {
        return (
            <div className="Menu">
                <span id="kensaku">検索</span>
                <input placeholder="name" onChange={e => this.onChangeserch(e)}></input>
                <button id="serchimage-button" onClick={this.serchClick}>serch</button>
                <span id="now-render">{this.props.nowrender}</span>
                <button id="addimage-button" onClick={this.addClick}>addImage</button>
            </div>
        );
    }
    addClick = () => {
        this.props.history.push('/addimage')
    }
    onChangeserch(e) {
        const str = e.target.value;
        this.setState({
            serchname: str
        })
    }
    serchClick() {
        //console.log(this.state.serchname);
        var serch = this.state.serchname;
        this.props.onEventCallBack({ serchname: serch });
    }
}

export default withRouter(Menu);