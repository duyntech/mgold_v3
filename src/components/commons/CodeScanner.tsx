import {QrScanner} from '@yudiel/react-qr-scanner';
import { codeScannerProps } from '../../types';

export default function CodeScanner(props:codeScannerProps){
    return (
        <QrScanner
            onDecode={props.onDecoded}
            onError={props.onError}
        />
    );
}