require(['jquery', 'underscore', 'chartjs'], function($, _, Chart) {
    var ctx = document.getElementById('myChart');
    $.getJSON('api/yearamount', function(rsp) {
        var yearamountData;
        if (rsp.message === 'OK') {
            yearamountData = rsp.data;
        }

        var yearKey = [];
        var yearValue = [];

        for (var item in yearamountData) {
            yearKey.push(item);
            yearValue.push(yearamountData[item]);
        }

        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: yearKey,
                datasets: [{
                    label: '支出',
                    data: yearValue,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                legend: {
                    display: false
                },
                responsive: false,
                hover: {
                    // Overrides the global setting
                    mode: 'single'
                },
                title: {
                    display: true,
                    text: '年支出（元/年）'
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    });
});
