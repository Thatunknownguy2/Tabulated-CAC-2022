import React, { Component } from "react";
import { Grid, Box, Typography, Button, Card, CircularProgress, CardContent, CardActions, Divider } from "@mui/material";
import { Add } from "@mui/icons-material";
import { Link } from "react-router-dom";

export class ClassesView extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: true, classes: [] };
    }

    componentDidMount() {
        this.getStudentClasses();
    }

    render() {
        if (this.state.loading) {
            return (<CircularProgress/>);
        } else {
            let classesAmount = this.state.classes.length;
            let boxContainerWidth = 18.75;
            let columnSize;
    
            if (classesAmount > 0) {
                // Clamping
                boxContainerWidth = Math.min(boxContainerWidth * classesAmount, 75);
                columnSize = Math.max(3, 12 / classesAmount);
            }
            
            return (
                <Box 
                    sx={{backgroundColor: "#1f232d", borderRadius: 1, width: { md: boxContainerWidth + "vw", xs: "100vw" }, minHeight: { md: "auto" , xs: "94vh" }, paddingY: 1}}
                >
                    <Typography variant="h4" align="center">Classes</Typography>
                    <Divider />

                    <Grid container columnSpacing={15} rowSpacing={3} padding={2} maxHeight="87vh" overflow="auto">
                        {this.state.classes.map((clas, index) => (
                            <Grid item md={columnSize} xs={12} key={index}>
                                <ClassCard clas={clas}/>
                            </Grid>       
                        ))}
                    </Grid>

                    <Box display="flex" justifyContent="center">
                        <Link to="/newclass" style={{ textDecoration: "none" }}>
                            <Button startIcon={<Add />}>Add Class</Button>  
                        </Link>
                    </Box>
                </Box>
            );
        }
    }

    async getStudentClasses() {
        let jwt = await this.props.currentUser.getIdToken(true);
        let response = await fetch("api/classes", {
            headers : {
                "Accept": "application/json",
                "Authorization" : "Bearer " + jwt
            }
        });
        let classesJSONArray = await response.json();

        this.setState({ loading: false, classes: classesJSONArray });
    }
}

function ClassCard(props) {
    return (
        <Card>
            <CardContent>
                <Typography sx={{ fontSize: 18 }}>{props.clas.className}</Typography>
                <Typography sx={{ fontSize: 13 }} color="text.secondary">{props.clas.teacherName}</Typography>
            </CardContent>
            <CardActions>
                <Link to={"/classview?class=" + props.clas.id} style={{ textDecoration: "none" }}>
                    <Button size="small">Go to class</Button>
                </Link>
            </CardActions>
        </Card>
    );
}