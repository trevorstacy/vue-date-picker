export default {
    titlePosition: 'out',
    titleTextStyle: {
        color: '#000',
        fontSize: 14,
        fontName: 'Roboto, sans-serif',
        bold: true
    },
    theme: 'material',
    vAxis: {
        format: '#\' min.\'',
        textStyle: {
            fontName: 'Roboto, sans-serif',
            fontSize: 10,
            bold: true,
        },
        gridlines : {
            count: 6
        },
        viewWindowMode:'explicit',
        viewWindow:{
            min: 0
        }
    },
    chartArea: {
        backgroundColor: '#EFEFEF',
        width: "80%",
        height: "75%",
        left: "14%",
        top: "10%"
    },
    legend: 'none',
    series: {
        0: { color: '#B11A29', lineWidth: 3 }
    }
}