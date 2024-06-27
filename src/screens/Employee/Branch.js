import React, { useState } from "react";
import { Alert, Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import PageHeader from "../../components/common/PageHeader";
import { DepartmentsData } from "../../components/Data/AppData";
import { getAllBranch } from "../../redux/apiRequest";
import { loginSuccess } from "../../redux/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { createAxios } from "../../createInstance";
import { getDistrict, getProvince, getWard } from "../../redux/address/addressApi";

var columnsT = "";
function Branch() {

    const [isModal, setIsModal] = useState(false);
    const [isEditModalData, setIsEditModalData] = useState("");
    const [modalheader, setModalHeader] = useState(null);
    const [branchname, setBranchName] = useState("");
    const [province, setProvince] = useState("");
    const [fax, setFax] = useState("");
    const [district, setDistrict] = useState("");
    const [ward, setWard] = useState("");
    const [addressdetails, setAddressDetails] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [opentime, setOpentime] = useState("");
    const [closetime, setCloseTime] = useState("");
    const [logo, setLogo] = useState("");
    const [bssid, setBssid] = useState("");
    const user = useSelector((state) => state.auth?.login?.currentUser);
    const branchList = useSelector((state) => state.branchs?.branchs?.allBranchs);
    const provinelist = useSelector((state) => state.addresss?.addresss?.alladdresss);
    const districtlist = useSelector((state) => state.addresss?.addresss?.district);
    const wardlist = useSelector((state) => state.addresss?.addresss?.ward);
    const active = true;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let axiosJWT = createAxios(user, dispatch, loginSuccess);
    useEffect(() => {
        if (!user) {
            navigate(process.env.PUBLIC_URL+"/sign-in")
        }
        if (user?.data?.token?.accessToken) {
          getAllBranch(user?.data?.token?.accessToken, dispatch, axiosJWT);
          getProvince(user?.data?.token?.accessToken, dispatch);
        }
      }, []);

    const changeProvince =(e) =>{  
        const provincename = provinelist?.find((x) => 
            x.provinceCode == e.target.value
        );
        setProvince(provincename?.provinceName);
        getDistrict(user?.data?.token?.accessToken,dispatch,e.target.value);
    }
    const changeDistrict =(e) =>{   
        const district = districtlist?.find((x) => 
            x.districtCode == e.target.value
        );
        setDistrict(district?.districtName);
        getWard(user?.data?.token?.accessToken,dispatch,e.target.value);
    }
    const changeWard =(e) =>{   
        const ward = wardlist?.find((x) => 
            x.wardCode == e.target.value
        );
        setWard(ward?.wardName);
    }
    const handleCreate = (e) => {
        e.preventDefault();
        const newBranch = {
            storeName: branchname,
            address: addressdetails + ", " + ward + ", " + district + ", " + province,
            fax: fax,
            latitude: latitude,
            longitude: longitude,
            openTime: opentime,
            closeTime: closetime,
            logoUrl: logo,
            bssid: bssid,
            active: active
        };
    };
    columnsT = [
        {
            name: "Branch ID",
            selector: (row) => row.id,
            sortable: true,
        },
        {
            name: "Branch Name",
            selector: (row) => row.storeName,
            sortable: true,
        },
        {
            name: "MANAGER OF BRANCH",
            selector: (row) => row.DepartmentHead,
            sortable: true,
            cell: row => <div> <img className="avatar rounded-circle" src={row.logoUrl} alt=""></img>
                <span className="fw-bold ms-1">{row.DepartmentHead}</span>
            </div>
        },
        {
            name: "ADDRESS",
            selector: (row) => row.address            ,
            sortable: true
        },
        {
            name: "EMPLOYEE OF BRAND",
            selector: (row) => row.employeeNo,
            sortable: true
        },
        {
            name: "ACTION",
            selector: (row) => { },
            sortable: true,
            cell: (row) => <div className="btn-group" role="group" aria-label="Basic outlined example">
                <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#depedit" onClick={() => { setIsModal(true); setIsEditModalData(row); setModalHeader('Edit Departments') }}><i className="icofont-edit text-success"></i></button>
                <button className="btn btn-outline-secondary deleterow"><i className="icofont-ui-delete text-danger"></i></button>
            </div>
        }

    ]


    return (
        
        <div className="container-xxl">
            <PageHeader headerTitle="Branch" renderRight={() => {
                return <div className="col-auto d-flex w-sm-100">
                    <button className="btn btn-dark btn-set-task w-sm-100" onClick={() => { setIsModal(true); setModalHeader('Add Departments') }}><i className="icofont-plus-circle me-2 fs-6"></i>Add BRANCH</button>
                </div>
            }} />
            <Alert variant='warning'>This is a warning alert—check it out!</Alert>

            <div className="row clearfix g-3">
                <div className="col-sm-12">
                    <DataTable
                        title={DepartmentsData.title}
                        columns={columnsT}
                        data={branchList}
                        defaultSortField="title"
                        pagination
                        selectableRows={false}
                        className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                        highlightOnHover={true}
                    />
                </div>
            </div>
            <Modal centered show={isModal} onHide={() => { setIsModal(false); setIsEditModalData("") }}>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">{modalheader}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
            <form onSubmit={handleCreate}>

                    <div className="deadline-form">
                            <div className="row g-3 mb-3">
                                <div className="col-sm-6">
                                    <label htmlFor="depone" className="form-label">Branch Name</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="depone" 
                                        onChange={(e)=>setBranchName(e.target.value)} 
                                        />
                                </div>
                                <div className="col-sm-6">
                                    <label htmlFor="deptwo" className="form-label">Fax</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="deptwo" 
                                        onClick={() => { }} 
                                        
                                        onChange={(e)=>setFax(e.target.value)} 
                                        />
                                </div>
                            </div>
                            <div className="row g-3 mb-3">
                                <div className="col-sm-6">
                                    <label htmlFor="depone" className="form-label">Province</label>
                                    <select className="form-select"
                                            onChange={changeProvince}
                                            >
                                            {provinelist ? provinelist.map(pro => (
                                                <option key={pro.provinceCode} value={pro.provinceCode}>{pro.provinceName}</option>
                                            )) : null}
                                    </select>
                                </div>
                                <div className="col-sm-6">
                                    <label htmlFor="deptwo" className="form-label">District</label>
                                    <select className="form-select"
                                            onChange={changeDistrict}
                                            >
                                            {districtlist ? districtlist.map(pro => (
                                                <option key={pro.districtCode} value={pro.districtCode}>{pro.districtName}</option>
                                            )) : null}
                                    </select>
                                </div>
                            </div>
                            <div className="row g-3 mb-3">
                                <div className="col-sm-6">
                                    <label htmlFor="depone" className="form-label">Ward</label>
                                    <select className="form-select"
                                            onChange={changeWard}
                                            >
                                            {wardlist ? wardlist.map(pro => (
                                                <option key={pro.wardCode} value={pro.wardCode}>{pro.wardName}</option>
                                            )) : null}
                                    </select>
                                </div>
                                <div className="col-sm-6">
                                    <label htmlFor="deptwo" className="form-label">Address Details</label>
                                    <input type="text" className="form-control" id="deptwo"  onClick={() => { }}  onChange={(e)=>setAddressDetails(e.target.value)}/>
                                </div>
                            </div>
                            <div className="row g-3 mb-3">
                                <div className="col-sm-6">
                                    <label htmlFor="depone" className="form-label">Latitude</label>
                                    <input type="text" className="form-control" id="depone" onClick={() => { }}  onChange={(e)=>setLatitude(e.target.value)} />
                                </div>
                                <div className="col-sm-6">
                                    <label htmlFor="deptwo" className="form-label">Longitude</label>
                                    <input type="text" className="form-control" id="deptwo" onClick={() => { }}  onChange={(e)=>setLongitude(e.target.value)} />
                                </div>
                            </div>
                            <div className="row g-3 mb-3">
                                <div className="col-sm-6">
                                    <label htmlFor="depone" className="form-label">open Time</label>
                                    <input type="datetime-local" className="form-control" id="timepickerded29" onChange={(e)=>setOpentime(e.target.value)} />
                                </div>
                                <div className="col-sm-6">
                                    <label htmlFor="deptwo" className="form-label">Close Time</label>
                                    <input type="datetime-local" className="form-control" id="timepickerded29"  onChange={(e)=>setCloseTime(e.target.value)} />
                                </div>
                            </div>
                            <div className="row g-3 mb-3">
                                <div className="col-sm-6">
                                    <label htmlFor="depone" className="form-label">Logo</label>
                                    <input type="text" className="form-control" id="depone" onClick={() => { }}  onChange={(e)=>setLogo(e.target.value)} />
                                </div>
                                <div className="col-sm-6">
                                    <label htmlFor="deptwo" className="form-label">BSS ID</label>
                                    <input type="text" className="form-control" id="deptwo" onClick={() => { }}  onChange={(e)=>setBssid(e.target.value)}/>
                                </div>
                            </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Save</button>
            </form>

                </Modal.Body>
                <Modal.Footer>
                    <button type="submit" className="btn btn-secondary" >Done</button>
                    {/* <button type="button" className="btn btn-primary">Save</button> */}
                </Modal.Footer>
            </Modal>
        </div>
    )
}


export default Branch; 