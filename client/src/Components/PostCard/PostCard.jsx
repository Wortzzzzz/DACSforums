import React, { useEffect, useState } from "react";
import { Card, CardActions, CardContent, Avatar, CardHeader, IconButton, FormControl, InputLabel, Select, Grid, Badge} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbDownAltIcon from "@material-ui/icons/ThumbDownAlt";
import CommentIcon from "@material-ui/icons/Comment";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import { Link } from "react-router-dom";
import "./PostCard.css";
import { useAuth0 } from "@auth0/auth0-react";
import * as _ from "lodash";
import forumApi from "../../utils/forum.api";
import { useForumContext } from "../../contexts/ForumContext";
import { useDarkModeContext } from "../../contexts/DarkModeContext";
import CreatePost from "../CreatePost/CreatePost";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  date: {
    margin: theme.spacing(1),
    minWidth: 80,
    color: "inherit",
    marginRight: 55,
  },
  cursorPointer: {
    cursor: "pointer",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(2em + ${theme.spacing(2)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "25ch",
    },
  },
  cardContainer: {
    borderRadius: 25,
    margin: 0,
    paddingTop: 100,
  },
  cardIndividual: {
    borderRadius: 15,
    marginTop: "5px",
    marginBottom: "5px",
    opacity: 0.8,
    padding: "10px",
    "&:hover": {
      opacity: 1,
    },
  },
  cardTitleLight: {
    color: "#17BEBB",
    textAlign: "left",
    paddingLeft: "50px",
    marginTop: 0,
    marginBottom: 0,
    fontSize: "16px",
  },
  cardTitleDark: {
    color: "#ffffff",
    textAlign: "left",
    paddingLeft: "50px",
    marginTop: 0,
    marginBottom: 0,
    fontSize: "16px",
  },
  cardHeaderLight: {
    fontSize: "50px",
    padding: 0,
    paddingBottom: 0,
    color: "#B9136C",
  },
  cardHeaderDark: {
    fontSize: "50px",
    padding: 0,
    paddingBottom: 0,
    color: "#8CCCE3",
  },
  cardContent: {
    padding: 0,
    "&:last-child": {
      paddingBottom: 0,
    },
  },
  likeButtonLight: {
    color: "#02CA59",
  },
  likeButtonDark: {
    color: "#51BBFE",
  },
  dislikeButtonLight: {
    color: "#FF0A0A",
  },
  dislikeButtonDark: {
    color: "#F6A23C",
  },
  likeCountLight: {
    color: "#000000",
    backgroundColor: "#F391C5",
    padding: "4px 4px 5px 4px",
    borderRadius: "20px",
  },
  likeCountDark: {
    color: "#000000",
    backgroundColor: "#96A7C5",
    padding: "4px 4px 5px 4px",
    borderRadius: "20px",
  },
  dislikeCountLight: {
    color: "#000000",
    backgroundColor: "#F391C5",
    padding: "4px 4px 5px 4px",
    borderRadius: "20px",
  },
  dislikeCountDark: {
    color: "#000000",
    backgroundColor: "#96A7C5",
    padding: "4px 4px 5px 4px",
    borderRadius: "20px",
  },
  deleteIcon: {
    cursor: "pointer",
    color: "#888098",
  },
  cardDisplay: {
    [theme.breakpoints.up("md")]: {
      marginTop: "100px",
    },
  },
  myForumDisplay: {
    [theme.breakpoints.down("md")]: {
      marginTop: "100px",
    },
    [theme.breakpoints.up("md")]: {
      marginTop: "100px",
    },
  },
  commentButtonDark: {
    color: "##ffffff",
    marginBottom: "-10px",
  },
  commentButtonLight: {
    color: "#17BEBB",
    marginBottom: "-10px",
  },
  commentCount: {
    marginRight: "15px",
  },
}));

export default function PostCard(props) {
  const classes = useStyles();
  const { forums, setForums } = useForumContext();
  const { darkMode } = useDarkModeContext();
  const { isAuthenticated, user } = useAuth0();
  const [sortOrder, setSortOrder] = useState("new");

  const onSortChange = (event) => {
    setSortOrder(event.target.value);
    const queryParam = {
      sortOrder: event.target.value === "new" ? "desc" : "asc",
    };

    loadAllForum(queryParam);
  };

  const deleteOnClick = (forum) => () => {
    forumApi.deleteForum(forum._id);
    loadAllForum();
  };
  const likeButtonOnClick = (forum) => async () => {
    const currentUserId = user.sub;
    if (!_.includes(forum.likedUsers, currentUserId)) {
      const hasUserDislikedBefore = _.includes(forum.dislikedUsers, currentUserId);
      let dislikes = forum.dislikes;
      if (hasUserDislikedBefore) {
        dislikes -= 1;
      }
      const dislikedUsers = _.filter(forum.dislikedUsers, (dislikedUser) => dislikedUser !== currentUserId);
      const updatedForum = {
        ...forum,
        likes: forum.likes + 1,
        likedUsers: [...forum.likedUsers, currentUserId],
        dislikes,
        dislikedUsers,
      };

      await forumApi.updateForum(forum._id, updatedForum);
      await loadAllForum();
    }
  };

  const dislikeButtonOnClick = (forum) => async () => {
    const currentUserId = user.sub;
    if (!_.includes(forum.dislikedUsers, currentUserId)) {
      const hasUserLikedBefore = _.includes(forum.likedUsers, currentUserId);
      let likes = forum.likes;
      if (hasUserLikedBefore) {
        likes -= 1;
      }
      const likedUsers = _.filter(forum.likedUsers, (likedUser) => likedUser !== currentUserId);

      const updatedForum = {
        ...forum,
        dislikes: forum.dislikes + 1,
        dislikedUsers: [...forum.dislikedUsers, currentUserId],
        likes,
        likedUsers,
      };

      // eslint-disable-next-line no-underscore-dangle
      await forumApi.updateForum(forum._id, updatedForum);
      await loadAllForum();
    }
  };

  useEffect(() => {
    loadAllForum();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Loads all forums and sets them to data
  function loadAllForum(params) {
    forumApi
      .getAllForum(params)
      .then((res) => {
        if (props.myForum) {
          const personalForum = res.data.filter((forum) => {
            return forum.user && forum.user.id === user.sub;
          });
          setForums(personalForum);
        } else {
          setForums(res.data);
        }
      })
      .catch((err) => console.log(err));
  }
  return (
    <Grid container direction="row" justify="center" alignItems="center" className={(props.myForum && classes.myForumDisplay) || classes.cardDisplay}>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Grid container direction="row" justify="flex-end">
          <Grid item xs={6} sm={5} md={3} lg={2}>
            <Grid container direction="row" justify="flex-end">
              <CreatePost />
            </Grid>
          </Grid>
          <Grid item xs={5} sm={3} md={3} lg={3}>
            <Grid container direction="row" justify="center">
              <FormControl>
                <InputLabel htmlFor="sort-by">Sort By Date</InputLabel>
                <Select
                  native
                  value={sortOrder}
                  onChange={onSortChange}
                  className={classes.date}
                  inputProps={{
                    name: "date",
                    id: "sort-by",
                  }}
                >
                  <option value="new">Newest</option>
                  <option value="old">Oldest</option>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Grid container direction="row" justify="center" alignItems="center">
          {forums.map((forum) => {
            const name = _.get(forum, "user.name");
            const username = name && name.includes("@") ? name.substring(0, name.lastIndexOf("@")) : name;
            return (
              <Grid key={forum._id} item xs={10} sm={10} md={10} lg={10}>
                <Card className={classes.cardIndividual} key={forum._id}>
                  <CardHeader
                    className={darkMode ? classes.cardHeaderDark : classes.cardHeaderLight}
                    avatar={<Avatar alt={forum.user && forum.user.name} src={forum.user && forum.user.picture} />}
                    title={username + ", " + moment(forum.date).fromNow()}
                  />
                  <Link to={`/forums/${forum._id}`}>
                    <CardContent className={classes.cardContent}>
                      <h2 className={darkMode ? classes.cardTitleDark : classes.cardTitleLight}>{forum.forum_title}</h2>
                    </CardContent>
                  </Link>

                  <CardActions>
                    <Grid className="likeDislikeBtns">
                      <span className={classes.commentCount}>
                      <Badge badgeContent={forum.replies.length} color="secondary">
                      <CommentIcon className={darkMode ? classes.commentButtonDark : classes.commentButtonLight} size="large" />
                      </Badge></span>
                      <span className={darkMode ? classes.likeCountDark : classes.likeCountLight}>{forum.likes}</span>
                      <IconButton disabled={!isAuthenticated} onClick={likeButtonOnClick(forum)} size="small">
                        <ThumbUpAltIcon className={darkMode ? classes.likeButtonDark : classes.likeButtonLight} size="small" />
                      </IconButton>
                      <IconButton disabled={!isAuthenticated} onClick={dislikeButtonOnClick(forum)} size="small">
                        <ThumbDownAltIcon className={darkMode ? classes.dislikeButtonDark : classes.dislikeButtonLight} />
                      </IconButton>
                      <span className={darkMode ? classes.dislikeCountDark : classes.dislikeCountLight}>{forum.dislikes}</span>
                    </Grid>
                    {/* show delete button only for the user who posted the forum */}
                    {forum.user && user && forum.user.id === user.sub && <DeleteIcon className={classes.deleteIcon} onClick={deleteOnClick(forum)} size="small" variant="contained" />}
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
}
