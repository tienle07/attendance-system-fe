import { Modal } from "react-bootstrap";
import GrowingSpinner from "../../components/UI/GrowingSpinner";
import { useState } from "react";
import AddressModal from "./addressModal";

function BrandModel(props) {
    const { onHide, isModal, isFetching, modalHeader, isEditModalData, handleEdit, handleCreate
            ,onChangeImage,handleChange,form,setForm } = props;
    const[isaddressModal,setisaddressModal] =useState(false);
    const[button,setButton] =useState(false);
    return (
        <div>
        <Modal
            centered
            show={isModal}
            onHide={onHide
            }
        >
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold">{modalHeader}</Modal.Title>
            </Modal.Header>
            {isFetching && <GrowingSpinner></GrowingSpinner>}
            {!isFetching && (
                <Modal.Body>
                    <form data-parsley-validate="" onSubmit={isEditModalData ? handleEdit : handleCreate} >
                        <div className="row g-3 mb-3">
                            
                            <div className="col-sm-6">
                                <label htmlFor="depone" className="form-label">
                                    Brand Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="depone"
                                    name="name"
                                    value={form?.name}
                                    onChange={(e) => handleChange(e)}
                                    required
                                />
                            </div>
                            <div className="col-sm-6">
                                <label htmlFor="deptwo" className="form-label">
                                    Contact Person
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="deptwo"
                                    name="contactPerson"
                                    value={form?.contactPerson}
                                    onChange={(e) => handleChange(e)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                                <label
                                    htmlFor="formFileMultipleoneone"
                                    className="form-label"
                                >
                                    Brand Logo
                                </label>
                                <input
                                    className="form-control"
                                    type="file"
                                    id="formFileMultipleoneone"
                                    name= "logoUrl"
                                    onChange={(e) => onChangeImage(e)}
                                />
                            </div>
                        <div className="deadline-form">
                        <div className="mb-3" onClick={()=>setisaddressModal(true)}>
                                <label
                                    htmlFor="formFileMultipleoneone"
                                    className="form-label"
                                >
                                    Address
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    readOnly
                                    value={form?.address}
                                    id="depone"
                                    name= "address"
                                    onChange={(e) => handleChange(e)}
                                />
                            </div>
                            <div className="row g-3 mb-3">
                                <div className="col-sm-6">
                                    <label htmlFor="depone" className="form-label">
                                        Description
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="depone"
                                        value={form?.description}
                                        name ="description"
                                        onChange={(e) => handleChange(e)}
                                        required
                                    />
                                </div>
                                <div className="col-sm-6">
                                    <label htmlFor="deptwo" className="form-label">
                                        Phone
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="deptwo"
                                        value={form?.phone}
                                        name="phone"
                                        onChange={(e) => handleChange(e)}
                                        required
                                    />
                                </div>
                            </div>

                        </div>
                        <div className="d-flex flex-row-reverse">
                            <button type="submit" className="btn btn-primary" onClick={() => setButton(true)}>
                                Save
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            )}
        </Modal>
        <AddressModal show ={isaddressModal}
                    onClose={()=>setisaddressModal(false)}
                    editModeldata ={form?.address}
                    setaddressReturn = {(e)=>setForm({...form,address: e})}
        ></AddressModal>
        </div>

    )
}
export default BrandModel;
