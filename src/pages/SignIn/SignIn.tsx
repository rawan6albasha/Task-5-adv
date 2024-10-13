import React, { useState } from 'react';
import style from './SignIn.module.css';
import HeaderSign from '../../Components/HeaderSign/HeaderSign';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignIn: React.FC = () => {
  const navigate=useNavigate()
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  function send(event: React.FormEvent): void {
    event.preventDefault();
    axios.post("https://test1.focal-x.com/api/login", {
      email: email,
      password: password
    })
    .then(res => {console.log(res.data)

      localStorage.setItem('first_name', res.data.user.first_name);
      localStorage.setItem('lastName', res.data.user.last_name);
      localStorage.setItem('profileImage', res.data.user.profile_image_url); 
      localStorage.setItem('token', `Bearer ${res.data.token}`);
      console.log(localStorage.getItem('profileImage'));
      navigate('/')
    })
    .catch(error => {
      console.error("Error response:", error.response);
      if (error.response) {
          console.log("Status code:", error.response.status);
          console.log("Error details:", error.response.data);
      } else if (error.request) {
          console.error("No response received:", error.request);
      } else {
          console.error("Error setting up request:", error.message);
      }
  });
  }

  return (
    <div className={style.sign_body}>
      <div className={style.SignIn}>
        <HeaderSign disc="Enter your credentials to access your account" title="Sign In" />
        <form onSubmit={send}>
          <div className={style.input}>
            <label>Email</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              onChange={(event) => setEmail(event.target.value)} 
              value={email}
            />
          </div>
          <div className={style.input}>
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              onChange={(event) => setPassword(event.target.value)} 
              value={password}
            />
          </div>
          <input className={style.submit} type="submit" value="SIGN IN" />
        </form>
        <p>Don’t have an account? <Link to="/SignUp">Create one</Link></p> 
      </div>
    </div>
  );
};

export default SignIn;
