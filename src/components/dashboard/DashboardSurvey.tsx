import JqxGrid, { jqx } from "jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid";
import 'jqwidgets-scripts/jqwidgets/styles/jqx.base.css';
import 'jqwidgets-scripts/jqwidgets/styles/jqx.bootstrap.css';
import { ApexColumn, ApexDonut } from "../commons/ApexChart";
import Card from "../commons/Card";
//import DashboardIncome from "./DashboardIncome";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { clearRevenueDetailStatus, clearRevenueStatus, retailRevenuesDetail, setDataChartByType, setReportProductTypes, setReportTags } from "../../slices/report/report.slice";
import { Calendar } from "primereact/calendar";
import Income from "../commons/Income";
import { SelectButton } from 'primereact/selectbutton';
import ColorBox from "../commons/ColorBox";
import { dateToYMDFormat, gridCellNumberFormat, isValidAction, toFixedRefactor } from "../../utils/util";
import { Dropdown } from "primereact/dropdown";
import { fetchCategories } from "../../slices/category/category.slice";
import LoadingDiv from "../commons/LoadingDiv";
export default function DashboardSurvey() {
    const dispatch = useAppDispatch()
    const reportState = useAppSelector(state => state.report)
    const categoryState = useAppSelector(state => state.category)
    const limitedActions = useAppSelector((state) => state.sidebar.actions)
    const { productTypes, tags } = reportState
    const { news, olds } = reportState.rawData
    const currentYear = new Date().getFullYear()
    const grid = useRef<any>(null)
    const curentDate = new Date()
    const firstDayOfMonth = new Date(curentDate.getFullYear(), curentDate.getMonth(), 1);
    const [fromdate, setFromdate] = useState(firstDayOfMonth)
    const [todate, setTodate] = useState(curentDate)
    const options = ['QTY', 'WET', 'VAL'];
    const viewOptions = ['GRID', 'CHART',];
    const typeOptions = [{ code: 'GOLDTYPE', name: 'Loại vàng' }, { code: 'PRODUCTTYPE', name: 'Loại sản phẩm' }]
    const levelOptions = [{ value: 0, name: 'Tất cả' }, { value: 1, name: 'Cấp 1' }, { value: 2, name: 'Cấp 2' }, { value: 3, name: 'Cấp 3' }];
    const [selectedType, setSelectedType] = useState('GOLDTYPE')
    const [selectedLevel, setSelectedLevel] = useState(1)
    const [sellGoldTypeChartMode, setSellGoldTypeChartMode] = useState('VAL')
    const [buyGoldTypeChartMode, setBuyGoldTypeChartMode] = useState('VAL')
    const [buyGoldTypeMode, setBuyGoldTypeMode] = useState('CHART')
    const [sellGoldTypeMode, setSellGoldTypeMode] = useState('CHART')
    const [percentGoldTypeMode, setPercentGoldTypeMode] = useState('CHART')
    const [revenueByMonthTypeMode, setRevenueByMonthTypeMode] = useState('CHART')
    const [percentGoldTypeChartMode, setPercentGoldTypeChartMode] = useState('VAL')
    const [percentProductTypeChartMode, setPercentProductTypeChartMode] = useState('VAL')
    const [percentTagChartMode, setPercentTagChartMode] = useState('VAL')
    const [filterChanged, setFilterChanged] = useState(false);
    const filterEnable = isValidAction(limitedActions, "VIE") && (isValidAction(limitedActions, "VPTP") || isValidAction(limitedActions, "VTP") || isValidAction(limitedActions, "VGP") || isValidAction(limitedActions, "VBR") || isValidAction(limitedActions, "VSR") || isValidAction(limitedActions, "VRP"))
    const rateChart = isValidAction(limitedActions, "VIE") && (isValidAction(limitedActions, "VPTP") || isValidAction(limitedActions, "VTP") || isValidAction(limitedActions, "VGP"))
    let years = []
    for (let index = currentYear; index > 2022; index--) {
        years.push(index)

    }
    const [buySource, setBuySource] = useState<any>({
        datatype: "json",
        dataFields: [
            { name: "_id", type: "string" },
            { name: "date", type: "date" },
            { name: "invoice", type: "string" },
            { name: "from", type: "string" },
            { name: "product", type: "string" },
            { name: "gold_type", type: "string" },
            { name: "gold_weight", type: "float" },
            { name: "quantity", type: "int" },
            { name: "exchange", type: "int" },
            { name: "value", type: "float" }
        ],
        id: '_id',
        localData: []
    })
    const [sellSource, setSellSource] = useState<any>({
        datatype: "json",
        dataFields: [
            { name: "_id", type: "string" },
            { name: "date", type: "date" },
            { name: "from", type: "string" },
            { name: "gold_type", type: "string" },
            { name: "gold_weight", type: "float" },
            { name: "exchange_rate", type: "float" },
            { name: "amount", type: "float" },
            { name: "wage", type: "float" },
        ],
        id: '_id',
        localData: []
    })
    const [revenueByMonthsSource, setRevenueByMonthsSource] = useState<any>({
        datatype: "json",
        dataFields: [
            { name: "amount", type: "float" },
            { name: "gold", type: "float" },
            { name: "wage", type: "float" },
            { name: "discount", type: "float" },
        ],
        id: '_id',
        localData: []
    })
    const [columnsRevenueByMonthsType, _setColumnsRevenueByMonthsType] = useState<any>([
        {
            text: 'Doanh thu tổng', align: 'center', datafield: 'amount', cellsalign: 'right', type: 'float',
            cellsrenderer: gridCellNumberFormat,
            cellsformat: 'n'
        },
        {
            text: 'Doanh thu vàng', align: 'center', datafield: 'gold', cellsalign: 'right', type: 'float',
            cellsrenderer: gridCellNumberFormat,
            cellsformat: 'n'
        },
        {
            text: 'Công', align: 'center', datafield: 'wage', cellsalign: 'right', type: 'float',
            cellsrenderer: gridCellNumberFormat,
            cellsformat: 'n'
        },
        {
            text: 'Chiết khấu', align: 'center', datafield: 'discount', cellsalign: 'right', type: 'float',
            cellsrenderer: gridCellNumberFormat,
            cellsformat: 'n'
        },
    ])
    const [percentGoldTypeSource, setPercentGoldTypeSource] = useState<any>({
        datatype: "json",
        dataFields: [
            { name: "type", type: "string" },
            { name: "quantity", type: "float" },
            { name: "weight", type: "float" },
            { name: "amount", type: "float" },
        ],
        localData: []
    })
    const [percentProductTypeSource, setPercentProductTypeSource] = useState<any>({
        datatype: "json",
        dataFields: [
            { name: "type", type: "string" },
            { name: "quantity", type: "float" },
            { name: "weight", type: "float" },
            { name: "amount", type: "float" },
        ],
        localData: []
    })
    const [percentTagTypeSource, setPercentTagTypeSource] = useState<any>({
        datatype: "json",
        dataFields: [
            { name: "type", type: "string" },
            { name: "quantity", type: "float" },
            { name: "weight", type: "float" },
            { name: "amount", type: "float" },
        ],
        localData: []
    })

    const [columnsPercentType, _setColumnsPercentType] = useState<any>([
        { text: 'Loại', align: 'center', datafield: 'type', cellsalign: 'left' },
        { text: 'Số lượng', align: 'center', datafield: 'quantity', cellsalign: 'right' },
        { text: 'Trọng lượng', align: 'center', datafield: 'weight', cellsalign: 'right' },
        { text: 'Doanh thu', align: 'center', datafield: 'amount', cellsalign: 'right' },
    ])
    const [columnsBuy, _setColumnsBuy] = useState<any>([
        { text: 'Ngày', align: 'center', datafield: 'date', cellsalign: 'left', cellsformat: "dd-MM-yyyy", filtertype: "date", width: 75 },
        { text: 'Mã phiếu', align: 'center', datafield: 'invoice', cellsalign: 'left', type: 'string', width: 100, aggregates: ['count'] },
        { text: 'Hình thức', align: 'center', datafield: 'from', cellsalign: 'left', width: 100 },
        { text: 'Loại vàng', align: 'center', datafield: 'gold_type', cellsalign: 'left', width: 100 },
        { text: 'Sản phẩm', align: 'center', datafield: 'product', cellsalign: 'left', type: 'string' },
        {
            text: 'Trọng lượng vàng', align: 'center', datafield: 'gold_weight', cellsalign: 'right', type: 'float', width: 130,
            aggregates: ['sum'],
            aggregatesrenderer: (aggregates: any, _column: any, _element: any): string => {
                const value = aggregates['sum'] !== undefined ? aggregates['sum'] : 0;
                const renderstring = '<div class="w-100 h-100 text-end p-1 fw-bold">' + value + '</div>'
                return renderstring;
            },
            cellsformat: 'f2',
            cellclassname: "fw-bold"
        },
        {
            text: 'Tỷ giá mua', align: 'center', datafield: 'exchange', cellsalign: 'right', type: 'float', width: 100,
            cellsrenderer: gridCellNumberFormat,
            cellsformat: 'n'
        },
        {
            text: 'Giá trị vàng', align: 'center', datafield: 'value', cellsalign: 'right', type: 'float', width: 130,
            aggregates: ['sum'],
            aggregatesrenderer: (aggregates: any, _column: any, _element: any): string => {
                const value = aggregates['sum'] !== undefined ? aggregates['sum'] : 0;
                const renderstring = '<div class="w-100 h-100 text-end p-1 fw-bold text-danger">' + value + '</div>'
                return renderstring;
            },
            cellsrenderer: gridCellNumberFormat,
            cellsformat: 'n',
            cellclassname: "text-danger fw-bold"
        },
    ])
    const [columnsSell, _setColumnsSell] = useState<any>([
        { text: 'Ngày', align: 'center', datafield: 'date', cellsalign: 'left', cellsformat: "dd-MM-yyyy", filtertype: "date", width: 75 },
        { text: 'Hình thức', align: 'center', datafield: 'from', cellsalign: 'left' },
        { text: 'Loại vàng', align: 'center', datafield: 'gold_type', cellsalign: 'left' },
        {
            text: 'Trọng lượng vàng', align: 'center', datafield: 'gold_weight', cellsalign: 'right', aggregates: ['sum'],
            cellclassname: "fw-bold",
            aggregatesrenderer: (aggregates: any, _column: any, _element: any): string => {
                const value = aggregates['sum'] !== undefined ? aggregates['sum'] : 0;
                const renderstring = '<div class="w-100 h-100 text-end p-1 fw-bold">' + value + '</div>'
                return renderstring;
            },
        },
        {
            text: 'Tỷ giá hối đoái', align: 'center', datafield: 'exchange_rate', cellsalign: 'right', type: 'float',
            aggregates: ['sum'],
            aggregatesrenderer: (aggregates: any, _column: any, _element: any): string => {
                const value = aggregates['sum'] !== undefined ? aggregates['sum'] : 0;
                const renderstring = '<div class="w-100 h-100 text-end p-1 fw-bold">' + value + '</div>'
                return renderstring;
            },
            cellsrenderer: gridCellNumberFormat,
            cellsformat: 'n',
            cellclassname: "fw-bold",
        },
        {
            text: 'Doanh thu', align: 'center', datafield: 'amount', cellsalign: 'right', type: 'float',
            aggregates: ['sum'],
            aggregatesrenderer: (aggregates: any, _column: any, _element: any): string => {
                const value = aggregates['sum'] !== undefined ? aggregates['sum'] : 0;
                const renderstring = '<div class="w-100 h-100 text-end p-1 fw-bold text-danger">' + value + '</div>'
                return renderstring;
            },
            cellsrenderer: gridCellNumberFormat,
            cellclassname: "text-danger fw-bold",
            cellsformat: 'n'
        },
        {
            text: 'Tiền công', align: 'center', datafield: 'wage', cellsalign: 'right', type: 'float',
            aggregates: ['sum'],
            aggregatesrenderer: (aggregates: any, _column: any, _element: any): string => {
                const value = aggregates['sum'] !== undefined ? aggregates['sum'] : 0;
                const renderstring = '<div class="w-100 h-100 text-end p-1 fw-bold">' + value + '</div>'
                return renderstring;
            },
            cellsrenderer: gridCellNumberFormat,
            cellsformat: 'n',
            cellclassname: "fw-bold",
        },
    ])
    const selectTemplate = (option: any) => {
        let icon = ''
        switch (option) {
            case 'VAL':
                icon = 'ri-money-dollar-circle-line'
                break;
            case 'WET':
                icon = 'ri-weight-line'
                break;

            case 'CHART':
                icon = 'ri-bar-chart-2-line'
                break;
            case 'GRID':
                icon = 'ri-layout-grid-2-line'
                break;
            default:
                icon = 'ri-coin-line'
                break;
        }
        return <i className={icon}></i>;
    }
    const fetchList = () => {
        dispatch(retailRevenuesDetail({ from: dateToYMDFormat(fromdate, '-', 0), to: dateToYMDFormat(todate, '-', 1) }))
    }
    useEffect(() => {
        dispatch(setDataChartByType({ type: selectedType, level: selectedLevel }))
    }, [selectedType, selectedLevel])

    useEffect(() => {
        if (reportState.revenueStatus) {
            switch (reportState.revenueStatus.status) {
                case "completed":
                    setBuySource(reportState.buyData)
                    setSellSource(reportState.rawData.news)
                    setPercentGoldTypeSource(reportState.percentGoldTypes)
                    setPercentProductTypeSource(reportState.percentProductTypes)
                    setPercentTagTypeSource(reportState.percentTags)
                    setRevenueByMonthsSource(reportState.revenueByMonths)
                    setTimeout(() => {
                        if (grid.current !== null) {
                            grid.current.updatebounddata('cells')
                        }
                    }, 300)
                    dispatch(clearRevenueStatus())
                    setFilterChanged(false)
                    break;
            }
        }
    }, [reportState.revenueStatus])

    useEffect(() => {
        if (reportState.revenueDetailStatus) {
            switch (reportState.revenueDetailStatus.status) {
                case "completed":
                    buySource.localData = reportState.buyData
                    percentGoldTypeSource.localData = reportState.percentGoldTypes
                    percentProductTypeSource.localData = reportState.percentProductTypes
                    percentTagTypeSource.localData = reportState.percentTags
                    sellSource.localData = reportState.rawData.news
                    revenueByMonthsSource.localData = reportState.revenueByMonths
                    setBuySource(buySource)
                    setSellSource(sellSource)
                    setPercentGoldTypeSource(percentGoldTypeSource)
                    setPercentProductTypeSource(percentProductTypeSource)
                    setPercentTagTypeSource(percentTagTypeSource)
                    setRevenueByMonthsSource(revenueByMonthsSource)
                    setTimeout(() => {
                        if (grid.current !== null) {
                            grid.current.updatebounddata('cells')
                        }
                    }, 300)
                    dispatch(clearRevenueDetailStatus())
                    break;

            }
        }
    }, [reportState.revenueDetailStatus])
    useEffect(() => {
        fetchList()
        dispatch(fetchCategories({ categories: ["product_types", "tags"] }))
    }, [])
    useEffect(() => {
        switch (categoryState.status) {
            case 'completed':
                dispatch(setReportProductTypes(categoryState.data.product_types ?? []))
                dispatch(setReportTags(categoryState.data.tags ?? []))
                break;
        }
    }, [categoryState.status])

    return (
        <>
            {filterEnable && <div className='col-sm-12'>
                <div className='w-100 bg-white row p-2 fs-6 mb-3' style={{ borderRadius: 20 }}>
                    <div className="col-sm-3 fami-text-primary pt-1 fs-5"><i className="ri-line-chart-line"></i> THỐNG KÊ</div>
                    <div className="col-sm-9 d-flex flex-wrap gap-3 align-items-center justify-content-end">
                        <div className="d-flex gap-3 align-items-center">
                            <span>Từ ngày</span>
                            <Calendar
                                dateFormat="dd/mm/yy"
                                value={fromdate}
                                onChange={(e) => {
                                    setFromdate(e.target.value as Date)
                                    setFilterChanged(true)
                                }}
                                placeholder="Từ ngày"
                                style={{ width: 130, borderRadius: "10px" }}
                            />
                        </div>
                        <div className="d-flex gap-3 align-items-center">
                            <span>Đến ngày</span>
                            <Calendar
                                dateFormat="dd/mm/yy"
                                value={todate}
                                onChange={(e) => {
                                    setFilterChanged(true)
                                    setTodate(e.target.value as Date)

                                }}
                                placeholder="Đến ngày"
                                style={{ width: 130, borderRadius: "10px" }}
                            />
                        </div>

                        <button

                            disabled={!filterChanged}
                            className='btn btn-primary' onClick={() => {
                                fetchList()
                            }
                            }>
                            <i className="ri-check-double-line"></i> Áp dụng</button>
                    </div>
                </div>
            </div>
            }
            {isValidAction(limitedActions, "VBR") && isValidAction(limitedActions, "VIE") && <div className="col-sm-12">
                <Card
                    body={<>
                        {buyGoldTypeMode === 'CHART' && <>
                            <div className='row text-center pt-4'>
                                <Income
                                    icon="ri-coin-line"
                                    className={'col-sm-4'}
                                    value={olds.reduce((sum, el) => sum += el.trading_type === "TRADE" ? 1 : 0, 0)}
                                    currency={' món'}
                                    title={<>Số lượng</>}
                                />
                                <Income
                                    icon="ri-weight-line"
                                    className={'col-sm-4'}
                                    value={reportState.buyGroupByGoldType.reduce((sum, el) => sum += el.weight, 0)}
                                    currency={' Li'}
                                    title={<>Trọng lượng vàng</>}
                                />
                                <Income
                                    rounded
                                    className={'col-sm-4'}
                                    value={reportState.buyGroupByGoldType.reduce((sum, el) => sum += el.amount, 0)}
                                    currency={'đ'}
                                    title={<>Giá trị</>}
                                />
                            </div>
                            <ColorBox
                                body={<>
                                    <div className="w-100 d-flex flex-wrap gap-3 justify-content-between p-2 align-items-center" >
                                        <div className="fs-6 fw-bold second-primary-color">Loại Vàng</div>
                                        <SelectButton className="module icon-select" itemTemplate={selectTemplate} value={buyGoldTypeChartMode} onChange={(e) => setBuyGoldTypeChartMode(e.value)} options={options} />

                                    </div>
                                    {buyGoldTypeChartMode === "QTY" && <ApexColumn
                                        options={{
                                            plotOptions: {
                                                bar: {
                                                    horizontal: false,
                                                    columnWidth: '55%',
                                                    endingShape: 'rounded',
                                                    borderRadius: 10,
                                                    dataLabels: {
                                                        position: 'top',
                                                    },
                                                }
                                            },
                                            dataLabels: {
                                                enabled: true,
                                                offsetY: -20,
                                                style: {
                                                    fontSize: '11px',
                                                    colors: ["#304758"]
                                                }
                                            },
                                            xaxis: {
                                                type: "string",
                                                categories: reportState.buyGroupByGoldType.map((e) => e.type),

                                            },
                                            yaxis: {
                                                title: {
                                                    text: "Món"
                                                },
                                                labels: {
                                                    formatter: function (y: any) {
                                                        return y;
                                                    }
                                                }
                                            },
                                            colors: [
                                                "#FFCC18"
                                            ]
                                        }}

                                        series={[{

                                            name: "Số lượng",
                                            data: reportState.buyGroupByGoldType.map((e) => e.quantity)
                                        },
                                        ]
                                        }

                                    />}
                                    {buyGoldTypeChartMode === "WET" && <ApexColumn
                                        options={{
                                            plotOptions: {
                                                bar: {
                                                    horizontal: false,
                                                    columnWidth: '55%',
                                                    endingShape: 'rounded',
                                                    borderRadius: 10,
                                                    dataLabels: {
                                                        position: 'top',
                                                    },
                                                }
                                            },
                                            dataLabels: {
                                                enabled: true,
                                                offsetY: -20,
                                                style: {
                                                    fontSize: '11px',
                                                    colors: ["#304758"]
                                                }
                                            },
                                            xaxis: {
                                                type: "string",
                                                categories: reportState.buyGroupByGoldType.map((e) => e.type),

                                            },
                                            yaxis: {
                                                title: {
                                                    text: "Li"
                                                },
                                                labels: {
                                                    formatter: function (y: any) {
                                                        return y;
                                                    }
                                                }
                                            },
                                            colors: [
                                                "#FFCC18"
                                            ]
                                        }}

                                        series={[{

                                            name: "Trọng lượng",
                                            data: reportState.buyGroupByGoldType.map((e) => toFixedRefactor(e.weight, 3))
                                        },
                                        ]
                                        }

                                    />}
                                    {buyGoldTypeChartMode === "VAL" && <ApexColumn
                                        options={{
                                            plotOptions: {
                                                bar: {
                                                    horizontal: false,
                                                    columnWidth: '55%',
                                                    endingShape: 'rounded',
                                                    borderRadius: 10,
                                                    dataLabels: {
                                                        position: 'top',
                                                    },
                                                }
                                            },
                                            dataLabels: {
                                                enabled: true,
                                                offsetY: -20,
                                                formatter: function (x: any) {
                                                    return Number(x).toLocaleString('de-DE');
                                                },
                                                style: {
                                                    fontSize: '11px',
                                                    colors: ["#304758"],

                                                },

                                            },
                                            xaxis: {
                                                type: "string",
                                                categories: reportState.buyGroupByGoldType.map((e) => e.type),


                                            },
                                            yaxis: {
                                                title: {
                                                    text: "Triệu đồng"
                                                },
                                                labels: {
                                                    formatter: function (y: any) {
                                                        return y;
                                                    }
                                                }
                                            },
                                            colors: [
                                                "#FFCC18"
                                            ]
                                        }}

                                        series={[{
                                            name: "Giá trị",
                                            data: reportState.buyGroupByGoldType.map((e) => Number((e.amount / 1000000).toFixed(3)))
                                        },
                                        ]
                                        }

                                    />}
                                </>}
                                className="bg-white"
                            />
                        </>
                        }
                        {buyGoldTypeMode === 'GRID' && <>
                            <LoadingDiv
                                className="pt-2 z-0"
                                loading={reportState.revenueStatus.status === "loading"}
                                body={<JqxGrid
                                    disabled={reportState.revenueStatus.status === "loading"}
                                    ref={grid}
                                    theme="bootstrap"
                                    width={"100%"}
                                    height={300}
                                    filterable={true}
                                    showfilterrow={true}
                                    showsortmenuitems={false}
                                    source={new jqx.dataAdapter(buySource)}
                                    columns={columnsBuy}
                                    showaggregates={true} showstatusbar={true} statusbarheight={25}
                                    localization={{ emptydatastring: 'Không có dữ liệu', decimalseparator: ',', thousandsseparator: '.', }}
                                    pageable={false} autoheight={false} sortable={true} altrows={true}
                                    enabletooltips={false} editable={false} selectionmode={'singlerow'}
                                />} />
                        </>}

                    </>}
                    tool={<><SelectButton className="module icon-select" itemTemplate={selectTemplate} value={buyGoldTypeMode} onChange={(e) => setBuyGoldTypeMode(e.value)} options={viewOptions} /></>}
                    title={<><i className="ri-shopping-bag-3-line"></i> Tổng Mua vào</>}
                    isPadding={true}
                />
            </div>
            }
            {isValidAction(limitedActions, "VSR") && isValidAction(limitedActions, "VIE") && <div className="col-sm-12">
                <Card
                    body={
                        <>
                            {
                                sellGoldTypeMode === "CHART" &&
                                <>
                                    <div className='row text-center pt-4'>
                                        <Income
                                            icon="ri-coin-line"
                                            className={'col-sm-4'}
                                            value={news.length}
                                            currency={' món'}
                                            title={<>Số lượng</>}
                                        />
                                        <Income
                                            icon="ri-weight-line"
                                            className={'col-sm-4'}
                                            value={news.reduce((sum, el) => sum += (el.unit === "GRAM" ? el.final_weight * 0.375 : el.final_weight), 0)}
                                            currency={' Li'}
                                            title={<>Trọng lượng vàng</>}
                                        />
                                        <Income
                                            rounded
                                            className={'col-sm-4'}
                                            value={news.reduce((sum, el) => sum += el.amount, 0)}
                                            currency={'đ'}
                                            title={<>Doanh thu</>}
                                        />
                                    </div>
                                    <ColorBox
                                        body={<>
                                            <div className="w-100 d-flex flex-wrap gap-3 justify-content-between p-2 align-items-center" >
                                                <div className="d-flex gap-3">
                                                    <Dropdown
                                                        style={{ width: 150 }}
                                                        options={typeOptions}
                                                        value={selectedType}
                                                        optionLabel="name"
                                                        optionValue="code"
                                                        onChange={(e) => { setSelectedType(e.value) }}
                                                    />
                                                    {selectedType === "PRODUCTTYPE" && <Dropdown
                                                        style={{ width: 100 }}
                                                        options={levelOptions}
                                                        value={selectedLevel}
                                                        optionLabel="name"
                                                        optionValue="value"
                                                        onChange={(e) => { setSelectedLevel(e.value) }}
                                                    />}
                                                </div>

                                                <SelectButton className="module icon-select" itemTemplate={selectTemplate} value={sellGoldTypeChartMode} onChange={(e) => setSellGoldTypeChartMode(e.value)} options={options} />

                                            </div>
                                            {sellGoldTypeChartMode === "QTY" && <ApexColumn
                                                options={{
                                                    plotOptions: {
                                                        bar: {
                                                            horizontal: false,
                                                            columnWidth: '55%',
                                                            endingShape: 'rounded',
                                                            borderRadius: 10,
                                                            dataLabels: {
                                                                position: 'top',
                                                            },
                                                        }
                                                    },
                                                    dataLabels: {
                                                        enabled: true,
                                                        offsetY: -20,
                                                        style: {
                                                            fontSize: '11px',
                                                            colors: ["#304758"]
                                                        }
                                                    },
                                                    xaxis: {
                                                        type: "string",
                                                        categories: reportState.sellGroupByGoldType.map((e) => selectedType === "PRODUCTTYPE" && productTypes.find(i => i.code === e.type) ? productTypes.find(i => i.code === e.type)?.name : e.type),

                                                    },
                                                    yaxis: {
                                                        title: {
                                                            text: "Món"
                                                        },
                                                        labels: {
                                                            formatter: function (y: any) {
                                                                return y;
                                                            }
                                                        }
                                                    },
                                                    colors: [
                                                        "#283673"
                                                    ]
                                                }
                                                }

                                                series={[{

                                                    name: "Số lượng",
                                                    data: reportState.sellGroupByGoldType.map((e) => e.quantity)
                                                },
                                                ]
                                                }

                                            />}
                                            {sellGoldTypeChartMode === "WET" && <ApexColumn
                                                options={{
                                                    plotOptions: {
                                                        bar: {
                                                            horizontal: false,
                                                            columnWidth: '55%',
                                                            endingShape: 'rounded',
                                                            borderRadius: 10,
                                                            dataLabels: {
                                                                position: 'top',
                                                            },
                                                        }
                                                    },
                                                    dataLabels: {
                                                        enabled: true,
                                                        offsetY: -20,
                                                        style: {
                                                            fontSize: '11px',
                                                            colors: ["#304758"]
                                                        }
                                                    },
                                                    xaxis: {
                                                        type: "string",
                                                        categories: reportState.sellGroupByGoldType.map((e) => selectedType === "PRODUCTTYPE" && productTypes.find(i => i.code === e.type) ? productTypes.find(i => i.code === e.type)?.name : e.type),

                                                    },
                                                    yaxis: {
                                                        title: {
                                                            text: "Li"
                                                        },
                                                        labels: {
                                                            formatter: function (y: any) {
                                                                return y;
                                                            }
                                                        }
                                                    },
                                                    colors: [
                                                        "#283673"
                                                    ]
                                                }
                                                }

                                                series={[{

                                                    name: "Trọng lượng",
                                                    data: reportState.sellGroupByGoldType.map((e) => Number(e.weight.toFixed(3)))
                                                },
                                                ]
                                                }

                                            />}
                                            {sellGoldTypeChartMode === "VAL" && <ApexColumn
                                                options={{
                                                    plotOptions: {
                                                        bar: {
                                                            horizontal: false,
                                                            columnWidth: '55%',
                                                            endingShape: 'rounded',
                                                            borderRadius: 10,
                                                            dataLabels: {
                                                                position: 'top',
                                                            },
                                                        }
                                                    },
                                                    dataLabels: {
                                                        enabled: true,
                                                        offsetY: -20,
                                                        formatter: function (x: any) {
                                                            return Number(x).toLocaleString('de-DE');
                                                        },
                                                        style: {
                                                            fontSize: '11px',
                                                            colors: ["#304758"]
                                                        }
                                                    },
                                                    xaxis: {
                                                        type: "string",
                                                        categories: reportState.sellGroupByGoldType.map((e) => selectedType === "PRODUCTTYPE" && productTypes.find(i => i.code === e.type) ? productTypes.find(i => i.code === e.type)?.name : e.type),

                                                    },
                                                    yaxis: {
                                                        title: {
                                                            text: "Triệu đồng"
                                                        },
                                                        labels: {
                                                            formatter: function (y: any) {
                                                                return y;
                                                            }
                                                        }
                                                    },
                                                    colors: [
                                                        "#283673"
                                                    ]
                                                }
                                                }

                                                series={[{
                                                    name: "Giá trị",
                                                    data: reportState.sellGroupByGoldType.map((e) => Number((e.amount / 1000000).toFixed(3)))
                                                },
                                                ]
                                                }

                                            />}
                                        </>}
                                        className="bg-white"
                                    />
                                </>
                            }
                            {sellGoldTypeMode === 'GRID' && <>
                                <LoadingDiv
                                    className="pt-2 z-0"
                                    loading={reportState.revenueStatus.status === "loading"}
                                    body={<JqxGrid
                                        disabled={reportState.revenueStatus.status === "loading"}
                                        ref={grid}
                                        theme="bootstrap"
                                        width={"100%"}
                                        height={300}
                                        filterable={true}
                                        showfilterrow={true}
                                        showsortmenuitems={false}
                                        source={new jqx.dataAdapter(sellSource)}
                                        columns={columnsSell}
                                        showaggregates={true} showstatusbar={true} statusbarheight={25}
                                        localization={{ emptydatastring: 'Không có dữ liệu', decimalseparator: ',', thousandsseparator: '.', }}
                                        pageable={false} autoheight={false} sortable={true} altrows={true}
                                        enabletooltips={false} editable={false} selectionmode={'singlerow'}
                                    />} />
                            </>}
                        </>
                    }
                    tool={<><SelectButton className="module icon-select" itemTemplate={selectTemplate} value={sellGoldTypeMode} onChange={(e) => setSellGoldTypeMode(e.value)} options={viewOptions} /></>}
                    title={<><i className="ri-hand-coin-line"></i> Tổng Bán ra</>}
                    isPadding={true}
                />
            </div>
            }
            {rateChart && <div className="col-sm-12">
                <Card
                    body={<>
                        {
                            percentGoldTypeMode === "CHART" &&
                            <div className="row pt-2">
                                {isValidAction(limitedActions, "VPTP") && isValidAction(limitedActions, "VIE") && <div className={`col-sm-${reportState.percentProductTypes.map((e) => e.type).length > 10 ? 12 : 6} mb-3`}>
                                    <ColorBox body={<>
                                        <div className="w-100 d-flex flex-wrap gap-3 justify-content-between p-2 align-items-center" >
                                            <div className="d-flex gap-3 align-items-center">
                                                <div className="fs-6 fw-bold second-primary-color">Loại Sản Phẩm</div>
                                                <Dropdown
                                                    style={{ width: 100 }}
                                                    options={levelOptions}
                                                    value={selectedLevel}
                                                    optionLabel="name"
                                                    optionValue="value"
                                                    onChange={(e) => { setSelectedLevel(e.value) }}
                                                />
                                            </div>

                                            <SelectButton className="module icon-select" itemTemplate={selectTemplate} value={percentProductTypeChartMode} onChange={(e) => setPercentProductTypeChartMode(e.value)} options={options} />

                                        </div>
                                        {percentProductTypeChartMode === "QTY" &&
                                            <ApexDonut
                                                options={
                                                    {
                                                        dataLabels: {
                                                            enabled: true,
                                                            formatter: function (val: any) {
                                                                return Number(val).toLocaleString('de-DE') + "%"
                                                            }
                                                        },
                                                        responsive: [
                                                            {
                                                                breakpoint: 480,
                                                                options: {

                                                                    legend: {
                                                                        position: 'bottom'
                                                                    }
                                                                }
                                                            }],
                                                        labels: reportState.percentProductTypes.map((e) => productTypes.find(i => i.code === e.type) ? productTypes.find(i => i.code === e.type)?.name : e.type)
                                                    }
                                                }
                                                series={reportState.percentProductTypes.map((e) => e.quantity)}
                                            />
                                        }
                                        {percentProductTypeChartMode === "WET" &&
                                            <ApexDonut
                                                options={
                                                    {
                                                        dataLabels: {
                                                            enabled: true,
                                                            formatter: function (val: any) {
                                                                return Number(val).toLocaleString('de-DE') + "%"
                                                            }
                                                        },
                                                        responsive: [
                                                            {
                                                                breakpoint: 480,
                                                                options: {

                                                                    legend: {
                                                                        position: 'bottom'
                                                                    }
                                                                }
                                                            }],
                                                        labels: reportState.percentProductTypes.map((e) => productTypes.find(i => i.code === e.type) ? productTypes.find(i => i.code === e.type)?.name : e.type)
                                                    }
                                                }
                                                series={reportState.percentProductTypes.map((e) => e.weight)}
                                            />
                                        }
                                        {percentProductTypeChartMode === "VAL" &&
                                            <ApexDonut
                                                options={
                                                    {
                                                        dataLabels: {
                                                            enabled: true,
                                                            formatter: function (val: any) {
                                                                return Number(val).toLocaleString('de-DE') + "%"
                                                            }
                                                        },
                                                        responsive: [
                                                            {
                                                                breakpoint: 480,
                                                                options: {

                                                                    legend: {
                                                                        position: 'bottom'
                                                                    }
                                                                }
                                                            }],
                                                        labels: reportState.percentProductTypes.map((e) => productTypes.find(i => i.code === e.type) ? productTypes.find(i => i.code === e.type)?.name : e.type)
                                                    }
                                                }
                                                series={reportState.percentProductTypes.map((e) => e.amount)}
                                            />
                                        }
                                    </>}
                                        className="h-100"
                                    />
                                </div>
                                }
                                {isValidAction(limitedActions, "VTP") && isValidAction(limitedActions, "VIE") && <div className={`col-sm-${reportState.percentTags.map((e) => e.type).length > 10 ? 12 : 6} mb-3`}>
                                    <ColorBox body={<>
                                        <div className="w-100 d-flex flex-wrap gap-3 justify-content-between p-2 align-items-center" >
                                            <div className="fs-6 fw-bold second-primary-color">Thẻ</div>
                                            <SelectButton className="module icon-select" itemTemplate={selectTemplate} value={percentTagChartMode} onChange={(e) => setPercentTagChartMode(e.value)} options={options} />

                                        </div>
                                        {percentTagChartMode === "QTY" &&
                                            <ApexDonut
                                                options={
                                                    {
                                                        dataLabels: {
                                                            enabled: true,
                                                            formatter: function (val: any) {
                                                                return Number(val).toLocaleString('de-DE') + "%"
                                                            }
                                                        },
                                                        responsive: [
                                                            {
                                                                breakpoint: 480,
                                                                options: {

                                                                    legend: {
                                                                        position: 'bottom'
                                                                    }
                                                                }
                                                            }],
                                                        labels: reportState.percentTags.map((e) => tags.find(i => i.code === e.type) ? tags.find(i => i.code === e.type)?.name : e.type)
                                                    }
                                                }
                                                series={reportState.percentTags.map((e) => e.quantity)}
                                            />
                                        }
                                        {percentTagChartMode === "WET" &&
                                            <ApexDonut
                                                options={
                                                    {
                                                        dataLabels: {
                                                            enabled: true,
                                                            formatter: function (val: any) {
                                                                return Number(val).toLocaleString('de-DE') + "%"
                                                            }
                                                        },
                                                        responsive: [
                                                            {
                                                                breakpoint: 480,
                                                                options: {

                                                                    legend: {
                                                                        position: 'bottom'
                                                                    }
                                                                }
                                                            }],
                                                        labels: reportState.percentTags.map((e) => tags.find(i => i.code === e.type) ? tags.find(i => i.code === e.type)?.name : e.type)
                                                    }
                                                }
                                                series={reportState.percentTags.map((e) => e.weight)}
                                            />
                                        }
                                        {percentTagChartMode === "VAL" &&
                                            <ApexDonut
                                                options={
                                                    {
                                                        dataLabels: {
                                                            enabled: true,
                                                            formatter: function (val: any) {
                                                                return Number(val).toLocaleString('de-DE') + "%"
                                                            }
                                                        },
                                                        responsive: [
                                                            {
                                                                breakpoint: 480,
                                                                options: {

                                                                    legend: {
                                                                        position: 'bottom'
                                                                    }
                                                                }
                                                            }],
                                                        labels: reportState.percentTags.map((e) => tags.find(i => i.code === e.type) ? tags.find(i => i.code === e.type)?.name : e.type)
                                                    }
                                                }
                                                series={reportState.percentTags.map((e) => e.amount)}
                                            />
                                        }
                                    </>}
                                        className="h-100"
                                    />
                                </div>
                                }
                                {isValidAction(limitedActions, "VGP") && isValidAction(limitedActions, "VIE") && <div className={`col-sm-${reportState.percentGoldTypes.map((e) => e.type).length > 10 ? 12 : 6} mb-3`}>
                                    <ColorBox body={<>
                                        <div className="w-100 d-flex flex-wrap gap-3 justify-content-between p-2 align-items-center" >
                                            <div className="fs-6 fw-bold second-primary-color">Loại Vàng</div>
                                            <SelectButton className="module icon-select" itemTemplate={selectTemplate} value={percentGoldTypeChartMode} onChange={(e) => setPercentGoldTypeChartMode(e.value)} options={options} />

                                        </div>
                                        {percentGoldTypeChartMode === "QTY" &&
                                            <ApexDonut
                                                options={
                                                    {
                                                        dataLabels: {
                                                            enabled: true,
                                                            formatter: function (val: any) {
                                                                return Number(val).toLocaleString('de-DE') + "%"
                                                            }
                                                        },
                                                        responsive: [
                                                            {
                                                                breakpoint: 480,
                                                                options: {

                                                                    legend: {
                                                                        position: 'bottom'
                                                                    }
                                                                }
                                                            }],
                                                        labels: reportState.percentGoldTypes.map((e) => e.type)
                                                    }
                                                }
                                                series={reportState.percentGoldTypes.map((e) => e.quantity)}
                                            />
                                        }
                                        {percentGoldTypeChartMode === "WET" &&
                                            <ApexDonut
                                                options={
                                                    {
                                                        dataLabels: {
                                                            enabled: true,
                                                            formatter: function (val: any) {
                                                                return Number(val).toLocaleString('de-DE') + "%"
                                                            }
                                                        },
                                                        responsive: [
                                                            {
                                                                breakpoint: 480,
                                                                options: {

                                                                    legend: {
                                                                        position: 'bottom'
                                                                    }
                                                                }
                                                            }],
                                                        labels: reportState.percentGoldTypes.map((e) => e.type)
                                                    }
                                                }
                                                series={reportState.percentGoldTypes.map((e) => e.quantity)}
                                            />
                                        }
                                        {percentGoldTypeChartMode === "VAL" &&
                                            <ApexDonut
                                                options={
                                                    {
                                                        dataLabels: {
                                                            enabled: true,
                                                            formatter: function (val: any) {
                                                                return Number(val).toLocaleString('de-DE') + "%"
                                                            }
                                                        },
                                                        responsive: [
                                                            {
                                                                breakpoint: 480,
                                                                options: {

                                                                    legend: {
                                                                        position: 'bottom'
                                                                    }
                                                                }
                                                            }],
                                                        labels: reportState.percentGoldTypes.map((e) => e.type)
                                                    }
                                                }
                                                series={reportState.percentGoldTypes.map((e) => e.amount)}
                                            />
                                        }
                                    </>}
                                        className="h-100"
                                    />
                                </div>
                                }
                            </div>
                        }
                        {percentGoldTypeMode === 'GRID' && <>
                            <LoadingDiv
                                className="pt-2 z-0"
                                loading={reportState.revenueStatus.status === "loading"}
                                body={<JqxGrid
                                    disabled={reportState.revenueStatus.status === "loading"}
                                    ref={grid}
                                    theme="bootstrap"
                                    width={"100%"}
                                    height={300}
                                    filterable={true}
                                    showfilterrow={true}
                                    showsortmenuitems={false}
                                    source={new jqx.dataAdapter(percentProductTypeSource)}
                                    columns={columnsPercentType}
                                    showaggregates={true} showstatusbar={true} statusbarheight={25}
                                    localization={{ emptydatastring: 'Không có dữ liệu', decimalseparator: ',', thousandsseparator: '.', }}
                                    pageable={false} autoheight={false} sortable={true} altrows={true}
                                    enabletooltips={false} editable={false} selectionmode={'singlerow'}
                                />} />
                            <LoadingDiv
                                className="pt-2 z-0"
                                loading={reportState.revenueStatus.status === "loading"}
                                body={<JqxGrid
                                    disabled={reportState.revenueStatus.status === "loading"}
                                    ref={grid}
                                    theme="bootstrap"
                                    width={"100%"}
                                    height={300}
                                    filterable={true}
                                    showfilterrow={true}
                                    showsortmenuitems={false}
                                    source={new jqx.dataAdapter(percentTagTypeSource)}
                                    columns={columnsPercentType}
                                    showaggregates={true} showstatusbar={true} statusbarheight={25}
                                    localization={{ emptydatastring: 'Không có dữ liệu', decimalseparator: ',', thousandsseparator: '.', }}
                                    pageable={false} autoheight={false} sortable={true} altrows={true}
                                    enabletooltips={false} editable={false} selectionmode={'singlerow'}
                                />} />

                            <LoadingDiv
                                className="pt-2 z-0"
                                loading={reportState.revenueStatus.status === "loading"}
                                body={<JqxGrid
                                    disabled={reportState.revenueStatus.status === "loading"}
                                    ref={grid}
                                    theme="bootstrap"
                                    width={"100%"}
                                    height={300}
                                    filterable={true}
                                    showfilterrow={true}
                                    showsortmenuitems={false}
                                    source={new jqx.dataAdapter(percentGoldTypeSource)}
                                    columns={columnsPercentType}
                                    showaggregates={true} showstatusbar={true} statusbarheight={25}
                                    localization={{ emptydatastring: 'Không có dữ liệu', decimalseparator: ',', thousandsseparator: '.', }}
                                    pageable={false} autoheight={false} sortable={true} altrows={true}
                                    enabletooltips={false} editable={false} selectionmode={'singlerow'}
                                />} />
                        </>}
                    </>}
                    tool={<><SelectButton className="module icon-select" itemTemplate={selectTemplate} value={percentGoldTypeMode} onChange={(e) => setPercentGoldTypeMode(e.value)} options={viewOptions} /></>}
                    title={<><i className="ri-percent-line"></i> Tỷ trọng bán ra</>}
                    isPadding={true}
                />
            </div>
            }
            {isValidAction(limitedActions, "VRP") && isValidAction(limitedActions, "VIE") && <div className="col-sm-12">
                <Card
                    body={
                        <>
                            {
                                revenueByMonthTypeMode === "CHART" &&
                                <div className="pt-3">
                                    <ColorBox body={<>
                                        <div className='row text-center pt-4'>
                                            <Income
                                                className={'col-sm-3'}
                                                value={reportState.revenueByMonths.reduce((sum, el) => sum += el.amount, 0)}
                                                currency={'đ'}
                                                title={<>Doanh thu tổng</>}
                                            />
                                            <Income
                                                className={'col-sm-3'}
                                                value={reportState.revenueByMonths.reduce((sum, el) => sum += el.gold, 0)}
                                                currency={'đ'}
                                                title={<>Doanh thu vàng</>}
                                            />
                                            <Income
                                                className={'col-sm-3'}
                                                value={reportState.revenueByMonths.reduce((sum, el) => sum += el.wage, 0)}
                                                currency={'đ'}
                                                title={<>Công</>}
                                            />
                                            <Income
                                                className={'col-sm-3'}
                                                value={reportState.revenueByMonths.reduce((sum, el) => sum += el.discount, 0)}
                                                currency={'đ'}
                                                title={<>Chiết khấu</>}
                                            />
                                        </div>
                                        <ApexColumn
                                            options={{
                                                plotOptions: {
                                                    bar: {
                                                        horizontal: false,
                                                        columnWidth: '55%',
                                                        endingShape: 'rounded',
                                                        borderRadius: 10,
                                                        dataLabels: {
                                                            position: 'top',
                                                        },
                                                    }
                                                },
                                                dataLabels: {
                                                    enabled: true,
                                                    offsetY: -20,
                                                    formatter: function (x: any) {
                                                        return Number(x).toLocaleString('de-DE');
                                                    },
                                                    style: {
                                                        fontSize: '11px',
                                                        colors: ["#304758"]
                                                    }
                                                },
                                                xaxis: {
                                                    type: "string",
                                                    categories: reportState.revenueByMonths.map((e) => e.month),

                                                },
                                                yaxis: {
                                                    title: {
                                                        text: "Triệu đồng"
                                                    },
                                                    labels: {
                                                        formatter: function (y: any) {
                                                            return Number(y.toFixed(3));
                                                        }
                                                    }
                                                },
                                                colors: [
                                                    "#283673",
                                                    "#FFCC18",
                                                    "#00E396",
                                                    "#FF4560"
                                                ]
                                            }
                                            }
                                            series={[
                                                {
                                                    name: "Doanh thu tổng",
                                                    data: reportState.revenueByMonths.map((e) => Number((e.amount / 1000000).toFixed(3)))
                                                },
                                                {
                                                    name: "Doanh thu vàng",
                                                    data: reportState.revenueByMonths.map((e) => Number((e.gold / 1000000).toFixed(3)))
                                                },
                                                {
                                                    name: "Công",
                                                    data: reportState.revenueByMonths.map((e) => Number((e.wage / 1000000).toFixed(3)))
                                                },
                                                {
                                                    name: "Chiết khấu",
                                                    data: reportState.revenueByMonths.map((e) => Number((e.discount / 1000000).toFixed(3)))
                                                }
                                            ]
                                            }
                                        />
                                    </>}
                                    />
                                    <ColorBox
                                        className="mt-3"
                                        body={<>
                                            <div className='row text-center pt-4'>
                                                <Income
                                                    className={'col-sm-3'}
                                                    value={reportState.revenues && reportState.revenues.reduce((sum: any, el: any) => sum += el.website, 0)}
                                                    currency={'đ'}
                                                    title={<>Website</>}
                                                />
                                                <Income
                                                    className={'col-sm-3'}
                                                    value={reportState.revenues && reportState.revenues.reduce((sum: any, el: any) => sum += el.sell, 0)}
                                                    currency={'đ'}
                                                    title={<>Bán</>}
                                                />
                                                <Income
                                                    className={'col-sm-3'}
                                                    value={reportState.revenues && reportState.revenues.reduce((sum: any, el: any) => sum += el.buy, 0)}
                                                    currency={'đ'}
                                                    title={<>Mua</>}
                                                />
                                                <Income
                                                    className={'col-sm-3'}
                                                    value={reportState.revenues && reportState.revenues.reduce((sum: any, el: any) => sum += el.exchange, 0)}
                                                    currency={'đ'}
                                                    title={<>Đổi</>}
                                                />
                                            </div>
                                            <ApexColumn
                                                options={{
                                                    chart: {
                                                        id: "dash-chart"
                                                    },
                                                    plotOptions: {
                                                        bar: {
                                                            horizontal: false,
                                                            columnWidth: '55%',
                                                            endingShape: 'rounded',
                                                            borderRadius: 10,
                                                            dataLabels: {
                                                                position: 'top',
                                                            },
                                                        }
                                                    },
                                                    dataLabels: {
                                                        enabled: true,
                                                        offsetY: -20,
                                                        formatter: function (x: any) {
                                                            return Number(x).toLocaleString('de-DE');
                                                        },
                                                        style: {
                                                            fontSize: '11px',
                                                            colors: ["#304758"]
                                                        }
                                                    },
                                                    xaxis: {
                                                        type: "string",
                                                        categories: reportState.revenues ? reportState.revenues.map((e: { month: string; }) => e.month) : [],

                                                    },
                                                    yaxis: {
                                                        title: {
                                                            text: "Triệu đồng"
                                                        },
                                                        labels: {
                                                            formatter: function (y: any) {
                                                                return y;
                                                            }
                                                        }
                                                    }
                                                }}

                                                series={[{
                                                    name: 'Website',
                                                    data: reportState.revenues ? reportState.revenues.map((e: { website: number; }) => Number((e.website / 1000000).toFixed(3))) : []
                                                },
                                                {
                                                    name: 'Bán',
                                                    data: reportState.revenues ? reportState.revenues.map((e: { sell: number; }) => Number((e.sell / 1000000).toFixed(3))) : []
                                                },
                                                {
                                                    name: 'Mua',
                                                    data: reportState.revenues ? reportState.revenues.map((e: { buy: number; }) => Number((e.buy / 1000000).toFixed(3))) : []
                                                },
                                                {
                                                    name: 'Đổi',
                                                    data: reportState.revenues ? reportState.revenues.map((e: { exchange: number; }) => Number((e.exchange / 1000000).toFixed(3))) : []
                                                }

                                                ]
                                                }

                                            />
                                        </>}
                                    />
                                </div>
                            }
                            {revenueByMonthTypeMode === 'GRID' && <>
                                <LoadingDiv
                                    className="pt-2 z-0"
                                    loading={reportState.revenueStatus.status === "loading"}
                                    body={<JqxGrid
                                        disabled={reportState.revenueStatus.status === "loading"}
                                        ref={grid}
                                        theme="bootstrap"
                                        width={"100%"}
                                        height={300}
                                        filterable={true}
                                        showfilterrow={true}
                                        showsortmenuitems={false}
                                        source={new jqx.dataAdapter(revenueByMonthsSource)}
                                        columns={columnsRevenueByMonthsType}
                                        showaggregates={true} showstatusbar={true} statusbarheight={25}
                                        localization={{ emptydatastring: 'Không có dữ liệu', decimalseparator: ',', thousandsseparator: '.', }}
                                        pageable={false} autoheight={false} sortable={true} altrows={true}
                                        enabletooltips={false} editable={false} selectionmode={'singlerow'}
                                    />} />
                            </>}
                        </>
                    }
                    tool={<><SelectButton className="module icon-select" itemTemplate={selectTemplate} value={revenueByMonthTypeMode} onChange={(e) => setRevenueByMonthTypeMode(e.value)} options={viewOptions} /></>}
                    title={<><i className="ri-money-dollar-circle-line"></i> Doanh thu theo tháng</>}
                    isPadding={true} />
            </div>
            }
        </>
    )
}
