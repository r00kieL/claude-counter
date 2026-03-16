生命体征 = {
  "data": {
    "dutyPerson": {
      "total": 2,
      "lateCheckTime": {},
      "detail": [{
        "signPlace": "拱墅区绿地中心7幢主控室",
        "picUrl": "http:/xxx.xxx.x.x/pic/LandscapeDuty/1767683723584.jpg",
        "regionalSourcesName": "杭州市",
        "earlyCheckTime": 315,
        "watchkeeper": "张三"
      },
      {
        "signPlace": "海创园1幢501机房",
        "picUrl": "http:/xxx.xxx.x.x/slmp/upload/d249fef075acdd56cd5ae8a54686e70f.jpg",
        "regionalSourcesName": "余杭区",
        "earlyCheckTime": 40,
        "watchkeeper": "李四"
      }
      ]
    },
    "dutyCategory": {
      "total": 2,
      "detail": [{
        "createdAt": 1767692102720,
        "picUrl": "https:/xxx.xxx.x.x/20260106/20c4a8099977a42c5c6953b44e2f4329.jpg",
        "regionalSourcesName": "余杭区",
        "programName": "微动态-日常模式",
        "name": "余杭区灯光秀",
        "delayPlaybackTime": 0
      },
      {
        "createdAt": 1767693685171,
        "picUrl": "http:/112.17.252.167:8889/video/2222222222222.jpg,",
        "regionalSourcesName": "西湖区",
        "programName": "平日模式",
        "name": "西湖区媒体墙灯光秀",
        "delayPlaybackTime": 0
      }
      ],
      "latePlayBack": {}
    },
    "alarm": {
      "street": {
        "total": 2,
        "detail": [{
          "categoryType": 0,
          "recoveryTime": 1767695666000,
          "createdAt": 1767690743074,
          "reason": "RTU失电",
          "regionalSourcesName": "余杭区",
          "factoryName": "余杭塘路-005",
          "generateTime": 1767690659000,
          "importanceDistrict": 0
        },
        {
          "categoryType": 0,
          "recoveryTime": 1767761996000,
          "createdAt": 1767696079740,
          "reason": "RTU失电",
          "regionalSourcesName": "余杭区",
          "factoryName": "余杭塘路-005",
          "generateTime": 1767695994000,
          "importanceDistrict": 0
        }
        ]
      },
      "secne": {
        "total": 2,
        "detail": [{
          "categoryType": 1,
          "recoveryTime": 1767695666000,
          "createdAt": 1767690743074,
          "reason": "RTU失电",
          "regionalSourcesName": "余杭区",
          "factoryName": "余杭塘路-005",
          "generateTime": 1767690659000,
          "importanceDistrict": 0
        },
        {
          "categoryType": 1,
          "recoveryTime": 1767761996000,
          "createdAt": 1767696079740,
          "reason": "RTU失电",
          "regionalSourcesName": "余杭区",
          "factoryName": "余杭塘路-005",
          "generateTime": 1767695994000,
          "importanceDistrict": 0
        }
        ]
      }
    },
    "lightingMode": {
      "secne": {
        "total": 2,
        "detail": [
          {
            "boxModelingName": "（东望）广利大厦",
            "categoryType": 1,
            "recoveryTime": 1722568307000,
            "createdAt": 1767677092000,
            "reason": "在开灯策略时间外，招测C相电流大于零电流标定配置",
            "regionalSourcesName": "西湖区",
            "factoryName": "（东望）广利大厦二号",
            "generateTime": 1722565347000,
            "importanceDistrict": 0
          },
          {
            "boxModelingName": "测试",
            "createdAt": 1767677092000,
            "reason": "在开灯策略时间外，招测C相电流大于零电流标定配置",
            "regionalSourcesName": "拱墅区",
            "factoryName": "测试"
          }
        ]
      }
    }
  },
  "result": {
    "code": "0",
    "errorParams": {
      "": ""
    },
    "message": "",
    "status": 200
  }
}

// ---------------------------------------------------

try {
  function format(time) {
    // 1. 防御性编程：如果 time 为空，直接返回空字符串或默认值
    if (!time) return "";

    const date = new Date(time);

    // 2. 核心修复：检查日期是否有效
    // isNaN(date.getTime()) 是判断 Date 对象是否有效的标准方法
    if (isNaN(date.getTime())) {
      console.warn("无效的时间格式:", time);
      return time; // 或者返回 "时间格式错误"，或者直接返回原字符串避免 NaN
    }

    const p = num => num <= 9 ? "0" + num : num;

    // 此时可以安全地调用 getFullYear 等方法，因为已经确认 date 有效
    const year = date.getFullYear();
    const month = p(date.getMonth() + 1);
    const day = p(date.getDate());
    const hours = p(date.getHours());
    const minutes = p(date.getMinutes());
    const seconds = p(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  const {
    生命体征: data1,
    昨日亮灯率_详情列表: data2,
    smType1: type1,
    smType2: type2
  } = callbackArgs;

  console.log("昨日亮灯率_详情列表: ", data2);

  if (type2 === "lightingRate") {
    const { detail: lightRateList } = data2;

    return lightRateList
      .map(({ regionalSourcesName, lightingRate }) => ({
        "区域": regionalSourcesName,
        "亮灯率": lightingRate,
      }))
  }

  const obj = data1[0].data;
  const { total, detail } = obj[type2][type1];
  return detail.map(d => {
    return {
      "区域": d.regionalSourcesName,
      "名称": d.factoryName,
      "告警原因": d.reason,
      "发生时间": format(d.generateTime)
    }
  })

} catch (e) {
  return data;
}

smType2: alarm(应亮未亮), lightingMode(亮灯率);
smType1: street(道路照明), secne(景观照明);

try {
  function format(time) {
    const date = new Date(time);
    const p = num => num <= 9 ? "0" + num : num;
    const year = date.getFullYear();
    const month = p(date.getMonth() + 1);
    const day = p(date.getDate());
    const hours = p(date.getHours());
    const minutes = p(date.getMinutes());
    const seconds = p(date.getSeconds());
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  const {
    生命体征: data1,
    昨日亮灯率_详情列表: data2,
    smType1: type1,
    smType2: type2
  } = callbackArgs;

  console.log("昨日亮灯率_详情列表: ", data2);

  if (type2 === "lightingRate") {
    const { detail: lightRateList } = data2;

    return lightRateList
      .map(({ regionalSourcesName, lightingRate }) => ({
        "区域": regionalSourcesName,
        "亮灯率": lightingRate,
      }))
  }


  const obj = data1[0].data;
  const { total, detail } = obj[type2][type1];
  return detail.map(d => {
    return {
      "区域": d.regionalSourcesName,
      "名称": d.factoryName,
      "告警原因": d.reason,
      "发生时间": format(d.generateTime)
    }
  })

} catch (e) {
  return data;
}