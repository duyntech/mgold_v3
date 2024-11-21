import React, { Suspense, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { use } from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getLanguageData } from './utils/constants/languages'
import './App.css'
import PageLoading from './components/commons/PageLoading'
import Layout from './views/Layout'
import { HttpService } from './services/http/HttpService'
import Home from './views/Home'
const SignIn = React.lazy(() => import('./views/authen/Signin'));
const AllProfile = React.lazy(() => import('./views/profile/AllProfile'));
const GoldType = React.lazy(() => import('./views/goldtype/AllGoldType'));
const GoldTypeItem = React.lazy(() => import('./views/goldtype/GoldTypeItem'));
const AllWarehouse = React.lazy(() => import('./views/warehouse/AllWarehouse'));
const DashBoard = React.lazy(() => import('./views/dashboard/Dashboard'));
const GoldPrice = React.lazy(() => import('./views/dashboard/GoldPrice'));
const AddProfile = React.lazy(() => import('./views/profile/AddProfile'));
const EditProfile = React.lazy(() => import('./views/profile/EditProfile'));
const AllTag = React.lazy(() => import('./views/tag/AllTag'));
const AllHistory = React.lazy(() => import('./views/history/AllHistory'));
const AllTransaction = React.lazy(() => import('./views/transaction/AllTransaction'));
const AllReview = React.lazy(() => import('./views/review/AllReview'));
const AllConsulting = React.lazy(() => import('./views/consulting/AllConsulting'));
const AllSearch = React.lazy(() => import('./views/search/AllSearch'));
const AllView = React.lazy(() => import('./views/view/AllView'));
const AllCustomer = React.lazy(() => import('./views/customer/AllCustomer'));
const AllSupplier = React.lazy(() => import('./views/supplier/AllSupplier'));
const AllTempPawn = React.lazy(() => import('./views/pawn/AllTempPawn'));
const TempPawnItem = React.lazy(() => import('./views/pawn/TempPawnItem'));
const TempPawnImport = React.lazy(() => import('./views/pawn/TempPawnImport'));
const PawnTags = React.lazy(() => import('./views/pawn/PawnTags'));
const PawnWarehouses = React.lazy(() => import('./views/pawn/PawnWarehouses'));
const FingerPrintMajor = React.lazy(() => import('./views/fingerprint/FingerPrintMajor'));
const AllDescription = React.lazy(() => import('./views/description/AllDescription'));
const AllCounter = React.lazy(() => import('./views/counter/AllCounter'));
const AllFeature = React.lazy(() => import('./views/feature/AllFeature'));
const pageList = [
    {
        path: "/goldprice",
        element: <Suspense fallback={<PageLoading />}><GoldPrice /></Suspense>
    },
    {
        path: "/signin",
        element: <Suspense fallback={<PageLoading />}><SignIn /></Suspense>
    },

    {
        path: "/user",
        element: <Layout children={<AllProfile />} target={'/user'}></Layout>
    },
    {
        path: "/user-add",
        element: <Layout children={<AddProfile />} target={'/user'}></Layout>
    },
    {
        path: "/user-edit",
        element: <Layout children={<EditProfile />} target={'/user'}></Layout>
    },

    {
        path: "/history",
        element: <Layout children={<AllHistory />} target={'/history'}></Layout>
    },
    {
        path: "/transaction",
        element: <Layout children={<AllTransaction />} target={'/transaction'}></Layout>
    },
    {
        path: "/warehouse",
        element: <Layout children={<AllWarehouse />} target={'/warehouse'}></Layout>
    },
    {
        path: "/tag",
        element: <Layout children={<AllTag />} target={'/tag'}></Layout>
    },
    {
        path: "/consulting",
        element: <Layout children={<AllConsulting />} target={'/consulting'}></Layout>
    },
    {
        path: "/customerreview",
        element: <Layout children={<AllReview />} target={'/customerreview'}></Layout>
    },

    {
        path: "/search",
        element: <Layout children={<AllSearch />} target={'/search'}></Layout>
    },
    {
        path: "/view",
        element: <Layout children={<AllView />} target={'/view'}></Layout>
    },
    {
        path: "/customer",
        element: <Layout children={<AllCustomer />} target={'/customer'}></Layout>
    },
    {
        path: "/supplier",
        element: <Layout children={<AllSupplier />} target={'/supplier'}></Layout>
    },

    {
        path: "/goldtype",
        element: <Layout children={<GoldType />} target={'/goldtype'}></Layout>
    },
    {
        path: "/goldtype-item",
        element: <Layout children={<GoldTypeItem />} target={'/goldtype'}></Layout>
    },
    {
        path: "/tpawn",
        element: <Layout children={<AllTempPawn />} target={'/tpawn'}></Layout>
    },
    {
        path: "/tpawn-item",
        element: <Layout children={<TempPawnItem />} target={'/tpawn'}></Layout>
    },
    {
        path: "/tpawn-item/*",
        element: <Layout children={<TempPawnItem />} target={'/tpawn'}></Layout>
    },
    {
        path: "/tpawn-import",
        element: <Layout children={<TempPawnImport />} target={'/tpawn'}></Layout>
    },
    {
        path: "/tgpawn",
        element: <Layout children={<PawnTags />} target={'/tgpawn'}></Layout>
    },
    {
        path: "/whpawn",
        element: <Layout children={<PawnWarehouses />} target={'/whpawn'}></Layout>
    },
    {
        path: "/dash",
        element: <Layout children={<DashBoard />} target={'/dash'}></Layout>
    },
    {
        path: "/fingerprint",
        element: <Layout children={<FingerPrintMajor />} target={'/fingerprint'}></Layout>
    },
    {
        path: "/description",
        element: <Layout children={<AllDescription />} target={'/description'}></Layout>
    },
    {
        path: "/counter",
        element: <Layout children={<AllCounter />} target={'/counter'}></Layout>
    },
    {
        path: "/feature",
        element: <Layout children={<AllFeature />} target={'/feature'}></Layout>
    },
    {
        path: "/*",
        element: <Layout children={<Home />} target={'/'}></Layout>
    }
];
function App() {
    use(initReactI18next).init({
        lng: localStorage.getItem('language') ?? 'vi',
        resources: {
            en: {
                translation: getLanguageData('en')
            },
            vi: {
                translation: getLanguageData('vi')
            }
        }
    })
    const [isReady, setIsReady] = useState(false)
    HttpService.initialize()
    if (!isReady) {
        setTimeout(function () {
            setIsReady(true)
        }, 860)
        return (
            <>
                <PageLoading />
            </>
        )
    }
    return (
        <BrowserRouter>
            <div className='App'>
                <Routes>
                    {pageList.map(page => (
                        <Route key={page.path} path={page.path} element={page.element} />
                    ))}
                </Routes>
            </div>
        </BrowserRouter>
    )
}
export default App
