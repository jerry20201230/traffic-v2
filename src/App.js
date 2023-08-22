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

function App() {
  return (
    <>
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

        <Route path='/bike'>
          <Route index element={<BikeRoot />}></Route>
          <Route path='station/*' element={<BikeStation />}></Route>
        </Route>


        <Route path='/setting'>
          <Route index element={<SettingRoot />}></Route>
          <Route path='about' element={<SettingAbout />}></Route>
        </Route>

        <Route path='/bookmark'>
          <Route index element={<Bookmark />}></Route>
        </Route>

        <Route path='/search'>
          <Route index element={<Search />}></Route>
        </Route>

        <Route path='*' element=<Err404 /> ></Route>

      </Routes>
    </>
  );
}

export default App;
