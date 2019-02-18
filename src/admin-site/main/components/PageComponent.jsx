import React from "react";
import {withStyles} from '@material-ui/core/styles';
import PropTypes from "prop-types";
import {IconButton, Typography} from "@material-ui/core";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";

const styles = {
    root: {
        width: '100%'
    },
    page: {
        display: 'inline-block'
    },
    selectedPage: {
        display: 'inline-block',
        fontWeight: 600,
    },
    arrow: {
        display: 'inline-block',
    }
};

class PageComponent extends React.Component {

    state = {};

    onBackClick = () => this.props.onPageSelected(this.props.currentPage - 1);

    onForwardClick = () => this.props.onPageSelected(this.props.currentPage + 1);

    renderBackArrow = () => {
        const {currentPage, classes} = this.props;
        if (currentPage === 0) {
            return null
        }
        return (
            <IconButton className={classes.arrow} onClick={this.onBackClick}>
                <KeyboardArrowLeft/>
            </IconButton>
        );
    };

    renderForwardArrow = () => {
        const {currentPage, allPages, classes} = this.props;
        if (currentPage === allPages - 1) {
            return null
        }
        return (
            <IconButton className={classes.arrow} onClick={this.onForwardClick}>
                <KeyboardArrowRight/>
            </IconButton>
        );
    };

    renderPageNumbers = () => {
        const {currentPage, allPages, onPageSelected, classes} = this.props;
        const pageItems = new Array(allPages);
        return pageItems.map((page, index) => {
            return (
                <Typography onClick={() => onPageSelected(index)} className={index === currentPage ? classes.selectedPage : classes.page}>
                    {page}
                </Typography>
            )
        })
    };

    render() {
        const {classes, showArrows} = this.props;
        return (
            <div className={classes.root}>
                {showArrows ? this.renderBackArrow() : null}
                {this.renderPageNumbers()}
                {showArrows ? this.renderForwardArrow() : null}
            </div>
        )
    }
}

PageComponent.propTypes = {
    currentPage: PropTypes.number.isRequired,
    allPages: PropTypes.number.isRequired,
    countFromZero: PropTypes.bool,
    onPageSelected: PropTypes.func,
    showArrows: PropTypes.bool,
};

export default withStyles(styles)(PageComponent)