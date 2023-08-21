import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import MapIcon from '@mui/icons-material/Map';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import { useEffect, useRef, useState } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from "@mui/material/Divider";
import { Link } from 'react-router-dom';
import BookmarkIcon from '@mui/icons-material/BookmarkBorder';
import SearchAnything from "./searchAnything";

function TopBar({ title }) {
  const [showNavigation, setShowNavigation] = useState(false);
  const titleRef = useRef()
  useEffect(() => {
    document.title = `${title} - 大眾運輸查詢系統`
  }, [title])
  function isElementOverflowing(element) {
    var overflowX = element.offsetWidth < element.scrollWidth,
      overflowY = element.offsetHeight < element.scrollHeight;

    return (overflowX || overflowY);
  }

  function wrapContentsInMarquee(element) {
    var marquee = document.createElement('marquee'),
      contents = element.innerText;

    marquee.innerText = contents;
    element.innerHTML = '';
    element.appendChild(marquee);
  }

  // useEffect(() => {
  //    if (isElementOverflowing(titleRef.current)) {
  //      console.log("YEEE")
  //      wrapContentsInMarquee(titleRef.current);
  //    }
  //  }, [titleRef])

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
            <Typography title={title} noWrap variant="h6" component="div" sx={{ flexGrow: 1, textOverflow: 'ellipsis' }} ref={titleRef}>
              {title}
            </Typography>
            <IconButton color="inherit" component={Link} to="/map" href="/map"><MapIcon /></IconButton>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <SwipeableDrawer
          sx={{ zIndex: 100000, height: "100%" }}
          anchor="left"
          open={showNavigation}
          onClose={() => setShowNavigation(false)}
          onOpen={() => setShowNavigation(true)}
        >


          <Box sx={{ width: '100%', minWidth: 240, bgcolor: 'background.paper' }}>
            <nav aria-label="main mailbox folders">
              <List>
                <ListItem disablePadding sx={{ p: 1, pt: 0 }}>
                  <SearchAnything type="easy" />
                </ListItem>
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
                  <ListItemButton component={Link} to="/bookmark">
                    <ListItemIcon>
                      <BookmarkIcon />
                    </ListItemIcon>
                    <ListItemText primary="書籤" />
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
                    <ListItemIcon>
                      <Typography sx={{ mr: 1, display: "inline-block", width: "1.5rem", height: "1.5rem", borderRadius: "5px", verticalAlign: "text-top", background: "linear-gradient(315deg, #004da7, #7fa9d9)" }} variant='div' ></Typography>
                    </ListItemIcon>
                    <ListItemText primary="台鐵" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/hsr">
                    <ListItemIcon>
                      <Typography sx={{ mr: 1, display: "inline-block", width: "1.5rem", height: "1.5rem", borderRadius: "5px", verticalAlign: "text-top", background: "linear-gradient(315deg, #ca4f0f, #f89867)" }} variant='div' ></Typography>
                    </ListItemIcon>
                    <ListItemText primary="高鐵" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/mrt">
                    <ListItemIcon>
                      <Typography sx={{ mr: 1, display: "inline-block", width: "1.5rem", height: "1.5rem", borderRadius: "5px", verticalAlign: "text-top", background: "linear-gradient(315deg, #8dc21f,#ccf871)" }} variant='div' ></Typography>
                    </ListItemIcon>
                    <ListItemText primary="捷運" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/bus">
                    <ListItemIcon>
                      <Typography sx={{ mr: 1, display: "inline-block", width: "1.5rem", height: "1.5rem", borderRadius: "5px", verticalAlign: "text-top", background: "linear-gradient(315deg, #8d8d8d,#ccc)" }} variant='div' ></Typography>
                    </ListItemIcon>
                    <ListItemText primary="公車" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/bike">
                    <ListItemIcon>
                      <Typography sx={{ mr: 1, display: "inline-block", width: "1.5rem", height: "1.5rem", borderRadius: "5px", verticalAlign: "text-top", background: "linear-gradient(315deg, #ffef00,#fff647)" }} variant='div' ></Typography>
                    </ListItemIcon>
                    <ListItemText primary="公共自行車" />
                  </ListItemButton>
                </ListItem>
              </List>
            </nav>
          </Box>


        </SwipeableDrawer >
      </Box >
    </>
  );
}

export default TopBar;
