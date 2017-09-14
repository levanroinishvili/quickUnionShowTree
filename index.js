let showMap = (function() {
  // Block is an array of strings where every string has equal length between themselves
  function blockWdith(b) {
    return b.length ? b[0].length : 0 ;
  }
  
  // arr is an array of integers that encodes a tree:
  // each element in the array has a parent - itself or another element in the array.
  // each element points to its parent in this way:
  // Element's integer value is an index of the parent inside arr.
  function getChildren(arr,i) {
    // Returns an array of all children of element with index i inside arr
    children = [];
    arr.forEach((v,j) => {
      if ( v===i && i!==j) children.push(j);
    });
    return children;
  }
  
  // Check if the array contains an infinite loop, when considered as a tree
  // This is ineficient, but making it efficient may itself be inefficient,
  // as I will only use these on very small trees for demonstration
  function isCursed(a) {
    for (elem of a) {
      let parent, count=0;
      while ( (parent=a[elem]) !==elem) {
        if ( ++count >= a.length ) return true; 
        elem = a[elem];
      }
    }
    return false;
  }

  // Check for infinite loops and 'heal' them
  // Also inefficient - see comment above
  function bless(a) {
    for (let i=0; i<a.length; i++) {
      if ( a[i]===i ) continue;

      let parent=a[i], count=1;
      while ( ++count<a.length && (parent=a[parent])!==i ) ;

      if ( parent === i ) a[i]=i; // Remove loop at point i
    }
  }

  function blockPad(a,b) {
    // Given two blocks that will be merged into a larger block (by mergeBlock function)
    // Create the third block which may go between these two blocks
    // to visually separate the two blocks.
    let pad = '  ', separator = '|';
    let leftPad  = (a.length?pad:'');
    let rightPad = (b.length?pad:'');
    let row = leftPad + separator + rightPad;
    let block = [];
    return new Array(Math.max(a.length,b.length)).fill(row);
    //return [' '.repeat(Math.max(a.length,b.length))];
    //return ['  |  '];
  }
  
  function mergeBlocks() {
    // Merge rectangular blocks.
    // Returns resulting rectengular blocks with spaces added in the right places
    // Usage:
    //     let b = mergeBlocks(b1,b2,b3,...,bn); // each bi is a block
    if ( arguments.length === 0 ) return [];
    if ( arguments.length === 1 ) return arguments[0];
    let b1=arguments[0];
    for (let i=1; i<arguments.length; i++) {
      let b2 = arguments[i], merged = [];
      let b1height=b1.length, b1width=blockWdith(b1);
      let b2height=b2.length, b2width=blockWdith(b2);

      for (let row=0; row<Math.max(b1height,b2height); row++) {
        let s1 = '', s2 = '' ;
        if ( row < b1height ) s1 = b1[row]; else s1 = ' '.repeat(b1width);
        if ( row < b2height ) s2 = b2[row]; else s2 = ' '.repeat(b2width);
        merged.push(s1+s2);
      }
      b1 = merged;
    }
    return b1;
  }
  
  // Take a rectangular block b and expand it to width w
  function widenBlock(b,w) {
    return b.map(row=>{
      if ( row.length<w ) {
        let extra = w - row.length;
        let front = Math.floor(extra/2), back = extra - front;
        row = ' '.repeat(front) + row + ' '.repeat(back);
      }
      return row;
    });
  }
  
  // Recursive function that will (eventually;) return a block
  // representing graphically the node i within arr, with all its descendants
  function buildChild(arr,i) {
    let block = [];
    let children = getChildren(arr,i);
    for ( child of children ) {
      let childMap = buildChild(arr,child);
      if ( block.length===0 ) block=childMap;
      else block = mergeBlocks(block,[','],childMap);
    }
    let top = String(i), bw = blockWdith(block);
    if ( top.length < bw ) {
      let extra = bw - top.length;
      let front = Math.floor(extra/2), back = extra - front;
      top = ' '.repeat(front) + top + ' '.repeat(back);
    } else if ( top.length > bw ) block = widenBlock(block,bw);
    block.unshift(top);
    return block;
  }

  // Build a graphical map of the tree encoded in arr.
  // Take all roots, build their maps, then merge
  function buildMap(arr) {
    let map = [];
    arr
      .filter((parent,i)=>parent===i)  // Roots only
      .forEach(root => {
        let childMap = buildChild(arr,root);
        map = mergeBlocks(map,blockPad(map,childMap),childMap);
      });
    return mergeBlocks(map,blockPad(map,[]),[]);
  }

  // Output to console textual-graphical map of the tree encoded within arr.
  function showMap(arr) {
    // if ( isCursed(arr) ) throw new Error('The array contains an infinite loop');
    if ( isCursed(arr) ) {
      arr = arr.slice();
      bless(arr);
      console.log('The array contains infinite loops. These will be broken for display.');
    }
    console.log(
      buildMap(arr)
        //.map(s=>'|'+s+'|')
        .join('\n')
      );
  }
  
  // Only expose showMap() function to the world
  return showMap;
})();



// Usage:
let a  =  [0,1,2,2,3,3,6,7,7,7];
showMap(a); // Outputs to console


