export default {
    memLoader: memId => window.location.origin + "/feed/imgs?id=" + memId,
    userLoader: username => window.location.origin + "/feed/userPhoto?targetUsername=" + username,
};