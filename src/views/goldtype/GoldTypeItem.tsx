import { InputText } from "primereact/inputtext";
import Card from "../../components/commons/Card";
import { FormikErrors, useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { NumericFormat } from "react-number-format";
import { GoldtypeModel } from "../../model";
import FormAction from "../../components/commons/FormAction";
import { isFormFieldInvalid, getFormErrorMessageString, getFormErrorMessage } from "../../utils/validate";
import MonneyFormat from "../../components/commons/MoneyFormat";
import { useEffect, useState } from "react";
import { addItem, changeAction, deleteItem, editItem, fetchAll, resetActionState, restoreItem, fetchChartItem } from "../../slices/goldtype/goldtype.slice";
import ActionButton from "../../components/action/ActionButton";
import { completed, failed, processing, warningWithConfirm } from "../../utils/alert";
import { toLocaleStringRefactor } from "../../utils/util";
import { baseWssUrl, decimalScale } from "../../utils/constants/const";
import { t } from "i18next";
import { EmptyHeight } from "../../components/commons";
import { InputSwitch } from "primereact/inputswitch";
import useWebSocket, { ReadyState } from "react-use-websocket"
import { fetchCategories, setFetched } from "../../slices/category/category.slice";
import Multiselect from 'multiselect-react-dropdown';
import { ApexLine } from "../../components/commons/ApexChart";
import moment from "moment";

export default function AddGoldType() {
    const navigate = useNavigate();
    const [labels, setLabels] = useState<string[]>([]);
    const [buyPrices, setBuyPrices] = useState<number[]>(new Array(12).fill(0));
    const [sellPrices, setSellPrices] = useState<number[]>(new Array(12).fill(0));
    const dispatch = useAppDispatch();
    const handleCancel = () => {
        navigate(-1);
    };
    const categoryState = useAppSelector((state) => state.category)
    const goldtypeState = useAppSelector((state) => state.goldtype);
    const goldtypeItem = goldtypeState.item;
    const action = goldtypeState.action;
    const disableInput = !["INS", "UPD"].includes(action);
    const formik = useFormik<GoldtypeModel>({
        initialValues: goldtypeItem,
        validate: (data) => {
            const errors: FormikErrors<GoldtypeModel> = {};
            if (!data.code) {
                errors.code = "Nhập mã loại vàng";
            }
            if (!data.name) {
                errors.name = "Nhập tên loại vàng";
            }
            if (!data.age) {
                errors.age = "Nhập tuổi vàng";
            }
            else {
                const age = Number(data.age.toString().split(',').join('.'))
                if (age > 100 || age < 0) {
                    errors.age = "Giá trị không hợp lệ";
                }
            }
            if (!data.unit) {
                errors.unit = "Chọn đơn vị";
            }
            if (Number(data.buyRate) > 100 || Number(data.buyRate) < 0) {
                errors.buyRate = "Giá trị không hợp lệ";
            }
            if (Number(data.changeRate) > 100 || Number(data.changeRate) < 0) {
                errors.changeRate = "Giá trị không hợp lệ";
            }

            return errors;
        },
        onSubmit: (data) => {
            //console.log( typeof data.buyPriceRate)
            const submitData = {
                id: data.id,
                code: data.code,
                name: data.name,
                unit: data.unit,
                age: typeof data.age === "string" ? Number(String(data.age).split(',').join('.')) : data.age,
                buy_rate: data.buyRate,
                buy_price_recipe: data.buyPriceRecipe,
                buy_price_from_type: data.buyPriceFromType,
                buy_price_operator: data.buyPriceOperator === "" ? "MULTIPLY" : data.buyPriceOperator,
                buy_price_rate: typeof data.buyPriceRate === "string" ? Number(String(data.buyPriceRate).split('.').join('').split(',').join('.')) : data.buyPriceRate,
                buy_price: data.buyPrice,
                sell_price_recipe: data.sellPriceRecipe,
                sell_price_from_type: data.sellPriceFromType,
                sell_price_operator: data.sellPriceOperator === "" ? "MULTIPLY" : data.sellPriceOperator,
                sell_price_rate: typeof data.sellPriceRate === "string" ? Number(String(data.sellPriceRate).split('.').join('').split(',').join('.')) : data.sellPriceRate,
                sell_price: data.sellPrice,
                change_rate: Number(data.changeRate),
                compensation: data.compensation,
                invoice: data.invoice,
                is_online: data.online,
                is_screen: data.screen,
                tags: data.tags,
                weight_custom_name: data.weightCustomName === "" ? null : data.weightCustomName,
                active: false,
                disable: false
            };
            //console.log(submitData)
            switch (goldtypeState.action) {
                case "INS":
                    dispatch(addItem(submitData));
                    break
                case "UPD":
                    dispatch(editItem(submitData));
                    break
                case "DEL":
                    dispatch(deleteItem(submitData));
                    break
            }
        },
    });
    const sellPriceRecipes = [
        { name: "Cố định", code: 'FIXED' },
        { name: "Từ loại vàng", code: 'FROMTYPE' },
        { name: "Từ giá mua", code: 'BUYPRICE' }
    ];
    const buyPriceRecipes = [
        { name: "Cố định", code: 'FIXED' },
        { name: "Từ loại vàng", code: 'FROMTYPE' },
        { name: "Từ giá bán", code: 'SELLPRICE' }
    ];
    const priceOperators = [
        { name: "(+) Cộng", code: 'ADD' },
        { name: "(-) Trừ", code: 'SUBTRACT' },
        { name: "(x) Nhân", code: 'MULTIPLY' },
        { name: "(/) Chia", code: 'DIVIDE' }
    ];
    const units = [
        { name: 'GRAM', value: 'GRAM' },
        { name: 'CHỈ', value: 'CHI' },
    ]
    const calculateBuyPrice = (props: { field: string, value: any, changed: boolean }) => {
        let { buyPriceOperator, buyPriceRate, buyPriceRecipe, buyPriceFromType, sellPrice } = formik.values
        const isNumber = !isNaN(+buyPriceRate)
        if (!isNumber) {
            buyPriceRate = Number(buyPriceRate.toString().split('.').join('').split(',').join('.'))
        }
        let buyPrice = 0
        if (props.changed) {
            switch (props.field) {
                case "buyPriceOperator":
                    buyPriceOperator = props.value
                    break
                case "buyPriceRate":
                    buyPriceRate = props.value
                    break
                case "buyPriceRecipe":
                    buyPriceRecipe = props.value
                    break
                case "buyPriceFromType":
                    buyPriceFromType = props.value
            }
        }

        switch (buyPriceRecipe) {
            case 'FROMTYPE':
                if (props.changed) {
                    const fromGold = goldtypeState.list.find((el) => el.code === buyPriceFromType)
                    switch (buyPriceOperator) {
                        case 'ADD':
                            buyPrice = fromGold !== undefined ? Number(fromGold.buyPrice) + Number(buyPriceRate) : 0
                            break;

                        case 'SUBTRACT':
                            buyPrice = fromGold !== undefined ? Number(fromGold.buyPrice) - Number(buyPriceRate) : 0
                            break;
                        case 'MULTIPLY':
                            buyPrice = fromGold !== undefined ? Number(fromGold.buyPrice) * Number(buyPriceRate) : 0
                            break;
                        case 'DIVIDE':
                            buyPrice = fromGold !== undefined ? Number(fromGold.buyPrice) / Number(buyPriceRate) : 0
                            break;
                    }
                    formik.setFieldValue('buyPrice', buyPrice)
                }
                break;
            case 'SELLPRICE':
                if (!props.changed) {
                    sellPrice = props.value
                }
                switch (buyPriceOperator) {
                    case 'ADD':
                        buyPrice = (sellPrice ?? 0) + Number(buyPriceRate)
                        break;
                    case 'SUBTRACT':
                        buyPrice = (sellPrice ?? 0) - Number(buyPriceRate)
                        break;
                    case 'MULTIPLY':
                        buyPrice = (sellPrice ?? 0) * Number(buyPriceRate)
                        break;
                    case 'DIVIDE':
                        buyPrice = (sellPrice ?? 0) / Number(buyPriceRate)
                        break;
                }
                formik.setFieldValue('buyPrice', buyPrice)
                break
        }
        return buyPrice
    }
    const calculateSellPrice = (props: { field: string, value: any, changed: boolean }) => {
        let { sellPriceOperator, sellPriceRate, sellPriceRecipe, sellPriceFromType, buyPrice } = formik.values
        const isNumber = !isNaN(+sellPriceRate)
        if (!isNumber) {
            sellPriceRate = Number(sellPriceRate.toString().split('.').join('').split(',').join('.'))
        }
        let sellPrice = 0
        if (props.changed) {
            switch (props.field) {
                case "sellPriceOperator":
                    sellPriceOperator = props.value
                    break
                case "sellPriceRate":
                    sellPriceRate = props.value
                    break
                case "sellPriceRecipe":
                    sellPriceRecipe = props.value
                    break
                case "sellPriceFromType":
                    sellPriceFromType = props.value
                    break
            }
        }
        switch (sellPriceRecipe) {
            case 'FROMTYPE':
                if (props.changed) {
                    const fromGold = goldtypeState.list.find((el) => el.code === sellPriceFromType)
                    switch (sellPriceOperator) {
                        case 'ADD':
                            sellPrice = fromGold !== undefined ? Number(fromGold.sellPrice) + Number(sellPriceRate) : 0
                            break;
                        case 'SUBTRACT':
                            sellPrice = fromGold !== undefined ? Number(fromGold.sellPrice) - Number(sellPriceRate) : 0
                            break;
                        case 'MULTIPLY':
                            sellPrice = fromGold !== undefined ? Number(fromGold.sellPrice) * Number(sellPriceRate) : 0
                            break;
                        case 'DIVIDE':
                            sellPrice = fromGold !== undefined ? Number(fromGold.sellPrice) / Number(sellPriceRate) : 0
                            break;
                    }
                    formik.setFieldValue('sellPrice', sellPrice)
                }
                break
            case 'BUYPRICE':
                if (!props.changed) {
                    buyPrice = props.value
                }
                switch (sellPriceOperator) {
                    case 'ADD':
                        sellPrice = (buyPrice ?? 0) + Number(sellPriceRate)
                        break;
                    case 'SUBTRACT':
                        sellPrice = (buyPrice ?? 0) - Number(sellPriceRate)
                        break;
                    case 'MULTIPLY':
                        sellPrice = (buyPrice ?? 0) * Number(sellPriceRate)
                        break;
                    case 'DIVIDE':
                        sellPrice = (buyPrice ?? 0) / Number(sellPriceRate)
                        break;
                }
                formik.setFieldValue('sellPrice', sellPrice)
                break

        }

        return sellPrice
    }
    const handleRestore = () => {
        dispatch(restoreItem({ id: goldtypeItem.id }));
    }
    const handleDelete = () => {
        warningWithConfirm({
            title: "Xóa",
            text: "Bạn muốn xóa loại vàng " + goldtypeItem.code + " ?",
            confirmButtonText: "Đồng ý",
            confirm: () => {
                dispatch(deleteItem({ id: goldtypeItem.id }));
            }
        })

    }
    const WS_URL = baseWssUrl + "?user_name=goldtype&user_id=gold-type"
    const { sendJsonMessage, readyState } = useWebSocket(
        WS_URL,
        {
            share: false,
            shouldReconnect: () => true,
        },
    )
    useEffect(() => {
        switch (goldtypeState.statusAction) {
            case 'failed':
                failed(goldtypeState.error);
                dispatch(resetActionState(''));
                break;
            case "loading":
                processing();
                break;
            case 'completed':
                completed();
                dispatch(resetActionState(''));
                if (goldtypeState.action === "DEL") {
                    handleCancel()
                }
                if (readyState === ReadyState.OPEN) {
                    sendJsonMessage(
                        {
                            "service": "price",
                            "action": "message",
                            "data": { "sender_id": "goldtype", "sender_name": "Gold Price", "msg": "Reload goldtype list" },
                        }
                    )
                }
                break;
        }
    }, [goldtypeState, dispatch])
    useEffect(() => {
        dispatch(fetchAll({}))
    }, [])
    useEffect(() => {
        switch (categoryState.status) {
            case 'failed':
                failed(categoryState.error);
                break;
            case 'completed':
                dispatch(setFetched(true))
                break;
        }
    }, [categoryState.status])
    useEffect(() => {
        if (!categoryState.fetched) {
            dispatch(fetchCategories({ categories: ["tags"] }))
        }
    }, [categoryState.fetched])

    useEffect(() => {
        if (formik.values.id) {
            const request = {
                transaction: "GOLDTYPE",
                id: formik.values.id
            }
            dispatch(fetchChartItem(request))
        }
    }, [formik.values.id])
    useEffect(() => {
        if (goldtypeState.histories.length > 0) {
            const newLabels: string[] = [];
            const newBuyPrices = new Array(12).fill(0);
            const newSellPrices = new Array(12).fill(0);

            goldtypeState.histories.forEach((item, index) => {
                const dateTime = moment(item.datetime, "DD-MM-YYYY HH:mm").toLocaleString();
                newLabels.push(dateTime);
                newBuyPrices[index] = item.new_data.buy_price;
                newSellPrices[index] = item.new_data.sell_price;
            });

            setLabels(newLabels);
            setBuyPrices(newBuyPrices);
            setSellPrices(newSellPrices);
        }
    }, [goldtypeState.histories]);
    const chartData = [
        {
            name: "Giá mua vào",
            data: buyPrices,
        },
        {
            name: "Giá bán ra",
            data: sellPrices,
        },
    ];

    const chartOptions = {
        chart: {
            id: "line-chart",
            height: 350,
            zoom: {
                enabled: true,
                type: 'x',
                autoScaleYaxis: true
            },
        },
        stroke: {
            width: 3
        },
        xaxis: {
            categories: labels,
            type: 'datetime',
            title: {
                text: "Ngày"
            },
        },
        yaxis: {
            title: {
                text: "Giá trị (nghìn đồng)"
            },
        },
        tooltip: {
            shared: true,
            intersect: false
        },
        colors: ['#42A5F5', '#FF5733']
    };

    return (
        <>
            <Card
                title={
                    <>
                        {action != "INS" ? (
                            <>
                                <i className="ri-eye-fill"></i> Loại vàng
                            </>
                        ) : (
                            <>
                                <i className="ri-add-line"></i> Thêm loại vàng
                            </>
                        )}
                    </>
                }
                body={
                    <div className="p-2">
                        <div className="row mb-2">
                            <div className="col-md-3">
                                <label className="form-label">
                                    Mã loại vàng<b className="text-danger">*</b>
                                </label>
                                <InputText
                                    id="code"
                                    name="code"
                                    disabled={disableInput}
                                    placeholder={
                                        isFormFieldInvalid("code", formik)
                                            ? getFormErrorMessageString("code", formik)
                                            : ""
                                    }
                                    value={formik.values.code}
                                    onChange={(e) => {
                                        formik.setFieldValue("code", e.target.value);
                                    }}
                                    className={classNames("form-group", {
                                        "p-invalid": isFormFieldInvalid("code", formik),
                                    })}
                                    style={{ width: "100%", borderRadius: 8 }}
                                />
                                {getFormErrorMessage("code", formik)}
                            </div>
                            <div className="col-sm-3">
                                <div className="d-flex justify-content-between mb-1">
                                    <div className="form-label">
                                        Lên website
                                    </div>
                                    <InputSwitch
                                        disabled={disableInput}
                                        id="type-online"
                                        name="type-online"
                                        checked={formik.values.online}
                                        onChange={(e) => {
                                            formik.setFieldValue('online', e.value);
                                        }}
                                    />
                                </div>
                                <div className="d-flex justify-content-between">
                                    <div className="form-label">
                                        Lên bảng giá
                                    </div>
                                    <InputSwitch
                                        disabled={disableInput}
                                        id="type-screen"
                                        name="type-screen"
                                        checked={formik.values.screen}
                                        onChange={(e) => {
                                            formik.setFieldValue('screen', e.value);
                                        }}
                                    />
                                </div>

                            </div>
                            <div className="col-md-6">
                                <label className="form-label">
                                    Tên loại vàng<b className="text-danger">*</b>
                                </label>
                                <InputText
                                    id="name"
                                    name="name"
                                    disabled={disableInput}
                                    placeholder={
                                        isFormFieldInvalid("name", formik)
                                            ? getFormErrorMessageString("name", formik)
                                            : ""
                                    }
                                    value={formik.values.name}
                                    onChange={(e) => {
                                        formik.setFieldValue("name", e.target.value);
                                    }}
                                    className={classNames("form-group", {
                                        "p-invalid": isFormFieldInvalid("name", formik),
                                    })}
                                    style={{ width: "100%", borderRadius: 8 }}
                                />
                                {getFormErrorMessage("name", formik)}
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-md-6">
                                <label className="form-label">
                                    Tuổi vàng(% vàng)<b className="text-danger">*</b>
                                </label>
                                <NumericFormat
                                    disabled={disableInput}
                                    id="age"
                                    name="age"
                                    value={toLocaleStringRefactor(formik.values.age)}
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    decimalScale={decimalScale}
                                    style={{ width: "100%", textAlign: "right" }}
                                    onChange={(e) => {
                                        formik.setFieldValue("age", e.target.value);
                                    }}
                                    className={classNames(`p-inputtext ${disableInput ? 'disabled-element' : ''}`, {
                                        "p-invalid": isFormFieldInvalid("age", formik),
                                    })}
                                />
                                {getFormErrorMessage("age", formik)}
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">
                                    Đơn vị tính<b className="text-danger">*</b>
                                </label>
                                <Dropdown
                                    name="unit"
                                    options={units}
                                    optionLabel="name"
                                    optionValue="value"
                                    disabled={disableInput}
                                    placeholder="Đơn vị tính"
                                    value={formik.values.unit}
                                    onChange={(e) => formik.setFieldValue("unit", e.value)}
                                    className={classNames({
                                        "p-invalid": isFormFieldInvalid("unit", formik),
                                    })}
                                    style={{ width: "100%" }}
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">
                                    Tiền bù/chỉ<b className="text-danger">*</b>
                                </label>
                                <NumericFormat
                                    placeholder=""
                                    name="compensation"
                                    disabled={disableInput}
                                    value={formik.values.compensation}
                                    onChange={(e) => {
                                        formik.setFieldValue('compensation', e.target.value.split('.').join(''));
                                    }}
                                    thousandSeparator="."
                                    decimalSeparator=','
                                    decimalScale={0}
                                    className={classNames(`form-group p-inputtext ${disableInput ? 'disabled-element' : ''}`, {
                                        "p-invalid": isFormFieldInvalid("compensation", formik),
                                    })}
                                    style={{ width: "100%" }}
                                />
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-md-3">
                                <label className="form-label">
                                    Tỷ lệ mua vào(%)<b className="text-danger">*</b>
                                </label>
                                <InputText
                                    placeholder="Tỷ lệ mua vào"
                                    name="buyRate"
                                    disabled={disableInput}
                                    value={formik.values.buyRate.toString()}
                                    onChange={(e) => {
                                        formik.setFieldValue("buyRate", (e.target.value));
                                    }}
                                    className={classNames("form-group", {
                                        "p-invalid": isFormFieldInvalid("buyRate", formik),
                                    })}
                                    style={{ width: "100%" }}
                                />
                                {getFormErrorMessage("buyRate", formik)}
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">
                                    Tỷ lệ đổi vàng(%)<b className="text-danger">*</b>
                                </label>
                                <InputText
                                    placeholder="Tỷ lệ đổi vàng"
                                    name="changeRate"
                                    disabled={disableInput}
                                    value={formik.values.changeRate.toString()}
                                    onChange={(e) => {
                                        formik.setFieldValue("changeRate", (e.target.value));
                                    }}
                                    className={classNames("form-group", {
                                        "p-invalid": isFormFieldInvalid("changeRate", formik),
                                    })}
                                    style={{ width: "100%" }}
                                />
                                {getFormErrorMessage("changeRate", formik)}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">
                                    Tên trọng lượng (Để trống mặc định hiển thị trên website là "Trọng lượng")
                                </label>
                                <InputText
                                    placeholder="Nhập tên trọng lượng"
                                    name="weightCustomName"
                                    disabled={disableInput}
                                    value={formik.values.weightCustomName}
                                    onChange={(e) => {
                                        formik.setFieldValue("weightCustomName", (e.target.value));
                                    }}
                                    className="form-group"
                                    style={{ width: "100%" }}
                                />
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-md-6">
                                <Card
                                    body={
                                        <div className="form-group pt-1">
                                            <div className="row">
                                                <div className={`col-sm-${formik.values.buyPriceRecipe == "FIXED" || formik.values.buyPriceRecipe === "SELLPRICE" ? 12 : 6}`}>
                                                    <label className="form-lable">Cách tính</label>
                                                    <Dropdown
                                                        options={buyPriceRecipes}
                                                        name="method"
                                                        optionLabel="name"
                                                        optionValue="code"
                                                        disabled={disableInput}
                                                        placeholder="Cách tính"
                                                        value={formik.values.buyPriceRecipe}
                                                        onChange={(e) => {
                                                            formik.setFieldValue("buyPriceRecipe", e.value)
                                                            const value = calculateBuyPrice({ field: "buyPriceRecipe", value: e.value, changed: true })
                                                            calculateSellPrice({ field: '', value: value, changed: false })
                                                        }
                                                        }
                                                        style={{ width: "100%" }}
                                                    />
                                                </div>
                                                {formik.values.buyPriceRecipe === "FIXED" || formik.values.buyPriceRecipe === "SELLPRICE" ?
                                                    <></>
                                                    : <div className="col-sm-6">
                                                        <label className="form-lable">Loại vàng</label>
                                                        <Dropdown
                                                            filter
                                                            options={goldtypeState.list}
                                                            name="buyFromType"
                                                            optionLabel="name"
                                                            optionValue="code"
                                                            disabled={disableInput}
                                                            placeholder="Chọn loại vàng"
                                                            value={formik.values.buyPriceFromType}
                                                            onChange={(e) => {
                                                                formik.setFieldValue("buyPriceFromType", e.value)
                                                                const value = calculateBuyPrice({ field: "buyPriceFromType", value: e.value, changed: true })
                                                                calculateSellPrice({ field: '', value: value, changed: false })
                                                            }
                                                            }
                                                            style={{ width: "100%" }}
                                                        />
                                                    </div>
                                                }
                                            </div>
                                            {formik.values.buyPriceRecipe == "FIXED" ?
                                                <></>
                                                : <div className="row">
                                                    <div className="col-md-12">
                                                        <label className="form-label">Phép tính</label>
                                                        <Dropdown
                                                            options={priceOperators}
                                                            name="method"
                                                            optionLabel="name"
                                                            optionValue="code"
                                                            disabled={disableInput}
                                                            placeholder="Phép tính"
                                                            value={formik.values.buyPriceOperator}
                                                            onChange={(e) => {
                                                                formik.setFieldValue("buyPriceOperator", e.value)
                                                                const value = calculateBuyPrice({ field: "buyPriceOperator", value: e.value, changed: true })
                                                                calculateSellPrice({ field: '', value: value, changed: false })
                                                            }
                                                            }
                                                            style={{ width: "100%" }}
                                                        />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label className="form-label">Giá trị</label>
                                                        <NumericFormat

                                                            name="buyPriceRate"
                                                            disabled={disableInput}
                                                            value={formik.values.buyPriceRate}
                                                            onChange={(e) => {
                                                                formik.setFieldValue('buyPriceRate', e.target.value);
                                                                const value = calculateBuyPrice({ field: "buyPriceRate", value: e.target.value.split('.').join('').split(',').join('.'), changed: true })
                                                                calculateSellPrice({ field: '', value: value, changed: false })

                                                            }}
                                                            thousandSeparator="."
                                                            decimalSeparator=','
                                                            decimalScale={3}
                                                            className={classNames({ 'p-invalid': isFormFieldInvalid('buyPriceRate', formik) }, `p-inputtext ${disableInput ? 'disabled-element' : ''}`)}
                                                            style={{ width: "100%", textAlign: "right" }}
                                                        />
                                                    </div>
                                                </div>
                                            }
                                            <div className="d-flex justify-content-between my-2">
                                                <div style={{ width: "120px" }}>Tỷ giá mua</div>
                                                {formik.values.buyPriceRecipe == "FIXED" ?
                                                    <NumericFormat
                                                        name="buyPrice"
                                                        disabled={disableInput}
                                                        value={formik.values.buyPrice}
                                                        onChange={(e) => {
                                                            const value = Number(e.target.value.split('.').join(''))
                                                            formik.setFieldValue('buyPrice', value)
                                                            calculateSellPrice({ field: '', value: value, changed: false })
                                                        }}
                                                        thousandSeparator="."
                                                        decimalSeparator=','
                                                        decimalScale={0}
                                                        className={classNames({ 'p-invalid': isFormFieldInvalid('buyPrice', formik) }, `p-inputtext text-end ${disableInput ? 'disabled-element' : ''}`)}
                                                        style={{ width: "100%" }} />
                                                    : <MonneyFormat
                                                        value={formik.values.buyPrice}
                                                        positiveColor={"fami-text-primary"}
                                                        unit={"đ"} decimal={false} />
                                                }
                                            </div>
                                        </div>
                                    }
                                    title={
                                        <>
                                            <i className="ri-money-dollar-circle-line"></i>Tỷ giá mua<b className="text-danger">*</b>
                                        </>
                                    }
                                    tool={<></>}
                                    isPadding={true}
                                    className={"iq-card-border"}
                                />
                            </div>
                            <div className="col-md-6">
                                <Card
                                    body={
                                        <div className="form-group pt-1">
                                            <div className="row">
                                                <div className={`col-sm-${formik.values.sellPriceRecipe == "FIXED" || formik.values.sellPriceRecipe == "BUYPRICE" ? 12 : 6}`}>
                                                    <label className="form-label">Cách tính</label>
                                                    <Dropdown
                                                        options={sellPriceRecipes}
                                                        name="method"
                                                        optionLabel="name"
                                                        optionValue="code"
                                                        disabled={disableInput}
                                                        placeholder="Cách tính"
                                                        value={formik.values.sellPriceRecipe}
                                                        onChange={(e) => {
                                                            formik.setFieldValue("sellPriceRecipe", e.value)
                                                            const value = calculateSellPrice({ field: "sellPriceRecipe", value: e.value, changed: true })
                                                            calculateBuyPrice({ field: '', value: value, changed: false })

                                                        }
                                                        }
                                                        style={{ width: "100%" }}
                                                    />
                                                </div>
                                                {formik.values.sellPriceRecipe == "FIXED" || formik.values.sellPriceRecipe == "BUYPRICE" ?
                                                    <></>
                                                    : <div className="col-sm-6">
                                                        <label className="form-lable">Loại vàng</label>
                                                        <Dropdown
                                                            filter
                                                            options={goldtypeState.list}
                                                            name="sellFromType"
                                                            optionLabel="name"
                                                            optionValue="code"
                                                            disabled={disableInput}
                                                            placeholder="Chọn loại vàng"
                                                            value={formik.values.sellPriceFromType}
                                                            onChange={(e) => {
                                                                formik.setFieldValue("sellPriceFromType", e.value)
                                                                const value = calculateSellPrice({ field: "sellPriceFromType", value: e.value, changed: true })
                                                                calculateBuyPrice({ field: '', value: value, changed: false })
                                                            }
                                                            }
                                                            style={{ width: "100%" }}
                                                        />
                                                    </div>
                                                }
                                            </div>
                                            {formik.values.sellPriceRecipe == "FIXED" ?
                                                <></>
                                                : <div className="row">
                                                    <div className="col-md-12">
                                                        <label className="form-label">Phép tính</label>
                                                        <Dropdown
                                                            options={priceOperators}
                                                            name="method"
                                                            optionLabel="name"
                                                            optionValue="code"
                                                            disabled={disableInput}
                                                            placeholder="Phép tính"
                                                            value={formik.values.sellPriceOperator}
                                                            onChange={(e) => {
                                                                formik.setFieldValue("sellPriceOperator", e.value)
                                                                const value = calculateSellPrice({ field: "sellPriceOperator", value: e.value, changed: true })
                                                                calculateBuyPrice({ field: '', value: value, changed: false })
                                                            }
                                                            }
                                                            style={{ width: "100%" }}
                                                        />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label className="form-label">Giá trị</label>
                                                        <NumericFormat
                                                            name="sellPriceRate"
                                                            disabled={disableInput}
                                                            value={formik.values.sellPriceRate}
                                                            onChange={(e) => {
                                                                formik.setFieldValue('sellPriceRate', e.target.value);
                                                                const value = calculateSellPrice({ field: "sellPriceRate", value: Number(e.target.value.split('.').join('').split(',').join('.')), changed: true })
                                                                calculateBuyPrice({ field: '', value: value, changed: false })
                                                            }}
                                                            thousandSeparator="."
                                                            decimalSeparator=','
                                                            decimalScale={3}
                                                            className={classNames({ 'p-invalid': isFormFieldInvalid('sellPriceRate', formik) }, `p-inputtext ${disableInput ? 'disabled-element' : ''}`)}
                                                            style={{ width: "100%", textAlign: "right" }}
                                                        />
                                                    </div>

                                                </div>
                                            }
                                            <div className="d-flex justify-content-between my-2">
                                                <div style={{ width: "120px" }}>Tỷ giá bán</div>
                                                {formik.values.sellPriceRecipe === "FIXED" ?
                                                    <NumericFormat
                                                        name="sellPrice"
                                                        disabled={disableInput}
                                                        value={formik.values.sellPrice}
                                                        onChange={(e) => {
                                                            const value = Number(e.target.value.split('.').join(''))
                                                            formik.setFieldValue('sellPrice', value)
                                                            calculateBuyPrice({ field: '', value: value, changed: false })
                                                        }}
                                                        thousandSeparator="."
                                                        decimalSeparator=','
                                                        decimalScale={0}
                                                        className={classNames(`form-group p-inputtext text-end ${disableInput ? 'disabled-element' : ''}`, {
                                                            "p-invalid": isFormFieldInvalid("sellPrice", formik)
                                                        })}
                                                        style={{ width: "100%" }} />
                                                    : <MonneyFormat
                                                        value={formik.values.sellPrice}
                                                        positiveColor={"fami-text-primary"}
                                                        unit={"đ"} decimal={false} />
                                                }
                                            </div>
                                        </div>
                                    }
                                    title={
                                        <>
                                            <i className="ri-money-dollar-circle-line"></i>Tỷ giá bán<b className="text-danger">*</b>
                                        </>
                                    }
                                    tool={<></>}
                                    isPadding={true}
                                    className={"iq-card-border"}
                                />
                            </div>
                            <div className="row">
                                <div className="form-group col-md-12">

                                    <label className="form-label">Thẻ</label>
                                    <Multiselect
                                        disable={disableInput}
                                        options={categoryState.data ? categoryState.data.tags : []}
                                        selectedValues={categoryState.data ? categoryState.data.tags.filter((e: { code: string; }) => formik.values.tags.includes(e.code)) : []}
                                        onSelect={(selectedList: { code: any; }[], _selectedItem: any) => {
                                            //console.log(selectedList)
                                            const tags = selectedList.map((e: { code: any; }) => e.code)
                                            formik.setFieldValue("tags", tags);
                                        }
                                        }
                                        onRemove={(selectedList: { code: any; }[], _selectedItem: any) => {
                                            //console.log(selectedList)
                                            const tags = selectedList.map((e: { code: any; }) => e.code)
                                            formik.setFieldValue("tags", tags);
                                        }}
                                        displayValue="name"
                                        placeholder="Chọn các thẻ"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="fixed-bottom">
                            <div className="d-flex justify-content-end">
                                <button
                                    type="button"
                                    className="btn btn-outline-danger me-2"
                                    onClick={handleCancel}
                                >
                                    <i className="ri-close-line"></i><span className="list-action-label"> {t("action.close")}</span>
                                </button>
                                {goldtypeState.action === 'VIE' ?
                                    goldtypeItem.disabled ?
                                        <ActionButton action={"UND"} className={"me-2"} minimumEnable={true} label={"Phục hồi"} onClick={() => handleRestore()} />
                                        : <>
                                            <ActionButton action={"UPD"} className={"me-2"} minimumEnable={true} label={"Sửa"} onClick={() => dispatch(changeAction("UPD"))} />
                                            <ActionButton action={"DEL"} className={"me-2"} minimumEnable={true} label={"Xóa"} onClick={() => handleDelete()} />
                                        </>

                                    : <></>}
                                <FormAction action={action} onClick={formik.handleSubmit} />
                            </div>
                        </div>
                    </div>
                }
                isPadding={true}
                tool={<></>}
                className={""}
            />
            {
                action != "INS" && <Card
                    title={
                        <>
                            <i className="ri-file-chart-fill"></i> Biến động giá vàng
                        </>
                    }
                    body={
                        <>
                            {/* <Chart type="line" data={chartData} options={chartOptions} style={{ width: '100%', height: '100%' }} /> */}
                            <ApexLine
                                options={
                                    chartOptions
                                }
                                series={chartData}
                            />
                        </>
                    }
                    isPadding={true}
                    tool={<></>}
                    className={""}
                />
            }
            <EmptyHeight height={48} />
        </>
    );
}
