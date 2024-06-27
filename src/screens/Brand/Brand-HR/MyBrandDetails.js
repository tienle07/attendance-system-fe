import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SideMenu from "./SideMenu";
import BrandInformationTab from "./BrandInformationTab";
import PosAndTypeTab from "./PosAndTypeTab";
import PageHeader from "../../../components/common/PageHeader";
import TimeFrameTab from "./TimeFrameTab";
import BrandModel from "../brandModel";
import { getBrandDetails } from "../../../redux/brand/brandApi";
import { createAxios } from "../../../createInstance";
import { loginSuccess } from "../../../redux/auth/authSlice";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { imageDb } from "../../../firebase";
import { toast } from "react-toastify";
import { useReducer } from "react";
function MyBrandDetails() {
  const storeId = localStorage.getItem("storeid");
  const [selectedTab, setSelectedTab] = useState({ id: 1,name: "Brand Information" });
  const [isEditBrandModal, setIsEditBrandModal] = useState(false);
  const user = useSelector((state) => state.auth?.login?.currentUser);
  const id = localStorage.getItem("brand");
  const data = useSelector(
    (state) => state.brand?.currentBrandSelect?.curBrand
  );
  const [isModal, setIsModal] = useState(false);
  const [image, setImage] = useState(null);
  const [logo, setLogo] = useState("");
  const [form, setForm] = useState({
    name: "",
    address: "",
    contactPerson: "",
    phone: "",
    description: "",
    logoUrl: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [reducerValue, foreUpdate] = useReducer((x) => x + 1, 0);
  let axiosJWT = createAxios(user,dispatch,loginSuccess)

  useEffect(() => {
    if (!user) {
      navigate(process.env.PUBLIC_URL + "/sign-in");
    }
    if (user?.data?.token?.accessToken) {
      getBrandDetails(id, user?.data?.token?.accessToken, dispatch,axiosJWT);
    }
  }, [reducerValue]);
  useEffect(() => {
    if (user?.data?.token?.accessToken) {
      setForm(data);
      setLogo(data?.logoUrl);
    }
  }, [data?.id]);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const onChangeImage = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleEdit = (e) => {
    e.preventDefault();
    if (image) {
      const imgRef = ref(imageDb, `logobrand/${image.name}`);
      uploadBytes(imgRef, image).then((value) => {
        getDownloadURL(value.ref).then((url) => {
          setForm({ ...form, logoUrl: url });
          handleUpload(url);
        });
      });
    } else {
      handleUpload();
    }
  };
  const handleUpload = async (link) => {
    const newBrand = {
      name: form?.name,
      address: form?.address,
      contactPerson: form?.contactPerson,
      phone: form?.phone,
      description: form?.description,
      logoUrl: link ? link : logo,
    };
    try {
      const res = await axiosJWT.put(
        "/api/brand/update-brand-infor/" + id,
        newBrand,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );
      if (res.data.code >= 200 && res.data.code < 300) {
        setIsModal(false);
        toast.success("Edit Brand Success");
        foreUpdate();
      }
    } catch (err) {
      toast.error("" + err?.response?.data?.message);
    }
  };
  return (
    <div className="container-xxl">
      <div className="row clearfix g-3">
        <PageHeader
          headerTitle={selectedTab?.name}
          renderRight={() => {
            return (
              <div className="col-auto d-flex w-sm-100">
                {selectedTab?.id === 1 ? (
                  <button
                    className="btn btn-dark btn-set-task w-sm-100"
                    onClick={() => {
                      setIsModal(true);
                    }}
                  >
                    <i className="icofont-edit me-2 fs-6"></i>Edit Brand
                  </button>
                ) : null}
              </div>
            );
          }}
        />
        <div className="col-9">
          {selectedTab?.id === 1 ? (
            <BrandInformationTab tab={selectedTab}></BrandInformationTab>
          ) : null}
          {selectedTab?.id === 2 ? (
            <PosAndTypeTab tab={selectedTab}></PosAndTypeTab>
          ) : null}
          {selectedTab?.id === 3 ? (
            <TimeFrameTab tab={selectedTab}></TimeFrameTab>
          ) : null}
        </div>
        <div className="col-3">
          <SideMenu setSelectedTab={setSelectedTab} />
        </div>
      </div>
      <BrandModel
        isModal={isModal}
        onHide={() => {
          setIsModal(false);
          setForm(data);
        }}
        handleChange={handleChange}
        onChangeImage={onChangeImage}
        form={form}
        setForm={setForm}
        handleEdit={handleEdit}
        isEditModalData={true}
      ></BrandModel>
    </div>
  );
}

export default MyBrandDetails;
