import Resizer from 'react-image-file-resizer'

export const resizeFile = async (file: any, type: string) =>
    new Promise((resolve) => {
        Resizer.imageFileResizer(
            file,
            1500,
            1500,
            type,
            100,
            0,
            (uri) => {
                resolve(uri);
            },
            "base64"
        );
    });

export const readPdfBase64 = async (file: any) => {
    const reader = new FileReader()
    return new Promise(resolve => {
        reader.onload = _ev => {
            var data = reader.result
            if (typeof data == 'string') {
                var base64 = data?.replace(/^[^,]*,/, '')
                resolve(base64)
            } else {
                resolve('')
            }
        }
        reader.readAsDataURL(file)
    })
}