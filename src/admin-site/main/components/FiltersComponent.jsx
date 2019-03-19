import React from "react";
import {withStyles} from '@material-ui/core/styles';
import PropTypes from "prop-types";
import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@material-ui/core";

const styles = {};

class FiltersComponent extends React.Component {

    renderFilters = () => {
        return this.props.filters.map((filter, index) => {
            return (
                <FormControlLabel key={index} control={<Radio/>} value={filter} label={filter}/>
            );
        })
    };

    handleChange = e => {
        this.props.onChangeFilter(e.target.value);
    };

    render() {
        const {classes, label, selectedFilter} = this.props;
        return (
            <FormControl component='fieldset'>
                {label && <FormLabel>{label}</FormLabel>}
                <RadioGroup
                    value={selectedFilter}
                    onChange={this.handleChange}
                >
                    {this.renderFilters()}
                </RadioGroup>
            </FormControl>
        )
    }
}

FiltersComponent.propTypes = {
    filters: PropTypes.array.isRequired,
    selectedFilter: PropTypes.string.isRequired,
    onChangeFilter: PropTypes.func.isRequired,
    label: PropTypes.string,
};

export default withStyles(styles)(FiltersComponent)