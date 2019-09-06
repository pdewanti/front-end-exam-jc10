import React, { Component } from "react";
import Axios from "axios";
import { urlApi } from "../../3.helpers/database";
import { connect } from "react-redux";
import { onWish } from "../../redux/1.actions";

class ParaSultan extends Component {
  state = {
    data: [],
    username: null
  };
  componentDidMount() {
    Axios.get(urlApi + "history")
      .then(res => {
        this.setState({
          dataSultan: res.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  renderParaSultan = () => {
    var price = [];
    var id = 0;
    var totalprice = 0;
    this.state.dataSultan.map(val => {
      return price.push(Number(val.totalPrice));
    });
    price.sort(function(a, b) {
      return b - a;
    });
    totalprice = price[0];
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="card shadow mt-3">
              <div className="card-header border-0 pt-5">
                {/* {this.state.data[0].price} */}
              </div>
              <div className="card-body">
                <ul>{/* <li> {this.renderJumlahQty()} </li> */}</ul>
              </div>
              <div className="card-footer align-items-center"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

export default connect(
  mapStateToProps,
  { onWish }
)(ParaSultan);