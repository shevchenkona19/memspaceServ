import React from "react";
import {withStyles} from '@material-ui/core/styles';
import PropTypes from "prop-types";
import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";

const styles = {
    root: {
        width: '100%'
    }
};

class ListSelect extends React.Component {

    renderItems = () => {
        return this.props.items.map((item, index) => <MenuItem key={index} value={item}>{item}
        </MenuItem>)
    };

    handleChange = e => {
        this.props.onChange(e.target.value);
    };

    render() {
        const {classes, label, items, selectedValue} = this.props;
        return (
            <React.Fragment>
                {items && items.length > 0 && <FormControl className={classes.root}>
                    {label && <InputLabel>
                        {label}
                    </InputLabel>}
                    <Select
                        value={selectedValue}
                        onChange={this.handleChange}
                    >
                        {this.renderItems()}
                        <MenuItem>
                        </MenuItem>
                    </Select>
                </FormControl>
                }
            </React.Fragment>
        )
    }
}

ListSelect.propTypes = {
    label: PropTypes.string,
    items: PropTypes.array.isRequired,
    selectedValue: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(ListSelect)