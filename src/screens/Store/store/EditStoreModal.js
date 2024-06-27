import React from "react";
import { Dropdown, Modal } from "react-bootstrap";
import Avatar2 from "../../assets/images/xs/avatar2.jpg";
import Avatar3 from "../../assets/images/xs/avatar3.jpg";
import Avatar8 from "../../assets/images/xs/avatar8.jpg";


function EditStoreModal(props) {

    const { onClose, show,isFetching, editModeldata, handleEdit,
    } = props;

    return (
        <Modal
            centered
            show={isModal}
            onHide={() => {
                setButton(false);
                setIsModal(false);
                setEditModeldata("");
                console.log(editModeldata);
            }}
        >
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold">{modalHeader}</Modal.Title>
            </Modal.Header>
            {isFetching && <GrowingSpinner></GrowingSpinner>}
            {!isFetching && (
                <Modal.Body>
                    <form data-parsley-validate="" onSubmit={isEditModalData ? handleEdit : handleCreate} >
                        <div className="deadline-form">
                            <div className="row g-3 mb-3">
                                <div className="col-sm-6">
                                    <label htmlFor="depone" className="form-label">
                                        Store Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="depone"
                                        name="branchName"
                                        value={editModeldata ? branchname : null}
                                        onChange={(e) => setBranchName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-sm-6">
                                    <label htmlFor="deptwo" className="form-label">
                                        Fax
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="deptwo"
                                        value={editModeldata ? fax : null}
                                        onChange={(e) => setFax(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row g-3 mb-3">
                                <div className="col-sm-6">
                                    <label htmlFor="depone" className="form-label">
                                        Province
                                    </label>
                                    <select
                                        className="form-select"
                                        value={editModeldata ? provinceEdit : null}
                                        onChange={changeProvince}
                                        required
                                    >
                                        <option></option>
                                        {provinelist
                                            ? provinelist.map((pro) => (
                                                <option
                                                    key={pro.provinceCode}
                                                    value={pro.provinceCode}
                                                >
                                                    {pro.provinceName}
                                                </option>
                                            ))
                                            : null}
                                    </select>
                                </div>
                                <div className="col-sm-6">
                                    <label htmlFor="deptwo" className="form-label">
                                        District
                                    </label>
                                    <select
                                        className="form-select"
                                        value={editModeldata ? districtEdit : null}
                                        onChange={changeDistrict}
                                        required
                                    >
                                        <option></option>
                                        {districtlist
                                            ? districtlist.map((pro) => (
                                                <option
                                                    key={pro.districtCode}
                                                    value={pro.districtCode}
                                                >
                                                    {pro.districtName}
                                                </option>
                                            ))
                                            : null}
                                    </select>
                                </div>
                            </div>
                            <div className="row g-3 mb-3">
                                <div className="col-sm-6">
                                    <label htmlFor="depone" className="form-label">
                                        Ward
                                    </label>
                                    <select
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
                                    </select>
                                </div>
                                <div className="col-sm-6">
                                    <label htmlFor="deptwo" className="form-label">
                                        Address Details
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="deptwo"
                                        value={editModeldata ? addressdetails : null}
                                        onClick={() => { }}
                                        onChange={(e) => {
                                            setAddressDetails(e.target.value);
                                        }}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row g-3 mb-3">
                                <div className="col-sm-6">
                                    <label htmlFor="depone" className="form-label">
                                        Latitude
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="depone"
                                        value={editModeldata ? latitude : null}
                                        onChange={(e) => setLatitude(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-sm-6">
                                    <label htmlFor="deptwo" className="form-label">
                                        Longitude
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="deptwo"
                                        value={editModeldata ? longitude : null}
                                        onChange={(e) => setLongitude(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row g-3 mb-3">
                                <div className="col-sm-6">
                                    <label htmlFor="depone" className="form-label">
                                        Open Time
                                    </label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        id="timepickerded29"
                                        value={editModeldata ? opentime : null}
                                        onChange={(e) => setOpentime(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-sm-6">
                                    <label htmlFor="deptwo" className="form-label">
                                        Close Time
                                    </label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        id="timepickerded29"
                                        value={editModeldata ? closetime : null}
                                        onChange={(e) => setCloseTime(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row g-3 mb-3">
                                <div className="col-sm-6">
                                    <label htmlFor="depone" className="form-label">
                                        Manager
                                    </label>
                                    <select
                                        className="form-select"
                                        value={editModeldata ? mngedit : null}
                                        onChange={changeManager}
                                        required
                                    >
                                        <option key={mngedit} value={mngedit} >{manager}</option>
                                        {promotelist
                                            ? promotelist.map((pro) => (
                                                <option key={pro.id} value={pro.id}>
                                                    {pro.name}
                                                </option>
                                            ))
                                            : null}
                                    </select>
                                </div>
                                <div className="col-sm-6">
                                    <label htmlFor="deptwo" className="form-label">
                                        BSS ID
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="deptwo"
                                        value={editModeldata ? bssid : null}
                                        onChange={(e) => {
                                            setBssid(e.target.value);
                                        }}
                                        required
                                    />
                                    {!(regex.test(bssid)) && button ? (
                                        <span className="text-danger">
                                            Wrong fomat BSS ID
                                        </span>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="d-flex flex-row-reverse">
                            <button type="submit" className="btn btn-primary">
                                Save
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            )}
        </Modal>
    )
}