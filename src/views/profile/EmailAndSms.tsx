import { useFormik } from "formik";
import { InputSwitch } from 'primereact/inputswitch';
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { resetActionState } from "../../slices/profile/profile.slice";
import { useEffect } from "react";
import * as Alert from "../../utils/alert";
import EmptyHeight from "../../components/commons/EmptyHeight";
export default function  EmailAndSms(){
    const profileState = useAppSelector((state) => state.profile);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const location = useLocation();
    let profile: any = undefined;
    if(location.state!==undefined){
        profile=location.state.profile;
        if(profile===undefined){
            navigate(-1);
        }
    }
    const settings=profile.settings??{};
    const formik = useFormik({
        initialValues: {
            wnewnotif:settings.wnewnotif??false,
            sadmessage:settings.sadmessage??false,
            addaconn:settings.addaconn??false,
            napointment:settings.napointment??false,
            nmembership:settings.nmembership??false,
            mregistration:settings.mregistration??false,
            emailnotification:settings.emailnotification??false,
            smsnotification:settings.smsnotification??false
        },
        onSubmit: (_data) => {
            // const submitData={
            //     username:profile.username,
            //     session:'SETTING',
            //     settings:{
            //             wnewnotif:data.wnewnotif,
            //             sadmessage:data.sadmessage,
            //             addaconn:data.addaconn,
            //             napointment:data.napointment,
            //             nmembership:data.nmembership,
            //             mregistration:data.mregistration,
            //             emailnotification:data.emailnotification,
            //             smsnotification:data.smsnotification
                    
            //     }
            // }
            //console.log(submitData);
            //dispatch(updateProfile(submitData));
        }
    });
    const handleCancel = () => {
        navigate(-1)
    }
    useEffect(() => {
        switch (profileState.statusAction) {
            case 'failed':
                Alert.failed(profileState.error);
                dispatch(resetActionState('UPDATE'));
                break;
            case "loading":
                Alert.processing();
                break;
            case 'completed':
                Alert.completed();
                dispatch(resetActionState('UPDATE'));
                navigate(-1);
                break;
        }
    }, [profileState,dispatch])
    return (
        <form onSubmit={formik.handleSubmit} className="p-3">
            <div className="row pt-3">
                <div className="form-group row align-items-center">
                    <label className="col-md-3" htmlFor="emailnotification">Thông báo Email:</label>
                    <div className="col-md-9 custom-control custom-switch">
                        <InputSwitch
                            id="emailnotification"
                            name="emailnotification"
                            checked={formik.values.emailnotification}
                            onChange={(e) => {
                                formik.setFieldValue('emailnotification', e.value);
                            }}
                        />
                        <label className="ms-1" htmlFor="emailnotification"></label>
                    </div>
                </div>
                <div className="form-group row align-items-center">
                    <label className="col-md-3" htmlFor="smsnotification">Thông báo SMS:</label>
                    <div className="col-md-9 custom-control custom-switch">
                        <InputSwitch
                            id="smsnotification"
                            name="smsnotification"
                            checked={formik.values.smsnotification}
                            onChange={(e) => {
                                formik.setFieldValue('smsnotification', e.value);
                            }}
                        />
                        <label className="ms-1" htmlFor="smsnotification"></label>
                    </div>
                </div>
                {/* <div className="form-group row align-items-center">
                    <label className="col-md-3" htmlFor="npass">When To Email</label>
                    <div className="col-md-9">
                        <div className="d-flex">
                            <Checkbox
                                id="wnewnotif"
                                name="wnewnotif"
                                checked={formik.values.wnewnotif}
                                onChange={(e) => {
                                    formik.setFieldValue('wnewnotif', e.checked);
                                }}
                            ></Checkbox>
                            <label className="ms-1" htmlFor="wnewnotif">You have new notifications.</label>
                        </div>
                        <div className="d-flex">
                            <Checkbox
                                id="sadmessage"
                                name="sadmessage"
                                checked={formik.values.sadmessage}
                                onChange={(e) => {
                                    formik.setFieldValue('sadmessage', e.checked);
                                }}
                            ></Checkbox>
                            <label className="ms-1" htmlFor="sadmessage">You're sent a direct message</label>
                        </div>
                        <div className="d-flex">
                            <Checkbox
                                id="addaconn"
                                name="addaconn"
                                checked={formik.values.addaconn}
                                onChange={(e) => {
                                    formik.setFieldValue('addaconn', e.checked);
                                    }}
                            ></Checkbox>
                            <label className="ms-1" htmlFor="addaconn">Someone adds you as a connection</label>
                        </div>
                    </div>
                </div> */}
                {/* <div className="form-group row align-items-center">
                    <label className="col-md-3" htmlFor="npass">When To Escalate Emails</label>
                    <div className="col-md-9">
                        <div className="d-flex">
                        <Checkbox
                            id="napointment"
                            name="napointment"
                            checked={formik.values.napointment}
                            onChange={(e) => {
                                formik.setFieldValue('napointment', e.checked);
                            }}
                        ></Checkbox>
                        <label className="ms-1" htmlFor="napointment"> Upon new appointment.</label>
                    </div>
                    <div className="d-flex">
                        <Checkbox
                            id="nmembership"
                            name="nmembership"
                            checked={formik.values.nmembership}
                            onChange={(e) => {
                                formik.setFieldValue('nmembership', e.checked);
                            }}
                        ></Checkbox>
                        <label className="ms-1" htmlFor="nmembership"> New membership approval</label>
                    </div>
                    <div className="d-flex">
                        <Checkbox
                            id="mregistration"
                            name="mregistration"
                            checked={formik.values.mregistration}
                            onChange={(e) => {
                                formik.setFieldValue('mregistration', e.checked);
                            }}
                        ></Checkbox>
                        <label className="ms-1" htmlFor="mregistration"> Member registration</label>
                    </div>
                </div>
            </div> */}
                                       
        </div>
        <EmptyHeight height={50}/>
        <div className='fixed-bottom'>
            <div className='d-flex justify-content-end'>
            <button type="button" className='btn btn-outline-danger' onClick={handleCancel}><i className='ri-close-line'></i> Hủy</button>
            <button type="submit" className='btn btn-primary ms-3'><i className='ri-add-line'></i> Cập nhật</button>
            </div>
        </div>
    </form>
    );
}