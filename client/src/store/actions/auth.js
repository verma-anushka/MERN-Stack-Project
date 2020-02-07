import axios from "axios";
import setAuthToken from "../../utils/setAuthToken";
import jwtDecode from "jwt-decode";
import { GET_ERRORS, SET_CURRENT_USER } from "./types";

// Register User
export const signUpUser = (newUser, history) => dispatch => {
  axios
    .post("/api/users/signup", newUser)
    .then(res => {
      history.push("/signin");
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Signin User: Token
export const signInUser = user => dispatch => {
  axios
    .post("/api/users/signin", user)
    .then(res => {
      // Get Token
      const { token } = res.data;
      // Save token in Local Storage
      localStorage.setItem("jwtToken", token);
      // Set token to authorization header
      setAuthToken(token);
      // Decode token to get user data
      const decodedUser = jwtDecode(token);
      // Set current user
      dispatch(setCurrentUser(decodedUser));
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Set current user
export const setCurrentUser = decodedUser => {
  return {
    type: SET_CURRENT_USER,
    payload: decodedUser
  };
};

// Logout User
export const logoutUser = () => dispatch => {
  // Remove token from Local Storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to null
  dispatch(setCurrentUser({}));
};
