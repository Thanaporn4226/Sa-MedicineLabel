import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box, Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Link as RouterLink } from "react-router-dom";
import { EmployeeInterface } from '../../modules/IEmployees';

export default function Employees() {
    const [employee, setEmployee] = useState<EmployeeInterface[]>([]);

    const getEmployee = async () => {
        const apiUrl = "http://localhost:8080/medicine/employees";
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        };

        fetch(apiUrl, requestOptions)
        .then((response) => response.json())
        .then((res) => {
          if (res.data) {
            setEmployee(res.data);
          } else {
            console.log("else");
          }
        });
    };

    React.useEffect(() => {
        getEmployee();
    },[])

    return (
        <Box >
            <Box display="flex">
                <Box flexGrow={1}>
                    <Typography
                        component="h2"
                        variant="h6"
                        color="primary"
                        gutterBottom
                    >
                        ข้อมูลเจ้าหน้าที่ดูแลคลังยา
                    </Typography>
                </Box>
                <Box>
                    <Button
                        component={RouterLink}
                        to="/employee/create"
                        variant="contained"
                        color="primary"
                    >
                        สร้างข้อมูล
                    </Button>
                </Box>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">ลำดับ</TableCell>
                            <TableCell align="center">ชื่อ</TableCell>
                            <TableCell align="center">นามสกุล</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employee.map((employee: EmployeeInterface) => (
                            <TableRow
                                key={employee.ID}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="center">{employee.ID}</TableCell>
                                <TableCell align="center">{employee.Name}</TableCell>
                                <TableCell align="center">{employee.Surname}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}
