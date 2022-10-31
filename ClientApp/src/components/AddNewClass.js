import React, { useState } from "react";
import { Box, Typography, TextField, Grid, InputAdornment, Button, CircularProgress } from "@mui/material";
import { Class as ClassIcon, Description, Person } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

export function AddNewClass(props) {
    const [loading, setLoading] = useState(false);
    const [className, setClassName] = useState("");
    const [classDescription, setClassDescription] = useState("");
    const [teacherName, setTeacherName] = useState("");

    const navigate = useNavigate();

    return (
        <Box 
            sx={{backgroundColor: "#1f232d", borderRadius: 1, width: { md: "auto", xs: "100vw" } , minHeight: { md: "auto", xs: "94vh" }}} 
            padding={2}
            display={{ md: "auto", xs: "flex" }}             
            alignItems="center"
            justifyContent="center"
        >
            {!loading ?
                <Box padding={{ md: 8, xs: "auto" }} width={{ md: "20vw", xs: "85vw" }}>
                    <Typography variant="h4" marginBottom={2} textAlign="center">Add a Class</Typography>
                    <Grid container direction="column" spacing={7}>
                        <Grid item>
                            <TextField
                                label="Class Name"
                                variant="standard"
                                required
                                onChange={(e) => { setClassName(e.target.value); } }
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <ClassIcon />
                                        </InputAdornment>
                                    )
                                }} />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Description (Optional)"
                                variant="standard"
                                multiline
                                rows={3}
                                onChange={(e) => { setClassDescription(e.target.value); } }
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Description />
                                        </InputAdornment>
                                    )
                                }} />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Teacher Name (Optional)"
                                variant="standard"
                                onChange={(e) => { setTeacherName(e.target.value); } }
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person />
                                        </InputAdornment>
                                    )
                                }} />
                        </Grid>
                        <Grid item>
                            <Box justifyContent="space-between" display="flex">
                                <Link to="/" style={{ textDecoration: "none" }}>
                                    <Button variant="outlined" color="error">Cancel</Button>
                                </Link>

                                <Button variant="contained" disabled={!className.trim()} onClick={async () => uploadNewClass(props.currentUser)}>Add</Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            :
                <CircularProgress />
            }
        </Box>
    );

    async function uploadNewClass(currentUser) {
        setLoading(true);

        let jwt = await currentUser.getIdToken(true);
        let uid = currentUser.uid;

        // Empty GUID is used for Id
        let response = await fetch("api/uploadclass", {
            method: "POST",
            headers : {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization" : "Bearer " + jwt
            },
            body: JSON.stringify({ 
                Id: "00000000-0000-0000-0000-000000000000", 
                StudentUID: uid, 
                TeacherName: teacherName, 
                ClassName: className,
                ClassInfo: classDescription
            })
        });

        if (response.status === 200) {
            navigate("/");
        } else {
            setLoading(false);
        }
    }
}