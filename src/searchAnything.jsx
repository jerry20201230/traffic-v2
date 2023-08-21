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
import { Button } from '@mui/material';

export default function SearchAnything({ type, value, variant }) {
  const [inputVal, setInputVal] = React.useState(value ? value : "")
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const submitButton = React.useRef()



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

  return (
    <>
      <Paper
        component="form"
        onSubmit={(e) => { e.preventDefault(); submitButton.current.click() }}
        sx={{ p: '1', mt: 2, display: 'flex', width: '100%' }}
      >
        <InputBase
          value={inputVal}
          onInput={(e) => setInputVal(e.target.value)}
          onBlur={(e) => setInputVal(e.target.value)}
          onFocus={(e) => setInputVal(e.target.value)}
          sx={{ ml: 1, flex: 1 }}
          placeholder={type === "easy" ? "簡易搜尋..." : '輸入任何關鍵字...'}
          inputProps={{ 'aria-label': type === "easy" ? "簡易搜尋..." : '輸入任何關鍵字...' }}
        />

        <IconButton ref={submitButton} type="button" sx={{ p: '10px' }} aria-label="search" component={Link} to={`/search/?q=${inputVal}`}>
          <SearchIcon />
        </IconButton>
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions"
          onClick={(e) => {
            if (variant === 'framed') {
              setDialogOpen(true)
            }
          }}>
          <TuneIcon />
        </IconButton>
      </Paper>


      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          選擇搜尋方式
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" component="div">

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button

            onClick={() => {
              setDialogOpen(false);
            }}
          >
            取消
          </Button>
          <Button
            onClick={() => {
              setDialogOpen(false);
            }}
          >
            確定
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}