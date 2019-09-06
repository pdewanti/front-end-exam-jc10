import React, { Component } from "react";
import Axios from "axios";
import { urlApi } from "../../3.helpers/database";
import { connect } from "react-redux";
import "./History.css";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { HistoCart } from "../../redux/1.actions";
import { Alert } from "reactstrap";

class History extends Component {
  state = {
    data: null
  };

  componentDidUpdate() {
    this.props.HistoCart(this.props.id);
  }
  componentDidMount() {
    Axios.get(urlApi + "history?userId=" + this.props.id)
      .then(res => {
        this.setState({ data: res.data });
        this.props.HistoCart(this.props.id);
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  historyKosong = () => {
    if (this.props.histo == 0) {
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
  renderHistory = () => {
    var jsx = this.state.data.map(val => {
      return (
        <div className="tablehistory">
          <table>
            <tr>
              <th>id</th>
              <th>waktu</th>
              <th>totalPrice</th>
              <th>Penerima</th>
              <th>Alamat</th>
              <th>Detail</th>
            </tr>
            <tr>
              <td>{val.id}</td>
              <td>{val.time}</td>
              <td>{val.TotalPrice}</td>
              <td>{val.recipient}</td>
              <td>{val.address}</td>
              <Link
                to={{
                  pathname: "/history-detail/" + val.id,
                  state: {
                    transactionId: val.id
                  }
                }}
              >
                <th>click untuk detail</th>
              </Link>
            </tr>
          </table>
        </div>
      );
    });
    return jsx;
  };
  render() {
    console.log(this.props.id);
    if (this.state.data === null) {
      return "apapun";
    } else if (this.props.id == 0) {
      return <Redirect to="/" exact />;
    }

    return (
      <div>
        {this.checkLogin()}
        {this.historyKosong()}
        <table>{this.renderHistory()}</table>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    username: state.user.username,
    role: state.user.role,
    id: state.user.id,
    histo: state.history.historyLength
  };
};
export default connect(
  mapStateToProps,
  { HistoCart }
)(History);