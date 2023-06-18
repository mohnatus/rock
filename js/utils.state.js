export function getState() {
  const state = {
    list: [],

    setList(list) {
      this.list = list;
    },

    getItem(itemId) {
      return this.list.find((item) => item.id === itemId);
    },
    addItem(itemData) {
      this.list.push(itemData);
    },
    editItem(itemData) {
      this.list = this.list.map((item) => {
        if (item.id === itemData.id) {
          return itemData;
        }
        return item;
      });
    },
    removeItem(itemId) {
      this.list = this.list.filter((item) => item.id !== itemId);
    },
  };

  return state;
}
