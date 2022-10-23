import { Box, Button, Container, Divider, FormControl, Grid, Paper, Snackbar, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { EmployeeInterface } from '../../modules/IEmployees'
import { MedicineLabelInterface } from '../../modules/IMedicineLabel'
import { MedicineUseInterface } from '../../modules/IMedicineUse'
import { WarningInterface } from '../../modules/IWarning'

import { Link as RouterLink } from "react-router-dom";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function MedicineLabelCreate() {
    const [medicineLabel, setMedicineLabel] = useState<Partial<MedicineLabelInterface>>({RecordingDate: new Date(), })
    const [medicineUse, setMedicineUse] = useState<MedicineUseInterface[]>([])
    const [warning, setWarning] = useState<WarningInterface[]>([])
    const [employee, setEmployee] = useState<Partial<EmployeeInterface>>({})

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleClose: any = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setSuccess(false);
        setError(false);
    };

    const handleChange: any = (event: SelectChangeEvent) => {
        const name = event.target.name as keyof typeof medicineLabel;
        setMedicineLabel({ ...medicineLabel, [name]: event.target.value });
    };

    const apiUrl = "http://localhost:8080"

    useEffect(() => {
        const reqOptGet = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            }
        }

        const getEmployee = () => {
            fetch(`${apiUrl}/employee/${localStorage.getItem("uid")}`, reqOptGet)
                .then((res) => res.json())
                .then((res) => {
                    if (res.data) {
                        setEmployee(res.data)
                    }
                    else {
                        console.log("else data")
                    }
                })
        }

        const getMedicineUse = () => {
            fetch(`${apiUrl}/pharmacist/medicine_uses`, reqOptGet)
                .then((res) => res.json())
                .then((res) => {
                    if (res.data) {
                        setMedicineUse(res.data)
                    }
                    else {
                        console.log("else data")
                    }
                })
        }

        const getWarning = () => {
            fetch(`${apiUrl}/pharmacist/warnings`, reqOptGet)
                .then((res) => res.json())
                .then((res) => {
                    if (res.data) {
                        setWarning(res.data)
                    }
                    else {
                        console.log("else data")
                    }
                })
        }

        getMedicineUse();
        getEmployee();
        getWarning();
    }, [])

    const convertType = (data: string | number | undefined) => {
        let val = typeof data === "string" ? parseInt(data) : data;
        return val;
    };

    async function submit() {
        let data = {
            EmployeeID: convertType(localStorage.getItem("uid") as string),
            MedicineUseID: convertType(medicineLabel.MedicineUseID),
            WarningID: convertType(medicineLabel.WarningID),
            RecordingDate: medicineLabel.RecordingDate,
        };


        const requestOptions = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };

        fetch(`${apiUrl}/pharmacist/medicine_labels`, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                if (res.data) {
                    console.log("บันทึกได้")
                    setSuccess(true)
                    setErrorMessage("")
                } else {
                    console.log("บันทึกไม่ได้")
                    setError(true)
                    setErrorMessage(res.error)
                }
            });

    }

    return (
        <Container maxWidth="md">
            <Snackbar
                open={success}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={handleClose} severity="success">
                    บันทึกข้อมูลสำเร็จ
                </Alert>
            </Snackbar>
            <Snackbar
                open={error}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={handleClose} severity="error">
                    บันทึกข้อมูลไม่สำเร็จ
                </Alert>
            </Snackbar>

            <Paper>
                <Box
                    display="flex"
                    sx={{
                        marginTop: 2,
                    }}
                >
                    <Box sx={{ paddingX: 2, paddingY: 1 }}>
                        <Typography
                            component="h2"
                            variant="h6"
                            color="primary"
                            gutterBottom
                        >
                            บันทึกข้อมูลฉลากยา
                        </Typography>
                    </Box>
                </Box>

                <Divider />

                <Grid container spacing={2} sx={{ padding: 2 }}>
                    <Grid item xs={3} sx={{ textAlign: 'right' }}><p>วิธีการใช้ยา</p></Grid>
                    <Grid item xs={7}>
                        <FormControl fullWidth variant="outlined">
                            <Select
                                native
                                value={medicineLabel.MedicineUseID + ""}
                                onChange={handleChange}
                                inputProps={{
                                    name: "MedicineUseID",
                                }}
                            >
                                <option aria-label="None" value="">
                                    กรุณาเลือกวิธีการใช้ยา
                                </option>
                                {medicineUse.map((item: MedicineUseInterface) => (
                                    <option value={item.ID} key={item.ID}>
                                        {item.How_To_Use}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ padding: 2 }}>
                    <Grid item xs={3} sx={{ textAlign: 'right' }}><p>คำเตือน</p></Grid>
                    <Grid item xs={7}>
                        <FormControl fullWidth variant="outlined">
                            <Select
                                native
                                value={medicineLabel.WarningID + ""}
                                onChange={handleChange}
                                inputProps={{
                                    name: "WarningID",
                                }}
                            >
                                <option aria-label="None" value="">
                                    กรุณาเลือกคำเตือน
                                </option>
                                {warning.map((item: WarningInterface) => (
                                    <option value={item.ID} key={item.ID}>
                                        {item.Medicine_Warning}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ padding: 2 }}>
                    <Grid item xs={3} sx={{ textAlign: 'right' }}><p>เภสัชกร</p></Grid>
                    <Grid item xs={5}>
                        <FormControl fullWidth variant="outlined">
                            <Select
                                native
                                value={medicineLabel.EmployeeID + ""}
                                onChange={handleChange}
                                disabled
                                inputProps={{
                                    name: "EmployeeID",
                                }}
                            >
                                <option value={employee?.ID} key={employee?.ID}>
                                    {employee?.Name}
                                </option>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ padding: 2 }}>
                    <Grid item xs={3} sx={{ textAlign: 'right' }}>
                        <p>วันที่และเวลา</p>
                    </Grid>
                    <Grid item xs={5}>
                        <FormControl fullWidth variant="outlined">
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    value={medicineLabel.RecordingDate}
                                    onChange={(newValue) => {
                                        setMedicineLabel({
                                            ...medicineLabel,
                                            RecordingDate: newValue,
                                        });
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid item xs={12} spacing={2} sx={{ padding: 2 }}>
                    <Button
                        component={RouterLink}
                        to="/home"
                        variant="contained"
                        color="inherit"
                    >
                        กลับ
                    </Button>
                    <Button
                        style={{ float: "right" }}
                        onClick={submit}
                        variant="contained"
                        color="primary"
                    >
                        บันทึกฉลากยา
                    </Button>
                </Grid>
            </Paper>
        </Container>
    );
}
