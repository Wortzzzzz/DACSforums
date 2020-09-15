// CreatePost
import React from "react";
import { Button, Dialog } from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import SubmitPost from "../SubmitPost/SubmitPost";
import { useAuth0 } from "@auth0/auth0-react";
import AlertDialog from "../AuthenticationModal/AuthenticationModal";
import { useSubmitPostModalContext } from "../../contexts/SubmitPostModalContext";

const myStyle = {
  CreatePostButton: {
    padding: "10px 10px 10px 100px",
    // backgroundColor: "primary",
    // paddingTop: "20px",
    // position: "sticky",
    // paddingLeft: "350px",
    // top: "0",
  },
  BorderColorIcon: {
    paddingRight: "5px",
    paddingLeft: "25px",
  },
};

function CreatePost() {
  const { showSubmitPostModal, setShowSubmitPostModal } = useSubmitPostModalContext();
  const { isAuthenticated } = useAuth0();

  const handleClickOpen = () => {
    setShowSubmitPostModal(true);
  };

  const handleClose = () => {
    setShowSubmitPostModal(false);
  };

  return (
    <div style={myStyle.CreatePostButton}>
      {(isAuthenticated && (
        <Button variant="contained" color="secondary" onClick={handleClickOpen}>
          <BorderColorIcon />
          Create Post
        </Button>
      )) || <AlertDialog />}
      <Dialog open={showSubmitPostModal} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create Your own Post</DialogTitle>
        <DialogContent>
          <SubmitPost />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CreatePost;
