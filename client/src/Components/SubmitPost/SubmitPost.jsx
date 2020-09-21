// Submit Post
import React from "react";
import { Grid, TextField, Button, FormControl, InputLabel, Select } from "@material-ui/core";
import forumApi from "../../utils/forum.api";
import { useAuth0 } from "@auth0/auth0-react";
import AlertDialog from "../AuthenticationModal/AuthenticationModal";
import { useForumContext } from "../../contexts/ForumContext";
import { useSubmitPostModalContext } from "../../contexts/SubmitPostModalContext";

const myStyle = {
  textField: {
    width: "500px",
    backgroundColor: "white",
    opacity: "80%",
  },
  button: {
    width: "100px",
  },
  entireForm: {
    paddingTop: "50px",
    position: "-webkit-sticky",
    // eslint-disable-next-line no-dupe-keys
    position: "sticky",
    top: "0",
  },
};

function SubmitPost() {
  const { setForums } = useForumContext();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const { isAuthenticated, user } = useAuth0();
  const [category, setCategory] = React.useState({});
  const { setShowSubmitPostModal } = useSubmitPostModalContext();

  const handleChange = (event) => {
    const name = event.target.name;
    setCategory({
      ...category,
      [name]: event.target.value,
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const forumCategory = (category.categoryName && category.categoryName) || "General";

    // API
    await forumApi.createForum({
      forum_title: title,
      forum_description: description,
      category: forumCategory,
      user: {
        id: user.sub,
        name: user.name,
        picture: user.picture,
      },
    });

    setTitle("");
    setDescription("");
    setCategory({
      categoryName: "",
    });

    // get all forums
    await forumApi
      .getAllForum()
      .then((res) => {
        if (window.location.pathname === "/my_forum") {
          let personalForum = res.data.filter((forum) => {
            return forum.user && forum.user.id === user.sub;
          });
          setForums(personalForum);
        } else {
          setForums(res.data);
        }
      })
      .catch((err) => console.log(err));

    setShowSubmitPostModal(false);
  };

  return (
    <form onSubmit={onSubmit}>
      <Grid container direction="row" alignItems="center" justify="center">
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <FormControl>
            <InputLabel htmlFor="age-native-simple">Categories</InputLabel>
            <Select
              native
              value={category.categoryName}
              onChange={handleChange}
              inputProps={{
                name: "categoryName",
                id: "age-native-simple",
              }}
            >
              <option aria-label="None" value="" />
              <option>Sports</option>
              <option>Food</option>
              <option>Technology</option>
              <option>Kids</option>
              <option>Health/Fitness</option>
              <option>Art</option>
              <option>Business</option>
              <option>Entertainment</option>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <TextField id="title" required label="Title" variant="outlined" margin="normal" fullWidth value={title} onChange={(event) => setTitle(event.target.value)} />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <TextField id="message" label="Message" variant="outlined" margin="normal" multiline rows={6} fullWidth value={description} onChange={(event) => setDescription(event.target.value)} />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          {(!isAuthenticated && (
            <Button style={myStyle.button} label="submit" type="submit" fullWidth color="primary" variant="contained">
              <AlertDialog />
            </Button>
          )) || (
            <Button style={myStyle.button} label="submit" type="submit" fullWidth color="primary" variant="contained">
              Send
            </Button>
          )}
        </Grid>
      </Grid>
    </form>
  );
}

export default SubmitPost;
