import $ from 'jquery'

function getData(tdxUrl, callback, setting) {
  console.log("[GET DATA]\nfrom: ", tdxUrl, "\nsetting:", setting, "\nlocalStorage:", Boolean(JSON.parse(localStorage.getItem(tdxUrl))), "\ngetData.js")
  function getapikey() {
    var tdxLogin = {
      grant_type: "client_credentials",
      client_id: "jerry20200815-905e4c2d-f4f9-42dd",
      client_secret: "df5c085e-f262-4258-b1d6-518e40138f71"
    };
    $.ajax({
      type: "POST",
      url: "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token",
      crossDomain: true,
      dataType: 'JSON',
      data: tdxLogin,
      async: false,
      success: function (data) {
        console.log(data)
        localStorage.setItem("loginAccess", JSON.stringify(data))
      },
      error: function (xhr, textStatus, thrownError) {
        alert("err")
      }
    });
  }

  if (tdxUrl.includes("tdx")) {
    if ((!setting.useLocalCatch || !localStorage.getItem(tdxUrl) || !setting)) {
      if (!localStorage.getItem("loginAccess")) {
        getapikey()
      }
      var accesstoken = JSON.parse(localStorage.getItem("loginAccess"));
      $.ajax({
        url: tdxUrl,
        method: "GET",
        dataType: "json",
        async: true,
        headers: {
          "authorization": "Bearer " + accesstoken.access_token,
        },
        success: function (res) {
          if (setting.useLocalCatch) { localStorage.setItem(tdxUrl, JSON.stringify(res)) }
          callback(res)
          return res
        },
        error: function (xhr, textStatus, thrownError) {
          getapikey()
        }
      })
    } else {
      callback(JSON.parse(localStorage.getItem(tdxUrl)))
    }
  }
  else{
    if ((!setting.useLocalCatch || !localStorage.getItem(tdxUrl) || !setting)) {
      if (!localStorage.getItem("loginAccess")) {
        getapikey()
      }
      var accesstoken = JSON.parse(localStorage.getItem("loginAccess"));
      $.ajax({
        url: tdxUrl,
        method: "GET",
        dataType: "json",
        async: true,
        success: function (res) {
          if (setting.useLocalCatch) { localStorage.setItem(tdxUrl, JSON.stringify(res)) }
          callback(res)
          return res
        },
        error: function (xhr, textStatus, thrownError) {
          getapikey()
        }
      })
    } else {
      callback(JSON.parse(localStorage.getItem(tdxUrl)))
    }
  }
}
export default getData;
