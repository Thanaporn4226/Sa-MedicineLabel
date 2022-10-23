import { Container, Box, Typography, Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react'
import { MedicineInterface } from '../../modules/IMedicine';
import { Link as RouterLink } from "react-router-dom";

export const Medicine = () => {
  const [medicine, setMedicine] = useState<MedicineInterface[]>([]);

  const apiUrl = "http://localhost:8080";
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  const getMedicine = async () => {
    fetch(`${apiUrl}/medicine/medicine`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log(res.data);
        if (res.data) {
            setMedicine(res.data);
        } else {
          console.log("else");
        }
      });
  };

  useEffect(() => {
    getMedicine();
  }, []);
  
  return (
    <div>
        <Container maxWidth="md">
        <Box display="flex">
          <Box flexGrow={1}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              ข้อมูลยา
            </Typography>
          </Box>
          <Box>
            <Button
              component={RouterLink}
              to="/medicine/create"
              variant="contained"
              color="primary"
            >
              สร้างข้อมูล
            </Button>
          </Box>
        </Box>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center" width="10%">
                  ลำดับ
                </TableCell>
                <TableCell align="center" width="20%">
                  ชื่อยา
                </TableCell>
                <TableCell align="center" width="20%">
                  ประเภทยา
                </TableCell>
                <TableCell align="center" width="20%">
                  สถาที่จัดเก็บ
                </TableCell>
                <TableCell align="center" width="30%">
                  จำนวน
                </TableCell>
                <TableCell align="center" width="30%">
                  วันที่ผลิต
                </TableCell>
                <TableCell align="center" width="30%">
                  วันหมดอายุ
                </TableCell>
                <TableCell align="center" width="30%">
                  เจ้าหน้าที่
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medicine.map((item: MedicineInterface) => (
                <TableRow key={item.ID}>
                  <TableCell align="center">{item.ID}</TableCell>
                  <TableCell align="center">{item.Name}</TableCell>
                  <TableCell align="center">{item.Type.Utilzation}</TableCell>
                  <TableCell align="center">{item.Storage.Name}</TableCell>
                  <TableCell align="center">{item.Amount}</TableCell>
                  <TableCell align="center">{format((new Date(item.MFD)), 'dd MMMM yyyy hh:mm a')}</TableCell>
                  <TableCell align="center">{format((new Date(item.EXP)), 'dd MMMM yyyy hh:mm a')}</TableCell>
                  <TableCell align="center">{item.Employee.Name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  )
}
