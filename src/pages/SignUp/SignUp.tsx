import React, { useState } from 'react';
import style from './SignUp.module.css';
import { Link, useNavigate } from 'react-router-dom';
import HeaderSign from '../../Components/HeaderSign/HeaderSign';
import ImageUpload from '../../Components/ImageUpload/ImageUpload';
import axios from 'axios';

const SignUp: React.FC = () => {
    const navigate=useNavigate()
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [first_name, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [rePassword, setRePassword] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  function send(event: React.FormEvent): void {
    event.preventDefault();

    // التحقق من صحة البيانات المدخلة
    if (!first_name || !lastName || !email || !password || !rePassword) {
      console.error("All fields are required.");
      return;
    }

    if (password !== rePassword) {
      console.error("Passwords do not match.");
      return;
    }

    if (!selectedImage) {
      console.error("No image selected");
      return;
    }
    console.log("First Name:", first_name );
    console.log("Last Name:", lastName);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Re-Password:", rePassword);
    console.log("Selected Image:", selectedImage);

    const formData = new FormData();
    formData.append('profile_image', selectedImage); 
    formData.append('email', email);
    formData.append('password', password);
    formData.append('password_confirmation', rePassword); // تأكيد كلمة المرور
    formData.append('first_name', first_name); // تعديل الحقل ليطابق ما يتوقعه الـ API
    formData.append('last_name', lastName); // تعديل الحقل ليطابق ما يتوقعه الـ API
    formData.append('user_name', email); // استخدام البريد الإلكتروني كاسم المستخدم أو استبداله بما يناسب


    axios.post("https://test1.focal-x.com/api/register", formData)
    .then(res => {
        console.log(res.data);  // تحقق من بيانات الاستجابة

        if (res.data.status === 'success') {
          localStorage.clear();

            const user = res.data.data.user;
            const token = res.data.data.token;

            if (user && token) {
                // تخزين البيانات في localStorage
                localStorage.setItem('first_name', user.first_name || '');
                localStorage.setItem('lastName', user.last_name || '');
                localStorage.setItem('profileImage', user.profile_image_url || '');
                localStorage.setItem('token', `Bearer ${token}`);
console.log("f1:",user.first_name)
                // تحقق من أن navigate يتم استدعاؤه بعد تخزين البيانات
                console.log("Navigating to homepage...");
                navigate('/');
                console.log("f2:",user.first_name)
            } else {
                console.error("User or token is missing from the response");
            }
        } else {
            console.error("Registration failed:", res.data.message);
        }
    })
    .catch(error => {
        console.error("Error response:", error.response);
    });
};
 

  return (
    <div className={style.sign_body}>
      <div className={style.SignIn}>
        <HeaderSign disc="Fill in the following fields to create an account." title="Sign up" />
        <form onSubmit={send}>
          <div className={style.input}>
            <label>Name</label>
            <div className={style.flex_input}>
              <input 
                type="text" 
                placeholder="First Name" 
                onChange={(event) => setFirstName(event.target.value)}  
                value={first_name} 
              />
              <input 
                type="text" 
                placeholder="Last Name" 
                onChange={(event) => setLastName(event.target.value)}  
                value={lastName}  
              />
            </div>
          </div>
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
            <div className={style.flex_input}>
              <input 
                type="password" 
                placeholder="Enter password" 
                onChange={(event) => setPassword(event.target.value)}  
                value={password}  
              />
              <input 
                type="password" 
                placeholder="Re-enter your password" 
                onChange={(event) => setRePassword(event.target.value)}  
                value={rePassword}  
              />
            </div>
          </div>
          <div className={style.input}>
          <label>Image</label>
            <ImageUpload setImage={setSelectedImage} />
          </div>
          <input className={style.submit} type="submit" value="SIGN UP" />
        </form>
        <p>Do you have an account?<Link to="/SignIn"> Sign in</Link></p> 
      </div>
    </div>
  );
}

export default SignUp;
