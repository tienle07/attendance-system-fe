import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from 'react-select'
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/auth/authSlice";

function AddressModal(props) {

  const { onClose, show, editModeldata, setaddressReturn, loading
  } = props;
  const provinelist = useSelector(
    (state) => state.addresss?.addresss?.alladdresss
  );
  let provinelists = provinelist?.map((d, i) => {
    return {
      value: d.provinceCode,
      label: d.provinceName,
      type: d.provinceType
    }
  })
  const [wardlist, setwardlist] = useState([]);
  const [districtlist, setdistrictlist] = useState([]);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [provinceType, setProvinceType] = useState("");
  const [districtType, setDistrictType] = useState("");
  const [wardType, setWardType] = useState("");
  const [addressdetails, setAddressDetails] = useState("");
  const [provinceEdit, setProvinceEdit] = useState(0);
  const [districtEdit, setDistrictEdit] = useState(0);
  const [wardEdit, setWardEdit] = useState("");
  const [addressdetailsEdit, setAddressDetailsEdit] = useState("");
  const user = useSelector((state) => state.auth?.login?.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let axiosJWT = createAxios(user,dispatch,loginSuccess)
  useEffect(() => {
    if (!user) {
      navigate(process.env.PUBLIC_URL + "/sign-in");
  }
    getAddressForEdit(editModeldata)
  }, [editModeldata]);
  function FindDistrictByName(name, list) {
    const distristobject = list?.find((x) => x.label == name);
    return distristobject;
  }
  function FindWardByName(name, list) {
    const distristobject = list?.find((x) => x.label == name);
    return distristobject;
  }
  const changeProvince = async (e) => {
    setProvince(e.label)
    setProvinceEdit(e.value)
    setProvinceType(e.type)
    setwardlist([])
    const url1 = "/api/address/districts/" + e.value;
    const res = await axiosJWT.get(url1, {
      headers: {
        Authorization: `Bearer ${user?.data?.token?.accessToken}`,
      },
    });
    var list = res.data.data;
    setdistrictlist(list?.map((d, i) => {
      return {
        value: d.districtCode,
        label: d.districtName,
        type: d.districtType
      }
    }));

  };

  const changeDistrict = async (e) => {
    // const district = districtlist?.find(
    //   (x) => x.districtCode == e.target.value
    // );
    setDistrict(e.label);
    setDistrictEdit(e.value);
    setDistrictType(e.type);
    const url2 = "/api/address/wards/" + e.value;
    const resward = await axiosJWT.get(url2, {
      headers: {
        Authorization: `Bearer ${user?.data?.token?.accessToken}`,
      },
    });
    var listward = resward.data.data;
    setwardlist(listward?.map((d, i) => {
      return {
        value: d.wardCode,
        label: d.wardName,
        type: d.wardType
      }
    }));
  };
  const changeWard = (e) => {
    // const ward = wardlist?.find((x) => x.wardCode == e.target.value);
    setWard(e.label);
    setWardEdit(e.value);
    setWardType(e.type);
  };
  async function getDistristAsync(id, name, name2) {
    // getDistrict(user?.data?.token?.accessToken, dispatch, id);
    const url1 = "/api/address/districts/" + id;
    const res = await axiosJWT.get(url1, {
      headers: {
        Authorization: `Bearer ${user?.data?.token?.accessToken}`,
      },
    });
    var list = res.data.data.map((d, i) => {
      return {
        value: d.districtCode,
        label: d.districtName,
        type: d.districtType
      }
    });
    setdistrictlist(list)
    let distristobject = await FindDistrictByName(name, list)
    if (distristobject) {
      const iddistrict = distristobject?.value;
      setDistrictEdit(iddistrict);
      setDistrict(distristobject?.label);
      setDistrictType(distristobject?.type)
    }

    const url2 = "/api/address/wards/" + distristobject?.value;
    const resward = await axiosJWT.get(url2, {
      headers: {
        Authorization: `Bearer ${user?.data?.token?.accessToken}`,
      },
    });
    var listward = resward?.data.data.map((d, i) => {
      return {
        value: d.wardCode,
        label: d.wardName,
        type: d.wardType
      }
    });
    setwardlist(listward)
    const wardObject = await FindWardByName(name2, listward)
    if (wardObject) {
      const idward = wardObject?.value;
      setWardEdit(idward);
      setWard(wardObject?.label);
      setWardType(wardObject?.type)
    }
  }
  async function getAddressForEdit(address) {
    if(!address){
      setwardlist([])
      setdistrictlist([])
    //   return
    }
    const addressArray = address ? address.split(", ") : "";
    var provineName = "";
    var distristName1 = "";
    var wardName1 = ""
    setAddressDetailsEdit(addressArray ? addressArray[0] : "");
    setAddressDetails(addressArray ? addressArray[0] : "");

    var provineSplit = addressArray ? addressArray[3] : "";
    var provineTypeName = provineSplit ? provineSplit.split(" ") : [];
    if (provineTypeName[0] === "Thành" || provineTypeName[0] === "Thị") {
      provineName = provineTypeName?.slice(2).join(" ");
    } else {
      provineName = provineTypeName?.slice(1).join(" ");
    }
    // var provineType = provineTypeName[1];
    var distristSplit = addressArray ? addressArray[2] : "";
    var distristTypeName = distristSplit ? distristSplit.split(" ") : [];
    if (distristTypeName[0] === "Thành" || distristTypeName[0] === "Thị") {
      distristName1 = distristTypeName?.slice(2).join(" ");
    } else {
      distristName1 = distristTypeName?.slice(1).join(" ");
    }
    // var distristType = distristTypeName[1];
    var wardSplit = addressArray ? addressArray[1] : "";
    var wardTypeName = wardSplit ? wardSplit.split(" ") : [];
    if (wardTypeName[0] === "Thành" || wardTypeName[0] === "Thị") {
      wardName1 = wardTypeName?.slice(2).join(" ");
    } else {
      wardName1 = wardTypeName?.slice(1).join(" ");
    }
    // var wardType = wardTypeName[1];

    const provinec = provinelists?.find((x) => x.label == provineName);
    if (provinec) {
      var idprovince = provinec?.value ? provinec?.value : 0;
      setProvinceEdit(idprovince);
      setProvince(provinec?.label);
      setProvinceType(provinec?.type)
    }
    if (idprovince) {
      await getDistristAsync(
        idprovince,
        distristName1,
        wardName1
      );
    }
  }
  const handleClickDone = () => {
    setaddressReturn(addressdetails + ", " + wardType + " " + ward + ", " + districtType + " " + district + ", " + provinceType + " " + province);
    onClose()
  }
  return (
    <Modal centered show={show} fullscreen="sm-down" size="small" onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Choose Address</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form id="employeeForm">
          <div className="modal-body">
            <div className="deadline-form">
              <div className="row g-3 mb-3">
                <div className="col-sm-6">
                  <label htmlFor="depone" className="form-label">
                    Province
                  </label>
                  <Select
                    options={provinelists}
                    defaultValue={editModeldata ? { label: province, value: provinceEdit, type: provinceType } : ''}
                    onChange={(e) => changeProvince(e)}
                  ></Select>
                </div>
                <div className="col-sm-6">
                  <label htmlFor="deptwo" className="form-label">
                    District
                  </label>
                  <Select
                    options={districtlist}
                    defaultValue={editModeldata ? { label: district, value: districtEdit, type: districtType } : ''}
                    onChange={changeDistrict}
                  ></Select>
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-sm-6">
                  <label htmlFor="depone" className="form-label">
                    Ward
                  </label>
                  <Select
                    options={wardlist}
                    defaultValue={editModeldata ? { label: ward, value: wardEdit, type: wardType } : ''}
                    onChange={changeWard}
                  ></Select>
                  {/* <select
                                        className="form-select"
                                        value={editModeldata ? wardEdit : null}
                                        onChange={changeWard}
                                        required
                                    >
                                        <option></option>
                                        {wardlist
                                            ? wardlist.map((pro) => (
                                                <option key={pro.wardCode} value={pro.wardCode}>
                                                    {pro.wardName}
                                                </option>
                                            ))
                                            : null}
                                    </select> */}
                </div>
                <div className="col-sm-6">
                  <label htmlFor="deptwo" className="form-label">
                    Address Details
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="deptwo"
                    defaultValue={editModeldata ? addressdetails : null}
                    onClick={() => { }}
                    onChange={(e) => {
                      setAddressDetails(e.target.value);
                    }}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-secondary" id="employeeForm" onClick={handleClickDone}>Done</button>
      </Modal.Footer>
    </Modal>
  )
}


export default AddressModal;