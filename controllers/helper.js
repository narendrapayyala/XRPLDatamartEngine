let obj = {
  prop1: "value1",
  prop2: {
    prop2_1: "value2_1",
    prop2_2: "value2_2",
    prop3_3: {
      prop3_3_1: "value3_3_1",
      prop3_3_2: "value3_3_2",
    },
  },
};

let filter = "prop2.prop3_3.prop3_3_1";
console.log(getProp(obj, filter.split(".")));

function getProp(obj, props) {
  if (!obj[props[0]]) return null;
  if (props.length === 1) {
    return obj ? obj[props[0]] : null;
  }
  return getProp(obj[props[0]], props.slice(1));
}
