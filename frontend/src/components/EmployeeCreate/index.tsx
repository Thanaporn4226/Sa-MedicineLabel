import { AlertProps, Box, Button, Container, Divider, FormControl, Grid, Paper, Snackbar, TextField, Typography } from '@mui/material';
import { sign } from 'crypto';
import React, { useState } from 'react'
import { EmployeeInterface } from '../../modules/IEmployees';
import { SigninInterface } from '../../modules/ISingin';
import { Link as RouterLink } from "react-router-dom";
import { LoginInterface } from '../../modules/ILogin';


function Alert(props: AlertProps) {
  return <Alert elevation={6} variant="filled" {...props} />;
}

export const EmployeeCreate = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [employee, setEmployee] = useState<Partial<EmployeeInterface>>({});
  const [signin, setSignin] = useState<Partial<SigninInterface>>({})
  
  const [login, setLogin] = useState<Partial<LoginInterface>>({})
  
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);


  const handleClose : any = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
    setError(false);
  };

  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof employee;
    const { value } = event.target;
    setEmployee({ ...employee, [id]: value });
  };

  const handleInputChangeLogin = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof login;
    const { value } = event.target;
    setLogin({ ...login, [id]: value });
  };

  function submit() {
    let data = {
      Eid: employee.ID ?? "",
      Name: employee.Name ?? "",
      Surname: employee.Surname ?? "",
      Username: login.username ?? "",
      Password: login.password ?? "",
    };

    const apiUrl = "http://localhost:8080/medicine/employees";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setSuccess(true);
        } else {
          setError(true);
        }
      });
  }
  return (
    <div>
      <Container maxWidth="md">
        
      <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          ??????????????????????????????????????????????????????
        </Alert>
      </Snackbar>

      <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          ???????????????????????????????????????????????????????????????
        </Alert>
      </Snackbar>

      <Paper>
        <Box display="flex">
          <Box flexGrow={1}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              ???????????????????????????????????????????????????????????????????????????????????????????????????
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Grid container spacing={3} >
          <Grid item xs={6}>
            <p>????????????</p>
            <FormControl fullWidth variant="outlined">
              <TextField
                id="Name"
                variant="outlined"
                type="string"
                size="medium"
                placeholder="?????????????????????????????????????????????????????????"
                value={employee.Name || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <p>?????????????????????</p>
            <FormControl fullWidth variant="outlined">
              <TextField
                id="Surname"
                variant="outlined"
                type="string"
                size="medium"
                placeholder="??????????????????????????????????????????????????????????????????"
                value={employee.Surname || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>Username</p>
              <TextField
                id="username"
                variant="outlined"
                type="string"
                size="medium"
                placeholder="??????????????????????????? Username"
                value={login.username}
                onChange={handleInputChangeLogin}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <p>Password</p>
            <FormControl fullWidth variant="outlined">
              <TextField
                id="Password"
                variant="outlined"
                type="password"
                size="medium"
                placeholder="??????????????????????????? Password"
                value={login.password}
                onChange={handleInputChangeLogin}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button component={RouterLink} to="/employees" variant="contained">
              ????????????
            </Button>
            <Button
              style={{ float: "right" }}
              onClick={submit}
              variant="contained"
              color="primary"
            >
              ??????????????????
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
    </div>
  )
}
