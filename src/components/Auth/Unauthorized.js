import React from "react";
import { Link } from "react-router-dom";
import GoogleImg from "../../assets/images/verify.svg";

function Unauthorized (){
    
        return(
            <div className="col-lg-6 d-flex justify-content-center align-items-center border-0 rounded-lg auth-h100">
                <div className="w-100 p-3 p-md-5 card border-0 bg-dark text-light" style={{maxWidth: "32rem"}}>
                    
                    <form className="row g-1 p-3 p-md-4">
                        <div className="col-12 text-center mb-1 mb-lg-5">
                            <img src={GoogleImg} className="w240 mb-4" alt="" />
                            <h5>OOP! PAGE NOT ALLOWED</h5>
                            <span className="text-light">Sorry, You Do Not Allow To Access This Page</span>
                        </div>
                        <div className="col-12 text-center">
                            <Link to="/sign-in" className="btn btn-lg btn-block btn-light lift text-uppercase">Back to Sign In</Link>
                        </div>
                    </form>
                    
                </div>
            </div>
        )
    }

export default Unauthorized;