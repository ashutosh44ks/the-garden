export default function toLabel(str) {
  // check if it is a string
  if (typeof str !== "string") {
    return "";
  }
  return str.replaceAll("_", " ").replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
