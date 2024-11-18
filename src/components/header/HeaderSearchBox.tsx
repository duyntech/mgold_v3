import { useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { searchChanged } from '../../slices/header/header.slice'
import { t } from 'i18next'
import { useEffect, useRef, useState } from 'react'
import { DynamicDialog } from '../commons'
import CodeScanner from '../commons/CodeScanner'
import { patchItem, resetScanState } from '../../slices/retail/retail.slice'
import { Spinner } from 'react-bootstrap'
import { failed } from '../../utils/alert'
const baseWebsiteURL = import.meta.env.VITE_APP_baseWebsiteURL!

export default function HeaderSearchBox() {
    const search = useAppSelector((state) => state.header.search)
    const target = useAppSelector((state) => state.sidebar.activedTarget)
    const retail = useAppSelector((state) => state.retail)
    const location = useLocation()
    const htmlElRef = useRef<any>(null)

    const [isShowDialog, setIsShowDialog] = useState(false);

    const [scannedCode, setScannedCode] = useState('')
    const current = location.pathname
    const validPath = ['/retail']
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (scannedCode !== '') {
            const code = scannedCode.replace(baseWebsiteURL, '').split('_')[0]
            dispatch(patchItem({ code: code }))
            dispatch(searchChanged(code))
        }
    }, [dispatch, scannedCode])
    useEffect(() => {
        switch (retail.statusScan) {
            case 'failed':
                failed(retail.error);
                dispatch(resetScanState(''))
                break;
            case 'completed':
                dispatch(resetScanState(''))
                break;
        }
        setScannedCode('')
    }, [retail.statusScan])
    useEffect(() => {
        if (search === '') {
            htmlElRef.current.focus()
        }
    }, [search])
    return (
        <div className='iq-search-bar'>

            <div className='p-inputgroup'>
                <input
                    type='text'
                    ref={htmlElRef}
                    value={search}
                    className='search-input'
                    placeholder={t('action.search_hint') ?? 'Search...'}
                    onChange={(e) => {
                        dispatch(searchChanged(e.target.value))
                    }}
                />
                {
                    target === current && validPath.indexOf(current) >= 0 ?
                        <div className='search-action px-2' style={{ fontSize: 22, cursor: "pointer" }}>
                            {retail.statusScan === "loading" ?
                                <Spinner size="sm" />
                                : <i className="ri-qr-scan-2-line fami-text-primary" onClick={() => setIsShowDialog(true)}></i>
                            }
                        </div>
                        : <></>
                }
                <div className='search-icon px-2' style={{ cursor: "pointer", fontSize: 22 }}>
                    {search !== undefined && search !== '' ?
                        <i className='ri-close-circle-line fami-text-primary' onClick={() => { dispatch(searchChanged('')) }}></i>
                        : <i className='ri-search-line fami-text-primary'></i>}
                </div>

            </div>
            <DynamicDialog visible={isShowDialog} position={undefined}
                title={<>"Quét mã hóa đơn"</>}
                body={
                    <div style={{ minWidth: 288 }}>
                        {
                            isShowDialog ?
                                <CodeScanner onDecoded={function (text: string): void {
                                    setScannedCode(text)
                                    setIsShowDialog(false)
                                }} onError={function (_error: any): void {
                                    //console.log(error)
                                }} />
                                : <></>
                        }
                    </div>

                }
                footer={
                    <>

                    </>
                }
                draggable={false}
                resizeable={false}
                onClose={() => setIsShowDialog(false)}
            />
        </div>
    )
}
