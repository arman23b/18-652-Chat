colors = ["FA6F57", "55C1E7", "FF6666", "9999FF", "009900", "00994C", "404040"]

module.exports = function (firstName, lastName) {
    var firstLetter = firstName[0] + lastName[0];
    var url = "http://placehold.it/40/" + colors[Math.floor(Math.random() * colors.length)] + "/fff&text=" + firstLetter;
    return url;
}