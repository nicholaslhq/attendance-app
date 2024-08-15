const moment = require("moment/moment");

const formatDate = (date) => {
	return moment(date).format("DD/MM/YYYY");
};

const formatDateMonth = (date) => {
	return moment(date).format("DD MMM");
};

const formatDatetime = (date) => {
	return moment(date).format("DD/MM/YYYY HH:mm:ss");
};

const formatDateWithoutSeconds = (date) => {
	return moment(date).format("DD/MM/YYYY HH:mm");
};

const formatDatetime12h = (date) => {
	return moment(date).format("DD/MM/YYYY hh:mm:ss A");
};

const formatDatetime12hWithoutSeconds = (date) => {
	return moment(date).format("DD/MM/YYYY hh:mm A");
};

export {
	formatDate,
	formatDateMonth,
	formatDatetime,
	formatDateWithoutSeconds,
	formatDatetime12h,
	formatDatetime12hWithoutSeconds,
};
export default formatDate;
