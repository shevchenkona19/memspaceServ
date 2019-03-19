import React from "react";
import {withStyles} from '@material-ui/core/styles';
import PropTypes from "prop-types";
import {Avatar, Dialog, DialogContent, DialogTitle, Typography} from "@material-ui/core";
import imageLoader from "../utils/imageLoader";
import moment from "moment";

const styles = theme => ({
    oneLine: {},
    title: {
        verticalAlign: 'middle',
        marginLeft: 10,
        display: 'inline-block',
    },
    avatar: {
        verticalAlign: 'middle',
        display: 'inline-block',
    },
    content: {
        textAlign: 'end'
    },
    header: {},
    row: {},
    fullWidth: {
        width: "100%"
    }
});

class DetailUserModal extends React.Component {
    render() {
        const {classes, onClose, user} = this.props;
        return (
            <Dialog
                open
                onClose={onClose}
            >
                <DialogTitle onClose={onClose}>
                    <Avatar className={classes.avatar} src={imageLoader.userLoader(user.username)}/>
                    <Typography variant={'h5'} className={classes.title}>{user.username}</Typography>
                </DialogTitle>
                <DialogContent>
                    <table className={classes.fullWidth}>
                        <tbody>
                        <tr className={classes.row}>
                            <td className={classes.header}>
                                <Typography className={classes.oneLine}>UserId: </Typography>
                            </td>
                            <td className={classes.content}>
                                <Typography>{user.userId}</Typography>
                            </td>
                        </tr>
                        <tr className={classes.row}>
                            <td className={classes.header}>
                                <Typography className={classes.oneLine}>Email: </Typography>
                            </td>
                            <td className={classes.content}>
                                <Typography>{user.email}</Typography>
                            </td>
                        </tr>
                        <tr className={classes.row}>
                            <td className={classes.header}>
                                <Typography className={classes.oneLine}>Access level: </Typography>
                            </td>
                            <td className={classes.content}>
                                <Typography>{user.accessLvl}</Typography>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <br/>
                    <br/>
                    <table>
                        <tbody>
                        <tr className={classes.row}>
                            <td className={classes.header}>
                                <Typography>Likes achievement
                                    level:</Typography>
                            </td>
                            <td className={classes.content}>
                                <Typography>{user.likeAchievementLvl}</Typography>
                            </td>
                        </tr>
                        <tr className={classes.row}>
                            <td className={classes.header}>
                                <Typography>Likes count:</Typography>
                            </td>
                            <td className={classes.content}>
                                <Typography>{user.likesCount}</Typography>
                            </td>
                        </tr>
                        <tr className={classes.row}>
                            <td className={classes.header}>
                                <Typography>Dislikes achievement level: </Typography>
                            </td>
                            <td className={classes.content}>
                                <Typography>{user.dislikesAchievementLvl}</Typography>
                            </td>
                        </tr>
                        <tr className={classes.row}>
                            <td className={classes.header}>
                                <Typography>Dislikes count: </Typography>
                            </td>
                            <td className={classes.content}>
                                <Typography>{user.dislikesCount}</Typography>
                            </td>
                        </tr>
                        <tr className={classes.row}>
                            <td className={classes.header}>
                                <Typography>Comments achievement level:</Typography>
                            </td>
                            <td className={classes.content}>
                                <Typography>{user.commentsAchievementLvl}</Typography>
                            </td>
                        </tr>
                        <tr className={classes.row}>
                            <td className={classes.header}>
                                <Typography>Comments count:</Typography>
                            </td>
                            <td className={classes.content}>
                                <Typography>{user.commentsCount}</Typography>
                            </td>
                        </tr>
                        <tr className={classes.row}>
                            <td className={classes.header}>
                                <Typography>Favourites achievement level:</Typography>
                            </td>
                            <td className={classes.content}>
                                <Typography>{user.favouritesAchievementLvl}</Typography>
                            </td>
                        </tr>
                        <tr className={classes.row}>
                            <td className={classes.header}>
                                <Typography>Favourites count:</Typography>
                            </td>
                            <td className={classes.content}>
                                <Typography>{user.favouritesCount}</Typography>
                            </td>
                        </tr>
                        <tr className={classes.row}>
                            <td className={classes.header}>
                                <Typography>Views achievement level: </Typography>
                            </td>
                            <td className={classes.content}>
                                <Typography>{user.viewsAchievementLvl}</Typography>
                            </td>
                        </tr>
                        <tr className={classes.row}>
                            <td className={classes.header}>
                                <Typography>Views count:</Typography>
                            </td>
                            <td className={classes.content}>
                                <Typography>{user.viewsCount}</Typography>
                            </td>
                        </tr>
                        <tr className={classes.row}>
                            <td className={classes.header}>
                                <Typography>Referral achievements level:</Typography>
                            </td>
                            <td className={classes.content}>
                                <Typography>{user.referralAchievementLvl}</Typography>
                            </td>
                        </tr>
                        <tr className={classes.row}>
                            <td className={classes.header}>
                                <Typography>Referrals count:</Typography>
                            </td>
                            <td className={classes.content}>
                                <Typography>{user.referralCount}</Typography>
                            </td>
                        </tr>
                        <tr className={classes.row}>
                            <td className={classes.header}>
                                <Typography>Is first hundred:</Typography>
                            </td>
                            <td className={classes.content}>
                                <Typography>{user.firstHundred ? "true" : "false"}</Typography>
                            </td>
                        </tr>
                        <tr className={classes.row}>
                            <td className={classes.header}>
                                <Typography>Is first thousand: </Typography>
                            </td>
                            <td className={classes.content}>
                                <Typography>{user.firstThousand ? "true" : "false"}</Typography>
                            </td>
                        </tr>
                        <tr className={classes.row}>
                            <td className={classes.header}>
                                <Typography>FCM id:</Typography>
                            </td>
                            <td className={classes.content}>
                                <Typography>{user.fcmId ? user.fcmId : "None"}</Typography>
                            </td>
                        </tr>
                        <tr className={classes.row}>
                            <td className={classes.header}>
                                <Typography>Last online:</Typography>
                            </td>
                            <td className={classes.content}>
                                <Typography>{user.lastVisited ? "Last online: " + moment(user.lastVisited).format("HH:MM DD/MM/YYYY").toString() : "Not recorded"}</Typography>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </DialogContent>
            </Dialog>
        )
    }
}

DetailUserModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    user: PropTypes.shape({
        userId: PropTypes.number,
        username: PropTypes.string,
        email: PropTypes.string,
        accessLvl: PropTypes.number,
        likeAchievementLvl: PropTypes.number,
        likesCount: PropTypes.number,
        dislikesAchievementLvl: PropTypes.number,
        dislikesCount: PropTypes.number,
        commentsAchievementLvl: PropTypes.number,
        commentsCount: PropTypes.number,
        favouritesAchievementLvl: PropTypes.number,
        favouritesCount: PropTypes.number,
        viewsAchievementLvl: PropTypes.number,
        viewsCount: PropTypes.number,
        referralAchievementLvl: PropTypes.number,
        referralCount: PropTypes.number,
        firstHundred: PropTypes.number,
        firstThousand: PropTypes.number,
        fcmId: PropTypes.string,
        lastVisited: PropTypes.string,
    }).isRequired,
};

export default withStyles(styles)(DetailUserModal)