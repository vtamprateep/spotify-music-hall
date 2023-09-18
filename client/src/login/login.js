import Dialog from '@mui/material/Dialog';
import './login.css';
import { useEffect, useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

const config = require('../config.json');

function Login(props) {
    const { onClose, open, logIn } = props;
    const [signUp, setSignUp] = useState(false);
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [validationErrors, setValidationErrors] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    useEffect(() => {
        const errors = [];
        const regex = new RegExp(/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/);
        if (!regex.test(email)) {
            errors.push('Please provide a valid email.');
        }
        if (signUp) {
            if (password.length < 5 || password.length > 20) {
                errors.push('Please choose a password between 5 and 20 characters long.');
            }
            if (password !== password2) {
                errors.push('Please confirm passwords match.');
            }
            if (!lastName.length || !name.length || !email.length || !password.length || !password2.length) {
                errors.push('Please fill out all fields.');
            }
        } else {
            if (!password.length || !email.length) {
                errors.push('Please fill out all fields.');
            }
        }
        setValidationErrors(errors);
    }, [email, password, password2, name, lastName, signUp  ])

    const onSubmit = (e) => {
        e.preventDefault();
        setHasSubmitted(true);
        if (validationErrors.length) return;
        const information = {
            email: email,
            name: name,
            last_name: lastName,
            password: password
        };
        fetch(`http://${config.server_host}:${config.server_port}/signup/`, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(information)
        })
        .then((response) => response.json())
        .then((json) => {
            //console.log("signup", json);
            if (json.result === 'ok') {
                setEmail('');
                setName('');
                setLastName('');
                setPassword('');
                setPassword2('');
                setValidationErrors([]);
                setHasSubmitted(false);
                setSignUp(false);
                return alert(`Successfully signed up!`);
            } else if (json.result === 'email') {
                return alert(`This email is already in use.`);
            } else {
                return alert(`There was an error. Please try again later.`);
            }
        })
        .catch((e) => {return alert(`There was an error. Please try again later.`)});
    }

    const onSubmitLogin = (e) => {
        e.preventDefault();
        setHasSubmitted(true);
        if (validationErrors.length) return;
        const information = {
            email: email,
            password: password
        };
        fetch(`http://${config.server_host}:${config.server_port}/login/`, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(information)
        })
        .then((response) => response.json())
        .then((json) => {
            //console.log("login", json);
            if (json.result === 'ok') {
                setEmail('');
                setName('');
                setPassword('');
                setPassword2('');
                setValidationErrors([]);
                setHasSubmitted(false);
                setSignUp(false);
                let obj = {
                    name: json.name,
                    email: json.email,
                    user_id: json.user_id
                };
                logIn(obj);
                onClose();
            } else {
                return alert(`Invalid username/password combination.`);
            }
        })
        .catch((e) => {return alert(`There was an error. Please try again later.`)});
    }

    const googResponse = (response) => {
        //console.log("google login!", response);
        var decoded = jwt_decode(response.credential);
        //console.log(decoded);
        let obj = {
            name: decoded.given_name,
            email: decoded.email,
            user_id: ''
        };
        logIn(obj);
        onClose();
    };

    const googError = (error) => {
        //console.log("google login failed!", error);
        return alert(`There was an error. Please try again later.`);
    };

    const fbResponse = (response) => {
        //console.log("fb login!", response);
        let obj = {
            name: response.name,
            email: response.email,
            user_id: response.id
        };
        logIn(obj);
        onClose();
    };

    return(
        <div>
            <Dialog onClose={onClose} open={open}>
            {!signUp &&
                <div className="scrolly">
                    {hasSubmitted && validationErrors.length > 0 && (
                        <div className='list-div'>
                            The following errors were found:
                            <ul>
                                {validationErrors.map(error => (
                                <li key={error}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <form onSubmit={onSubmitLogin}>
                    <fieldset className="fields">
                    <h2>Login</h2>
                        <input name="email" onChange={e => setEmail(e.target.value)} value={email} placeholder="Email"/>

                        <input type="password" name="password" onChange={e => setPassword(e.target.value)} value={password} placeholder="Password"/>
                    </fieldset>
                    <div className="buttonsDiv">
                        <div className="externalLogins">
                        <GoogleLogin type="icon" onSuccess={googResponse} onError={googError} />
                        <FacebookLogin
                            appId={config.fbId}
                            fields="name,email"
                            size="small"
                            render={renderProps => (
                                <button className="fbButton" onClick={renderProps.onClick}></button>
                              )}
                            callback={fbResponse} />
                        </div>
                        <button type="submit" className="loginButtons">Login</button>
                        <p className="noMargin">Don't have an account? <button className="linkStyle" onClick={() => setSignUp(true)}>Sign up!</button></p>
                    </div>
                    </form>
                </div>
            }
            {signUp &&
                <div className="scrolly">
                    {hasSubmitted && validationErrors.length > 0 && (
                        <div className='list-div'>
                            The following errors were found:
                            <ul>
                                {validationErrors.map(error => (
                                <li key={error}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <form onSubmit={onSubmit}>
                    <fieldset className="fields">
                    <h2>Sign Up</h2>
                        <input name="name" onChange={e => setName(e.target.value)} placeholder="First Name"/>
                        <input name="lastName" onChange={e => setLastName(e.target.value)} placeholder="Last Name"/>
                        <input name="email" onChange={e => setEmail(e.target.value)} placeholder="Email"/>
                        <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"/>
                        <input type="password" name="password2" value={password2} onChange={e => setPassword2(e.target.value)} placeholder="Confirm Password"/>
                    </fieldset>
                    <div className="buttonsDiv">
                        <button type="submit" className="loginButtons">Submit</button>
                        <p>Already have an account? <button className="linkStyle" onClick={() => setSignUp(false)}>Log in!</button></p>
                    </div>
                    </form>
                </div>
            }
            </Dialog>
        </div>
    )

}

export default Login;
