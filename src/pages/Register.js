//pagina di login
import React from 'react'
import { useRef } from 'react';
import {auth, providerGoogle, providerFacebook} from "../firebase-config";
import {signInWithPopup} from 'firebase/auth';
import {useNavigate} from "react-router-dom";
import { login } from '../firebase-config';
import { useDispatch } from 'react-redux';
import { loginU } from '../redux/reducers/authSlice';
import { supa } from '../components/utenti';
import { logoutUser } from '../redux/reducers/userAuthSlice';

function Register({}) {
  const dispatch = useDispatch();
  let navigate = useNavigate();  

  const emailRef = useRef();      //attributes
  const passwordRef = useRef();
 //_______________________________________________________________________________________

//_______________________________________________________________________________________
  const signInwithGoogle = () => {  //function for login with google
    signInWithPopup(auth, providerGoogle).then((result) => {
      const email = result.user.email;
      const profilePic = result.user.photoURL;
      const uid = result.user.uid;

      if(supa.includes(uid)) {   //controllo per andare avanti, oppure da problemi, questi sono i permessi supervisore
        localStorage.setItem("email", email);
        localStorage.setItem("profilePic", profilePic);
        localStorage.setItem("isAuth", true);
        localStorage.setItem("uid", uid);
        dispatch(loginU({ email }));
        dispatch(logoutUser()); //in caso sia loggato come utente, allora mi disconetto
        navigate("/");  //returns it to the home page
      }

    })
  }
//___________________________________________________________________________________________
  async function handelLogin () {    //login function
    try {
      await login(emailRef.current.value, passwordRef.current.value).then((result) => {
        const email = result.user.email;
  
        localStorage.setItem("email", email);
        localStorage.setItem("isAuth", true);
        dispatch(loginU({ email }));
        navigate("/");  //returns it to the home page
      })
    } catch{
    }

  }
//_____________________________________________________________________________________________
const singup = () => {
  navigate("/signup");   //I report it to the sign up page
}

const forgotPassword = () => {
  navigate("/recoverpassword");  //I report it to the recover password page
}
//___________________________________________________________________________________________
  return (
    <>
    <div className='Page'>  
    <div className="ciao container">
  <section className="gradient-custom">
  <div className="container py-1">
    <div className="row d-flex justify-content-center align-items-center h-70">
      <div className="col-12 col-md-8 col-lg-6 col-xl-5">
        <div className="card bg-dark text-white" style={{borderRadius: "2rem"}}>
          <div className="card-body p-5 text-center">

            <div className="mb-md-5 mt-md-4 pb-5">

              <h2 className="fw-bold mb-2 text-uppercase">EpicEnergyService</h2>
              <h2 className="fw-bold mb-2 text-uppercase">Register</h2>
              <p className="text-white-50 mb-5">Please enter your email and password</p>

              <div className="form-outline form-white mb-4">
                <label class="form-label" htmlFor="typeEmailX">Email</label>
                <input ref={emailRef} type="email" id="typeEmailX" className="form-control form-control-lg" placeholder="Inserisci email"/>
              </div>

              <div className="form-outline form-white mb-4">
                <label class="form-label" htmlFor="typePasswordX"> Password</label>
                <input ref={passwordRef} type="password" id="typePasswordX" className="form-control form-control-lg" placeholder="Inserisci password"/>
              </div>

              <p className="small mb-5 pb-lg-2" ><a className="text-white-50">Forgot password?</a></p>

              <button className="btn btn-outline-light btn-lg px-5" type="submit" onClick={""}>Register</button>

  
            </div>
            <div>
            <p className="mb-0">Accedi come utente <a style={{ cursor: 'pointer' }} onClick={() => {navigate("/loginuser")}} className="text-white-50 fw-bold">Accedi</a></p>
            {/** <p className="mb-0">Do not have an account? <a onClick={singup} className="text-white-50 fw-bold">SignUp</a>
              </p> */}
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</section>
    </div>
    </div>
    </>
  )

}

export default Register