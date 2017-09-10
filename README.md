# Show Quick-Union Array as Tree in Console 

## Background
The [Quick Union algorithm](https://www.coursera.org/learn/algorithms-part1/lecture/ZgecU/quick-union)
in its basic form uses an array of integers, where each integer represents an index in that same array
of the element's 'parent' element.

It is useful to visualize such arrays as trees. However, transforming such an array into a corresponding
tree structure in one's mind may be tedious. 

For example, consider the following simple array `a` below:
```JavaScript
// Indices 0,1,2,3,4,5,6,7,8,9
let a  =  [0,1,2,2,3,3,6,7,7,7];
```
It may not be immediately obvious that `a` represents the following simple structure:
```JavaScript
//   0   1   2   6   7
//           |      / \
//           3     8   9
//          / \
//         4   5
```

## Functionality

This script provides a quick way to take an array containing a tree (as described in [Background](#background))
and output to a console its crude visualization.

## Usage

The easiest way to use this script is to
1. add the script to your JavaScript file, and then
1. simply call `showMap()` with your array as the only argument:
```JavaScript
showMap(arrayTree);  // Will output to console
```
