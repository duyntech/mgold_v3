
const isFormFieldInvalid = (name: string,formik:any) => !!(formik.touched[name] && formik.errors[name]);
const getFormErrorMessage = (name:string,formik:any) => {
    return isFormFieldInvalid(name,formik) ? <small className="p-error">{formik.errors[name]}</small> : <></>;
};
const getFormErrorMessageString = (name:string,formik:any) => {
    return isFormFieldInvalid(name,formik) ? formik.errors[name]: '';
};
export {isFormFieldInvalid, getFormErrorMessage,getFormErrorMessageString}