import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import { Link } from 'react-router-dom';
import TuneIcon from '@mui/icons-material/Tune';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Button, NativeSelect, InputLabel } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import getData from './getData';



export default function SearchAnything({ type, value, variant, sx, onSettingBtnClick, onSearchBtnClick, city }) {
  const citySelect = React.useRef()
  const [searchCity, setSearchCity] = React.useState(city ? city : "選擇縣市")
  const [tempSearchCity, setTempSearchCity] = React.useState("選擇縣市")
  const [inputVal, setInputVal] = React.useState(value ? value : "")
  const [currentCity, setCurrentCityList] = React.useState([])
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const submitButton = React.useRef()

  React.useEffect(() => {
    getData("https://tdx.transportdata.tw/api/basic/v2/Basic/City?%24format=JSON", function (res) {
      console.log(res)
      var list = ["選擇縣市"]
      for (let i = 0; i < res.length; i++) {
        list.push(res[i].CityName)
      }
      setCurrentCityList(list)

    }, { useLocalCatch: true })
  }, [])



  React.useEffect(() => {

    const handleKeyDown = (event) => {
      if (event.keyCode === 13) {
        console.log(submitButton)
        submitButton.current.click()
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [])
  /*
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions"
            onClick={(e) => {
              if (variant === 'framed') {
                setDialogOpen(true)
                if (onSettingBtnClick) {
                  onSettingBtnClick.func(onSettingBtnClick.par)
                }
              }
            }}>
            <TuneIcon />
          </IconButton>*/
  return (
    <>
      <Paper
        component="form"
        onSubmit={(e) => { e.preventDefault(); submitButton.current.click() }}
        sx={{ p: '1', mt: 2, display: 'flex', width: '100%', ...sx }}
      >
        <InputBase
          value={inputVal}
          onInput={(e) => setInputVal(e.target.value)}
          onBlur={(e) => setInputVal(e.target.value)}
          onFocus={(e) => setInputVal(e.target.value)}
          sx={{ ml: 1, flex: 1, width: "min-content" }}
          placeholder={variant === "framed-topbar" ? "搜尋" : "輸入車次、車站或地址..."}
          inputProps={{ 'aria-label': variant === "framed-topbar" ? "搜尋" : "輸入車次、車站或地址..." }}
        />

        <Button color="primary" ref={submitButton} type="button" sx={{ p: '10px' }} onClick={() => { if (onSettingBtnClick) { onSettingBtnClick.func(onSettingBtnClick.par); } setDialogOpen(true) }} >
          {searchCity}
        </Button>
        <IconButton color="primary" ref={submitButton} type="button" sx={{ p: '10px' }} aria-label="search" component={Link} to={`/route/to/search/?q=${inputVal}&city=${searchCity}&submit=now`}>
          <SearchIcon />
        </IconButton>
      </Paper>


      <Dialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); if (onSettingBtnClick) { onSettingBtnClick.func(!onSettingBtnClick.par) } }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          選擇縣市
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" component="div">
            <FormControl fullWidth>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                縣市
              </InputLabel>
              <NativeSelect
                ref={citySelect}
                defaultValue={currentCity.length ? currentCity[0] : ""}
                inputProps={{
                  name: '縣市',
                  id: 'uncontrolled-native',
                }}
                onChange={(e) => setTempSearchCity(e.target.value)}
              >
                {
                  currentCity.map((data, index) => {
                    return (<option value={data} key={"citylist-" + index}>{data}</option>)
                  })
                }
              </NativeSelect>
            </FormControl>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button

            onClick={() => {
              setDialogOpen(false);
              if (onSettingBtnClick) { onSettingBtnClick.func(!onSettingBtnClick.par) }
            }}
          >
            取消
          </Button>
          <Button
            onClick={() => {
              setDialogOpen(false);
              setSearchCity(tempSearchCity)
              if (onSettingBtnClick) { onSettingBtnClick.func(!onSettingBtnClick.par) }
            }}
          >
            確定
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}