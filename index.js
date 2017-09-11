let showMap = (function() {
  function blockWdith(b) {
    if ( !b.length ) return 0; else return b[0].length;
  }
  function getChildren(arr,i) {
    // arr = an array each element of which is an index
    // pointing to the parent of that element
    // Returns an array of all children
    children = [];
    arr.forEach((v,j) => {
      if ( v===i && i!==j) children.push(j);
    });
    return children;
  }
  function blockPad(a,b) {
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
    // b1 is an array of strings of equal length
    // b2 is an array of strings of equal length
    // Returns a merged block - array of strings of equal lengths
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
  function showMap(arr) {
    console.log(
      buildMap(arr)
        //.map(s=>'|'+s+'|')
        .join('\n')
      );
  }
  return showMap;
})();



// Usage:
let a  =  [0,1,2,2,3,3,6,7,7,7];
showMap(a); // Outputs to console
