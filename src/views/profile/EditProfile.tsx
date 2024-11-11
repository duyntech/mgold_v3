import React, { Suspense, useState } from "react";
const AddProfile = React.lazy(() => import('./AddProfile'));
const ResetPassword = React.lazy(() => import('./ResetPassword'));
const ResetGA = React.lazy(() => import('./ResetGA'));
const Fingerprint = React.lazy(() => import('./Fingerprint'));
const tabs = [
    {
        "title": "Thông tin cá nhân",
        "component": AddProfile
    },
    {
        "title": "Reset Google Authenticate",
        "component": ResetGA
    },
    {
        "title": "Làm mới mật khẩu",
        "component": ResetPassword
    },
    {
        "title": "Vân tay",
        "component": Fingerprint
    },
];
export default function EditProfile() {
    const [tabIndex, settabIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState(tabs[0]);
    const handleTab = (idx: number) => {
        settabIndex(idx);
        setCurrentPage(tabs[idx]);
    }
    return (
        <>
            <div className="row">
                <div className="col-lg-12">
                    <div className="iq-card">
                        <div className="iq-card-body p-0">
                            <div className="iq-edit-list">
                                <ul className="iq-edit-profile d-flex nav nav-pills">
                                    {
                                        tabs.map((item, index) => {
                                            return (
                                                <li key={`profile-tab-${index}`} className="col-md-3 p-0" style={{ cursor: "pointer" }}>
                                                    <a className={`nav-link ${tabIndex === index ? 'active' : ''}`} data-toggle="pill" onClick={() => handleTab(index)} >
                                                        {item.title}
                                                    </a>
                                                </li>
                                            );
                                        })
                                    }
                                </ul>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <Suspense>{<currentPage.component />}</Suspense>
                </div>
            </div>
        </>
    );
}