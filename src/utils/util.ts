//import { useEffect, useState } from "react"
import dayjs from 'dayjs'
import { t } from "i18next";
import { goldTypes } from './constants/category';
import { decimalScale, numberRoundTo, statuses } from './constants/const';
import { actions } from '../types';
import province_district from "../data/province_district.json"
import district_ward from "../data/district_ward.json"
import Assets from '../assets';
const s3ImagesLink=import.meta.env.VITE_APP_s3ImagesLink
const s3ProductPrefix=import.meta.env.VITE_APP_s3ProductPrefix!
export const MAX_IMAGE_SIZE = 100  * 1024;
export const scaleImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
        const MAX_SIZE = 1024 * 1024; // 1MB
        const img = new Image();
        img.onload = () => {
            let width = img.width;
            let height = img.height;
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Cannot get canvas context'));
                return;
            }
            let quality = 1; // Chất lượng ban đầu
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 600;
            do {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
                canvas.width = width;
                canvas.height = height;
                ctx.clearRect(0, 0, width, height); // Xóa bản vẽ trước đó
                ctx.drawImage(img, 0, 0, width, height);
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                const dataSize = dataUrl.length * 0.75;
                if (dataSize > MAX_SIZE) {
                    quality -= 0.1;
                } else {
                    canvas.toBlob((blob: Blob | null) => {
                        if (blob) {
                            resolve(new File([blob], file.name, { type: file.type }));
                        } else {
                            reject(new Error('Failed to convert canvas to blob'));
                        }
                    }, file.type, quality);
                    return;
                }
            } while (quality > 0);
            reject(new Error('Failed to scale image within 1MB'));
        };
        img.onerror = () => {
            reject(new Error('Failed to load image'));
        };
        img.src = URL.createObjectURL(file);
    });
};
export const dateToSubmit=(date:string)=>{
    const dateArr=date.split("-")
    return dateArr[2]+"-"+dateArr[1]+"-"+dateArr[0]
}
export const datetimeToConvert=(date:string)=>{
    const datetimeArr=date.split(" ")
    const dateArr=datetimeArr[0].split("-")
    const timeString=datetimeArr[1]
    return dateArr[2]+"-"+dateArr[1]+"-"+dateArr[0]+" "+timeString
}
export const deepCloneObject = (obj: any) => {
    return JSON.parse(JSON.stringify(obj))
}
export const dateStringToDate=(date:any)=>{
    var utcDate = typeof date==="string"? new Date(Date.parse(date)):date;
    var localDate = new Date(utcDate.getTime());
    return localDate
}
export function dateDetail(date:Date){
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    startOfYear.setDate(startOfYear.getDate() + (startOfYear.getDay() % 7));
    const week= Math.round((date.getTime() - startOfYear.getTime()) / 604800000);
    return {
        date:date.getDate(),
        month:date.getMonth(),
        year:date.getFullYear(),
        week:week,
        quarter:Math.floor((date.getMonth() + 3) / 3)
    }
}
export function gridCellNumberFormat(_row: any, _column: any, value: number) {
    if (value == 0) {
        return "";
    } else if (value < 0) {
        const string = Math.abs(value).toLocaleString("de-DE")
        return (
            '<div class="w-100 jqx-grid-cell-right-align text-danger p-2">(' +
            string +
            ")</div>"
        );
    }
    // else{
    //     const string= value.toLocaleString("de-DE")
    //     return (
    //         '<div class="w-100 jqx-grid-cell-right-align p-2">' +
    //         string +
    //         "</div>"
    //     );
    // }
}
export const fileToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();

        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
            reject(error);
        };
    });
};
export const makeId = (length: number) => {
    return (Math.random() + 1).toString(36).substring(length);
}
export const sortProductImages = (images: string[]) => {
    return images.sort((a, b) => {
        const af = a.split('.')[0]
        const bf = b.split('.')[0]
        const f = af.slice(-1)
        const s = bf.slice(-1)
        return Number(f) - Number(s)
    })
}
const province_district_map = province_district.reduce((accum: any, item) => {
    let d = item.state_id
    let c = accum[d] ?? []
    return {
        ...accum,
        [item.state_id]: [...c, item.name],
    };
}, {});

export const getProvinceDistrictData = () => {
    return province_district_map
}
export const getProvinceData = () => {
    let ttp = []
    for (const [key, _value] of Object.entries(province_district_map)) {
        ttp.push({ 'name': key })
    }
    return ttp
}

export const findDistrictId = (province: string, district: string) => {
    const index = province_district.findIndex((e) => e.state_id == province && e.name == district)
    if (index >= 0) {
        return province_district[index].id
    }
    return ''
}
export const getWards = (districtId: string) => {
    return district_ward.filter((e) => e['district_id:id'] == districtId)
}
export function numberFormat(numer:number){
    const value=Math.abs(numer)
    const stringValue=value.toLocaleString('de-DE')
    return stringValue
}
export function removeVietnameseTones(str:string) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str = str.replace(/đ/g,"d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g," ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
    return str;
}
export const errorMessage=(error:any,_byCode:boolean)=>{
    //console.log(error)
    let message="Lỗi kết nối. Vui lòng thử lại!"
    if(error.message!==undefined){
        if(error.message.content!==undefined){
            message=error.message.content
        }
        else{
            message=error.message
            if(error.error&&error.error.message){
                message+='. '+error.error.message
            }
        }
    }
    else{
        if(error.code!==undefined){
            message=t("response."+error.code)
        }
        else{
            message=t("response.UNDEFINED")
        }
    }
    return message
}
export const statusToObjectList=()=>{
    let list=[]
    for (let index = 0; index < statuses.length; index++) {
        const element = statuses[index];
        list.push({
            code:element,
            name:t('status.'+element.toLowerCase())
        })
    }
    return list
}
export const productImageUrl = (value:string) => {
    if(isUrl(value)){
        return value
    }
    else if(value.includes(s3ProductPrefix)){
        return s3ImagesLink+value
    }
    else{
        return null
    }
}
export const isUrl = (value:string) => {
    try { return Boolean(new URL(value)); }
    catch(e){ return false; }
}
export const dataToExcel=(data:any,name:string)=>{
    import('xlsx').then((xlsx) => {
        const worksheet = xlsx.utils.json_to_sheet(data);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, name);
        xlsx.writeFile(workbook, name+'_'+new Date().getTime()+  ".xlsx");
        }
    )
}
export const isValidAction=(limited:string[],action:actions)=>{
    const index=limited.indexOf(action)
    return index>=0
}
export const roundNumber=(value:number)=>{
    const rate=value/numberRoundTo
    const fixedRate=Number(rate.toFixed(0))
    const roundedNumber=fixedRate*numberRoundTo
    return roundedNumber
}
export const booleanRefactor=(value:any)=>{
    let result=false
    if(value===1||value===true){
        result=true
    }
    return result
}
export const toLocaleStringRefactor=(value:number)=>{
    const stringNumber=(value??0).toLocaleString("de-DE", {style:"currency",currency:'USD'})
    const refactorString=stringNumber.replace(' $','')
    return refactorString
}
export const weightFormatWithoutUnit=(value:number)=>{
    let formatedWeight=toLocaleStringRefactor(value)
    return formatedWeight
}
export const weightFormat=(value:number,unit:string)=>{
    let formatedWeight=''
    if(unit==='GRAM'){
        const valueStrArr=(value??0).toLocaleString('de-DE').split(',')
        const int=valueStrArr[0]
        const dec=valueStrArr.length>1?valueStrArr[1].length>1?valueStrArr[1]:valueStrArr[1]+"0":"00"
        formatedWeight=int+'g'+dec
    }
    else{
        formatedWeight=toLocaleStringRefactor(value)+' Ly'
    }
    return formatedWeight
}
export const weightString=(value:number,digit:number)=>{
    let formatedWeight=value.toFixed(digit)
    return formatedWeight
}
export const numberRandom=()=>{
    return Math.random()*100
}
export const weightByUnit=(value:number,unit:string)=>{
    if(unit!="GRAM"){
        value=value/100
    }
    return value
}
export const ExcelDateToJSDate=(date:number,separate:string)=> {
    const dateTime= new Date(Math.round((date - 25569)*86400*1000));
    return dateToFormat(dateTime,separate);
}
export const ExcelDateToJSDateWithYMDFormat=(date:number,separate:string)=> {
    const dateTime= new Date(Math.round((date - 25569)*86400*1000));
    return dateToYMDFormat(dateTime,separate,0);
}
export const formatDateTimeToFormatString = (datetime: string, format: string) => {
    const formated = dayjs(datetime).format(format)
    return formated
}
export const dateToFormat=(date:Date,separate:string)=>{
    const dateString =
        (date.getDate() < 10 ? "0" : "") +
        date.getDate() +
        separate +
          (date.getMonth() < 9 ? "0" : "") +
          (date.getMonth() + 1) +
        separate +
        date.getFullYear();
    return dateString;
}
export const dateToYMDFormat=(date:Date,separate:string,addDate:number)=>{
    const _date=typeof date==="string"?new Date(Date.parse(date)):date
    const newDate = new Date(_date.getTime());
    newDate.setDate(_date.getDate() + addDate);
    const dateString =
    newDate.getFullYear()+ separate  +
        (newDate.getMonth() < 9 ? "0" : "") + 
        (newDate.getMonth() + 1)+ separate  +(newDate.getDate() < 10 ? "0" : "") + 
        newDate.getDate();
    return dateString;
}
export const toUpcaseSentence=(text:string)=>{
    const result = text.charAt(0).toLocaleUpperCase() + text.slice(1);

    return result;
}
export const isMobile = () => {
    const width=window.innerWidth;
    return (width <= 1366);
}
export const isPhone = () => {
    const width=window.innerWidth;
    return (width < 600);
}
export const formatDateToFormatString = (datetime: string, format: string) => {
    const formated = dayjs(datetime).format(format)
    return formated
}
export const currentDateTimeInFormat=(format:string)=>{
    return dayjs().format(format);

}
export const uniqueArray = (value: any, index: any, self: any) => {
    return self.indexOf(value) === index
}
export const delayed = (ms: any) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
export const stringNumberToInt=(number:string)=>{
    const value=Number.parseInt(number)
    return Number.isNaN(value)?0:toFixedRefactor(value,0)
}
export const stringNumberToFloat=(number:string)=>{
    const value=Number.parseFloat(number)
    return Number.isNaN(value)?0:toFixedRefactor(value,decimalScale)
}
export const toFixedRefactor=(number:number, scale:number)=> {
    try {
        const valueEdit = number.toFixed(scale + 1).toString() + "001"
        const valueFinal = Number.parseFloat(valueEdit)
        return Number.parseFloat(valueFinal.toFixed(scale))
    } catch (error) {
        return number
    }
}
export const formatGold= (weight:number)=> {
    const iarr = weight.toString().split('.');
    const c = iarr[0];
    let str = '';
    if (c != '0') {
        str = c + 'c';
    }
    if (typeof iarr[1] !== 'undefined') {
        // your code here
        const ap = iarr[1];
        const p = ap.substring(0, 1);
        if (p != '0') {
        str = str + p + 'p';
        }
        const m = ap.substring(1, 2);
        if (m != '0') {
        str = str + m + 'li';
        }
    }
    return str;
}
const localeNumber=  (number:number)=> {
    return t(number.toString());
}
const readingDozens= (number:number, isFull:boolean)=> {
    let reading = "";
    const dozen = Math.floor(number / 10);
    const unit = number % 10;
    if (dozen > 1) {
        reading = " " + localeNumber(dozen) + t("muoi");
        if (unit == 1) {
        reading += t("mot");
        }
    } else if (dozen == 1) {
        reading = ` ${t("10")}`;
        if (unit == 1) {
        reading += ` ${t("1")}`;
        }
    } else if (isFull && unit > 0) {
        reading = t("le");
    }
    if (unit == 5 && dozen >= 1) {
        reading += t("lam");
    } else if (unit > 1 || (unit == 1 && dozen == 0)) {
        reading += " " + localeNumber(unit);
    }
    return reading;
}
const readingBlock=(number:number, isFull:boolean)=> {
    let reading = "";
    const hundred = Math.floor(number / 100);
    number = number % 100;
    if (isFull || hundred > 0) {
      reading =
        " " +
        localeNumber(hundred) +
        t("hundred");
      reading += readingDozens(number, true);
    } else {
      reading = readingDozens(number, false);
    }
    return reading;
}
const readingMilions=(number:number, isFull:boolean)=> {
    let reading = "";
    const milion = Math.floor(number / 1000000);
    number = number % 1000000;
    if (milion > 0) {
        reading =
        readingBlock(milion, isFull) +
        t("milion");
        isFull = true;
    }
    const thousand = Math.floor(number / 1000);
    number = number % 1000;
    if (thousand > 0) {
        reading +=
        readingBlock(thousand, isFull) +
        t("thousand");
        isFull = true;
    }
    if (number > 0) {
      reading += readingBlock(number, isFull);
    }
    return reading;
}
export const readingNumber= (number:number)=> {
    if (number === 0) return localeNumber(0);
    if (number < 0) number = -1 * number;
    let reading = "",suffix = "";
    do {
        const bilion = number % 1000000000;
        number = Math.floor(number / 1000000000);
        if (number > 0) {
            
            reading = readingMilions(bilion, true) + suffix + reading;
        } else {
            reading = readingMilions(bilion, false) + suffix + reading;
        }
        suffix =t("bilion");
    } while (number > 0);
    return reading;
}

export const getGoldType9999=()=> {
    const index = goldTypes.findIndex((e)=> e.code == '9999');
    if (index >= 0) {
        return goldTypes[index]; 
    }
    return {
        'buyPrice': 7000000,
        'sellPrice': 7000000
    };
}
export const getLocalization = (culture:string)=> {
    var localization = null;
    switch (culture) {
        case "de":
            localization =
             {
                 // separator of parts of a date (e.g. '/' in 11/05/1955)
                 '/': "/",
                 // separator of parts of a time (e.g. ':' in 05:44 PM)
                 ':': ":",
                 // the first day of the week (0 = Sunday, 1 = Monday, etc)
                 firstDay: 1,
                 days: {
                     // full day names
                     names: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
                     // abbreviated day names
                     namesAbbr: ["Sonn", "Mon", "Dien", "Mitt", "Donn", "Fre", "Sams"],
                     // shortest day names
                     namesShort: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]
                 },

                 months: {
                     // full month names (13 months for lunar calendards -- 13th month should be "" if not lunar)
                     names: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember", ""],
                     // abbreviated month names
                     namesAbbr: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dez", ""]
                 },
                 // AM and PM designators in one of these forms:
                 // The usual view, and the upper and lower case versions
                 //      [standard,lowercase,uppercase]
                 // The culture does not use AM or PM (likely all standard date formats use 24 hour time)
                 //      null
                 AM: ["AM", "am", "AM"],
                 PM: ["PM", "pm", "PM"],
                 eras: [
                 // eras in reverse chronological order.
                 // name: the name of the era in this culture (e.g. A.D., C.E.)
                 // start: when the era starts in ticks (gregorian, gmt), null if it is the earliest supported era.
                 // offset: offset in years from gregorian calendar
                 { "name": "A.D.", "start": null, "offset": 0 }
                 ],
                 twoDigitYearMax: 2029,
                 patterns:
                  {
                      d: "dd.MM.yyyy",
                      D: "dddd, d. MMMM yyyy",
                      t: "HH:mm",
                      T: "HH:mm:ss",
                      f: "dddd, d. MMMM yyyy HH:mm",
                      F: "dddd, d. MMMM yyyy HH:mm:ss",
                      M: "dd MMMM",
                      Y: "MMMM yyyy"

                  },
                 percentsymbol: "%",
                 currencysymbol: "€",
                 currencysymbolposition: "after",
                 decimalseparator: '.',
                 thousandsseparator: ',',
                 pagergotopagestring: "Gehe zu",
                 pagershowrowsstring: "Zeige Zeile:",
                 pagerrangestring: " von ",
                 pagerpreviousbuttonstring: "nächster",
                 pagernextbuttonstring: "voriger",
                 pagerfirstbuttonstring: "first",
                 pagerlastbuttonstring: "last",
                 groupsheaderstring: "Ziehen Sie eine Kolumne und legen Sie es hier zu Gruppe nach dieser Kolumne",
                 sortascendingstring: "Sortiere aufsteigend",
                 sortdescendingstring: "Sortiere absteigend",
                 sortremovestring: "Entferne Sortierung",
                 groupbystring: "Group By this column",
                 groupremovestring: "Remove from groups",
                 filterclearstring: "Löschen",
                 filterstring: "Filter",
                 filtershowrowstring: "Zeige Zeilen, in denen:",
                 filterorconditionstring: "Oder",
                 filterandconditionstring: "Und",
                 filterselectallstring: "(Alle auswählen)",
                 filterchoosestring: "Bitte wählen Sie:",
                 filterstringcomparisonoperators: ['leer', 'nicht leer', 'enthält', 'enthält(gu)',
                    'nicht enthalten', 'nicht enthalten(gu)', 'beginnt mit', 'beginnt mit(gu)',
                    'endet mit', 'endet mit(gu)', 'equal', 'gleich(gu)', 'null', 'nicht null'],
                 filternumericcomparisonoperators: ['gleich', 'nicht gleich', 'weniger als', 'kleiner oder gleich', 'größer als', 'größer oder gleich', 'null', 'nicht null'],
                 filterdatecomparisonoperators: ['gleich', 'nicht gleich', 'weniger als', 'kleiner oder gleich', 'größer als', 'größer oder gleich', 'null', 'nicht null'],
                 filterbooleancomparisonoperators: ['gleich', 'nicht gleich'],
                 validationstring: "Der eingegebene Wert ist ungültig",
                 emptydatastring: "Nokeine Daten angezeigt",
                 filterselectstring: "Wählen Sie Filter",
                 loadtext: "Loading...",
                 clearstring: "Löschen",
                 todaystring: "Heute"
             }
            break;
        case "en":
        default:
            localization =
            {
                // separator of parts of a date (e.g. '/' in 11/05/1955)
                '/': "/",
                // separator of parts of a time (e.g. ':' in 05:44 PM)
                ':': ":",
                // the first day of the week (0 = Sunday, 1 = Monday, etc)
                firstDay: 0,
                days: {
                    // full day names
                    names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                    // abbreviated day names
                    namesAbbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                    // shortest day names
                    namesShort: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
                },
                months: {
                    // full month names (13 months for lunar calendards -- 13th month should be "" if not lunar)
                    names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""],
                    // abbreviated month names
                    namesAbbr: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""]
                },
                // AM and PM designators in one of these forms:
                // The usual view, and the upper and lower case versions
                //      [standard,lowercase,uppercase]
                // The culture does not use AM or PM (likely all standard date formats use 24 hour time)
                //      null
                AM: ["AM", "am", "AM"],
                PM: ["PM", "pm", "PM"],
                eras: [
                // eras in reverse chronological order.
                // name: the name of the era in this culture (e.g. A.D., C.E.)
                // start: when the era starts in ticks (gregorian, gmt), null if it is the earliest supported era.
                // offset: offset in years from gregorian calendar
                { "name": "A.D.", "start": null, "offset": 0 }
                ],
                twoDigitYearMax: 2029,
                patterns: {
                    // short date pattern
                    d: "M/d/yyyy",
                    // long date pattern
                    D: "dddd, MMMM dd, yyyy",
                    // short time pattern
                    t: "h:mm tt",
                    // long time pattern
                    T: "h:mm:ss tt",
                    // long date, short time pattern
                    f: "dddd, MMMM dd, yyyy h:mm tt",
                    // long date, long time pattern
                    F: "dddd, MMMM dd, yyyy h:mm:ss tt",
                    // month/day pattern
                    M: "MMMM dd",
                    // month/year pattern
                    Y: "yyyy MMMM",
                    // S is a sortable format that does not vary by culture
                    S: "yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss",
                    // formatting of dates in MySQL DataBases
                    ISO: "yyyy-MM-dd hh:mm:ss",
                    ISO2: "yyyy-MM-dd HH:mm:ss",
                    d1: "dd.MM.yyyy",
                    d2: "dd-MM-yyyy",
                    d3: "dd-MMMM-yyyy",
                    d4: "dd-MM-yy",
                    d5: "H:mm",
                    d6: "HH:mm",
                    d7: "HH:mm tt",
                    d8: "dd/MMMM/yyyy",
                    d9: "MMMM-dd",
                    d10: "MM-dd",
                    d11: "MM-dd-yyyy"
                },
                percentsymbol: "%",
                currencysymbol: "$",
                currencysymbolposition: "before",
                decimalseparator: '.',
                thousandsseparator: ',',
                pagergotopagestring: "Go to page:",
                pagershowrowsstring: "Show rows:",
                pagerrangestring: " of ",
                pagerpreviousbuttonstring: "previous",
                pagernextbuttonstring: "next",
                pagerfirstbuttonstring: "first",
                pagerlastbuttonstring: "last",
                groupsheaderstring: "Drag a column and drop it here to group by that column",
                sortascendingstring: "Sort Ascending",
                sortdescendingstring: "Sort Descending",
                sortremovestring: "Remove Sort",
                groupbystring: "Group By this column",
                groupremovestring: "Remove from groups",
                filterclearstring: "Clear",
                filterstring: "Filter",
                filtershowrowstring: "Show rows where:",
                filterorconditionstring: "Or",
                filterandconditionstring: "And",
                filterselectallstring: "(Select All)",
                filterchoosestring: "Please Choose:",
                filterstringcomparisonoperators: ['empty', 'not empty', 'enthalten', 'enthalten(match case)',
                   'does not contain', 'does not contain(match case)', 'starts with', 'starts with(match case)',
                   'ends with', 'ends with(match case)', 'equal', 'equal(match case)', 'null', 'not null'],
                filternumericcomparisonoperators: ['equal', 'not equal', 'less than', 'less than or equal', 'greater than', 'greater than or equal', 'null', 'not null'],
                filterdatecomparisonoperators: ['equal', 'not equal', 'less than', 'less than or equal', 'greater than', 'greater than or equal', 'null', 'not null'],
                filterbooleancomparisonoperators: ['equal', 'not equal'],
                validationstring: "Entered value is not valid",
                emptydatastring: "No data to display",
                filterselectstring: "Select Filter",
                loadtext: "Loading...",
                clearstring: "Clear",
                todaystring: "Today"
            }
            break;
    }
    return localization;
}
export const getImageNetwork = (relativePath: string) => relativePath !== undefined && relativePath !== null && relativePath !== '' ? relativePath : Assets.images.loadingImage;
export const onlyUnique=(value: any, index: number, array: any[]) =>{
    return array.indexOf(value) === index;
}