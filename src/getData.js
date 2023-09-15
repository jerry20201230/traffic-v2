import $ from 'jquery'
import * as React from 'react'


function getData(tdxUrl, callback, setting, i) {
  console.log("[GET DATA]\nfrom: ", tdxUrl, "\nsetting:", setting, "\nlocalStorage:", Boolean(JSON.parse(localStorage.getItem(tdxUrl))), "\ngetData.js")

  try {
    if (tdxUrl.includes("tdx")) {
      if ((!setting.useLocalCatch || !localStorage.getItem(tdxUrl) || !setting)) {
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
            return
          }
        })

      } else {
        callback(JSON.parse(localStorage.getItem(tdxUrl)))
      }
    }
    else {
      try {
        if ((!setting.useLocalCatch || !localStorage.getItem(tdxUrl) || !setting)) {
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
              return
            }
          })

        }
      }
      catch (e) {
        try {
          callback(JSON.parse(localStorage.getItem(tdxUrl)))
        } catch {

        }
      }
    }
  } catch {
    return 0
  }
}
export default getData;
