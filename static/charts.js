google.charts.load("visualization", "1", {packages: ["corechart"]});
google.charts.setOnLoadCallback(getData);
function getData(date_from = null, date_to = null) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            drawChart(JSON.parse(this.response));
        }
    };
    xhttp.open("GET", "/api", true);
    xhttp.send();
    setTimeout(getData, 5 * 60 * 1000)
}
function drawChart(data) {
    let userOffset = (new Date()).getTimezoneOffset() * 60000;
    let dataTable = new google.visualization.DataTable();
    let oneDay = 24*60*60*1000;
    let diffDays = Math.round(Math.abs((new Date(data[0]['date']).getTime() - new Date(data[data.length-1]['date']).getTime())/(oneDay)));
    console.log(diffDays);
    const options = {
        vAxis: {
            scaleType: 'mirrorLog',
            title: 'Lux'
        },
        legend: {position: 'none'},
        //curveType: 'function',
        chartArea: {
            top: 55,
            height: '40%'
        },
        hAxis: {
            title: "Date",
            gridlines: {count: 11, color: '#CCC'},
            format: 'hh:mm:ss',
            ticks: data.filter((item, index) => index % 18*4*diffDays === 0).map((obj) => {
                return new Date((new Date(obj['date'])).getTime() + userOffset)
            }),
            slantedTextAngle: 45,
            slantedText: true
        },
        backgroundColor: '#fff',
        height: 500,
        width: '100%'


    };
    dataTable.addColumn('date', 'Time');
    dataTable.addColumn('number', 'Lux');
    //dataTable.addColumn('number', 'sin');
    dataTable.addColumn({type: 'string', role: 'tooltip'});
    data = data.map((obj) => {
        let date = new Date((new Date(obj['date'])).getTime() + userOffset);
        let value = obj['value'];
        //let secs = (date.getSeconds() + (60 * date.getMinutes()) + (60 * 60 * date.getHours())) / (60*60*24);
        //let sun =  Math.max(0, -1* Math.cos(secs  * Math.PI*2)) * 10000;
        return [date, value, /*sun ,*/moment(date).format('LLL') + "\nLux:  " + value + '\nSun:' + sun]
    });
    dataTable.addRows(data);
    let chart = new google.visualization.LineChart($('#chart').get(0));

    chart.draw(dataTable, options);
}
function make_measurement() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        getData();
    };
    xhttp.open("GET", "/measurement", true);
    xhttp.send();
    setTimeout(getData, 5 * 60 * 1000)
}
$('document').ready(function () {

    let datepicker = $('#date_from').datetimepicker().data('DateTimePicker');
    datepicker.options({
        'maxDate': new Date(),
        'defaultDate': moment().subtract(1, 'd'),
        'sideBySide': true,
        'showTodayButton': true,
    });
    datepicker = $('#date_to').datetimepicker().data('DateTimePicker');
    datepicker.options({
        'maxDate': new Date(),
        'defaultDate': moment(),
        'sideBySide': true,
        'showTodayButton': true,
    });
    $('#update_chart').click(() => {
        getData();
    });
    $('#make_measurement').click(() => {
        make_measurement();
    });
    $('#update_chart').click(() => {
        $.get(
            '/api',
            {
                'date_from': $('#date_from').datetimepicker().data('DateTimePicker').date().format('YYYY-MM-DD H:mm:ss'),
                'date_to': $('#date_to').datetimepicker().data('DateTimePicker').date().format('YYYY-MM-DD H:mm:ss'),
            }
        )
        .done((data) => {
            drawChart(data);
        });
    });
});
$(window).resize(function () {
    if (this.resizeTO) clearTimeout(this.resizeTO);
    this.resizeTO = setTimeout(function () {
        $(this).trigger('resizeEnd');
    }, 500);
});

//redraw graph when window resize is completed
$(window).on('resizeEnd', function () {
    getData();
});
