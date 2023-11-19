class Node {
    constructor(value, level) {
      this.value = value;
      this.forward = new Array(level + 1);
    }
  }
  
  class SkipList {
    constructor(maxLevel) {
      this.maxLevel = maxLevel;
      this.head = new Node(-1, maxLevel);
      this.level = 0;
    }
  
    randomLevel() {
      let level = 0;
      while (Math.random() < 0.5 && level < this.maxLevel) {
        level++;
      }
      return level;
    }
  
    insert(value) {
      const update = new Array(this.maxLevel + 1);
      let current = this.head;
  
      for (let i = this.level; i >= 0; i--) {
        while (
          current.forward[i] !== undefined &&
          current.forward[i].value < value
        ) {
          current = current.forward[i];
        }
        update[i] = current;
      }
  
      const newLevel = this.randomLevel();
  
      if (newLevel > this.level) {
        for (let i = this.level + 1; i <= newLevel; i++) {
          update[i] = this.head;
        }
        this.level = newLevel;
      }
  
      const newNode = new Node(value, newLevel);
  
      for (let i = 0; i <= newLevel; i++) {
        newNode.forward[i] = update[i].forward[i];
        update[i].forward[i] = newNode;
      }
    }
  
    search(value) {
      let current = this.head;
      for (let i = this.level; i >= 0; i--) {
        while (
          current.forward[i] !== undefined &&
          current.forward[i].value < value
        ) {
          current = current.forward[i];
  
        }
      }
  
      current = current.forward[0];
  
      if (current !== undefined && current.value === value) {
        console.log(`${value} found in the Skip List`);
        return true;
      } else {
        console.log(`${value} not found in the Skip List`);
        return false;
      }
    }
  
    remove(value) {
      const update = new Array(this.maxLevel + 1);
      let current = this.head;
  
      for (let i = this.level; i >= 0; i--) {
        while (
          current.forward[i] !== undefined &&
          current.forward[i].value < value
        ) {
          current = current.forward[i];
        }
        update[i] = current;
      }
  
      current = current.forward[0];
  
      if (current !== undefined && current.value === value) {
        for (let i = 0; i <= this.level; i++) {
          if (update[i].forward[i] !== current) break;
          update[i].forward[i] = current.forward[i];
        }
  
        while (this.level > 0 && this.head.forward[this.level] === undefined) {
          this.level--;
        }
  
        console.log(`${value} removed from the Skip List`);
      } else {
        console.log(`${value} not found in the Skip List`);
      }
    }
  
    print() {
      for (let i = this.level; i >= 0; i--) {
        let row = "Head -> ";
        let current = this.head.forward[i];
        while (current !== undefined) {
          row += `${current.value} -> `;
          current = current.forward[i];
        }
        console.log(row + "null");
      }
    }
  }
  
  
  const skipList = new SkipList(400);
  
  skipList.insert(3);
  skipList.insert(6);
  skipList.insert(7);
  skipList.remove(7)
  skipList.insert(9);
  skipList.insert(12);
  skipList.insert(19);
  skipList.insert(17);
  skipList.insert(26);
  skipList.insert(21);
  skipList.insert(25);
  skipList.print();
  skipList.search(19);