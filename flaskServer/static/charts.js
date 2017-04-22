//google.charts.load('current', {packages: ['corechart']});
google.charts.load("visualization", "1", { packages: ["corechart"] });
google.charts.setOnLoadCallback(getData);
function getData(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
        drawChart(JSON.parse(this.response));
        $('#response').get(0).innerHTML = this.responseText;
    }
  };
  xhttp.open("GET", "/api", true);
  xhttp.send();
}
function drawChart(data) {
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('date', 'Time');
    dataTable.addColumn('number', 'Lux');
    data = data.map((obj) =>   [new Date(obj['date']) , obj['value']]);
    console.log(data);
    dataTable.addRows(data);
    var chart = new google.visualization.LineChart($('#chart').get(0));
    var options = {
        vAxis: {
            scaleType: 'log' ,
            title: 'Lux' },
        legend: {position: 'none'},
        hAxis: {
            title: "Date",
            gridlines: { count: 3, color: '#CCC' },
            format: 'dd-MMM-yyyy hh:mm:ss'
        }};
    chart.draw(dataTable, options);
}