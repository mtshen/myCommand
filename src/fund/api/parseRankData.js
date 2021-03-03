export default function(evalStr) {
  const str = evalStr.slice(22);
  const strExec = /,allRecords:\d+/.exec(str);
  return JSON.parse(str.slice(0, strExec.index));
}
