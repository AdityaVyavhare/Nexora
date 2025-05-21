import moment from "moment";

function timeAgo(dateString) {
  return moment(dateString).fromNow();
}

export default timeAgo;
