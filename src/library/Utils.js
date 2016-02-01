module.exports.toCamelCase = function(str) {
    return String(str).replace(/\-([a-z])/g, function(all, match) {
        return match.toUpperCase();
    });
};
