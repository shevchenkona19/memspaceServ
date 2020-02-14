import React from "react";
import {Button, Card, CardActions, CardContent, List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import BackButton from "../components/BackButton";
import {withStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import DeleteIcon from '@material-ui/icons/Delete';
import MemAnalyzerActions from "../actions/memAnalyzer";
import {_delete} from "../utils/api/api";
import Spinner from "../../common/components/Spinner";

const styles = {
    root: {
        width: "100%",
        height: "100%",
        margin: "auto"
    },
    mainCard: {
        margin: "16px"
    }
};

class MemAnalyzerPage extends React.Component {

    onBackClick = () => {
        this.props.history.goBack();
    };

    showMemesWithoutImageData = () => {
        this.props.getMemesWithoutImageData();
    };

    deleteMeme = memId => {
        _delete("/reports/meme?memeId=" + memId)
            .then(res => {
                if (res.success) {
                    this.showMemesWithoutImageData();
                } else {
                    alert("Error: " + res.message)
                }
            }).catch(error => {
            alert("Error: " + error.toString())
        });
    };

    renderMemesWithoutImageData = memes => {
        return memes.map(mem => (
            <ListItem>
                <ListItemText
                    primary={`Id: ${mem.imageId}; isChecked: ${mem.isChecked}; createdAt: ${mem.createdAt}`}
                    secondary={`This meme has no image data and should be deleted`}
                />
                <ListItemIcon><DeleteIcon onClick={() => this.deleteMeme(mem.imageId)}/></ListItemIcon>
            </ListItem>
        ));
    };

    render = () => {
        const {classes, memAnalyzer: {memesWithoutImageData}, isLoading} = this.props;
        return (
            <div className={classes.root}>
                <BackButton onBackClick={this.onBackClick}/>
                <Card className={classes.mainCard}>
                    <CardActions>
                        <Button
                            onClick={this.showMemesWithoutImageData}
                        >
                            Show memes without image data
                        </Button>
                    </CardActions>
                    <CardContent>{isLoading ? <Spinner isLoading/> :
                        <List>
                            {memesWithoutImageData && memesWithoutImageData.length > 0 &&
                            this.renderMemesWithoutImageData(memesWithoutImageData)}
                        </List>}
                    </CardContent>
                </Card>
            </div>
        );
    };
}

const mapStateToProps = state => ({
    isLoading: state.app.isLoading,
    memAnalyzer: {...state.memAnalyzer}
});

const mapDispatchToProps = dispatch => ({
    getMemesWithoutImageData: () => dispatch(MemAnalyzerActions.findMemesWithoutImageData())
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(MemAnalyzerPage));