import './App.css';
import HomePage from './pages/HomePage2';
import Err404 from './pages/Error404';
import Map from './pages/Map';
import TraRoot from './pages/TraRoot';
import TraStation from './pages/TraStation';
import TraTrain from './pages/TraTrain';
import { Route, Routes } from 'react-router-dom'
import { Switch } from 'react-router-dom'
import BikeRoot from './pages/BikeRoot';
import SettingRoot from './pages/SettingRoot';
import SettingAbout from './pages/SettingAbout';
import HsrRoot from './pages/HsrRoot';
import HsrStation from './pages/HsrStation';
import HsrTrain from './pages/HsrTrain';
import { Bookmark } from './pages/Bookmark';
import BikeStation from './pages/BikeStation';
import Search from './pages/Search';
import GoToLocation from './GoToLocation';
import { BusRoot } from './pages/BusRoot';
import { PlanRoot } from './pages/Plan';
import { useEffect } from 'react';
import { Welcome } from './pages/Welcome';
import { BusRoute } from './pages/BusRoute';
import $ from 'jquery'
import * as React from 'react'

function App() {

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

        setRoute(
          <Routes>
            <Route path='/' element=<HomePage /> ></Route>
            <Route path='/index.html' element=<HomePage /> ></Route>
            <Route path='/map/*' element=<Map />></Route>

            <Route path='/tra'>
              <Route index element=<TraRoot />></Route>
              <Route path='station/*' element=<TraStation />></Route>
              <Route path='train/*' element=<TraTrain />></Route>
            </Route>

            <Route path='/hsr'>
              <Route index element=<HsrRoot />></Route>
              <Route path='station/*' element=<HsrStation />></Route>
              <Route path='train/*' element=<HsrTrain />></Route>
            </Route>

            <Route path='/bus'>
              <Route index element=<BusRoot />></Route>
              <Route path='station/*' element=<HsrStation />></Route>
              <Route path='route/*' element=<BusRoute />></Route>
            </Route>

            <Route path='/bike'>
              <Route index element={<BikeRoot />}></Route>
              <Route path='station/*' element={<BikeStation />}></Route>
            </Route>

            <Route path='/plan'>
              <Route index element={<PlanRoot />}></Route>
              <Route path='station/*' element={<BikeStation />}></Route>
            </Route>

            <Route path='/setting'>
              <Route index element={<SettingRoot />}></Route>
              <Route path='about' element={<SettingAbout CURRENT_VER={CURRENT_VER} />}></Route>
            </Route>

            <Route path='/bookmark'>
              <Route index element={<Bookmark />}></Route>
            </Route>

            <Route path='/search'>
              <Route index element={<Search />}></Route>
            </Route>


            <Route path='/route/to/*' element={<GoToLocation />}>
            </Route>

            <Route path='*' element=<Err404 /> ></Route>
          </Routes>
        )
      },
      error: function (xhr, textStatus, thrownError) {
        setRoute(
          <Routes>
            <Route path='*' element=<h1>ERROR</h1> ></Route>
          </Routes>

        )
        return
      }
    });
  }


  const CURRENT_VER = "1.0.4"

  const [route, setRoute] = React.useState(
    <h1>LOADING...</h1>

  )
  const [page, setPage] = React.useState(<>
    {(!localStorage.getItem("ver") || localStorage.getItem("ver") !== CURRENT_VER) ? <Welcome CURRENT_VER={CURRENT_VER} /> :
      route
    }
  </>)
  React.useEffect(() => {
    getapikey()
  }, [])
  React.useEffect(() => {
    setPage(
      <>{(!localStorage.getItem("ver") || localStorage.getItem("ver") !== CURRENT_VER) ? <Welcome CURRENT_VER={CURRENT_VER} /> :
        route
      }</>)
  }, [route])
  return (
    <>
      {page}
    </>
  );
}

export default App;
