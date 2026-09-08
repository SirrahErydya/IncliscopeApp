// DATA

function range(start, stop, num_samples) {
    a = Array(num_samples);
    step = (stop-start+1)/num_samples;
    value = start;
    for(i=0; i<num_samples; i++) {
        a[i] = value;
        value += step;
    }
    console.log(a);
    return a
}

function pdf(x, mean, std) {
    return (1./Math.sqrt(2*Math.PI*std**2)) * Math.exp(-0.5 * ((x-mean)/std)**2);
}

function mixed_pdf(x, means, stds, alphas) {
    var n = alphas[0] * pdf(x, means[0], stds[0]);
    for(i=1; i<alphas.length; i++) {
        n += alphas[i] * pdf(x, means[i], stds[i]);
    }
    return n;
}


(async function() {
    // DATA
    const samples = range(0.0, 90.00, 900.);

    // PLUGINS
    corsairPlugin = {
        id: 'corsair',
        defaults: {
            color: '#FF4949',
        },
        afterInit: (chart, args, opts) => {
            chart.corsair = {
                x: 0,
                y: 0,
                draw: false
            }
        },
        afterEvent: (chart, args) => {
            const {inChartArea} = args
            const {type,x,y} = args.event

            chart.corsair = {x, y, draw: inChartArea}
            chart.draw()
        },
        afterDatasetsDraw: (chart, args, opts) => {
            if (!chart.corsair) {
                chart.corsair = { x: 0, y: 0, draw: false };
            }
            const {ctx} = chart
            const {top, bottom, left, right} = chart.chartArea
            const {x, y, draw} = chart.corsair
            if (!draw) return

            ctx.save()

            ctx.beginPath()
            ctx.lineWidth = 3
            ctx.strokeStyle = opts.color
            ctx.moveTo(x, bottom)
            ctx.lineTo(x, top)
            ctx.stroke()

            /*ctx.beginPath()
            ctx.lineWidth = 1
            ctx.strokeStyle = opts.color
            ctx.moveTo(left, y)
            ctx.lineTo(right, y)
            ctx.stroke()*/
            console.log(x)

            if(!chart.tooltip.getActiveElements().length) {
                chart.tooltip.setActiveElements([{
                    datasetIndex: 0,
                    index: x
                }]);
                chart.update();
              }

            ctx.restore()
        }
    }

    // CHART
    const ctx = document.getElementById('pdf');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: samples,
            datasets: [{
                label: 'Probability',
                data: samples.map(s => mixed_pdf(s, pred_mean, pred_std, pred_alpha))
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            hover: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                corsair: {
                    color: 'red'
                },
                tooltip: {
                    callbacks: {
                        title: function (ctx) {
                            // 1. Get the raw numeric value
                            const chart = ctx[0].chart

                            let value = chart.scales.x.getValueForPixel(ctx[0].parsed.x);

                            // 2. Round the value (Choose Option A or B below)
                            // Option B: Round to exactly 2 decimal places
                            let roundedValue = value.toFixed(2)/10;

                            // 3. Return the formatted string (Dataset Label: Value)
                            return `i = ${roundedValue}°`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        // For a category axis, the val is the index so the lookup via getLabelForValue is needed
                        callback: function(val, index) {
                            // Hide every 2nd tick label
                            return index % 3 === 0 ? this.getLabelForValue(val).toFixed(2) + '°' : '';
                        }
                    },
                    title: {
                        display: true,
                        text: "Inclination Angle"
                    }
                }
            }
        },
        plugins: [ corsairPlugin ]
    });
}())

// UI Functionalities
const smaSlider = document.querySelector('#sma');
const smiSlider = document.querySelector('#smi');
const sma = document.querySelector('#sma-value');
const smi = document.querySelector('#smi-value');
sma.textContent = smaSlider.value;
smi.textContent = smiSlider.value;

smaSlider.addEventListener("input", (event) => {
  sma.textContent = event.target.value;
});

smiSlider.addEventListener("input", (event) => {
  smi.textContent = event.target.value;
});

