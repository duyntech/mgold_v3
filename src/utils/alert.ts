import { t } from "i18next";
import Swal from "sweetalert2";
import { AuthService } from "../services/Auth.service";
const processing = (text?: string) => {
    Swal.fire({
        title: text ? text : t('status.processing') ?? 'Processing',
        /* timer: 10000,
        timerProgressBar: true, */
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading()
        }
    })
}
const failed = (text?: string) => {
    //const isRefreshing=localStorage.getItem('refreshingToken')
    // if(text=="Unauthorized"){
    //     console.log('First refreshing')
    //     //window.location.reload()
    // }
    if (text !== "Unauthorized") {
        Swal.fire({
            icon: 'error',
            title: t('Oops...') ?? 'Có lỗi',
            text: t(text ?? '') ?? 'Lỗi chưa xác định',
            timer: 15000,

        }).then((result) => {
            if (result.isConfirmed && (text === "Invalid token" || text === "Invalid token. jwt expired")) {
                const authService = new AuthService()
                authService.logout()
                window.location.href = import.meta.env.BASE_URL + 'signin'
            }
        });
    }

}
const completed = () => {
    Swal.fire({
        icon: 'success',
        showConfirmButton: false,
        title: t('status.success') ?? 'Success!',
        text: '',
        timer: 2000
    })
}
interface warningAlertProps {
    title: string
    onClose: VoidFunction
}
const warning = (props: warningAlertProps) => {
    Swal.fire({
        icon: 'warning',
        title: t(props.title ?? '') ?? 'Unvalaiable feature!',
        text: '',
        timer: 3000,
        showConfirmButton: false
    }).then((_result) => {
        props.onClose()
    })
}
interface confirmAlertProps {
    title: string
    text: string
    confirmButtonText: string
    confirm: VoidFunction
    cancel?: VoidFunction
}
const warningWithConfirm = (props: confirmAlertProps) => {
    Swal.fire({
        title: props.title,
        text: props.text,
        icon: 'warning',
        showCancelButton: true,
        focusCancel: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: props.confirmButtonText,
        cancelButtonText: "Hủy"
    }).then((result) => {
        if (result.isConfirmed) {
            props.confirm();
        } else {
            if (props.cancel) {
                props.cancel();
            }
        }
    })
}
export {
    processing,
    failed,
    completed,
    warning,
    warningWithConfirm
}