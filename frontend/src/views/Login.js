import React, { Component } from 'react';
import axios from "axios";

const server = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true,
    // mode: '*cors', // no-cors, *cors, same-origin
    // cache: '*default', // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: 'same-origin', // include, *same-origin, omit
  })

class Login extends Component {
    // state = {username: "", email="", password=""};
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

    // onEmailChange = (event) =>{
    //   this.setState({email: event.target.value})
    // };
    // onUsernameChange = (event) =>{
    //     this.setState({username: event.target.value})
    //   };
    onFormSubmit = async (event) =>{
        event.preventDefault();
        const form = event.target;
        const username = form.username.value;
        const email = form.email.value;
        const password = form.password.value;
        
        

        
        // const res = await axios.get('http://localhost:5000/');
        // const res = await axios.post('http://localhost:5000/login',{
        //     // method: 'POST', // *GET, POST, PUT, DELETE, etc.
        //     // mode: 'no-cors', // no-cors, *cors, same-origin
        //     // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //     // // credentials: 'same-origin', // include, *same-origin, omit
        //     // headers: {
        //     //   'Content-Type': 'application/json'
        //     //   // 'Content-Type': 'application/x-www-form-urlencoded',
        //     // },
        //     // redirect: 'follow', // manual, *follow, error
        //     // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        //     body: {username,  password} // body data type must match "Content-Type" header
        // });
        console.log({username, email, password});
        const res = await server.post('/login', {username, email, password});
        // const res = await axios.post('http://localhost:5000/login', {
        //     "username": "dhoni",
        //     "email": "example07@gmail.com",
        //     "password": "dhoni07"
        // });

        console.log('Cookies', res.cookies)
        console.log('Response: ',res)
        const body = await res.data;
        console.log('Body: ', body);
    }
    render() { 
        return (
            <div>
                 <form  onSubmit={this.onFormSubmit}>
                        <label>Email </label>
                        <input 
                            name ="email"
                            type="text"
                            // value={this.state.email}
                            onChange={this.handleInputChange}
                        />
                        <label>Username </label>
                        <input 
                            name="username"
                            type="text"
                            // value={this.state.username}
                            onChange={this.handleInputChange}
                        />

                        <label>Password </label>
                        <input
                            name="password" 
                            type="password"
                            onChange={this.handleInputChange}
                        />
                    <button type="submit">Submit</button>
                </form>
            </div>
          );
    }
}
 
export default Login;