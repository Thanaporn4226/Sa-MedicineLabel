import { Container, Box, Typography, Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Divider, FormControl, Grid, Select, Snackbar, TextField } from '@mui/material';

import React, { useEffect, useState } from 'react'
import { MedicineInterface } from '../../modules/IMedicine';
import { Link as RouterLink } from "react-router-dom";
import { EmployeeInterface } from '../../modules/IEmployees';
import { StorageInterface } from '../../modules/IStorage';
import { TypeInterface } from '../../modules/IType';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { Medicine } from '../Medicine';
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";


  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const MedicineCrate = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  
    const [employee, setEmployee] = useState<EmployeeInterface>();
    const [storage, setStorage] = useState<StorageInterface[]>([]);
    const [type, setType] = useState<TypeInterface[]>([]);
    const [medicine, setMedicine] = useState<Partial<MedicineInterface>>(
      { EXP: new Date(),
        MFD: new Date(),}
    );
    
    const [value, setValue] = React.useState<Dayjs | null>(null);

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
  
    const apiUrl = "http://localhost:8080";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
  
    const handleClose: any = (event?: React.SyntheticEvent, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }
      setSuccess(false);
      setError(false);
    };
  
    const handleChange: any = (
      event: React.ChangeEvent<{ name?: string; value: unknown }>
    ) => {
      const name = event.target.name as keyof typeof medicine;
      setMedicine({
        ...medicine,
        [name]: event.target.value,
      });
    };

    const handleInputChange = (
      event: React.ChangeEvent<{ id?: string; value: any }>
    ) => {
      const id = event.target.id as keyof typeof MedicineCrate;
      const { value } = event.target;
      setMedicine({ ...medicine, [id]: value });
    };
  
    const handleDateChange = (date: Date | null) => {
      console.log(date);
      setSelectedDate(date);
    };
  
    const getEmployee = async () => {
      let uid = localStorage.getItem("uid");
      fetch(`${apiUrl}/medicine/employee/${uid}`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
          medicine.EmployeeID = res.data.ID
          if (res.data) {
              setEmployee(res.data);
          } else {
            console.log("else");
          }
        });
    };
    
    const getStorage = async () => {
      fetch(`${apiUrl}/medicine/storage`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
          if (res.data) {
              setStorage(res.data);
          } else {
            console.log("else");
          }
        });
    };
  
    const getType = async () => {
      fetch(`${apiUrl}/medicine/type`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
          if (res.data) {
              setType(res.data);
          } else {
            console.log("else");
          }
        });
    };
  
    useEffect(() => {
      getEmployee();
      getStorage();
      getType();
      
    }, []);
  
    const convertType = (data: string | number | undefined) => {
      let val = typeof data === "string" ? parseInt(data) : data;
      return val;
    };

    
  
    function submit() {
      let data = {
        EmployeeID: convertType(medicine.EmployeeID),
        StorageID: convertType(medicine.StorageID),
        TypeID: convertType(medicine.TypeID),
        Name: convertType(medicine.Name),
        MFD:    medicine.MFD,
        EXP:    medicine.EXP,
        Amount: convertType(medicine.Amount),
      };
  
      console.log(data)
      
  
      const requestOptionsPost = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
  
      fetch(`${apiUrl}/medicine/medicine`, requestOptionsPost)
        .then((response) => response.json())
        .then((res) => {
          if (res.data) {
            console.log("บันทึกได้")
            setSuccess(true);
          } else {
            console.log("บันทึกไม่ได้")
            setError(true);
          }
        });
    }

  return (
    <div>
    <Container maxWidth="md">
      <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          บันทึกข้อมูลสำเร็จ
        </Alert>
      </Snackbar>
      <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          บันทึกข้อมูลไม่สำเร็จ
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
              บันทึกข้อมูลยา
            </Typography>
          </Box>
        </Box>
        <Divider />

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <p>EXP</p>
            <FormControl fullWidth variant="outlined">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
              label="Basic example"
              value={medicine.EXP}
              onChange={(newValue) => {
                setValue(value);
              }}
              renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <p>MFD</p>
            <FormControl fullWidth variant="outlined">
              <p>วันที่และเวลา</p>

            </FormControl>
          </Grid>

          <Grid item xs={6}>
          <p>ชื่อ - สกุล</p>
            <FormControl fullWidth variant="outlined">
                <TextField
                  id="Name"
                  variant="outlined"
                  type="string"
                  size="medium"
                  placeholder="กรุณากรอกข้อมูลชื่อ"
                  value={medicine.Name || ""}
                  onChange={handleInputChange}
                />
              </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ประเภทยา</p>
              <Select
                native
                value={medicine.TypeID}
                onChange={handleChange}
                inputProps={{
                  name: "TypeID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกชื่อยา
                </option>
                {type.map((item: TypeInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Utilzation}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>  

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>สถานที่จัดเก็บ</p>
              <Select
                native
                value={medicine.StorageID}
                onChange={handleChange}
                inputProps={{
                  name: "StorageID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกสถานที่จัดเก็บ
                </option>
                {storage.map((item: StorageInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6}>
            <p>จำนวนยา</p>
            <FormControl fullWidth variant="outlined">
              <TextField
                id="medicineAmount"
                variant="outlined"
                type= "number"
                size="medium"
                placeholder="กรุณากรอกข้อมูลชื่อ"
                value={medicine.Amount}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

        
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ชื่อเจ้าหน้าที่</p>
              <Select
                native
                value={medicine.EmployeeID + ""}
                onChange={handleChange}
                disabled
                inputProps={{
                  name: "EmployeeID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกชื่อเจ้าหน้าที่
                </option>
                <option value={employee?.ID} key={employee?.ID}>
                  {employee?.Name}
                </option>
                
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Button
              component={RouterLink}
              to="/medicines"
              variant="contained"
            >
              กลับ
            </Button>
            <Button
              style={{ float: "right" }}
              variant="contained"
              onClick={submit}
              color="primary"
            >
              บันทึก
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
    </div>
  )
}
