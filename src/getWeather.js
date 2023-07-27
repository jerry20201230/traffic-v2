import * as React from 'react'
import getData from './getData'

function getWeather(city,func){
    getData("https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-F29A34D9-5547-4A00-BA43-CDA0C1416940",function(res){
        for(let i=0;i<res.records.location.length;i++){
            if(res.records.location[i].locationName === String(city)){
                console.log(res.records.location[i])
                func(res.records.location[i])
                break
            }
        }
    },{useLocalCatch:false})
}

export default getWeather