export const Pipoption = (o, s, m) => {
  const option = {
    title: {
      text: '在线用户情况',
      left: 'center'
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    legend: {
      bottom: 10,
      left: 'center',
    },
    calculable: true,
    series: [
      {
        name: "访问来源",
        type: "pie",
        radius: "50%",
        center: ["50%", "50%"],
        data: [
          { value: o, name: "当前在线人数" },
          { value: s, name: "总人数" },
          { value: m, name: "最多人数" },
        ],
      },
    ],
  };

  return option;
};

export const Lineoption = (Data) => {
  let l = Data['GET'].length;
  let Time = [];
  for (let i = 0; i < l; i++){
    Time[i] = i >= 10 ? `${i}:00` : `0${i}:00`;
  }
  console.log(Time);
  
  const option = {
    title: {
      text: 'Api每日请求流量监控'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['POST', 'PUT', 'DELETE', 'GET']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: Time
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'POST',
        type: 'line',
        stack: 'Total',
        data: Data['POST']
      },
      {
        name: 'PUT',
        type: 'line',
        stack: 'Total',
        data: Data['PUT']
      },
      {
        name: 'DELETE',
        type: 'line',
        stack: 'Total',
        data: Data['DELETE']
      },
      {
        name: 'GET',
        type: 'line',
        stack: 'Total',
        data: Data['GET']
      },
    ]
  };

  return option;
};
export const Nightingaleoption = (o: Object) => {

  let d = [];
  for (let k in o) {
    let data = {
      value: o[k],
      name: k
    };
    d.push(data);
  }
  const option = {
    title: {
      text: '近2000次请求响应时间/单位(ms)'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: 10,
      left: 'center',
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        center: ['50%', '37%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '20',
          }
        },
        labelLine: {
          show: false
        },
        data: d
      }
    ]
  };

  return option;
};