---
title: 'Notes on PyTorch Tensor Representation and Autograd'
date: '2023-12-24'
lastmod: '2023-12-24'
tags: ['PyTorch', 'Tensor Internals', 'Strided Representation', 'Strides', 'Autograd']
draft: false
layout: PostSimple
summary: 'Notes on PyTorch Tensor Internals including Strided Representation, Strides, View, and Autograd'
images: []
authors: ['default']
---

## Readings

- [PyTorch Documentation](https://pytorch.org/docs/stable/torch.html)
- [PyTorch Internals - Tensor, Autograd](http://blog.ezyang.com/2019/05/pytorch-internals/)
- [A Gentle Introduction to Torch.Autograd](https://pytorch.org/tutorials/beginner/blitz/autograd_tutorial.html)
- [PyTorch Autograd Explained](https://www.youtube.com/watch?v=MswxJw-8PvE)

## Tensor Memory Internals

### Locical vs Physical Representation

Tensor is an n-dimensional array in mathematics. It is a logical representation we use in PyTorch.
However, it is not how PyTorch stores the data in the physical memory.

A Tensor Object has several [attributes](https://pytorch.org/docs/stable/tensor_attributes.html) to help decide how to store the data in the physical memory.

- `sizes` The shape/dimension of the tensor
- `dtype`: The data type of the tensor
- `device`: The device where the tensor is stored
- `layout`: The layout of the tensor in the physical memory, for example, `torch.strided` or `torch.sparse_coo` for dense and sparse tensors respectively.

### Represent Dense Tensor in Memory with Strided Representation

In computer science, the [Stride of an array](https://en.wikipedia.org/wiki/Stride_of_an_array) is the number of locations in memory between successive array elements.
When we talk about the stride, it could mean

1. The number of elements between two consecutive elements
2. The actual byte offset between two two consecutive elements

Let's consider the following two examples with [row-major order](https://en.wikipedia.org/wiki/Row-_and_column-major_order#:~:text=In%20row%2Dmajor%20order%2C%20the,column%20in%20column%2Dmajor%20order.) logical-physical representation mapping.

#### 1D Array Example

We have a 1D array `[1, 2, 3, 4, 5, 6]`, it is stored in the memory as a 1D array
`[1, 2, 3, 4, 5, 6]` (Physical Representation) each `int32` element is 32 bits in size. We can either say the `strides` is

1. [1] element (the number of elements between two consecutive elements)
2. [32] bits (the actual byte offset between two two consecutive elements)

#### 2D Array Example

We have a 2D array `[[1, 2, 3], [4, 5, 6]]`, it is stored in the memory as a 1D array
`[1, 2, 3, 4, 5, 6]` (Physical Representation) each `int32` element is 32 bits in size. We can either say the `strides` is

1. [3, 1] elements (the number of elements between two consecutive elements in each dimension respectively)
2. [12, 4] bits (the actual byte offset between two consecutive elements in each dimension respectively)

In other words, the stride in the 0-th dimension (row) is 3 elements or 12 bits, and the stride in the 1-st dimension (column) is 1 element or 4 bits.

```python
tensor = torch.Tensor([[1, 2, 3], [4, 5, 6]])
tensor.stride() # (3, 1)
```

#### Advanced Indexing

When we want to get a row or column from a 2D array, we can use advanced indexing.

```python
tensor[1, :] # get the second row
tensor[:, 1] # get the second column
```

Since we stored the 2D array `[[1, 2, 3], [4, 5, 6]]` in the row-major order, `tensor[1, :]` returns the contiguous memory block starting from the index 3 with stride 1.

```python
Memory: [1, 2, 3, 4, 5, 6]
                  ^
         ----3----|      # Offset 3 from the start
tensor[1, :] = [4, 5, 6] # With size 3
```

We say that `tensor[1, :]` is a view (not a copy) of the original tensor `tensor`.
The view is with `sizes=[3]`, `strides=[1]` and `offset=3` from the start of the original tensor.

On the other hand, `tensor[:, 1]` returns the non-contiguous memory:

```python
Memory: [1, 2, 3, 4, 5, 6]
            ^        ^
        --1-|---3----| # Offset 1 from the start
tensor[1, :] = [2, 5]  # With size 2
```

We say that `tensor[:, 1]` is a view (not a copy) of the original tensor `tensor`.
The view is with `sizes=[2]`, `strides=[3]` and `offset=1` from the start of the original tensor.

```python
tensor = torch.Tensor([[1, 2, 3], [4, 5, 6]])
print(tensor[1, :].size()) # 3
print(tensor[1, :].storage_offset()) # 3
print(tensor[1, :].stride()) # 1
print(tensor[:, 1].size()) # 2
print(tensor[:, 1].storage_offset()) # 1
print(tensor[:, 1].stride()) # 3
```

More on [Stride Visualizer](https://ezyang.github.io/stride-visualizer/index.html)

### View

We briefly mentioned that `tensor[1, :]` and `tensor[:, 1]` are views of the original `tensor`.
It means that they are not copies of the original tensor but share the same memory block with the original tensor.

```python
tensor = torch.Tensor([[1, 2, 3], [4, 5, 6]])
print(tensor.untyped_storage().data_ptr()) # Same
print(tensor[1, :].untyped_storage().data_ptr()) # Same
print(tensor[:, 1].untyped_storage().data_ptr()) # Same
```

Many tensor operations return a view of the original tensor instead. For example:

- `Tensor.unsqueeze(dim)` returns a view of the original tensor with a dimension of size 1 inserted at the specified position.
- `Tensor.squeeze(dim)` returns a view of the original tensor with all the dimensions of size 1 removed.

These operations are handy when a module requires a higher or lower dimensional tensor than the input.

```python
tensor = torch.Tensor([[1, 2, 3], [4, 5, 6]])
print(tensor.untyped_storage().data_ptr()) # Same
print(tensor.unsqueeze(dim=-1).untyped_storage().data_ptr()) # Same
print(tensor.size()) # (2, 3)
print(tensor.unsqueeze(dim=-1).size()) # (2, 3, 1)
print(tensor.unsqueeze(dim=-1).squeeze().size()) # (2, 3)
```

- `Tensor.permute(*dims)` returns a view of the original tensor with the dimensions permuted.

This operation is handy when we want to change the order of the dimensions, such as Width-Height-Channel to Channel-Width-Height.

```python
tensor = torch.Tensor([[1, 2, 3], [4, 5, 6]])
print(tensor.untyped_storage().data_ptr()) # Same
print(tensor.permute(1, 0).untyped_storage().data_ptr()) # Same
print(tensor.permute(1, 0))
'''
[[1, 4],
 [2, 5],
 [3, 6]]
'''
```

`Tensor.reshape` and `Tensor.flatten` might return a view or a copy of the original tensor.
More on [Tensor View](https://pytorch.org/docs/stable/tensor_view.html)
These operations are handy when we want to change the tensor's shape.

`Tensor.unflatten` returns a view of the original tensor with the selected `dim` unflattened
to the specified `sizes`.

```python
tensor = torch.Tensor([[1, 2, 3], [4, 5, 6]])
print(tensor.flatten()) # [1, 2, 3, 4, 5, 6]
print(tensor.flatten().unflatten(dim=0, sizes=(2, 3)))
''' 2 x 3
[[1, 2, 3],
 [4, 5, 6]]
'''
print(tensor.flatten().unflatten(dim=0, sizes=(2, 3, 1)))
''' 2 x 3 x 1
[[[1],
  [2],
  [3]],
 [[4],
  [5],
  [6]]]
'''
```

## Autograd

### Chain Rule

Let's say there is a function $g$ that takes a value $x$ and applies N operations to it: $y = g(x) = f_{N-1}(...f_1(f_0(x)))$.
We define the output of each operations layer as $h_i = f_i(h_{i-1})$, $h_0 = x$, and $h_N = y$.

The chain rule tells us that the derivative of $y$ with respect to $x$ is the product of the derivatives of each intermediate operation $f_i$ with respect to its input $h_{i-1}$:

$$
\frac{\partial y}{\partial x} = \frac{\partial y}{\partial h_{N-1}} \frac{\partial h_{N-1}}{\partial h_{N-2}} ... \frac{\partial h_1}{\partial x}
= \frac{\partial h_N}{\partial h_{N-1}} \frac{\partial h_{N-1}}{\partial h_{N-2}} ... \frac{\partial h_1}{\partial h_0}
$$

### Reverse Accumulation (Back Propagation)

Now, we can see that the chain rule is a recursive definition.
We can compute the derivative of $y$ with respect to $x$ by computing the derivative of $h_i$ with respect to $h_{i-1}$ for each $i$.
This is called reverse accumulation or backpropagation. At each step, we define an accumulator:

$$
\frac{\partial y}{\partial x} = \prod_{i=1}^N \frac{\partial h_i}{\partial h_{i-1}} = acc_0
$$

$$
    acc_{i-1} = \frac{\partial h_i}{\partial h_{i-1}} acc_i
$$

### PyTorch Computational Graph

PyTorch uses a computational graph to represent the chain of operations applied to a tensor.
The graph is a directed acyclic graph (DAG). We denote the input tensor as the leaves of the graph and
the output tensor as the graph's root. It is because we are computing the gradients backward.

When `.backward` is called on the root tensor:

- Compute the gradients of the root tensor with respect to its direct children.
- Accumulate the gradients of the root tensor with respect to its direct children.
- Repeat the above steps until the leaves are reached.

The DAG is dynamic. It means that the graph is created after each `.backward` call. This allows us to
change the graph's shape and size at runtime.

### Exclusion from the Computational Graph

We can exclude a tensor from the computational graph by setting `requires_grad=False` on the tensor.

```python
from torch import nn, optim

model = resnet18(weights=ResNet18_Weights.DEFAULT)

# Freeze all the parameters in the network
for param in model.parameters():
    param.requires_grad = False
```

Since the parameters are excluded from the computational graph, the gradients of the parameters are not computed.
Therefore, in gradient descent (Subtracting the gradient from the parameters), the parameters are not updated.
