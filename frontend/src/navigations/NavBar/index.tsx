import { Toolbar, IconButton, Typography, Box, Badge } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import React from 'react'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

export default function Navbar({ open, onClick }: any) {


  interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
  }
  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

  const navigator = useNavigate();
  const handleSignOutClick = (e : any) => {
    localStorage.clear()
    navigator('/')
    window.location.reload()
  }

  return (
    <AppBar position="fixed" open={open}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onClick}
          edge="start"
          sx={{ mr: 2, ...(open && { display: 'none' }) }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          Welcome to Medicine System
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex'}}>
          <IconButton size="large" color="inherit" onClick={handleSignOutClick} >
            <Badge color="error">
              <ExitToAppIcon />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
