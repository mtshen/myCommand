export default class DataStorage {
  data: Object = {};

  constructor() {}

  set(key, option) {
    this.data[key] = option;
  }

  get(key) {
    return this.data[key];
  }
}
