import React, { Component } from 'react'
import Axios from 'axios';
import { urlApi } from '../../3.helpers/database';
import {connect} from 'react-redux'

class HistoryDetail extends Component {
    state = {
        data: null
    }
    componentDidMount(){
        Axios.get(urlApi + 'history?userId=' + this.props.id +'&id='+this.props.location.state.transactionId )
        .then((res)=>{
            this.setState({data: res.data})
            console.log(res.data)
            
        })
        .catch((err)=>{
            console.log(err)
        })
    }
    renderDetail=()=>{ // ini buat render jumlah
        var jsx = this.state.data.map((val) => {
            var porno = val.items.map((value) => {
                return(
                    <div>
                        <table>
                            <tr>
                                <th>Kuantitas</th>
                                <th>Individual Price</th>
                                <th>Nama Produk</th>
                                <th>Diskon</th>
                            </tr>
                            <tr>
                                <td>{value.quantity}</td>
                                <td>{value.price}</td>
                                <td>{value.productName}</td>
                                <td>{value.discount}</td>
                            </tr>
                        </table>
                        
                    </div>
                )
            })
            return porno
        })
        return jsx
    }

    functionBaru = () => {
        var baru = this.state.data.items.map((val)=>{
            return
        })
    }
    render() {
        if(this.state.data === null){
            return(
                <h1>loading</h1>
            )
        }
        return (
            <div>
                {this.renderDetail()}
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return{
        id: state.user.id,
        items: state.user.id
    }
}

export default connect (mapStateToProps)(HistoryDetail);