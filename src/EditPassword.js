import React from 'react';
import axios from 'axios';
import { updatePasswordNotification } from './Notifications';

export default class EditPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: "",
            newPassword: "",
            newPasswordAgain: "",
            passwordErrorMessage: ""
        };
       
    }
    savePassword = event => {
        this.setState({password: event.target.value, passwordErrorMessage: ""});
    }
    saveNewPassword = event => {
        this.setState({newPassword: event.target.value, passwordErrorMessage: ""});
    }
    saveNewPasswordAgain = event => {
        this.setState({newPasswordAgain: event.target.value, passwordErrorMessage: ""});
    }

    handleSubmit = async event => {
        event.preventDefault();
        console.log(this.props);
        var response = await axios.post('http://localhost:4000/account/login', {
            _id: this.props.location.state.email,
            password: this.state.password
        });
        console.log(response);
        if(response.status !== 200){
            this.setState({passwordErrorMessage: "Invalid password"});
        }
        else if(this.state.newPassword !== this.state.newPasswordAgain) {
            this.setState({passwordErrorMessage: "New passwords must match"});
        } 
        else if(this.state.newPassword.length < 8) {
            this.setState({passwordErrorMessage: "New password must have at least 8 characters"});
        }
        else if(!/^(?=.*[a-z])/.test(this.state.newPassword)) {
            this.setState({passwordErrorMessage: "New password must contain 1 lowercase character"});
        }
        else if(!/^(?=.*[A-Z])/.test(this.state.newPassword)) {
            this.setState({passwordErrorMessage: "New password must contain 1 uppercase character"});
        }
        else if(!/^(?=.*[0-9])/.test(this.state.newPassword)) {
            this.setState({passwordErrorMessage: "New password must contain 1 numerical character"});
        } else {
            await axios.post('http://localhost:4000/account/password/edit', {
                _id: this.props.location.state.email,
                password: this.state.password,
                new_password: this.state.newPassword
            }).then(success => {
                updatePasswordNotification(this.props.location.state.email); 
                setTimeout(() => {  this.props.history.push({
                    pathname: '/',
                    state: {
                        email: this.props.location.state.email
                    }
                }); }, 750);
                
                
            }).catch(error =>{
                this.setState({passwordErrorMessage: "Unable to update. Please try again"});
            });
        }
    }
    render() {
        return(
            <div id="edit-password-page" onClick={this.props.onClick}>
                <div className="container">
                    <div className="row">
                        <div id="password-form-holder" className="col-12">
                            <h1>Change Password</h1>
                            <form id="password-form" onSubmit={this.handleSubmit}>
                                <div class="form-group">
                                    <label>Current Password:</label>
                                    <input className="form-control" type="password" placeholder="********" value={this.state.password} onChange={this.savePassword}/>
                                </div>
                                <div class="form-group">
                                    <label>New Password:</label>
                                    <input className="form-control" type="password" placeholder="********" value={this.state.newPassword} onChange={this.saveNewPassword}/>
                                </div>
                                <div class="form-group">
                                    <label>Re-enter New Password:</label>
                                    <input className="form-control" type="password" placeholder="********" value={this.state.newPasswordAgain} onChange={this.saveNewPasswordAgain}/>
                                    <div className="text-danger">{this.state.passwordErrorMessage}</div>
                                </div>
                                <button className="btn btn-primary" type="submit">Update</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}