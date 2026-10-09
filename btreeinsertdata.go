package piscine

type TreeNode struct {
	Left, Right, Parent *TreeNode
	Data                string
}

func BTreeInsertData(root *TreeNode, data string) *TreeNode {
	if root == nil {
		return &TreeNode{Data: data}
	}

	current := root

	for {
		if data < current.Data {
			if current.Left == nil {
				current.Left = &TreeNode{
					Data:   data,
					Parent: current,
				}
				break
			}
			current = current.Left
		} else if data > current.Data {
			if current.Right == nil {
				current.Right = &TreeNode{
					Data:   data,
					Parent: current,
				}
				break
			}
			current = current.Right
		} else {
			break
		}
	}

	return root
}
