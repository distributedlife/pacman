// var expect = require('expect');

// var HALF = 0.5;

// const j = JSON.stringify;

// function isASmallerThanB(board, usable) {
//   return (board.width < usable.width || board.height < usable.height);
// }

// function isALargerThanB(board, usable) {
//   return board.width >= usable.width && board.height >= usable.height;
// }

// function calculateOffset (board, usable) {
//   if (isASmallerThanB(board, usable)) {
//     const margin = {
//       x: usable.width - board.width,
//       y: usable.height - board.height
//     }

//     return {
//       x: margin.x < 0 ? 0 : margin.x * HALF,
//       y: margin.y < 0 ? 0 : margin.y * HALF
//     };
//   }

//   return {x: 0, y: 0 };
// }

// function weShouldShrinkBoard (board, usable) {
//   return board.width > usable.width || board.height > usable.height;
// }

// function calculateScale (board, screen, usable) {
//   var ratio;
//   // if (weShouldShrinkBoard(board, usable)) {
//     ratio = Math.min(usable.width / board.width, usable.height / board.height);
//   // } else {
//     // if (board.width = usable.width || board.height=== usable.height) {
//       // ratio = usable.height / board.height;
//     // } else {
//     // } else if (board.height > usable.height) {
//       // ratio = usable.width / board.width;
//       // ratio = Math.min(usable.width / board.width, usable.height / board.height);

//       console.log(usable.width / board.width);
//       console.log(usable.height / board.height);
//     // }
//   // }

//   return { x: ratio, y: ratio };
// }

// describe('positioning the board in the middle of the usable area', () => {
//   var tests = [
//     /* board                      usable                offset  */
//     [{width: 10, height: 10},  {width:  8, height:  8},  {x: 0, y: 0}],
//     [{width: 10, height: 10},  {width:  8, height: 10},  {x: 0, y: 0}],
//     [{width: 10, height: 10},  {width: 10, height:  8},  {x: 0, y: 0}],
//     [{width: 10, height: 10},  {width: 10, height: 10},  {x: 0, y: 0}],
//     [{width: 10, height: 10},  {width: 10, height: 12},  {x: 0, y: 1}],
//     [{width: 10, height: 10},  {width: 12, height: 10},  {x: 1, y: 0}],
//     [{width: 10, height: 10},  {width: 12, height: 12},  {x: 1, y: 1}],

//     [{width:  6, height: 10},  {width:  8, height:  8},  {x: 1, y: 0}],
//     [{width:  6, height: 10},  {width:  8, height: 10},  {x: 1, y: 0}],
//     [{width:  6, height: 10},  {width: 10, height:  8},  {x: 2, y: 0}],
//     [{width:  6, height: 10},  {width: 10, height: 10},  {x: 2, y: 0}],
//     [{width:  6, height: 10},  {width: 10, height: 12},  {x: 2, y: 1}],
//     [{width:  6, height: 10},  {width: 12, height: 10},  {x: 3, y: 0}],
//     [{width:  6, height: 10},  {width: 12, height: 12},  {x: 3, y: 1}],

//     [{width: 10, height:  6},  {width:  8, height:  8},  {x: 0, y: 1}],
//     [{width: 10, height:  6},  {width:  8, height: 10},  {x: 0, y: 2}],
//     [{width: 10, height:  6},  {width: 10, height:  8},  {x: 0, y: 1}],
//     [{width: 10, height:  6},  {width: 10, height: 10},  {x: 0, y: 2}],
//     [{width: 10, height:  6},  {width: 10, height: 12},  {x: 0, y: 3}],
//     [{width: 10, height:  6},  {width: 12, height: 10},  {x: 1, y: 2}],
//     [{width: 10, height:  6},  {width: 12, height: 12},  {x: 1, y: 3}],

//     [{width:240, height:112},  {width:648, height:712},  {x:200, y:290}]
//   ];

//   tests.forEach(function(test, index) {
//     it('should remain in the center #' + index, function () {
//       expect(calculateOffset(test[0], test[1])).toEqual(test[2]);
//     })
//   });
// });

// describe('scale the stage', () => {
//   var tests = [
//     /*   board          screen         usable          scale  */
//     [{w:  5, h:  5}, {w: 10, h: 10}, {w: 10, h: 10}, {x:   2, y:   2}],
//     [{w: 10, h:  5}, {w: 10, h: 10}, {w: 10, h: 10}, {x:   1, y:   1}],
//     [{w:  5, h: 10}, {w: 10, h: 10}, {w: 10, h: 10}, {x:   1, y:   1}],
//     [{w: 10, h: 10}, {w: 10, h: 10}, {w: 10, h: 10}, {x:   1, y:   1}],
//     [{w: 20, h: 20}, {w: 10, h: 10}, {w: 10, h: 10}, {x: 0.5, y: 0.5}],
//     [{w: 10, h: 20}, {w: 10, h: 10}, {w: 10, h: 10}, {x: 0.5, y: 0.5}],
//     [{w: 20, h: 10}, {w: 10, h: 10}, {w: 10, h: 10}, {x: 0.5, y: 0.5}],
//     [{w: 20, h:  5}, {w: 10, h: 10}, {w: 10, h: 10}, {x: 0.5, y: 0.5}],
//     [{w:  5, h: 20}, {w: 10, h: 10}, {w: 10, h: 10}, {x: 0.5, y: 0.5}],

//     [{w:  5, h:  5}, {w: 20, h: 10}, {w: 10, h: 10}, {x:   2, y:   2}],
//     [{w: 10, h:  5}, {w: 20, h: 10}, {w: 10, h: 10}, {x:   1, y:   1}],
//     [{w:  5, h: 10}, {w: 20, h: 10}, {w: 10, h: 10}, {x:   1, y:   1}],
//     [{w: 10, h: 10}, {w: 20, h: 10}, {w: 10, h: 10}, {x:   1, y:   1}],
//     [{w: 20, h: 20}, {w: 20, h: 10}, {w: 10, h: 10}, {x: 0.5, y: 0.5}],
//     [{w: 10, h: 20}, {w: 20, h: 10}, {w: 10, h: 10}, {x: 0.5, y: 0.5}],
//     [{w: 20, h: 10}, {w: 20, h: 10}, {w: 10, h: 10}, {x: 0.5, y: 0.5}],
//     [{w: 20, h:  5}, {w: 20, h: 10}, {w: 10, h: 10}, {x: 0.5, y: 0.5}],
//     [{w:  5, h: 20}, {w: 20, h: 10}, {w: 10, h: 10}, {x: 0.5, y: 0.5}],

//     [{w:  5, h:  5}, {w: 10, h: 20}, {w: 10, h: 10}, {x:   2, y:   2}],
//     [{w: 10, h:  5}, {w: 10, h: 20}, {w: 10, h: 10}, {x:   1, y:   1}],
//     [{w:  5, h: 10}, {w: 10, h: 20}, {w: 10, h: 10}, {x:   1, y:   1}],
//     [{w: 10, h: 10}, {w: 10, h: 20}, {w: 10, h: 10}, {x:   1, y:   1}],
//     [{w: 20, h: 20}, {w: 10, h: 20}, {w: 10, h: 10}, {x: 0.5, y: 0.5}],
//     [{w: 10, h: 20}, {w: 10, h: 20}, {w: 10, h: 10}, {x: 0.5, y: 0.5}],
//     [{w: 20, h: 10}, {w: 10, h: 20}, {w: 10, h: 10}, {x: 0.5, y: 0.5}],
//     [{w: 20, h:  5}, {w: 10, h: 20}, {w: 10, h: 10}, {x: 0.5, y: 0.5}],
//     [{w:  5, h: 20}, {w: 10, h: 20}, {w: 10, h: 10}, {x: 0.5, y: 0.5}],

//     // [{w:112, h:240}, {w:650, h:1362}, {w:650, h:650}, {x: 2.70, y: 2.70}],
//     // [{w:240, h:112}, {w:1362, h:650}, {w:650, h:586}, {x: 2.70, y: 2.70}],
//   ]

//   function u (a) {
//     return {width: a.w, height: a.h};
//   }

//   tests.forEach(function(test, index) {
//     it(`${j(test[0])} within ${j(test[2])} should be scaled by ${j(test[3])}`, function () {
//       expect(
//         calculateScale(u(test[0]), u(test[1]), u(test[2]))
//       ).toEqual(test[3]);
//     })
//   });
// });