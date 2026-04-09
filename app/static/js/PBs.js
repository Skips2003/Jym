function createChart(deadLift, squat, benchPress, overheadPress, snatch, cleanAndJerk){

    Chart.defaults.backgroundColor = '#56787a';
    Chart.defaults.borderColor = '#56787a';
    Chart.defaults.color = '#000';

    const PBs = document.getElementById('pbsChart');

    let lablesInUse = ['DeadLift', 'Squat', 'BenchPress', 'OverheadPress', 'Snatch', 'Clean&Jerk'];

    let dataInUse = [deadLift, squat, benchPress, overheadPress, snatch, cleanAndJerk];

    console.log(dataInUse);
    console.log(lablesInUse)

    for(i=0; i<dataInUse.length; i++){
        console.log(i)
        console.log(dataInUse[i]);
        console.log(lablesInUse[i]);
        if (dataInUse[i] == 0){
            dataInUse.splice(i, 1);
            lablesInUse.splice(i, 1);
            i--;
        }
    }

    console.log(dataInUse);
    console.log(lablesInUse)

    if(dataInUse.length == 0){
        document.getElementById("PBs").innerText = "This user has not recorded any PBs"
    }
    else{
        new Chart(PBs, {
            type: 'bar',
            data: {
              labels: lablesInUse,
              datasets: [{
                label: 'weight (kg)',
                data: dataInUse,
                borderWidth: 1
              }]
            },
            options: {
                  scales: {
                      y: {
                          beginAtZero: true
                      }
                  },
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                      legend: {
                          position: 'top',
                      }
                  }
              }
          });
    }

}