// Red-Black Tree Node
class Node {
  constructor(key, color) {
    this.key = key;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.color = color; // 'R' for red, 'B' for black
  }
}

// Red-Black Tree
class RedBlackTree {
  constructor() {
    this.root = null;
  }

  // Rotate left
  leftRotate(node) {
    const rightChild = node.right;
    node.right = rightChild.left;

    if (rightChild.left !== null) {
      rightChild.left.parent = node;
    }

    rightChild.parent = node.parent;

    if (node.parent === null) {
      this.root = rightChild;
    } else if (node === node.parent.left) {
      node.parent.left = rightChild;
    } else {
      node.parent.right = rightChild;
    }

    rightChild.left = node;
    node.parent = rightChild;
  }

  // Rotate right
  rightRotate(node) {
    const leftChild = node.left;
    node.left = leftChild.right;

    if (leftChild.right !== null) {
      leftChild.right.parent = node;
    }

    leftChild.parent = node.parent;

    if (node.parent === null) {
      this.root = leftChild;
    } else if (node === node.parent.left) {
      node.parent.left = leftChild;
    } else {
      node.parent.right = leftChild;
    }

    leftChild.right = node;
    node.parent = leftChild;
  }

  // Insert a key into the tree
  insert(key) {
    const newNode = new Node(key, 'R');
    this._insert(newNode);
    this.fixInsert(newNode);
  }

  _insert(node) {
    let parent = null;
    let current = this.root;

    while (current !== null) {
      parent = current;
      if (node.key < current.key) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    node.parent = parent;
    if (parent === null) {
      this.root = node;
    } else if (node.key < parent.key) {
      parent.left = node;
    } else {
      parent.right = node;
    }
  }

  // Fix the tree after insertion
  fixInsert(node) {
    while (node.parent !== null && node.parent.color === 'R') {
      if (node.parent === node.parent.parent.left) {
        const uncle = node.parent.parent.right;

        if (uncle !== null && uncle.color === 'R') {
          // Case 1
          node.parent.color = 'B';
          uncle.color = 'B';
          node.parent.parent.color = 'R';
          node = node.parent.parent;
        } else {
          if (node === node.parent.right) {
            // Case 2
            node = node.parent;
            this.leftRotate(node);
          }

          // Case 3
          node.parent.color = 'B';
          node.parent.parent.color = 'R';
          this.rightRotate(node.parent.parent);
        }
      } else {
        const uncle = node.parent.parent.left;

        if (uncle !== null && uncle.color === 'R') {
          // Case 1
          node.parent.color = 'B';
          uncle.color = 'B';
          node.parent.parent.color = 'R';
          node = node.parent.parent;
        } else {
          if (node === node.parent.left) {
            // Case 2
            node = node.parent;
            this.rightRotate(node);
          }

          // Case 3
          node.parent.color = 'B';
          node.parent.parent.color = 'R';
          this.leftRotate(node.parent.parent);
        }
      }
    }

    this.root.color = 'B';
  }

  // In-order traversal to get sorted keys
  inOrderTraversal(node, result) {
    if (node !== null) {
      this.inOrderTraversal(node.left, result);
      result.push(node.key);
      this.inOrderTraversal(node.right, result);
    }
  }

  // Get sorted keys
  sort() {
    const result = [];
    this.inOrderTraversal(this.root, result);
    return result;
  }

  // Search for a key
  search(key) {
    let current = this.root;

    while (current !== null) {
      if (key === current.key) {
        return true;
      } else if (key < current.key) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return false;
  }

  // Get the minimum key
  findMin(node) {
    while (node.left !== null) {
      node = node.left;
    }
    return node;
  }

  min() {
    const minNode = this.findMin(this.root);
    return minNode ? minNode.key : null;
  }

  // Get the maximum key
  findMax(node) {
    while (node.right !== null) {
      node = node.right;
    }
    return node;
  }

  max() {
    const maxNode = this.findMax(this.root);
    return maxNode ? maxNode.key : null;
  }

  // Get the successor of a key
  successor(key) {
    const node = this.findSuccessorNode(key);
    return node ? node.key : null;
  }

  // Get the successor node
  findSuccessorNode(key) {
    let current = this.root;
    let successor = null;

    while (current !== null) {
      if (key < current.key) {
        successor = current;
        current = current.left;
      } else if (key > current.key) {
        current = current.right;
      } else {
        if (current.right !== null) {
          return this.findMin(current.right);
        }
        break;
      }
    }

    return successor;
  }

  // Get the predecessor of a key
  predecessor(key) {
    const node = this.findPredecessorNode(key);
    return node ? node.key : null;
  }

  // Get the predecessor node
  findPredecessorNode(key) {
    let current = this.root;
    let predecessor = null;

    while (current !== null) {
      if (key > current.key) {
        predecessor = current;
        current = current.right;
      } else if (key < current.key) {
        current = current.left;
      } else {
        if (current.left !== null) {
          return this.findMax(current.left);
        }
        break;
      }
    }

    return predecessor;
  }

  // Delete a key from the tree
  delete(key) {
    const node = this.searchNode(key);
    if (node) {
      this._delete(node);
    }
  }

  _delete(node) {
    let y = node;
    let yOriginalColor = y.color;
    let x;

    if (node.left === null) {
      x = node.right;
      this.transplant(node, node.right);
    } else if (node.right === null) {
      x = node.left;
      this.transplant(node, node.left);
    } else {
      y = this.findMin(node.right);
      yOriginalColor = y.color;
      x = y.right;

      if (y.parent === node) {
        x.parent = y;
      } else {
        this.transplant(y, y.right);
        y.right = node.right;
        y.right.parent = y;
      }

      this.transplant(node, y);
      y.left = node.left;
      y.left.parent = y;
      y.color = node.color;
    }

    if (yOriginalColor === 'B') {
    //   this.fixDelete(x);
    }
  }

  fixDelete(node) {
    while (node !== this.root && node.color === 'B') {
      if (node === node.parent.left) {
        let sibling = node.parent.right;

        if (sibling.color === 'R') {
          // Case 1
          sibling.color = 'B';
          node.parent.color = 'R';
          this.leftRotate(node.parent);
          sibling = node.parent.right;
        }

        if (sibling.left.color === 'B' && sibling.right.color === 'B') {
          // Case 2
          sibling.color = 'R';
          node = node.parent;
        } else {
          if (sibling.right.color === 'B') {
            // Case 3
            sibling.left.color = 'B';
            sibling.color = 'R';
            this.rightRotate(sibling);
            sibling = node.parent.right;
          }

          // Case 4
          sibling.color = node.parent.color;
          node.parent.color = 'B';
          sibling.right.color = 'B';
          this.leftRotate(node.parent);
          node = this.root; // Terminate the loop
        }
      } else {
        let sibling = node.parent.left;

        if (sibling.color === 'R') {
          // Case 1
          sibling.color = 'B';
          node.parent.color = 'R';
          this.rightRotate(node.parent);
          sibling = node.parent.left;
        }

        if (sibling.right.color === 'B' && sibling.left.color === 'B') {
          // Case 2
          sibling.color = 'R';
          node = node.parent;
        } else {
          if (sibling.left.color === 'B') {
            // Case 3
            sibling.right.color = 'B';
            sibling.color = 'R';
            this.leftRotate(sibling);
            sibling = node.parent.left;
          }

          // Case 4
          sibling.color = node.parent.color;
          node.parent.color = 'B';
          sibling.left.color = 'B';
          this.rightRotate(node.parent);
          node = this.root; // Terminate the loop
        }
      }
    }

    node.color = 'B';
  }

  // Transplant the subtree rooted at node `u` with the subtree rooted at node `v`
  transplant(u, v) {
    if (u.parent === null) {
      this.root = v;
    } else if (u === u.parent.left) {
      u.parent.left = v;
    } else {
      u.parent.right = v;
    }

    if (v !== null) {
      v.parent = u.parent;
    }
  }

  // Search for a node with the given key
  searchNode(key) {
    let current = this.root;

    while (current !== null) {
      if (key === current.key) {
        return current;
      } else if (key < current.key) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return null;
  }
}

// Example usage:
const rbTree = new RedBlackTree();

// Inserting elements
rbTree.insert(1);
rbTree.insert(2);
rbTree.insert(5);
rbTree.insert(6);
rbTree.insert(12);
rbTree.insert(30);
rbTree.insert(15);

console.log("Sorted keys:", rbTree.sort());
console.log("Minimum key:", rbTree.min());
console.log("Maximum key:", rbTree.max());
console.log("Successor of 15:", rbTree.successor(15));
console.log("Predecessor of 15:", rbTree.predecessor(15));

// Deleting elements
// rbTree.delete(15);

console.log("After deleting 15:", rbTree.sort());