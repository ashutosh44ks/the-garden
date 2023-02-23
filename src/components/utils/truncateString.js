export default function truncateString(str, maxLength) {
  if (str.length > maxLength) {
    str = str.substring(0, maxLength) + "...";
  }
  return str;
}
