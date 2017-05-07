//google.charts.load('current', {packages: ['corechart']});
google.charts.load("visualization", "1", {packages: ["corechart"]});
google.charts.setOnLoadCallback(getData);
function getData() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            drawChart(JSON.parse(this.response));
        }
    };
    xhttp.open("GET", "/api", true);
    xhttp.send();
    setTimeout(getData, 5*60*1000)
}
function drawChart(data) {
    let userOffset = (new Date()).getTimezoneOffset()*60000;
    let dataTable = new google.visualization.DataTable();
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
            gridlines: {count: 20, color: '#CCC'},
            format: 'hh:mm:ss',
            ticks: data.map((obj) => { return new Date((new Date(obj['date'])).getTime() + userOffset) }),
            format: 'dd/MM HH:mm',
            slantedTextAngle: 45,
            slantedText: true
        },
        backgroundColor: '#fff',
        height : 500,
        width : '100%'


    };
    dataTable.addColumn('date', 'Time');
    dataTable.addColumn('number', 'Lux');
    console.log(userOffset);
    data = data.map((obj) => { 
          return [new Date((new Date(obj['date'])).getTime() + userOffset), obj['value'] ]
    });
    dataTable.addRows(data);
    let chart = new google.visualization.LineChart($('#chart').get(0));

    chart.draw(dataTable, options);
}
