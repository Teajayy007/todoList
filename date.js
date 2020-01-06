//jshint esversion:6


exports.getDate = function () {
  const time = new Date();


  const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  return time.toLocaleDateString("en-US", options);

};

exports.getDay = function () {
  const time = new Date();


  const options = {
    weekday: "long",
  };

  return time.toLocaleDateString("en-US", options);
};
