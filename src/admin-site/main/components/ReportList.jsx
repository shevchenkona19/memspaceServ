import React from "react";
import PropTypes from "prop-types";
import {withStyles} from '@material-ui/core/styles';
import {Button, Card, CardActions, CardContent} from "@material-ui/core";
import imageLoader from "../utils/imageLoader";
import CardMedia from "@material-ui/core/es/CardMedia/CardMedia";
import Text from "../../common/components/Text";

const styles = theme => ({
    container: {
        margin: "auto",
        overflow: "auto",

    },
    card: {
        width: "60%",
        margin: 12,
    },
    cardPhoto: {
        maxWidth: "50%",
        margin: "auto",
        height: "auto",
    },
});


class ReportList extends React.Component {


    renderItem = report => {
        const {classes, banUser, deleteMeme, deleteReport} = this.props;
        return (
            <Card className={classes.card} key={report.id}>
                <CardMedia
                    className={classes.cardPhoto}
                    component={"img"}
                    image={imageLoader.memLoader(report.imageId)}
                />
                <CardContent>
                    <Text text={`Report reason: ${report.reportReason}`}/>
                    <br/>
                    <Text text={`Report date: ${report.reportDate}`}/>
                    <br/>
                    <Text text={`Meme posted by: ${report.memePostedBy === null ? "MemSpace" : report.memePostedBy}`}/>
                    <br/>
                    <Text text={`Reported by: ${report.userId}`}/>
                </CardContent>
                <CardActions>
                    <Button onClick={() => banUser(report.memePostedBy)}>Ban meme poster</Button>
                    <Button onClick={() => deleteReport(report.id)}>Delete report</Button>
                    <Button onClick={() => deleteMeme(report.imageId)}>Delete Meme</Button>
                </CardActions>
            </Card>
        )
    };

    render() {
        const {classes, reports} = this.props;
        return (
            <div className={classes.container}>
                {reports.map(report => this.renderItem(report))}
            </div>
        )
    }
}

ReportList.propTypes = {
    reports: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        imageId: PropTypes.number,
        memePostedBy: PropTypes.number,
        reportDate: PropTypes.string,
        reportReason: PropTypes.string,
        userId: PropTypes.number,
    })),
    deleteMeme: PropTypes.func,
    banUser: PropTypes.func,
    deleteReport: PropTypes.func,
};

export default withStyles(styles)(ReportList)