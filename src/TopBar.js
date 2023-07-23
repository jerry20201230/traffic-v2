import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import MapIcon from '@mui/icons-material/Map';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import { useEffect, useState} from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from "@mui/material/Divider";
import { Link } from 'react-router-dom';

function TopBar({ title }) {
  const [showNavigation, setShowNavigation] = useState(false);
  useEffect(()=>{
    document.title = `${title} - 大眾運輸查詢系統`
  },[])
  return (
    <>
    
    <Box>
     <AppBar position="fixed" >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setShowNavigation((prev) => !prev)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <IconButton color="inherit" component={Link} to="/map" href="/map"><MapIcon /></IconButton>
        </Toolbar>
      </AppBar> 
      <Toolbar />
      <SwipeableDrawer
      sx={{zIndex:100000}}
        anchor="left"
        open={showNavigation}
        onClose={() => setShowNavigation(false)}
        onOpen={() => setShowNavigation(true)}>

        <Box sx={{ width: '100%', minWidth: 240, bgcolor: 'background.paper' }}>
          <nav aria-label="main mailbox folders">
            <List>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/">
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="首頁" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/map">
                  <ListItemIcon>
                    <MapIcon />
                  </ListItemIcon>
                  <ListItemText primary="地圖" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/setting">
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="設定" />
                </ListItemButton>
              </ListItem>
            </List>
          </nav>
          <Divider />
          <nav>
            <List>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/tra">
                  <ListItemText primary="台鐵" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/hsr">
                  <ListItemText primary="高鐵" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/mrt">
                  <ListItemText primary="捷運" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/bus">
                  <ListItemText primary="公車" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/bike">
                  <ListItemText primary="公共自行車" />
                </ListItemButton>
              </ListItem>
            </List>
          </nav>
        </Box>


      </SwipeableDrawer>
    </Box>
    </>
  );
}

export default TopBar;
