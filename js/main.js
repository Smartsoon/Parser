//#region Global variables
let textToArray = [];
const output = document.querySelector("#output");
const searchBtn = document.querySelector('.search-btn');
const countArea = document.querySelector('.count');
const searchArea = document.querySelector('.search-log');
const filterDateFrom = document.querySelector('.date-filter-from');
const filterDateTo = document.querySelector('.date-filter-to');
//#endregion

//#region Events
window.onload = function () {
    document.getElementById('file').addEventListener('change', handleFileSelect, false);
};

searchBtn.addEventListener('click', searching);

filterDateFrom.onchange = function dateToActive() {
    filterDateTo.removeAttribute('disabled');
};
//#endregion

//region Handlers
function handleFileSelect(evt) {
    let file = evt.target.files[0];
    if (!file.type.match('.')) {
        return alert(file.name + " is not a valid text file.");
    }
    if (file.size < 4) {
        alert('Меня пустые файлы не интересуют!');
        return;
    }
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function () {
        textToArray = reader.result.split("\n").map(function(x){return x.split("]]")});
        for (let i = 0; i < textToArray.length; i++) {
            textToArray[i] = {
                date: toStamp(textToArray[i].map(function(x){return x.slice(4, 6) + '/' + x.slice(1, 3) + '/' + x.slice(7, 11)})),
                content: textToArray[i].map(function(x){return x.slice(18)})
            }
        }
        searchBtn.removeAttribute('disabled');

    };
    reader.addEventListener('load', function (e) {
             output.textContent = e.target.result;
    });
}

function searching() {
    if (searchArea.value.length <= 0) {
        alert('Прежде, чем нажимать на меня, сначала ввел бы что-то в поле поиска...');
        return;
    }
    if (filterDateFrom.value.length > filterDateTo.value.length) {
        alert('Выбраны не все даты');
        return;
    }
    let searchedText = searchArea.value;
    let selectedDateFrom = toStamp(FormatDate(filterDateFrom.value));
	let selectedDateTo = toStamp(FormatDate(filterDateTo.value));
	let findByTime = GetContentByTime(textToArray, selectedDateFrom, selectedDateTo);
	countArea.value = GetItems(findByTime, searchedText);
}
//#endregion

//#region Utils
function toStamp(whatToStamp) {
    let datum = Date.parse(whatToStamp);

    return datum/1000;
}

function GetItems(textFromArray, findtext) {
    let count = 0;
    let line = textFromArray.toString();
    pos = line.indexOf(findtext);
    while (pos !== -1) {
        count++;
        pos = line.indexOf(findtext, pos+1);
    } return count;
}

function FormatDate(selectedDate) {
	let date;
	date = selectedDate.split('-');
	return date[1] + '/' + date[2] + '/' + date[0];
}


function GetContentByTime(sArray, selectedDateFrom, selectedDateTo) {
    var resultArray = new Array();
    if (isNaN(selectedDateFrom) && isNaN(selectedDateTo)) {
        for (let i = 0; i < sArray.length; i++) {
            resultArray.push(sArray[i].content);
        }
    } else {
        for (let i = 0; i < sArray.length; i++) {
            if (sArray[i].date >= selectedDateFrom && sArray[i].date <= selectedDateTo) resultArray.push(sArray[i].content);
        }} return resultArray;
}
//#endregion



