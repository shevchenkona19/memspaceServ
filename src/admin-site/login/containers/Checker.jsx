import React from "react";
import {withStyles} from '@material-ui/core/styles';
import {connect} from "react-redux";
import Card from "@material-ui/core/es/Card/Card";
import CardContent from "@material-ui/core/es/CardContent/CardContent";
import CardMedia from "@material-ui/core/es/CardMedia/CardMedia";

const styles = {};

class Checker extends React.Component {

    renderCategories = () => {

    };

    render() {
        const {classes} = this.props;
        return (
            <Card>
                <CardContent>
                    <CardMedia/>
                    {this.renderCategories()}
                </CardContent>
            </Card>
        )
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Checker));