import React from "react";
import loginImg from "../../assets/images/login-img.svg";

function LeftSide (){
    
        return(
            <div className="col-lg-6 d-none d-lg-flex justify-content-center align-items-center rounded-lg auth-h100">
                <div style={{maxWidth: "25rem"}}>
                    <div className="mb-5">
                        <h2 className="color-900 text-center fw-bold">STARAS</h2>
                        <h2 className="color-900 text-center">Let's Management Better</h2>
                    </div>
                    <div className="">
                        <img src={loginImg} alt="login-img" />
                    </div>
                </div>
            </div>
        )
    }


export default LeftSide;