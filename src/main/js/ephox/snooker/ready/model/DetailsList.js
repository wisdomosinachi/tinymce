define(
  'ephox.snooker.ready.model.DetailsList',

  [
    'ephox.compass.Arr',
    'ephox.peanut.Fun',
    'ephox.snooker.ready.data.Structs',
    'ephox.snooker.ready.lookup.TableLookup',
    'ephox.sugar.api.Attr'
  ],

  function (Arr, Fun, Structs, TableLookup, Attr) {
    /*
     * Takes a DOM table and returns a list of list of (id, rowspan, colspan) structs
     */
    var fromTable = function (table) {
      var rows = TableLookup.rows(table);
      return Arr.map(rows, function (row) {
        var element = row;
        var cells = Arr.map(TableLookup.cells(row), function (cell) {
          // TODO: Can a valid rowspan value be 0? Because that would be falsy...
          var rowspan = Attr.get(cell, 'rowspan') || 1;
          var colspan = Attr.get(cell, 'colspan') || 1;
          return Structs.detail(cell, rowspan, colspan);
        });

        return {
          element: Fun.constant(element),
          cells: Fun.constant(cells)
        };
      });
    };

    return {
      fromTable: fromTable
    };
  }
);
