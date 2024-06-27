import React, { useState } from "react";
import { Spinner } from "react-bootstrap";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

function GrowingSpinner() {
    const [basicT, setBasicT] = useState("Preview");


    return (
        <div className="border-top mt-5 pt-3">
            <div className="card mb-3">
                <div className="card-body">
                    <div className="tab-content">
                        <div className={basicT === "Preview" ? "tab-pane fade active show" : "tab-pane fade"} id="nav-Preview1" role="tabpanel">
                            <Spinner animation="grow" variant="primary" />
                            <Spinner animation="grow" variant="secondary" />
                            <Spinner animation="grow" variant="success" />
                            <Spinner animation="grow" variant="danger" />
                            <Spinner animation="grow" variant="warning" />
                            <Spinner animation="grow" variant="info" />
                            <Spinner animation="grow" variant="light" />
                            <Spinner animation="grow" variant="dark" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default GrowingSpinner;