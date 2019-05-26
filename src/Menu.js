import React from 'react';
import './App.css';
import { withRouter } from 'react-router';


class Menu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            serchname: "ss",
            img: []
        };



        this.serchClick = this.serchClick.bind(this);
    }

    render() {
        return (
            <div className="Menu">

                serch:add
             <input placeholder="name" onChange={e => this.onChangeserch(e)}></input>
                <button onClick={this.serchClick}>serch</button>
                <button onClick={this.addClick}>add</button>
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
        console.log(this.state.serchname);
    }
}

export default withRouter(Menu);