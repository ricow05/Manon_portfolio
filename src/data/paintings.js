export function toLabel(fileName) {
  return fileName.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
}
