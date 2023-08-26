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


function getIcon(text) {

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
                "你沒有任何書籤"
                : bookmarkSetting("get").map((data, index) => {
                  return (

                    <ListItem disablePadding >
                      <ListItemButton component={Link} to={data.url}>
                        <ListItemIcon>

                        </ListItemIcon>
                        <ListItemText primary={data.title} />
                      </ListItemButton>
                    </ListItem>)
                })
              : "你沒有任何書籤"
            }
          </List>
        </nav>
      </Box>
    </>
  )
}