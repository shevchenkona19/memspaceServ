import React from "react";
import {connect} from "react-redux";
import PageComponent from "../components/PageComponent";
import BackButton from "../components/BackButton";
import ReportList from "../components/ReportList";
import Actions from "../actions/reports";
import {_delete, post} from "../utils/api/api";

class ViewReports extends React.Component {

    count = 5;

    componentDidMount() {
        this.props.getReports(this.count, 0);
    }

    deleteReport = reportId => {
        _delete(`/reports/report?reportId=${reportId}`).then(res => {
            if (res.success) {
                alert("Report was deleted");
                this.props.getReports(this.count, this.props.currentPage * this.count);
            } else {
                alert("Error deleting report: " + res.message)
            }
        }).catch(err => {
            alert("Error deleting report: " + err)
        });
    };

    banUser = userId => {
        post(`/reports/banUser?userId=${userId}`).then(res => {
           if (res.success) {
               alert("User was banned")
           } else {
               alert("Error banning user: " + res.message)
           }
        }).catch(err => {
            alert("Error banning user: " + err)
        });
    };

    deleteMeme = imageId => {
        _delete(`/reports/meme?memeId=${imageId}`).then(res => {
            if (res.success) {
                alert("Meme was deleted");
            } else {
                alert("Error deleting meme: " + res.message);
            }
        }).catch(err => {
            alert("Error deleting meme: " + err);
        });
    };

    onBackClicked = () => {
        this.props.history.goBack();
    };

    selectPage = pageNum => {
        this.props.setCurrentPage(pageNum);
        this.props.getReports(this.count, pageNum * this.count);
    };

    render() {
        const {
            currentPage, allPages, reports
        } = this.props;
        return (
            <React.Fragment>
                <BackButton onBackClick={this.onBackClicked}/>
                <ReportList
                    reports={reports}
                    deleteMeme={this.deleteMeme}
                    banUser={this.banUser}
                    deleteReport={this.deleteReport}
                />
                <PageComponent
                    currentPage={currentPage}
                    allPages={allPages}
                    onPageSelected={this.selectPage}
                    showArrows
                />
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    ...state.reports
});

const mapDispatchToProps = dispatch => ({
    setCurrentPage: page => dispatch(Actions.setCurrentPageAction(page)),
    getReports: (count, offset) => dispatch(Actions.getReportsAction(count, offset)),
    setErrorRead: () => dispatch(Actions.setErrorRead()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewReports)