import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { Link } from 'react-router-dom';

import server from "../api/server";
import {setCookie} from "../api/cookie"

// assets
import "./css/Login.css"

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {username: "", email:"", password:""};
    
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    
    handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
        [name]: value
    });
    }

    onFormSubmit = async (event) =>{
        event.preventDefault();
        const form = event.target;
        // const username = form.username.value;
        const email = form.email.value;
        const password = form.password.value;
        // console.log({username, email, password});
        const res = await server.post('/login', {email, password});
        // console.log('Response: ', res)
        if(res.status===200){
            setCookie('authtoken', res.data.token, 30);
            this.props.history.push("/home")
        }else {
            // Handle error
        }
        
    }
    render() { 

        return (
            <div style={{width:"300px", marginTop:"5%", marginLeft:"40%"}}>
                <form onSubmit={this.onFormSubmit}>
                    <div className="form-group">
                        <label for="exampleInputEmail1"><h4>Email address</h4></label>
                        <input name ="email" type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div className="form-group">
                        <label for="exampleInputPassword1"><h4>Password</h4></label>
                        <input name ="password" type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"/>
                    </div>
                    <button type="submit" className="btn btn-primary">Log In</button>
                </form>
                <br/>
                <div>
                    <Link to='/register'>  Don't have an account? Create a new one.</Link>
                </div>
            </div>
          );
    }
}
 
export default withRouter(Login);