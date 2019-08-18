import React, { Component } from 'react';
import { Card, Button, CardTitle, CardText } from 'reactstrap';

export default class Product extends Component {
  constructor(props) {
    super(props);
    this.state = { itemCt: props.item.count };
  }

  decrementItemCt(item) {
    this.setState({ itemCt: this.state.itemCt - 1 });
    this.props.onPlaceOrder(item.itemId);
  }

  render() {
    const { item } = this.props;
    return (
      <Card body>
        <CardTitle><strong>{item.title}</strong></CardTitle>
        <img src={require(`../assets/img/${item.image}`)} alt={item.image} width={150} />
        <CardText>Qty left: {this.state.itemCt}</CardText>
        <Button
          size="sm"
          onClick={() => this.decrementItemCt(item)}
        >
          Buy
        </Button>
      </Card>
    );
  }
}
