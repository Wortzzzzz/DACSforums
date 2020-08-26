import React from 'react';
import { Card, CardActions, CardContent, Button, Typography } from '@material-ui/core';
import "./PostCard.css";

const myStyle = {
    cardContainer: {
        textAlign: "center",
        width: "700px"
    },
    cardIndividual: {
        margin: "20px"
    }
}

export default function PostCard(props) {
    return (
        // <div className="post-card" style={myStyle.cardContainer}>
        // {
        //     props.data.map(item => (
        //         <Card style={myStyle.cardIndividual} key={item.id}>
        //         <CardContent>
        //             <Typography>{item.User}</Typography>
        //             <Typography className="alignLeft" color="textSecondary" gutterBottom>
        //                 {item.Title}
        //             </Typography>
        //             <Typography className="alignLeft" variant="body2" component="p">
        //                 {item.PostBody}
        //             <br />
        //             </Typography>
        //         </CardContent>
        //         <CardActions>
        //             <Button
        //             color="secondary"
        //             size="small"
        //             variant="contained"
        //             >
        //                 Delete
        //             </Button>
        //         </CardActions>
        //     </Card>
        //     ))
        <div className="post-card" style={myStyle}>
            {
                props.data.map(item => (
                    <Card key={item.id}>
                        <CardContent>
                            <Typography className="alignLeft" color="textSecondary" gutterBottom>
                                {item.forum_title}
                            </Typography>
                            <Typography className="alignLeft" variant="body2" component="p">
                                {item.forum_description}
                                <br />
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">Delete</Button>
                        </CardActions>
                    </Card>
                ))

            }
        </div>
    );
}
