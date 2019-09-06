import React, { Component } from "react";
import Axios from "axios";
import { connect } from "react-redux";
import { urlApi } from "../../3.helpers/database";
import swal from "sweetalert";
import { qtyCart } from "../../redux/1.actions";
import { Link, Redirect } from "react-router-dom";
import { Alert } from "reactstrap";

class Cart extends Component {
  state = {
    cartData: [],
    TotalCheckout: 0,
    imputPenerima: "",
    inputKodePos: "",
    inputAlamat: "",
    isCheckout: false
  };

  componentWillReceiveProps(newProps) {
    this.getDataCart(newProps.id);
  }

  componentDidMount() {
    this.getDataCart(this.props.id);
    this.props.qtyCart(this.props.id);
  }
  componentDidUpdate() {
    this.props.qtyCart(this.props.id);
  }

  deleteCartItem = id => {
    Axios.delete(urlApi + "cart/" + id)
      .then(res => {
        swal("Success", "Item Deleted", "success");
        this.getDataCart(this.props.id);
      })
      .catch(err => {
        swal("Error", "There is an error", "error");
      });
  };

  getDataCart = id => {
    Axios.get(urlApi + "cart?userId=" + id)
      .then(res => {
        console.log(res);
        this.setState({ cartData: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  };

  renderCart = () => {
    var jsx = this.state.cartData.map((val, idx) => {
      return (
        <tr>
          <td>{val.productName}</td>
          <td>
            <img src={val.img} height="50px" />
          </td>
          <td>{val.price - val.price * (val.discount / 100)}</td>
          <td>
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => this.onBtnEditQty("min", idx)}
              >
                -
              </button>
              <button type="button" className="btn btn-secondary">
                {val.quantity}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => this.onBtnEditQty("add", idx)}
              >
                +
              </button>
            </div>
          </td>
          <td>
            {(val.price - val.price * (val.discount / 100)) * val.quantity}
          </td>
          <td>
            <input
              type="button"
              className="btn btn-danger btn-block"
              onClick={() => this.deleteCartItem(val.id)}
              value="Delete"
            />
          </td>
        </tr>
      );
    });

    return jsx;
  };

  TotalPrice = () => {
    let result = 0;
    this.state.cartData.map(val => {
      result += val.quantity * (val.price - val.price * (val.discount / 100));
    });
    return result;
  };

  onBtnPay = () => {
    let TotalPrice = this.TotalPrice();
    let d = new Date();
    let today = `${d.getFullYear()}-${d.getMonth() + 1} - ${d.getDate()}`;
    let items = this.state.cartData;
    let newData = {
      userId: this.props.id,
      items,
      time: today,
      TotalPrice,
      recipient: this.state.inputPenerima,
      postalCode: this.state.inputKodePos,
      address: this.state.inputAlamat
    };
    if (TotalPrice > this.state.inputUang) {
      swal("Uang Tidak Cukup", "Uang Anda Tidak Mencukupi", "warning");
    } else if (this.state.inputUang > TotalPrice) {
      swal(
        "Success",
        "Uang kembalian anda adalah" + (this.state.inputUang - TotalPrice),
        "success"
      );
      Axios.post(urlApi + "history", newData)
        .then(res => {
          console.log(res);
          this.props.KartingEuy(this.props.id);
        })
        .catch(err => {
          console.log(err);
        });
      for (var i = 0; i < this.state.cartData.length; i++) {
        Axios.delete(urlApi + "cart/" + this.state.cartData[i].id)
          .then(res => {
            console.log(res);

            this.getDataCart();
          })
          .catch(err => console.log(err));
      }
    } else {
      swal("Success!", "Ntap Gan udah pas uangnya", "Success");
      Axios.post(urlApi + "history", newData)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
      for (var i = 0; i < this.state.cartData.length; i++) {
        Axios.delete(urlApi + "cart/" + this.state.cartData[i].id)
          .then(res => {
            console.log(res);
            this.getDataCart();
          })
          .catch(err => console.log(err));
      }
    }
  };

  onBtnEditQty = (action, idx) => {
    let arrCart = this.state.cartData;

    if (action == "min") {
      if (arrCart[idx].quantity > 1) {
        arrCart[idx].quantity -= 1;
        Axios.put(urlApi + "cart/" + arrCart[idx].id, arrCart[idx])
          .then(res => this.getDataCart(this.props.id))
          .catch(err => console.log(err));
      }
    } else if (action == "add") {
      arrCart[idx].quantity += 1;
      Axios.put(urlApi + "cart/" + arrCart[idx].id, arrCart[idx])
        .then(res => this.getDataCart(this.props.id))
        .catch(err => console.log(err));
    }
  };

  funCharKosong = () => {
    if (this.props.cart == 0) {
      return (
        <Alert color="danger" className="text-center">
          Cart anda kosong <Link to="/">Pergi berbelanja</Link>
        </Alert>
      );
    }
  };
  checkLogin = () => {
    if (this.props.username == "" || this.props.role == "") {
      return <Redirect to="/" />;
    }
  };
  render() {
    return (
      <div className="container -fluid">
        {this.checkLogin()}
        {this.funCharKosong()}
        <table className="table mt-3 text-center">
          <thead>
            <tr>
              <th>Name</th>
              <th>Gambar</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>{this.renderCart()}</tbody>

          <div className="row mt-5">
            <div className="col-8">
              <input
                type="button"
                className="btn btn-success btn-block"
                value="CHECKOUT"
                onClick={() =>
                  this.setState({ isCheckout: !this.state.isCheckout })
                }
              />
            </div>
            {/* {this.TotalPrice()} */}
            {this.state.cartData.length > 0 ? (
              <div className="col-8">
                <h3>Total Harga = {this.TotalPrice()}</h3>
              </div>
            ) : null}
          </div>
          {this.state.isCheckout ? (
            <div className="row mt-4">
              <div className="col-10">
                <div className="row">
                  <div className="col-6">
                    <input
                      type="text"
                      onChange={e => {
                        this.setState({ inputPenerima: e.target.value });
                      }}
                      className="form-control "
                      placeholder="Insert Receiver Name"
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="button"
                      value="pay"
                      onClick={this.onBtnPay}
                      className="btn btn-primary btn-block"
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-8">
                    <input
                      type="text"
                      onChange={e => {
                        this.setState({ inputAlamat: e.target.value });
                      }}
                      className="form-control "
                      placeholder="Insert Address"
                    />
                  </div>
                  <div className="col-4">
                    <input
                      type="text"
                      onChange={e => {
                        this.setState({ inputKodePos: e.target.value });
                      }}
                      className="form-control "
                      placeholder="Insert Postal Code"
                    />
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-12">
                  <input
                    type="number"
                    onChange={e => {
                      this.setState({ inputUang: e.target.value });
                    }}
                    className="form-control"
                    placeholder="Insert payment"
                  />
                </div>
              </div>
            </div>
          ) : null}
        </table>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    id: state.user.id,
    username: state.user.username,
    role: state.user.role,
    cart: state.cart.cartLength
  };
};

export default connect(
  mapStateToProps,
  { qtyCart }
)(Cart);