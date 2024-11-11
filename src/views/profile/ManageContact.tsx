import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect } from "react";
import * as Alert from "../../utils/alert";
import { resetActionState } from "../../slices/profile/profile.slice";
import EmptyHeight from "../../components/commons/EmptyHeight";
export default function  ManageContact(){
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
    // let profileContact={};
    // if(profile.information){
    //     profileContact=profile.information.contact??{}
    // }
    const formik = useFormik({
        initialValues: {
            phone:'',
            email:'',
            url:'',
            facebook:'',
            instagram:'',
            twitter:'',
            linkedin:''
        },
        onSubmit: (_data) => {
            // const submitData={
            //     username:profile.username,
            //     session:'CONTACT',
            //     contact:{
            //         phone:data.phone,
            //         email:data.email,
            //         url:data.url,
            //         facebook:data.facebook,
            //         instagram:data.instagram,
            //         twitter:data.twitter,
            //         linkedin:data.linkedin
            //     },
            //     // create_user: UserRepo.getUser()?.username,
            // }
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
                <div className="form-group col-md-12">
                    <label htmlFor="phone">Số điện thoại:</label>
                    <InputText
                        id="phone"
                        name="phone"
                        value={formik.values.phone}
                        onChange={(e) => {
                            formik.setFieldValue('phone', e.target.value);
                        }}
                        placeholder="Điện thoại"
                        style={{width: "100%",borderRadius: "10px"}}
                    />
                </div>
                <div className="form-group col-md-12">
                    <label htmlFor="email">Email:</label>
                    <InputText
                        id="email"
                        name="email"
                        value={formik.values.email}
                        onChange={(e) => {
                            formik.setFieldValue('email', e.target.value);
                        }}
                        placeholder="Email"
                        style={{width: "100%",borderRadius: "10px"}}
                    />
                </div>
                <div className="form-group col-md-12">
                    <label htmlFor="url">Url:</label>
                    <InputText
                        id="url"
                        name="url"
                        value={formik.values.url}
                        onChange={(e) => {
                            formik.setFieldValue('url', e.target.value);
                        }}
                        placeholder="Url"
                        style={{width: "100%",borderRadius: "10px"}}
                    />
                </div>
                <div className="form-group col-md-12">
                    <label htmlFor="facebook">Facebook Url:</label>
                    <InputText
                        id="facebook"
                        name="facebook"
                        value={formik.values.facebook}
                        onChange={(e) => {
                            formik.setFieldValue('facebook', e.target.value);
                        }}
                        placeholder="Facebook Url"
                        style={{width: "100%",borderRadius: "10px"}}
                    />
                </div>
                
                <div className="form-group col-md-12">
                    <label htmlFor="instagram">Instagram Url:</label>
                    <InputText
                        id="instagram"
                        name="instagram"
                        value={formik.values.instagram}
                        onChange={(e) => {
                            formik.setFieldValue('instagram', e.target.value);
                        }}
                        placeholder="Instagram Url"
                        style={{width: "100%",borderRadius: "10px"}}
                    />
                </div>
                <div className="form-group col-md-12">
                    <label htmlFor="twitter">Twitter Url:</label>
                    <InputText
                        id="twitter"
                        name="twitter"
                        value={formik.values.twitter}
                        onChange={(e) => {
                            formik.setFieldValue('twitter', e.target.value);
                        }}
                        placeholder="Twitter Url"
                        style={{width: "100%",borderRadius: "10px"}}
                    />
                </div>
                <div className="form-group col-md-12">
                    <label htmlFor="linkedin">Linkedin Url:</label>
                    <InputText
                        id="linkedin"
                        name="linkedin"
                        value={formik.values.linkedin}
                        onChange={(e) => {
                            formik.setFieldValue('linkedin', e.target.value);
                        }}
                        placeholder="Linkedin Url"
                        style={{width: "100%",borderRadius: "10px"}}
                    />
                </div>
            </div>
            <EmptyHeight height={50}/>
            <div className='fixed-bottom'>
                <div className='d-flex justify-content-end'>
                <button type='button' className='btn btn-outline-danger' onClick={handleCancel}><i className='ri-close-line'></i> Hủy</button>
                <button type='submit' className='btn btn-primary ms-3'><i className='ri-add-line'></i> Cập nhật</button>
                </div>
            </div>
        </form>
    );
}