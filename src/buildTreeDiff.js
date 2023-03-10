import _ from 'lodash';

const getParent = (name, type, children) => ({ name, type, children });
const getLeaf = (name, type, value) => ({ name, type, value });
const getChangedLeaf = (name, type, oldValue, newValue) => ({
  name, type, oldValue, newValue,
});

const getKey = (data1, data2) => _.sortBy(_.union(_.keys(data1), _.keys(data2)));
const isObject = (value1, value2) => {
  const result1 = typeof (value1) === 'object';
  const result2 = typeof (value2) === 'object';
  return result1 && result2;
};

const findDiff = (data1, data2) => {
  const keys = getKey(data1, data2);
  const result = keys.map((key) => {
    if (isObject(data1[key], data2[key])) {
      return getParent(key, 'nested', findDiff(data1[key], data2[key]));
    }
    if (!_.has(data1, key) && _.has(data2, key)) {
      return getLeaf(key, 'added', data2[key]);
    }
    if (_.has(data1, key) && !_.has(data2, key)) {
      return getLeaf(key, 'removed', data1[key]);
    }
    if (_.isEqual(data1[key], data2[key])) {
      return getLeaf(key, 'unchanged', data1[key]);
    }
    const structure = getChangedLeaf(key, 'changed', data1[key], data2[key]);
    return structure;
  });
  return result;
};

const buildTreeDiff = (data1, data2) => ({ type: 'root', children: findDiff(data1, data2) });
export default buildTreeDiff;
