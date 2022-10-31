import React, { Component, useEffect } from "react";
import { Box, Typography, Paper, TableContainer, TableHead, TableRow, TableCell, Table, TableBody, Button, TextField, CircularProgress, IconButton, Collapse, Checkbox } from "@mui/material";
import { Done, KeyboardArrowUp, KeyboardArrowDown, Add, Delete } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { Stack } from "@mui/system";

export class ClassDisplay extends Component {
    constructor(props) {
        super(props);
        
        this.clasID = new URLSearchParams(window.location.search).get("class");
        this.state = { clas: null, assignments: [], goals: [], loading:  true, goalView: false };
    }

    componentDidMount() {
        if (this.clasID)
            this.getClass();
    }

    render() {
        if ((!this.clasID || !this.state.clas) && !this.state.loading) {
            return (
                <Stack alignItems="center" spacing={2} sx={{backgroundColor: "#1f232d", borderRadius: 1}} padding={5}>
                    <Typography>Error: Please visit this page from the main Classes page!</Typography>
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <Button variant="contained">Classes</Button>
                    </Link>
                </Stack>
            );
        }

        if (this.state.loading) {
            return (
                <CircularProgress/>
            );
        }

        return (
            <Box sx={{ backgroundColor: "#1f232d", borderRadius: 1, minHeight: { md: "auto" , xs: "94.5vh" }, maxWidth: { md: "auto", xs: "100vw" } }} padding={{ md: 5 , xs: 0 }}>
                <Box paddingLeft={{ md: 0, xs: 1 }} marginTop={{ md: 0, xs: 1 }}>
                    <Typography variant="h4">{this.state.clas.className}</Typography>
                    <Typography color="text.secondary">{"Teacher: " + this.state.clas.teacherName}</Typography>
                    <Typography color="text.secondary">{"Description: " + this.state.clas.classInfo}</Typography>
                </Box>

                {!this.state.goalView ?
                    <>
                    <TableContainer 
                        component={Paper} 
                        sx={{ width: { md: "75vw", xs: "100vw" }, minHeight: "50vh", maxHeight: "70vh", height: { md: "auto", xs: "61vh" }, backgroundColor: "#1e212b", marginTop: 1}}
                    >
                        <Typography variant="h5" textAlign="center" paddingTop={2}>Class Assignments</Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Assignment</TableCell>
                                    <TableCell align="center">Description</TableCell>
                                    <TableCell align="right">Due Date</TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.assignments.map((assignment, index) => (
                                    <AssignmentRow key={index} currentUser={this.props.currentUser} assignment={assignment} removeAssignment={assign => this.removeAssignment(assign)}/>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>  

                    <AddAssignContainer currentUser={this.props.currentUser} clasID={this.clasID} addAssignment={assign => this.addAssignment(assign)} setGoalView={bool => this.setGoalView(bool)}/>
                    </>  
                :
                    <>
                    <TableContainer 
                        component={Paper} 
                        sx={{ width: { md: "75vw", xs: "100vw" }, minHeight: "50vh", maxHeight: "65vh", height: { md: "auto", xs: "61vh" }, backgroundColor: "#1e212b", marginTop: 1}}
                    >
                        <Typography variant="h5" textAlign="center" paddingTop={2}>Class Goals</Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left" width={"4%"} />
                                    <TableCell align="left">Goal</TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.goals.map((goal, index) => (
                                    <GoalRow key={index} currentUser={this.props.currentUser} goal={goal} removeGoal={goal => this.removeGoal(goal)}/>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>  

                    <AddGoalContainer currentUser={this.props.currentUser} clasID={this.clasID} addGoal={goal => this.addGoal(goal)} setGoalView={bool => this.setGoalView(bool)}/>
                    </>
                }
            </Box>
        );
    }

    async getClass() {
        let jwt = await this.props.currentUser.getIdToken(true);

        let classResponse = await fetch("api/class/" + this.clasID, {
            method: "GET",
            headers : {
                "Authorization" : "Bearer " + jwt
            },
        });
        

        if (classResponse.status === 200) {
            let assignmentsResponse = await fetch("api/assignments/" + this.clasID, {
                method: "GET",
                headers : {
                    "Authorization" : "Bearer " + jwt
                },
            });
            let goalsResponse = await fetch("api/goals/" + this.clasID, {
                method: "GET",
                headers : {
                    "Authorization" : "Bearer " + jwt
                },
            });

            let clas = await classResponse.json();
            let assignments = await assignmentsResponse.json();
            let goals = await goalsResponse.json();

            this.setState({ loading: false, clas: clas, assignments: assignments, goals: goals });
        } else {
            this.setState({ loading: false });
        }
    }

    addAssignment(assignment) {
        let assignments = this.state.assignments;
        assignments.push(assignment);
        this.setState({ assignments: assignments });
    }

    removeAssignment(assignment) {
        let assignments = this.state.assignments;
        let index = assignments.indexOf(assignment);

        assignments.splice(index, 1);
        this.setState({ assignment: assignments });
    }

    addGoal(goal) {
        let goals = this.state.goals;
        goals.push(goal);
        this.setState({ goals: goals });
    }

    removeGoal(goal) {
        let goals = this.state.goals;
        let index = goals.indexOf(goal);

        goals.splice(index, 1);
        this.setState({ goals: goals });
    }

    setGoalView(bool) {
        this.setState({ goalView: bool });
    }
}

function AssignmentRow(props) {
    const [loading, setLoading] = React.useState(false);

    return (
        <TableRow>
            <TableCell>{props.assignment.name}</TableCell>
            <TableCell align="center">{props.assignment.description}</TableCell>
            <TableCell align="right">{props.assignment.dueDate}</TableCell>
            <TableCell align="right">
                <IconButton disabled={loading} onClick={async () => await deleteAssignment()}>
                    <Done />
                </IconButton>
            </TableCell>
        </TableRow>
    );

    async function deleteAssignment() {
        setLoading(true);

        let jwt = await props.currentUser.getIdToken(true);
        let response = await fetch("api/deleteassignment/" + props.assignment.id, {
            method: "DELETE",
            headers : {
                "Authorization" : "Bearer " + jwt
            },
        });

        setLoading(false);

        if (response.status === 200) {
            props.removeAssignment(props.assignment);
        }
    }
}

function AddAssignContainer(props) {
    const [buttonMode, setButtonMode] = React.useState(true);

    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [duedate, setDuedate] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const [showDeleteMenu, setShowDeleteMenu] = React.useState(false);
    const [pendingDelete, setPendingDelete] = React.useState(false);

    const navigate = useNavigate();

    if (buttonMode) {
        if (showDeleteMenu) {
            return (
                <Stack direction={{ md: "row", xs: "columm" }} justifyContent="center" alignItems="center" spacing={2} marginTop={2}>
                    <Typography marginBottom={{ md: 0, xs: 2 }}>Are you sure that you want to delete this class?</Typography>
                    <Button variant="outlined" sx={{ width: { md: "auto", xs: "100vw" } }} onClick={() => setShowDeleteMenu(false)} disabled={pendingDelete}>Cancel</Button>
                    <Button variant="outlined" color="error" sx={{ width: { md: "auto", xs: "100vw" } }} onClick={async () => await deleteClass()} disabled={pendingDelete}>Delete class</Button>
                </Stack>
            );
        } else {
            return (
                <Stack direction={{ md: "row", xs: "columm" }} justifyContent="space-between" marginTop={2}>
                    <Stack direction={{ md: "row", xs: "columm" }} justifyContent="space-between" spacing={1}>
                        <Link to="/" style={{ textDecoration: "none" }}>
                            <Button variant="outlined" fullWidth>Go back to classes</Button>
                        </Link>
                        <Button variant="outlined" onClick={() => props.setGoalView(true)}>View Goals</Button>
                        <Button variant="outlined" color="error" onClick={() => setShowDeleteMenu(true)}>Delete Class</Button>
                    </Stack>
                    <Button variant="contained" onClick={() => setButtonMode(false)}>Add Assignment</Button>
                </Stack>
        
            );
        }
    } else {
        return (
            <Stack direction={{ md: "row", xs: "column" }} justifyContent="space-between" spacing={1} marginTop={1}>
                <TextField label="Assignment Name" sx={{ width: { md: 250, xs: "100vw" } }} size="small" defaultValue={name} onChange={(e) => setName(e.target.value)}/>
                <TextField label="Description (Optional)" fullWidth  size="small" defaultValue={description} onChange={(e) => setDescription(e.target.value)}/>
                <TextField type="date" sx={{ width: { md: 250, xs: "100vw" } }} size="small" defaultValue={duedate} onChange={(e) => setDuedate(e.target.value)}/>
                <Box display="flex" justifyContent="space-between">
                    <Button variant="outlined" color="error" onClick={() => setButtonMode(true)} disabled={loading}>Cancel</Button> 
                    <Button variant="contained" 
                        sx={{ marginLeft: 1 }} 
                        disabled={name.trim().length === 0 || duedate === "" || loading}
                        onClick={async () => await uploadAssignment()}
                    >
                        {loading ? "Uploading" : "Add"}
                    </Button>
                </Box>
            </Stack>
        );
    }

    async function deleteClass() {
        setPendingDelete(true);

        let jwt = await props.currentUser.getIdToken(true);
        let response = await fetch("api/deleteclass/" + props.clasID, {
            method: "DELETE",
            headers : {
                "Authorization" : "Bearer " + jwt
            },
        });

        setPendingDelete(false);

        if (response.status === 200) {
            navigate("/");
        }
    }

    async function uploadAssignment() {
        setLoading(true);

        let splittedDate = duedate.split("-");
        let formattedDueDate = splittedDate[1] + "-" + splittedDate[2] + "-" + splittedDate[0];

        let jwt = await props.currentUser.getIdToken(true);
        let response = await fetch("api/uploadassignment", {
            method: "POST",
            headers : {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization" : "Bearer " + jwt
            },
            body: JSON.stringify({ClassGUID: props.clasID, Name: name, Description: description, DueDate: formattedDueDate})
        });

        setLoading(false);

        if (response.status === 200) {
            setButtonMode(true);
            setName("");
            setDescription("");
            setDuedate("");

            let assignment = await response.json();
            props.addAssignment(assignment);
        }
    }
}

function GoalRow(props) {
    const [loading, setLoading] = React.useState(false);

    const [open, setOpen] = React.useState(false);
    const [subtasks, setSubtasks] = React.useState(null);

    const [uploading, setUploading] = React.useState(false);
    const [newSubtaskName, setNewSubtaskName] = React.useState("");

    useEffect(() => {
        getSubtasks();
    }, []);

    return (
        <>
        <TableRow>
            <TableCell>
                <IconButton
                    size="small"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </IconButton>
            </TableCell>
            <TableCell>{props.goal.name}</TableCell>
            <TableCell align="right">
                <IconButton disabled={loading} onClick={async () => await deleteGoal()}>
                    <Done />
                </IconButton>
            </TableCell>
        </TableRow>
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box marginY={1}>
                        {subtasks ?
                            <>
                            <TableContainer sx={{ maxHeight: "30vh" }}>
                                <Table size="small" sx={{ backgroundColor: "#1e212b", borderRadius: 1, minHeight: "8vh"  }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ width: "10%" }} />
                                            <TableCell>Subtask</TableCell>
                                            <TableCell align="right" />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {subtasks.map((subtask, index) => (
                                            <SubtaskRow key={index} subtask={subtask} currentUser={props.currentUser} deleteSubtask={async (subtask) => deleteSubtask(subtask)} />
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Stack direction="row" justifyContent="space-between" alignItems="center" marginTop={1} spacing={2}>
                                <TextField label="Add New Subtask" size="small" fullWidth value={newSubtaskName} onChange={(e) => setNewSubtaskName(e.target.value)} />
                                <Button variant="contained" disabled={uploading || newSubtaskName.trim().length === 0} onClick={async () => await uploadSubtask()}>
                                    <Add />
                                </Button>
                            </Stack>
                            </>
                        :
                            <CircularProgress />
                        }
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
        </>
    );

    async function deleteSubtask(subtask) {
        let jwt = await props.currentUser.getIdToken(true);

        let response = await fetch("api/deletesubtask/" + subtask.id, {
            method: "DELETE",
            headers : {
                "Authorization" : "Bearer " + jwt
            },
        });

        if (response.status === 200) {
            let index = subtasks.indexOf(subtask);
            let tasks = [...subtasks];

            tasks.splice(index, 1);
            setSubtasks(tasks);
        }
    }

    async function uploadSubtask() {
        setUploading(true);

        let jwt = await props.currentUser.getIdToken(true);
        let response = await fetch("api/uploadsubtask", {
            method: "POST",
            headers : {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization" : "Bearer " + jwt
            },
            body: JSON.stringify({ Name: newSubtaskName, GoalGUID: props.goal.id })
        });

        if (response.status === 200) {
            let subtask = await response.json();
            let tasks = subtasks;

            tasks.push(subtask);

            setNewSubtaskName("");
            setUploading(false);
            setSubtasks(tasks);
        }
    }

    async function deleteGoal() {
        setLoading(true);

        let jwt = await props.currentUser.getIdToken(true);
        let response = await fetch("api/deletegoal/" + props.goal.id, {
            method: "DELETE",
            headers : {
                "Authorization" : "Bearer " + jwt
            },
        });

        setLoading(false);

        if (response.status === 200) {
            props.removeGoal(props.goal);
        }
    }

    async function getSubtasks() {
        let jwt = await props.currentUser.getIdToken(true);
        let response = await fetch("api/subtasks/" + props.goal.id, {
            method: "GET",
            headers : {
                "Authorization" : "Bearer " + jwt
            },
        });

        if (response.status === 200) {
            let tasks = await response.json();
            setSubtasks(tasks);
        }
    }
}

function SubtaskRow(props) {
    const [updating, setUpdating] = React.useState(false);

    return (
        <TableRow>
            <TableCell sx={{ width: "10%" }}>
                <Checkbox disabled={updating} checked={props.subtask.isCompleted} onChange={async (e) => await updateSubtask(e.target.checked)} />
            </TableCell>
            <TableCell>{props.subtask.name}</TableCell>
            <TableCell align="right">
                <IconButton onClick={async () => {
                    await props.deleteSubtask(props.subtask);
                }}>
                    <Delete />
                </IconButton>
            </TableCell>
        </TableRow>
    );

    async function updateSubtask(bool) {
        setUpdating(true);

        props.subtask.isCompleted = bool;
    
        let jwt = await props.currentUser.getIdToken(true);
        let response = await fetch("api/updatesubtask", {
            method: "POST",
            headers : {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization" : "Bearer " + jwt
            },
            body: JSON.stringify(props.subtask)
        });

        if (response.status === 200)
            setUpdating(false);
    }
}

function AddGoalContainer(props) {
    const [buttonMode, setButtonMode] = React.useState(true);

    const [name, setName] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const [showDeleteMenu, setShowDeleteMenu] = React.useState(false);
    const [pendingDelete, setPendingDelete] = React.useState(false);

    const navigate = useNavigate();

    if (buttonMode) {
        if (showDeleteMenu) {
            return (
                <Stack direction={{ md: "row", xs: "columm" }} justifyContent="center" alignItems="center" spacing={2} marginTop={2}>
                    <Typography marginBottom={{ md: 0, xs: 2 }}>Are you sure that you want to delete this class?</Typography>
                    <Button variant="outlined" sx={{ width: { md: "auto", xs: "100vw" } }} onClick={() => setShowDeleteMenu(false)} disabled={pendingDelete}>Cancel</Button>
                    <Button variant="outlined" color="error" sx={{ width: { md: "auto", xs: "100vw" } }} onClick={async () => await deleteClass()} disabled={pendingDelete}>Delete class</Button>
                </Stack>
            );
        } else {
            return (
                <Stack direction={{ md: "row", xs: "columm" }} justifyContent="space-between" marginTop={2}>
                    <Stack direction={{ md: "row", xs: "columm" }} justifyContent="space-between" spacing={1}>
                        <Link to="/" style={{ textDecoration: "none" }}>
                            <Button variant="outlined" fullWidth>Go Back to classes</Button>
                        </Link>
                        <Button variant="outlined" sx={{ marginLeft: 1 }} onClick={() => props.setGoalView(false)}>View Assignments</Button>
                        <Button variant="outlined" sx={{ marginLeft: 1 }} color="error" onClick={() => setShowDeleteMenu(true)}>Delete Class</Button>
                    </Stack>
                    <Button variant="contained" onClick={() => setButtonMode(false)}>Add Goal</Button>
                </Stack>
            );
        }
    } else {
        return (
            <Stack direction={{ md: "row", xs: "column" }} justifyContent="space-between" spacing={1} marginTop={2}>
                <TextField label="Goal" size="small" defaultValue={name} onChange={(e) => setName(e.target.value)} fullWidth />
                <Box display="flex" justifyContent="space-between">
                    <Button variant="outlined" color="error" onClick={() => setButtonMode(true)} disabled={loading}>Cancel</Button> 
                    <Button variant="contained" 
                        sx={{ marginLeft: 1 }} 
                        disabled={name.trim().length === 0 || loading}
                        onClick={async () => await uploadGoal()}
                    >
                        {loading ? "Uploading" : "Add"}
                    </Button>
                </Box>
            </Stack>
        );
    }

    async function deleteClass() {
        setPendingDelete(true);

        let jwt = await props.currentUser.getIdToken(true);
        let response = await fetch("api/deleteclass/" + props.clasID, {
            method: "DELETE",
            headers : {
                "Authorization" : "Bearer " + jwt
            },
        });

        setPendingDelete(false);

        if (response.status === 200) {
            navigate("/");
        }
    }

    async function uploadGoal() {
        setLoading(true);

        let jwt = await props.currentUser.getIdToken(true);
        let response = await fetch("api/uploadgoal", {
            method: "POST",
            headers : {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization" : "Bearer " + jwt
            },
            body: JSON.stringify({ClassGUID: props.clasID, Name: name})
        });

        setLoading(false);

        if (response.status === 200) {
            setButtonMode(true);
            setName("");

            let goal = await response.json();
            props.addGoal(goal);
        }
    }
}