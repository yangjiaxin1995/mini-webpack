export function jsonLoader(source) {
  this.addDeps('test jsonLoader');
  return `export default ${JSON.stringify(source)}`;
}
