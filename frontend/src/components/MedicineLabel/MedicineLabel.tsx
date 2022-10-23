import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { MedicineLabelInterface } from "../../modules/IMedicineLabel";

function MedicineLabel() {
    const [medicineLabel, setMedicineLabel] = useState<MedicineLabelInterface[]>([]);

    const apiUrl = "http://localhost:8080";

    useEffect(() => {
        const reqOptGet = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            }
        }

        const getMedicineLabel = () => {
            fetch(`${apiUrl}/pharmacist/medicine_labels`, reqOptGet)
                .then((res) => res.json())
                .then((res) => {
                    if (res.data) {
                        setMedicineLabel(res.data)
                    }
                    else {
                        console.log("else")
                    }
                })
        }

        getMedicineLabel();
        
    }, []);

    

    const columns: GridColDef[] = [
        { field: "ID", headerName: "ลำดับ", width: 50 },
        {
            field: "MedicineUse",
            headerName: "วิธีการใช้ยา",
            width: 225,
            valueFormatter: (params) => params.value.How_To_Use,
        },
        {
            field: "Warning",
            headerName: "คำเตือน",
            width: 225,
            valueFormatter: (params) => params.value.Medicine_Warning,
        },
        {
            field: "Employee",
            headerName: "เภสัชกร",
            width: 160,
            valueFormatter: (params) => params.value.Name,
        },
        { field: "RecordingDate", 
        headerName: "วันที่และเวลา", 
        width: 250 },
    ];
    

    return (
        <div>
            <Container maxWidth="md">
                <Box
                    display="flex"
                    sx={{
                        marginTop: 2,
                    }}
                >
                    <Box flexGrow={1}>
                        <Typography
                            component="h2"
                            variant="h6"
                            color="primary"
                            gutterBottom
                        >
                            ข้อมูลฉลากยา
                        </Typography>
                    </Box>
                    <Box>
                        <Button
                            component={RouterLink}
                            to="/medicine_labels/create"
                            variant="contained"
                            color="primary"
                        >
                            สร้างข้อมูล
                        </Button>

                    </Box>
                </Box>
                <div style={{ height: 400, width: "105%", marginTop: "20px" }}>
                    <DataGrid
                        rows={medicineLabel}
                        getRowId={(row) => row.ID}
                        columns={columns}
                        pageSize={6}
                        rowsPerPageOptions={[6]}
                    />
                </div>
            </Container>
        </div>
    );
}

export default MedicineLabel;