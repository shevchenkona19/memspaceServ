import {_delete, get, post} from "./api";

function getReports(count, offset) {
    return get(`/reports/reports?count=${count}&offset=${offset}`);
}

function deleteMeme(memeId) {
    return _delete(`/reports/meme?memeId=${memeId}`);
}

function deleteReport(reportId) {
    return _delete(`/reports/report?reportId=${reportId}`);
}

function banUser(userId) {
    return post(`/reports/banUser?userId=${userId}`);
}

export default {
    getReports,
    deleteMeme,
    deleteReport,
    banUser
}
