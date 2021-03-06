import React from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import { useForumContext } from "../../contexts/ForumContext";
import forumApi from "../../utils/forum.api";
import { FormControl, InputLabel, Select, Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
    [theme.breakpoints.down("sm")]: {
      marginLeft: theme.spacing(2),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  category: {
    color: "inherit",
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
}));

const Search = () => {
  const classes = useStyles();
  const { setForums } = useForumContext();
  const [searchCriteria, setSearchCriteria] = React.useState({
    category: "All",
    text: "",
  });

  const handleChange = (event) => {
    setSearchCriteria({ ...searchCriteria, text: event.target.value });
    handleSearch(searchCriteria.category, event.target.value);
  };

  const onCategoryChange = (event) => {
    setSearchCriteria({ category: event.target.value });
    handleSearch(event.target.value, searchCriteria.text);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch(searchCriteria.category, searchCriteria.text);
    }
  };

  const handleSearch = (category, text) => {
    forumApi
      .getAllForum()
      .then((res) => {
        if (category === "All") {
          let filtered = res.data;

          if (text) {
            filtered = res.data.filter((forum) => forum.forum_title.toLowerCase().includes(text.toLocaleLowerCase()) || forum.forum_description.toLowerCase().includes(text.toLocaleLowerCase()));
          }

          setForums(filtered);
        } else {
          let filtered;

          if (category) {
            filtered = res.data.filter((forum) => forum.category.toLowerCase().includes(category.toLocaleLowerCase()));
          }

          if (text) {
            filtered = filtered.filter(
              (filteredCategory) => filteredCategory.forum_title.toLowerCase().includes(text.toLocaleLowerCase()) || filteredCategory.forum_description.toLowerCase().includes(text.toLocaleLowerCase())
            );
          }

          setForums(filtered);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Grid container direction="row" justify="flex-end" alignItems="center">
      <Grid item xs={4} sm={4} md={4} lg={2}>
        <Grid container direction="row" justify="center" alignItems="center">
          <FormControl>
            <InputLabel className={classes.category}>Categories</InputLabel>
            <Select
              native
              value={searchCriteria.category}
              onChange={onCategoryChange}
              className={classes.category}
              inputProps={{
                name: "category",
              }}
            >
              <option>All</option>
              <option>General</option>
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
      </Grid>
      <Grid item xs={8} sm={8} md={8} lg={5}>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search???"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{
              name: "text",
              id: "aria-label",
            }}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
          />
        </div>
      </Grid>
    </Grid>
  );
};

export default Search;
