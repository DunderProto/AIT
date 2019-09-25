import React from 'react';

class Card extends React.Component {
    constructor() {
        super();
        this.state = {
            value: false
        }

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        console.log("YO")
        if (this.state.value === null) {
            this.setState({value: "O"});
        } else {
            this.setState({value: null});
        }
    }

    render() {
        return (
            <div onClick={this.handleClick}>Card Component</div>
        )
    }
}

export default Card;