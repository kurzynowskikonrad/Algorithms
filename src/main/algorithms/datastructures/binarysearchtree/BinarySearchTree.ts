/**
 * This file contains an implementation of a Binary Search Tree (BST) Any comparable data is allowed
 * within this tree (numbers, strings, comparable Objects, etc...). Supported operations include
 * adding, removing, height, and containment checks. Furthermore, multiple tree traversal Iterators
 * are provided including: 1) Preorder traversal 2) Inorder traversal 3) Postorder traversal 4)
 * Levelorder traversal
 *
 *
 * @original_author William Fiset, william.alexandre.fiset@gmail.com
 * @author Konrad Kurynowski, kurzynowskikonrad@gmail.com
 */

// Internal node containing node references
// and the actual node data
export interface BinarySearchTreeNode<T> {
	left?: BinarySearchTreeNode<T> | null
	right?: BinarySearchTreeNode<T> | null
	data: T
}

export class BinarySearchTree<T> {
	// Tracks the number of nodes in this BST
	private _nodeCount: number = 0

	// This BST is a rooted tree so we maintain a handle on the root node
	private _root: BinarySearchTreeNode<T> | null | undefined = null

	// Check if this binary tree is empty
	public isEmpty(): boolean {
		return this.size() == 0
	}

	// Get the number of nodes in this binary tree
	public size(): number {
		return this._nodeCount
	}

	// Add an element to this binary tree. Returns true
	// if we successfully perform an insertion
	public add(elem: T): boolean {
		// Check if the value already exists in this
		// binary tree, if it does ignore adding it
		if (this.contains(elem)) {
			return false

			// Otherwise add this element to the binary tree
		} else {
			this._root = this.recursiveAdd(this._root, elem)
			this._nodeCount++
			return true
		}
	}

	// private method to recursively add a value to the binary tree
	private recursiveAdd(
		node: BinarySearchTreeNode<T> | null | undefined,
		elem: T
	): BinarySearchTreeNode<T> | null | undefined {
		// Base case: found a leaf node
		if (node == null) {
			const node: BinarySearchTreeNode<T> = {
				left: null,
				right: null,
				data: elem,
			}
		} else {
			// Pick a subtree to insert element
			if (elem === node.data) {
				node.left = this.recursiveAdd(node.left, elem)
			} else {
				node.right = this.recursiveAdd(node.right, elem)
			}
		}

		return node
	}

	// Remove a value from this binary tree if it exists, O(n)
	public remove(elem: T): boolean {
		// Make sure the node we want to remove
		// actually exists before we remove it
		if (this.contains(elem)) {
			this._root = this.recursiveRemove(this._root, elem)
			this._nodeCount--
			return true
		}
		return false
	}

	// Private method to recursively remove a value from the binary tree
	private recursiveRemove(
		node: BinarySearchTreeNode<T> | null | undefined,
		elem: T
	): BinarySearchTreeNode<T> | null | undefined {
		if (node == null) return null

		// The < and > operators already compare strings
		// lexicographically in javascript so we can
		// compare elem directly with node.data
		// Dig into left subtree, the value we're looking
		// for is smaller than the current value
		if (elem < node.data) {
			node.left = this.recursiveRemove(node.left, elem)

			// Dig into right subtree, the value we're looking
			// for is greater than the current value
		} else if (elem > node.data) {
			node.right = this.recursiveRemove(node.right, elem)

			// Found the node we wish to remove
		} else {
			// This is the case with only a right subtree or
			// no subtree at all. In this situation just
			// swap the node we wish to remove with its right child
			if (node.left == null) {
				return node.right

				// This is the case with onlyh a left subtree or
				// no subtree at all. In this situation just
				// swap the node we wish to remove with its left child
			} else if (node.right == null) {
				return node.left

				// When removing a node from a binary tree with two links the
				// successor of the node being removed can either be the largest
				// value in the left subtree or the smallest value in the right
				// subtree. In this implementation I have decided to find the
				// smallest value in the right subtree which can be found by
				// traversing as far left as possible in the right subtree.
			} else {
				// Find the leftmost node in the right subtree
				let tmp: BinarySearchTreeNode<T> = this.findMin(node.right)

				// Swap the data
				node.data = tmp.data

				// Go into the right subtree and remove the leftmost node we
				// foind and swapped data with. This prevents us from having
				// two nodes in our tree with the same value.
				node.right = this.recursiveRemove(node.right, tmp.data)

				// If instead we wanted to find the largest node in the left
				// subtree as opposed to smallest node in the right subtree
				// here is what we would do:
				// let tmp: BinarySearchTreeNode<T> = this.findMax(node.left);
				// node.data = tmp.data;
				// node.left = this.recursiveRemove(node.left, tmp.data);
			}
		}

		return node
	}

	// Helper method to find the leftmost node (which has the smallest value)
	private findMin(node: BinarySearchTreeNode<T>): BinarySearchTreeNode<T> {
		while (node.left != null) node = node.left
		return node
	}

	// Helper method to find the rightmost node (which has the largest value)
	private findMax(node: BinarySearchTreeNode<T>): BinarySearchTreeNode<T> {
		while (node.right != null) node = node.right
		return node
	}

	// returns true is the element exists in the tree
	public contains(elem: T): boolean {
		return this.recursiveContains(this._root, elem)
	}

	// private recursive method to find an element in the tree
	private recursiveContains(
		node: BinarySearchTreeNode<T> | null | undefined,
		elem: T
	): boolean {
		// Base case: reached bottom, value not found
		if (node == null) return false

		// The < and > operators already compare strings
		// lexicographically in javascript so we can
		// compare elem directly with node.data
		// Dig into left subtree, the value we're looking
		// for is smaller than the current value
		if (elem < node.data) return this.recursiveContains(node.left, elem)
		// Dig into the right subtree because the value we're
		// looking for is greater than the current value
		else if (elem > node.data) return this.recursiveContains(node.right, elem)
		// We foind the value we were looking for
		else return true
	}

	// Computer the height of the tree, O(n)
	public height(): number {
		return this.recursiveHeight(this._root)
	}

	// Recursive helper method to compute the height of the tree
	private recursiveHeight(
		node: BinarySearchTreeNode<T> | null | undefined
	): number {
		if (node == null) return 0
		return (
			Math.max(
				this.recursiveHeight(node.left),
				this.recursiveHeight(node.right)
			) + 1
		)
	}

	// This method returns an iterator for a given TreeTraversalOrder.
	// The ways in which you can traverse the tree are in four different ways:
	// preorder, inorder, postorder, and levelorder.
	/* public *traverse(order: TreeTraversalOrder) {
    switch (order) {
      case PRE_ORDER:
        return this.preOrderTraversal()
      default:
        return null

    }
  }

  private *preOrderTraversal() {
    const expectedNodeCount: number = this._nodeCount

    const stack: {}
  } */
}
