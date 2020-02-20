import React from "react";
import {withStyles} from '@material-ui/core/styles';
import PropTypes from "prop-types";
import Card from "@material-ui/core/es/Card/Card";
import CardContent from "@material-ui/core/es/CardContent/CardContent";
import CardActions from "@material-ui/core/es/CardActions/CardActions";
import Title from "../../common/components/Title";
import SmallText from "../../common/components/SmallText";
import Button from "@material-ui/core/es/Button/Button";
import Link from "@material-ui/core/es/Link/Link";

const styles = {};

class HomeCard extends React.Component {
    render() {
        const {classes, title, subTitle, navLink, buttonText, isButton, onClick, useSecondButton, secondButtonAction, secondButtonText} = this.props;
        return (
            <React.Fragment>
                {
                    isButton ?
                        <Card>
                            <CardContent>
                                <Title text={title}/>
                                {subTitle && <SmallText text={subTitle}/>}
                            </CardContent>
                            <CardActions>
                                <Button onClick={onClick}>{buttonText}</Button>
                                {useSecondButton && <Button onClick={secondButtonAction}>{secondButtonText}</Button>}
                            </CardActions>
                        </Card> :
                        <Link to={navLink}>
                            <Card raised={this.state.hovered}>
                                <CardContent>
                                    <Title text={title}/>
                                    {subTitle && <SmallText text={subTitle}/>}
                                </CardContent>
                            </Card>
                        </Link>
                }
            </React.Fragment>
        )
    }
}

HomeCard.propTypes = {
    title: PropTypes.string,
    subTitle: PropTypes.string,
    navLink: PropTypes.string,
    isButton: PropTypes.bool,
    onClick: PropTypes.func,
    buttonText: PropTypes.string,
    useSecondButton: PropTypes.bool,
    secondButtonText: PropTypes.string,
    secondButtonAction: PropTypes.func,
};

export default withStyles(styles)(HomeCard)