import React from 'react';
import './App.css';
import { withRouter } from 'react-router';


class Menu extends React.Component {

    render() {
        return (
            <div class="Menu">

                serch:add
                <form onSubmit={this.submitSerch}>
                    <input placeholder="name"></input>
                    <button type="submit">serch</button>
                </form>
                <button onClick={this.addClick}>add</button>
            </div>
        );
    }
    addClick = () => {
        this.props.history.push('/addimage')
    }
    submitSerch = () => {
        alert("serch");
    }
}

export default withRouter(Menu);