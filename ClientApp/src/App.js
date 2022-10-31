import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './custom.css';

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { EmailAuthProvider, GoogleAuthProvider } from "firebase/auth";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Logout } from "@mui/icons-material";
import { CssBaseline, Box, Typography, AppBar, Toolbar, Button } from "@mui/material";
import 'firebaseui/dist/firebaseui.css'

import { ClassesView } from "./components/ClassesView";
import { AddNewClass } from "./components/AddNewClass";
import { ClassDisplay } from "./components/ClassDisplay";

const theme = createTheme({
  components: {
    MuiCard: {
      styleOverrides: {
        backgroundColor: "#b4bbcb"
      }
    }
  },
  palette: {
    mode: "dark",
    background: {
      default: "#171a21",
      paper: "#171a21",
    }
  }
});


export default class App extends Component {
  static displayName = App.name;

  constructor(props) {
    super(props);

    this.getFirebaseConfig();

    this.state = { user: null };
  }

  async getFirebaseConfig() {
    let response = await fetch("api/firebaseconfig", {
      headers : {
          "Accept": "application/json",
      }
    });

    let config = await response.json();
    
    const app = initializeApp(config);
    const firebaseAuth = getAuth(app);

    firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({user: user});
      } else {
        this.setState({user: null});
      }
    });

    this.firebaseAuth = firebaseAuth;
    
    var firebaseui = require("firebaseui");

    let ui = firebaseui.auth.AuthUI.getInstance()
    if (!ui) {
      ui = new firebaseui.auth.AuthUI(firebaseAuth);
    }

    ui.start("#firebaseui-auth-container", {
      signInOptions: [
        EmailAuthProvider.PROVIDER_ID,
        GoogleAuthProvider.PROVIDER_ID
      ],
      callbacks: {
        signInSuccessWithAuthResult: () => {
          return false;
        }
      }
    });
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppBar position="static" sx={{ maxWidth: "100vw", height: { md: "auto", xs: "10" } }}>
            {this.state.user != null ?
              <Toolbar variant="dense">
                <img style={{ width: "32px", height: "32px" }} src={process.env.PUBLIC_URL + "/icon.png"} alt="logo" />
                <Link to="/" style={{ flexGrow: 1, textDecoration: "none", color: "white" }}>
                <Typography variant="h5" marginLeft={1}>Tabulated</Typography>
                </Link>
         
                <Button onClick={() => {
                  this.firebaseAuth.signOut().then(() => {
                    window.location.reload();
                  }, (error) => console.log(error));
                }}>
                  <Logout />
                  <Typography>Log out</Typography>
                </Button>
              </Toolbar>
            :
              <Typography variant="h5" textAlign="center">Tabulated</Typography>
            }
          </AppBar>
          <Box
            alignItems="center"
            justify="center"
            justifyContent="center"
            minHeight="94vh"
            display={this.state.user == null ? "flex" : { xs: "flex", md: "flex" }}
          >
            {this.state.user != null ?
              <Routes>
                <Route path="/" element={<ClassesView currentUser={this.firebaseAuth.currentUser} />}/>
                <Route path="/newclass" element={<AddNewClass currentUser={this.firebaseAuth.currentUser} />} />
                <Route path="/classview" element={<ClassDisplay currentUser={this.firebaseAuth.currentUser} />} />
              </Routes>
            :
              <LoginContainer/>
            }
          </Box>
        </Router>
      </ThemeProvider>
    );
  }
}

function LoginContainer() {
  return (
    <Box sx={{backgroundColor: "#1f232d", borderRadius: 1}} paddingY={4} paddingX={4}>
      <Typography variant="h4" textAlign="center" paddingBottom={1}>Login</Typography>
      <div id="firebaseui-auth-container" />
    </Box>
  );
}