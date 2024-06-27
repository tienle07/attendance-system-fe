import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Modal } from "react-bootstrap";
import PageHeader from "../../components/common/PageHeader";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useReducer } from "react";
import { getAllBrand, getAllBrandBySearchName } from "../../redux/brand/brandApi";
import BrandModel from "./brandModel";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { imageDb } from "../../firebase";
import { toast } from "react-toastify";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/auth/authSlice";
import { getProvince } from "../../redux/address/addressApi";


function Brands() {
  const [search, setSearch] = useState("");

  const [isModal, setIsModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState("");
  const [editModeldata, setEditModeldata] = useState("");

  const [image, setImage] = useState(null);
  const [id, setId] = useState("");
  const [form, setForm] = useState({
    name: '',
    address: '',
    contactPerson: '',
    phone: '',
    description: '',
    logoUrl: '',
  });


  const user = useSelector((state) => state.auth?.login?.currentUser);
  const allBrand = useSelector((state) => state.brand?.brand?.allBrands);
  const [reducerValue, foreUpdate] = useReducer((x) => x + 1, 0);


  const dispatch = useDispatch();
  const navigate = useNavigate();
  var columnT = ""
  let axiosJWT = createAxios(user,dispatch,loginSuccess)

  useEffect(() => {
    if (!user) {
      navigate(process.env.PUBLIC_URL + "/sign-in");
    }
    if (user?.data?.token?.accessToken) {
      getAllBrand(user?.data?.token?.accessToken, dispatch,axiosJWT);
      getProvince(user?.data?.token?.accessToken, dispatch,axiosJWT);
    }
  }, [reducerValue]);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  const onChangeImage = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleCreate = (e) => {
    e.preventDefault();
    if (image) {
      const imgRef = ref(imageDb, `logobrand/${image.name}`);
      uploadBytes(imgRef, image).then((value) => {
        getDownloadURL(value.ref).then((url) => {
          setForm({ ...form, ["logoUrl"]: url });
          handleCreateSend(url);
        });
      });
    } else {
      handleCreateSend(null);
    }
  };
  const handleCreateSend = async (link) => {
    const newBrand = {
      name: form?.name,
      address: form?.address,
      contactPerson: form?.contactPerson,
      phone: form?.phone,
      description: form?.description,
      logoUrl: link ? link : "",
    };
    try {
      const res = await axiosJWT.post(
        "/api/brand",
        newBrand,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );

      if (res.data.code >= 200 && res.data.code < 300) {
        setIsModal(false);
        setIsEditModal(false);
        setEditModeldata("");
        toast.success("Create Brand Success");
        foreUpdate();
      }
      if (res.data.code === 400) {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("" + err?.response?.data?.message);
    }
  };
  const handleSearch = (e) =>{
    if(e.keyCode === 13) { 
      getAllBrandBySearchName(e.target.value,user?.data?.token?.accessToken, dispatch)
    }
  }
  columnT = [
    {
      name: "NAME",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Contact",
      selector: (row) => row.contactPerson,
      sortable: true
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      sortable: true
    },
    {
      name: "STATUS",
      selector: (row) => { },
      sortable: true,
      cell: row =>
        row.active ?
          <span className="badge bg-success">Active</span> :
          <span className="badge bg-error">Inactive</span>

    },

  ]


  return (
    <div className="container-xxl">
      <PageHeader headerTitle="Brands" renderRight={() => {
        return <div className="col-auto d-flex w-sm-100">
          <div className="input-group flex-nowrap input-group-sm me-2">
            <button type="button" className="input-group-text" id="addon-wrapping"><i className="fa fa-search"></i></button>
            <input type="search" className="form-control" onKeyDown={handleSearch} placeholder="Search" aria-label="search" aria-describedby="addon-wrapping" />
          </div>
          <button className="btn btn-dark btn-set-task w-sm-100" onClick={() => { setIsModal(true) }}><i className="icofont-plus-circle me-2 fs-6"></i>Brand</button>
        </div>
      }} />
      <div className="row clearfix g-3">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <DataTable
                title="Brands"
                columns={columnT}
                data={allBrand ? allBrand : []}
                defaultSortField="title"
                pagination
                noDataComponent="No Brand Available"
                onRowClicked={(e) => {
                  navigate(
                    process.env.PUBLIC_URL + "/brands/" + e.id
                  );
                }}
                selectableRows={false}
                className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                highlightOnHover={true}
              />
            </div>
          </div>
        </div>
      </div>
      <BrandModel isModal={isModal}
        onHide={() => { setIsModal(false); setForm({}) }}
        handleChange={handleChange}
        onChangeImage={onChangeImage}
        form={form}
        setForm={setForm}
        handleCreate={handleCreate}
      >
      </BrandModel>
      <Modal centered show={isEditModal} onHide={() => { setIsModal(false); setIsEditModal("") }}>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">{isEditModal !== "" ? "Edit" : "Add"} Ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="sub" className="form-label">Subject</label>
            <input type="text" className="form-control" id="sub" onChange={() => { }} value={isEditModal ? isEditModal.subject : ""} />
          </div>
          <div className="deadline-form">
            <form>
              <div className="row g-3 mb-3">
                <div className="col-lg-6">
                  <label htmlFor="depone" className="form-label">Assign Name</label>
                  <input type="text" className="form-control" id="depone" onChange={() => { }} value={isEditModal ? isEditModal.assigned : ""} />
                </div>
                <div className="col-lg-6">
                  <label htmlFor="deptwo" className="form-label">Creted Date</label>
                  <input type="date" className="form-control" id="deptwo" onChange={() => { }} value={isEditModal ? isEditModal.createdate : ""} />
                </div>
              </div>
            </form>
          </div>
          <div className="mb-3">
            <label className="form-label">Status</label>
            <select className="form-select">
              <option >In Progress</option>
              <option value="1">Completed</option>
              <option value="2">Wating</option>
              <option value="3">Decline</option>
            </select>
          </div>

        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-secondary" onClick={() => { setIsModal(false) }}>Done</button>
          <button type="button" className="btn btn-primary">Sent</button>
        </Modal.Footer>
      </Modal>
    </div>
  )

}

export default Brands;