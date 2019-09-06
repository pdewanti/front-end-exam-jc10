import React, { Component } from 'react';
import Axios from 'axios';
import { urlApi } from '../../3.helpers/database';
import {connect} from 'react-redux'

class BestSeller extends Component {
    state ={
        data: null
    }
    componentDidMount(){
        Axios.get(urlApi + 'history' + this.props.items)
        .then((res)=>{
            this.setState({data: res.data})
            console.log(res)
        })
        .catch((err)=>{
            console.log(err)
        })
    }
    renderBestSeller = () => {
        var jsx = this.state.data((val)=>{
            return(
                <div>
                    TOP 3 BEST SELLING
                    <table>
                        <tr>
                            <td>Nama Barang</td>
                        </tr>
                        <tr>
                            <td>{val.items.productName}</td>
                        </tr>
                        <tr>

                        </tr>
                    </table>
                </div>
            )
        })
        return jsx
    }
    render() {
        console.log(this.props.items)
        return (
            <div>
                
            </div>
        );
    }
}

export default BestSeller;