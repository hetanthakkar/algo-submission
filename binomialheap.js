class BinomialNode {
  constructor(key) {
    this.key = key;
    this.degree = 0;
    this.parent = null;
    this.child = null;
    this.sibling = null;
  }
}

class BinomialHeap {
  constructor() {
    this.head = null;
  }

  // Insert a key into the heap
  insert(key) {
    const newHeap = new BinomialHeap();
    newHeap.head = new BinomialNode(key);
    this.union(newHeap);
  }

  // Find the minimum key in the heap
  findMinimum() {
    if (!this.head) return null;

    let minNode = this.head;
    let current = this.head.sibling;

    while (current) {
      if (current.key < minNode.key) {
        minNode = current;
      }
      current = current.sibling;
    }

    return minNode.key;
  }

  // Extract the minimum key from the heap
  extractMinimum() {
    if (!this.head) return null;

    let minNode = this.head;
    let prevMin = null;
    let prev = null;
    let current = this.head.sibling;

    while (current) {
      if (current.key < minNode.key) {
        minNode = current;
        prevMin = prev;
      }
      prev = current;
      current = current.sibling;
    }

    if (prevMin) {
      prevMin.sibling = minNode.sibling;
    } else {
      this.head = minNode.sibling;
    }

    // Reverse the order of the children and merge with the heap
    const reversedChildrenHeap = new BinomialHeap();
    reversedChildrenHeap.head = this.reverseList(minNode.child);
    this.union(reversedChildrenHeap);

    return minNode.key;
  }

  // Union two binomial heaps
  union(heap) {
    this.head = this.mergeHeaps(this, heap);
    if (!this.head) return;

    let prevNode = null;
    let currentNode = this.head;
    let nextNode = this.head.sibling;

    while (nextNode) {
      if (
        currentNode.degree !== nextNode.degree ||
        (nextNode.sibling && nextNode.sibling.degree === currentNode.degree)
      ) {
        prevNode = currentNode;
        currentNode = nextNode;
      } else {
        if (currentNode.key <= nextNode.key) {
          currentNode.sibling = nextNode.sibling;
          this.link(nextNode, currentNode);
        } else {
          if (!prevNode) {
            this.head = nextNode;
          } else {
            prevNode.sibling = nextNode;
          }

          this.link(currentNode, nextNode);
          currentNode = nextNode;
        }
      }

      nextNode = currentNode.sibling;
    }
  }

  // Link two binomial trees of the same degree
  link(node1, node2) {
    node1.parent = node2;
    node1.sibling = node2.child;
    node2.child = node1;
    node2.degree++;
  }

  // Merge two binomial heaps into a new heap
  mergeHeaps(heap1, heap2) {
    const mergedHeap = new BinomialHeap();
    let carry = null;

    while (heap1.head || heap2.head || carry) {
      const sum = (heap1.head ? 1 : 0) + (heap2.head ? 1 : 0) + (carry ? 1 : 0);

      switch (sum) {
        case 0:
          // No trees to add
          break;
        case 1:
        case 2:
          // One tree to add
          const node =
            (heap1.head ? heap1.extractHead() : null) ||
            (heap2.head ? heap2.extractHead() : null) ||
            carry;

          carry = node;
          break;
        case 3:
          // Two trees to add with carry
          carry = this.linkTrees(heap1.extractHead(), heap2.extractHead(), carry);
          break;
      }

      if (carry) {
        mergedHeap.insertTree(carry);
        carry = null;
      }
    }

    return mergedHeap.head;
  }

  // Extract and return the head of the heap
  extractHead() {
    const oldHead = this.head;
    if (oldHead) {
      this.head = oldHead.sibling;
      oldHead.sibling = null;
    }
    return oldHead;
  }

  // Insert a tree into the heap
  insertTree(tree) {
    tree.sibling = this.head;
    this.head = tree;
  }

  // Reverse the order of a linked list of trees
  reverseList(tree) {
    let prev = null;
    let current = tree;
    let next = null;

    while (current) {
      next = current.sibling;
      current.sibling = prev;
      prev = current;
      current = next;
    }

    return prev;
  }

  // Link two trees with the same degree and return the resulting tree
  linkTrees(tree1, tree2, carry) {
    if (tree1.key <= tree2.key) {
      tree1.sibling = tree2.child;
      tree2.child = tree1;
      tree2.degree++;
      return tree2;
    } else {
      tree2.sibling = tree1.child;
      tree1.child = tree2;
      tree1.degree++;
      return tree1;
    }
  }

  // Decrease the key of a node in the heap
  decreaseKey(node, newKey) {
    if (newKey > node.key) {
      console.error("New key is greater than the current key.");
      return;
    }

    node.key = newKey;
    let current = node;

    while (current.parent && current.key < current.parent.key) {
      // Swap key values with parent
      const temp = current.key;
      current.key = current.parent.key;
      current.parent.key = temp;

      current = current.parent;
    }
  }

  // Delete a node with the given key
  delete(key) {
    const nodeToDelete = this.searchNode(this.head, key);

    if (!nodeToDelete) {
      console.error("Node with the given key not found.");
      return;
    }

    this.decreaseKey(nodeToDelete, Number.NEGATIVE_INFINITY);
    this.extractMinimum();
  }

  // Search for a node with the given key in the heap
  searchNode(node, key) {
    if (!node) return null;

    if (node.key === key) {
      return node;
    }

    const childResult = this.searchNode(node.child, key);
    if (childResult) return childResult;

    const siblingResult = this.searchNode(node.sibling, key);
    if (siblingResult) return siblingResult;

    return null;
  }
  print() {
    if (!this.head) {
      console.log("Empty Heap");
      return;
    }

    console.log("Binomial Heap:");
    this.printTrees(this.head, 0);
  }

  // Print binomial trees in the heap recursively
  printTrees(node, depth) {
    while (node) {
      console.log("  ".repeat(depth) + `Degree ${node.degree}: ${node.key}`);
      if (node.child) {
        this.printTrees(node.child, depth + 1);
      }
      node = node.sibling;
    }
  }

}

// Testing the binomial heap implementation
const binomialHeap = new BinomialHeap();

// Insert keys
// binomialHeap.insert(4);
// binomialHeap.insert(8);
// binomialHeap.insert(1);
// binomialHeap.insert(3);
// binomialHeap.insert(7);

// Find and extract

let a=[7, 2,4,17,1,11,6,8,15,10,20,5]
// Insert keys into the heap
for (let i=0;i<a.length;i++){
  
  binomialHeap.insert(a[i]);
}


binomialHeap.printTrees()
