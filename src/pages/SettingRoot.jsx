import * as React from 'react';
import TopBar from '../TopBar';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';

import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InfoIcon from '@mui/icons-material/Info';

function SettingRoot() {


  return (
    <>
      <TopBar title="設定" />
      <Box sx={{ p: 3 }}>
      <List>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/setting/about">
                  <ListItemIcon>
                    <InfoIcon />
                  </ListItemIcon>
                  <ListItemText primary="關於" />
                </ListItemButton>
              </ListItem>
            </List>
      </Box>
    </>
  )
}

export default SettingRoot;
