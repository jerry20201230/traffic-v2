import * as  React from 'react'
import TopBar from '../TopBar';
import getData from '../getData';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom'
import { bookmarkSetting } from '../bookmarkSetting';
import Typography from '@mui/material/Typography';

function GetIcon({ text }) {
  if (text === "tra") {
    return (<Typography sx={{ mr: 1, display: "inline-block", width: "1.5rem", height: "1.5rem", borderRadius: "5px", verticalAlign: "text-top", background: "linear-gradient(315deg, #004da7, #7fa9d9)" }} variant='div' ></Typography>)
  } else if (text === "hsr") {
    return (<Typography sx={{ mr: 1, display: "inline-block", width: "1.5rem", height: "1.5rem", borderRadius: "5px", verticalAlign: "text-top", background: "linear-gradient(315deg, #ca4f0f, #f89867)" }} variant='div' ></Typography>)
  } else if (text === "mrt") {
    return (<Typography sx={{ mr: 1, display: "inline-block", width: "1.5rem", height: "1.5rem", borderRadius: "5px", verticalAlign: "text-top", background: "linear-gradient(315deg, #8dc21f,#ccf871)" }} variant='div' ></Typography>)
  } else if (text === "bus") {
    return (<Typography sx={{ mr: 1, display: "inline-block", width: "1.5rem", height: "1.5rem", borderRadius: "5px", verticalAlign: "text-top", background: "linear-gradient(315deg, #8d8d8d,#ccc)" }} variant='div' ></Typography>)
  } else if (text === "bike") {
    return (<Typography sx={{ mr: 1, display: "inline-block", width: "1.5rem", height: "1.5rem", borderRadius: "5px", verticalAlign: "text-top", background: "linear-gradient(315deg, #ffef00,#fff647)" }} variant='div' ></Typography>)
  } else {
    return <>N</>
  }
}

export function Bookmark() {
  return (
    <>
      <TopBar title="書籤" />
      <Box sx={{ p: 3 }}>
        <nav aria-label="">

          <List>
            {bookmarkSetting("get") !== null ?
              bookmarkSetting("get").length < 1 ?
                "你的書籤會顯示在這裡"
                : bookmarkSetting("get").map((data, index) => {
                  return (
                    <ListItem disablePadding >
                      <ListItemButton component={Link} to={data.url}>
                        <ListItemIcon>
                          <GetIcon text={data.icon} />
                        </ListItemIcon>
                        <ListItemText primary={data.title} />
                      </ListItemButton>
                    </ListItem>)
                })
              : "你的書籤會顯示在這裡"
            }
          </List>
        </nav>
      </Box>
    </>
  )
}