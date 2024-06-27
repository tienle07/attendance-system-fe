import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import AddNewUserModal from "./AddNewUserModal";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/apiRequest";
import { GetCurrentUserLoginProfile } from "../../redux/auth/authApi";
import { useEffect } from "react";

function Header() {
    const [isAddUserModa, setIsAddUserModa] = useState(false);
    const [role, setRole] = useState('');
    const user = useSelector((state) => state.auth?.login?.currentUser);
    const userProfile = useSelector((state) => state.auth?.currentUserProfile?.userLoginProfile?.employeeResponse);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        getAsyns();
      }, []);
    const handleLogout = (e) => {
        logout(dispatch,navigate);
    };
    const getAsyns = () => {
        localStorage.setItem('picture', userProfile?.profileImage ? userProfile?.profileImage : '')
        localStorage.setItem('name', userProfile?.name)
        setRole(localStorage.getItem('role'));
    }
    return (
        <div className="header">
            <nav className="navbar py-4">
                <div className="container-xxl">
                    <div className="h-right d-flex align-items-center order-1">                      
                        <Dropdown className="dropdown user-profile ms-2 ms-sm-3 d-flex align-items-center">
                            <div className="u-info me-2">
                                {role !== '1' && <p className="mb-0 text-end line-height-sm "><span className="font-weight-bold">{userProfile?.name}</span></p>}
                                <small>{role === '2' ? 'HR Manager' : role === '1' ? 'System Admin' : 'Store Manager'}</small>
                            </div>
                            <Dropdown.Toggle as="a" className="nav-link dropdown-toggle pulse p-0">
                                {role !== '1' && <img className="avatar lg rounded-circle img-thumbnail" src={userProfile?.profileImage} alt="profile" />}
                                {role === '1' && <i className="icofont-rounded-down" />}
                            </Dropdown.Toggle>
                            {role !== '1' && <Dropdown.Menu className="rounded-lg shadow border-0 dropdown-animation dropdown-menu-end p-0 m-0">
                                <div className="card border-0 w280">
                                    <div className="card-body pb-0">
                                        <div className="d-flex py-1">
                                            <img className="avatar rounded-circle" src={userProfile?.profileImage} alt="profile" />
                                            <div className="flex-fill ms-3">
                                                <p className="mb-0"><span className="font-weight-bold">{userProfile?.name}</span></p>
                                                <small className="">{userProfile?.email}</small>
                                            </div>
                                        </div>

                                        <div><hr className="dropdown-divider border-dark" /></div>
                                    </div>
                                    <div className="list-group m-2 ">
                                        <Link to={"/profile" } className="list-group-item list-group-item-action border-0 "><i className="icofont-tasks fs-5 me-3"></i>My Profile</Link>
                                        {/* <Link to="members" className="list-group-item list-group-item-action border-0 "><i className="icofont-ui-user-group fs-6 me-3"></i>members</Link> */}
                                        <button className="list-group-item list-group-item-action border-0 " onClick={handleLogout}><i className="icofont-logout fs-6 me-3"></i>Signout</button>
                                        <div><hr className="dropdown-divider border-dark" /></div>
                                        {/* <Link to="sign-up" className="list-group-item list-group-item-action border-0 "><i className="icofont-contact-add fs-5 me-3"></i>Add personal account</Link> */}
                                    </div>
                                </div>
                            </Dropdown.Menu>}
                            {role === '1' && <Dropdown.Menu className="rounded-lg shadow border-0 dropdown-animation dropdown-menu-end p-0 m-0">
                                    <div className="list-group m-2 ">
                                        <button className="list-group-item list-group-item-action border-0 " onClick={handleLogout}><i className="icofont-logout fs-6 me-3"></i>Signout</button>
                                </div>
                            </Dropdown.Menu>}
                        </Dropdown>
                    </div>


                    <button className="navbar-toggler p-0 border-0 menu-toggle order-3"
                        onClick={() => {
                            var side = document.getElementById("mainSideMenu");
                            if (side) {
                                if (side.classList.contains("open")) {
                                    side.classList.remove("open")
                                } else {
                                    side.classList.add("open")
                                }
                            }
                        }}
                    >
                        <span className="fa fa-bars"></span>
                    </button>


                    <div className="order-0 col-lg-4 col-md-4 col-sm-12 col-12 mb-3 mb-md-0 ">

                    </div>

                </div>
            </nav>
            <AddNewUserModal show={isAddUserModa} onClose={() => { setIsAddUserModa(false) }} />
        </div>
    )
}


export default Header;  