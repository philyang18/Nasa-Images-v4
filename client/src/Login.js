import React from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';



export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLogin: true,
            password: "",
            passwordAgain: "",
            email: "",
            passwordErrorMessage: "",
            emailErrorMessage: "",
            loginError: false,
            showUI: false,
            isLoggedIn: props.location.state === undefined ? false : true
        };
    }
    toggleUI = () => {
        this.setState({showUI: true});
    }
    handleToggle = e => {
        e.preventDefault();
        this.setState({showLogin: !this.state.showLogin, password: "", passwordAgain: "", email: "" });
    }
    saveEmail = event => {
        this.setState({email: event.target.value, emailErrorMessage: "", loginError: false});
    }
    savePassword = event => {
        this.setState({password: event.target.value, passwordErrorMessage: "", loginError: false });
    }
    savePasswordAgain = event => {
        this.setState({passwordAgain: event.target.value, passwordErrorMessage: "" });
    }

    handleLogin = async event => {
        event.preventDefault();
        
        const account = {
            _id: this.state.email.toLowerCase(),
            password: this.state.password
        };
        await axios.post('http://localhost:4000/account/login', account)
            .then(response => {
                this.props.onLogin(this.state.email);
                this.setState({isLoggedIn: true, showUI: false});
                // this.props.history.push({
                //     pathname: '/',
                //     state: {
                //         email: this.state.email
                //     }
                // });
            })
            .catch( error => {
                this.setState({loginError: true});
            });
    }

    handleCreate = async event => {
        event.preventDefault();

        if(this.state.email.length < 5) {
            this.setState({emailErrorMessage: "Email is invalid"});
        }
        else if(this.state.password !== this.state.passwordAgain) {
            this.setState({passwordErrorMessage: "Passwords must match"});
        } 
        else if(this.state.password.length < 8) {
            this.setState({passwordErrorMessage: "Password must have at least 8 characters"});
        }
        else if(!/^(?=.*[a-z])/.test(this.state.password)) {
            this.setState({passwordErrorMessage: "Password must contain 1 lowercase character"});
        }
        else if(!/^(?=.*[A-Z])/.test(this.state.password)) {
            this.setState({passwordErrorMessage: "Password must contain 1 uppercase character"});
        }
        else if(!/^(?=.*[0-9])/.test(this.state.password)) {
            this.setState({passwordErrorMessage: "Password must contain 1 numerical character"});
        }
        else {
            this.setState({emailErrorMessage: ""});
            this.setState({passwordErrorMessage: ""});
            
            const account = {
                _id: this.state.email.toLowerCase(),
                password: this.state.password,
                favorites: []
            };
            await axios.post('http://localhost:4000/account/signup', account)
                .then(response => {
                    this.props.onLogin(this.state.email);
                    this.setState({isLoggedIn: true, showUI: false});
                    // this.props.history.push('/apod');
                })
                .catch( error => {
                    this.setState({emailErrorMessage: "Email is already in use"});
                });
        }
    }
    

    render() {

        return (
            <div id="login-page">
                {this.state.showUI ? 
                    <div className="container">
                        <div className="row">
                            <div id="login-container" className="col-12">
                                <div id="login-content">
                                    <h1>NASA Images</h1>
                                    {this.state.showLogin ? 
                                        <div>
                                            <h3>Login</h3>
                                            <form onSubmit={this.handleLogin} >
                                                <div className="form-group">
                                                    <label>Email: </label>
                                                    <input type="email" className="form-control" placeholder="johndoe@gmail.com" onChange={this.saveEmail} value={this.state.email}/>
                                                </div>
                                                <div className="form-group">
                                                    <label>Password: </label>
                                                    <input type="password" className="form-control" placeholder="********" onChange={this.savePassword} value={this.state.password}/>
                                                    {this.state.loginError ? <div className="text-danger">Invalid email or password</div> : <div /> }
                                                </div>
                                                <button className="btn btn-primary" type="submit">Login</button>
                                            </form>
                                            <div id="login-links" className="row">
                                                <p className="col-6">Forgot Password?</p>
                                                <p className="col-6"onClick={this.handleToggle}>Sign Up</p>
                                            </div>
                                        </div> :
                                        <div>
                                            <h3>Create Account</h3>
                                            <form onSubmit={this.handleCreate} >
                                                <div className="form-group">
                                                    <label>Email: </label>
                                                    <input type="email" className="form-control" placeholder="johndoe@gmail.com" onChange={this.saveEmail} value={this.state.email}/>
                                                    {this.state.emailErrorMessage.length > 0 ? <div className="text-danger">{this.state.emailErrorMessage}</div> : <div /> }
                                                </div>
                                                
                                                <div className="form-group">
                                                    <label>Password: </label>
                                                    <input type="password" className="form-control" placeholder="********" onChange={this.savePassword} value={this.state.password}/>
                                                </div>
                                                <div className="form-group">
                                                    <label>Re-enter Password: </label>
                                                    <input type="password" className="form-control" placeholder="********" onChange={this.savePasswordAgain} value={this.state.passwordAgain}/>
                                                    {this.state.passwordErrorMessage.length > 0 ? <div className="text-danger">{this.state.passwordErrorMessage}</div> : <div /> }
                                                </div>
                                                <button className="btn btn-success" type="submit">Create</button>
                                            </form>
                                            <div id="login-links" className="row">
                                                <p onClick={this.handleToggle} className="col-12">Already have an account? Log in</p>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div> 
                        </div>
                    </div> :
                    <div id="home-page">
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <h1>NASA IMAGES</h1>
                                    {this.state.isLoggedIn ? 
                                        <div id="home-link-container" className="row">
                                            
                                            <NavLink className="col-6" to={{
                                                    pathname: '/apod',
                                                    state: {
                                                        email: this.state.email
                                                    }
                                                }}>
                                                <h2 >
                                                    APOD
                                                </h2>
                                            </NavLink>

                                            
                                            <NavLink className="col-6" to={{
                                                pathname: '/mars',
                                                state: {
                                                    email: this.state.email
                                                }
                                            }}>
                                                <h2>
                                                    Mars
                                                </h2>
                                            </NavLink>
                                            
                                        </div> :
                                        <h2 onClick={this.toggleUI}>Login / Signup</h2> 
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}