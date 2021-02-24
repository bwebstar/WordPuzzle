var matches = [];
var wsDataObject;
var wsRows;
var wsColumns;
var wsGrid;
var wsWords;
var textarea = document.querySelector('textarea');

$.ajax({
  url: 'input.txt',
  cache: false,
  type: 'text',
  method: 'GET',
}).done(function (data) {
  wsDataObject = parseTextSearch(data);

  wsRows = wsDataObject.rows;
  wsColumns = wsDataObject.columns;
  wsGrid = wsDataObject.grid;
  wsWords = wsDataObject.words;
});

function parseTextSearch(data) {
  var splitText = data.split(/\r\n|\n/);

  if (splitText.length > 1) {
    var firstLine = String(splitText[0].split('\n'));

    var rows = parseInt(firstLine.charAt(0));
    var columns = parseInt(firstLine.charAt(2));

    splitText.shift();

    var rawLines = splitText.slice(0, rows);
    var rawWords = splitText.slice(rows);

    rawLines = sanitizeArr(rawLines);
    rawWords = sanitizeArr(rawWords);

	var newRawLines = [];

	//   Needed output for rawLines
	//   0: "'HASDF"
	//   1: "'GEYBH"
	//   2: "'JKLZX"
	//   3: "'CVBLN"
	//   4: "'GOODO'"


	// Needs more work
	var i;
	for (i = 0; i < rawLines.length; i++) {
		var line = "'" + rawLines[i] + "'";
		newRawLines.push(line);
	}

	rawLines = newRawLines;

    if (rawLines.length > 0 && rawWords.length > 0) {
      var wsObject = {
        rows: rows,
        columns: columns,
        grid: rawLines,
        words: rawWords,
      };
      return wsObject;
    }
  }
  return { rows:int, columns:int, grid: [], words: [] };
}

function sanitizeArr(array) {
  var newRawLines = [];

  array.forEach(function(string){
    string = string.replace(/\s/g, '');
    newRawLines.push(string);
  })

  array = newRawLines;

  return array;
}

function exportToText(matches) {
  //var wordProperties = Object.keys(matches);

  var matchingResults = matches.join('\n');

  return matchingResults;
}

function Puzzle() {
  this.rows = 0; // number of rows in the puzzle
  this.columns = 0; // number of columns in the puzzle
  this.puzzle = new Array(); // the puzzle
  this.words = new Array(); // words need to be found

  // harcoded, this could be solved with the CSS class
  this.foundCharacterColor = "#00FF00";
}

Puzzle.prototype = {
  doCreatePuzzle: function () {
    var i,
      j = 0; // indexes
    var rebuild = false; // rebuild puzzle (new columnds, rows..)

    // hide input form
    $("div#step1").slideUp();

    // read words
    // if (this.words.length != wsWords.length) {
    //   this.words = wsWords;
    //   $("span#wTotal").html(this.words.length);
    //   rebuild = true;
    // }

    // if (this.puzzle.length != wsGrid.length) {
    //   this.puzzle = wsGrid;
    //   rebuild = true;
    //   this.rows = wsRows;
    //   this.columns = wsColumns.length-1;
    // }

	// read words
    if (this.words.length != $("#words").val().split('\n').length) {
		this.words = $("#words").val().split('\n');
		$("span#wTotal").html(this.words.length);
		rebuild = true;
	  }

	  if (this.puzzle.length != $("#puzzleText").val().split('\n').length) {
		this.puzzle = $("#puzzleText").val().split('\'\n');
		rebuild = true;
		this.rows = this.puzzle.length;
		this.columns = (this.puzzle[0].length-1);
	  }

    // create table
    if (true == rebuild) {
      $("table#puzzle").html("");
      for (i = 0; i < this.rows; ++i) {
        $("table#puzzle").append('<tr id="r' + i + '"></tr>');
        for (j = 0; j < this.columns; ++j) {
          $("table#puzzle tr#r" + i).append(
            '<td id="c' +
              (j) +
              '" rel="E">' +
              this.puzzle[i].charAt(j) +
              "</td>"
          );
        }
      }
    }

    // show form
    $("div#step2").slideDown();
  },
  solveThePuzzle: function () {
    var wFound = new Array(); // list of words that were found
    var res = false; // was word found in any direction
    var wL = this.words.length;
    var i = 0; // index for the words
    var j = 0; // index for the puzzle rows
    var k = 0; // index for the puzzle columns
    var fChar = ""; // first character

    for (i = 0; i < wL; ++i) {
      // search all words
      fChar = this.words[i].charAt(0); // get first char and find beginning

      wordFound: for (j = 0; j < this.rows; ++j) {
        for (k = 0; k < this.columns; ++k) {
          if (fChar == this.puzzle[j].charAt(k + 1)) {
            // first character found

            // check left
            res = this.findWordLeft(
              this.words[i],
              1,
              this.words[i].length,
              j,
              k + 1
            );
            if (false !== res) {
              $("table#puzzle tr#r" + j + " td#c" + (k + 1))
                .css("background-color", this.foundCharacterColor)
                .attr("rel", "X");

              // Todo: Check Word Length to find last Index
              var length = this.words[i].length;

              var line = this.words[i] + " " + j + ":" + k + "\n";
              matches.push(line);

              break wordFound; // word found, break loops
            }

            // check right
            res = this.findWordRight(
              this.words[i],
              1,
              this.words[i].length,
              j,
              k + 1
            );
            if (false !== res) {
              $("table#puzzle tr#r" + j + " td#c" + (k + 1))
                .css("background-color", this.foundCharacterColor)
                .attr("rel", "X");

              // Todo: Check Word Length to find last Index
              var length = this.words[i].length;

              var line = this.words[i] + " " + j + ":" + k + "\n";
              matches.push(line);

              break wordFound; // word found, break loops
            }

            // check top
            res = this.findWordUp(
              this.words[i],
              1,
              this.words[i].length,
              j,
              k + 1
            );
            if (false !== res) {
              $("table#puzzle tr#r" + j + " td#c" + (k + 1))
                .css("background-color", this.foundCharacterColor)
                .attr("rel", "X");

              // Todo: Check Word Length to find last Index
                var wLength = this.words[i].length;

              var line = this.words[i] + " " + j + ":" + k + "\n";
              matches.push(line);

              break wordFound; // word found, break loops
            }

            // check bottom
            res = this.findWordDown(
              this.words[i],
              1,
              this.words[i].length,
              j,
              k + 1
            );
            if (false !== res) {
              $("table#puzzle tr#r" + j + " td#c" + (k + 1))
                .css("background-color", this.foundCharacterColor)
                .attr("rel", "X");

              // Todo: Check Word Length to find last Index
                var wLength = this.words[i].length;

              var line = this.words[i] + " " + j + ":" + k + "\n";
              matches.push(line);

              break wordFound; // word found, break loops
            }

            // check up-left
            res = this.findWordUpLeft(
              this.words[i],
              1,
              this.words[i].length,
              j,
              k + 1
            );
            if (false !== res) {
              $("table#puzzle tr#r" + j + " td#c" + (k + 1))
                .css("background-color", this.foundCharacterColor)
                .attr("rel", "X");

              // Todo: Check Word Length to find last Index
                var wLength = this.words[i].length;

              var line = this.words[i] + " " + j + ":" + k + "\n";
              matches.push(line);

              break wordFound; // word found, break loops
            }

            // check up-right
            res = this.findWordUpRight(
              this.words[i],
              1,
              this.words[i].length,
              j,
              k + 1
            );
            if (false !== res) {
              $("table#puzzle tr#r" + j + " td#c" + (k + 1))
                .css("background-color", this.foundCharacterColor)
                .attr("rel", "X");

              // Todo: Check Word Length to find last Index
              var wLength = this.words[i].length;

              var line = this.words[i] + " " + j + ":" + k + "\n";
              matches.push(line);

              break wordFound; // word found, break loops
            }

            // check down-left
            res = this.findWordDownLeft(
              this.words[i],
              1,
              this.words[i].length,
              j,
              k + 1
            );
            if (false !== res) {
              $("table#puzzle tr#r" + j + " td#c" + (k + 1))
                .css("background-color", this.foundCharacterColor)
                .attr("rel", "X");

              // Todo: Check Word Length to find last Index
                var wLength = this.words[i].length;

              var line = this.words[i] + " " + j + ":" + k + "\n";
              matches.push(line);

              break wordFound; // word found, break loops
            }

            // check down-right
            res = this.findWordDownRight(
              this.words[i],
              1,
              this.words[i].length,
              j,
              k + 1
            );
            if (false !== res) {
              $("table#puzzle tr#r" + j + " td#c" + (k + 1))
                .css("background-color", this.foundCharacterColor)
                .attr("rel", "X");

              // Todo: Check Word Length to find last Index
                var wLength = this.words[i].length;

              var line = this.words[i] + " " + j + ":" + k + "\n";
              matches.push(line);

              break wordFound; // word found, break loops
            }
          }
        }
      }

      ++wFound;
    }
    $("input#wFound").val(wFound);

    var lines = exportToText(matches);

    textarea.value = lines;

  },
  getSolution: function () {
    var result = "";
    $("#puzzle td[rel='E']").each(function (i) {
      result += $(this).html();
    });
    return result;
  },
  findWordLeft: function (word, posW, wordL, j, k) {
    var result = false;
    if (posW == wordL) {
      return true;
    } // check if all characters were found

    if (0 < k && word.charAt(posW) == this.puzzle[j].charAt(k - 1)) {
      result = this.findWordLeft(word, posW + 1, wordL, j, k - 1);
      if (result !== false) {
        $("table#puzzle tr#r" + j + " td#c" + (k - 1))
          .css("background-color", this.foundCharacterColor)
          .attr("rel", "X");
        return new Array(j, k - 1);
      }
    }
    return result;
  },
  findWordRight: function (word, posW, wordL, j, k) {
    var result = false;
    if (posW == wordL) {
      return true;
    } // check if all characters were found

    if (this.columns > k && word.charAt(posW) == this.puzzle[j].charAt(k + 1)) {
      result = this.findWordRight(word, posW + 1, wordL, j, k + 1);
      if (result !== false) {
        $("table#puzzle tr#r" + j + " td#c" + (k + 1))
          .css("background-color", this.foundCharacterColor)
          .attr("rel", "X");
        return new Array(j, k + 1);
      }
    }
    return result;
  },
  findWordUp: function (word, posW, wordL, j, k) {
    var result = false;
    if (posW == wordL) {
      return true;
    } // check if all characters were found

    if (0 <= j - 1 && word.charAt(posW) == this.puzzle[j - 1].charAt(k)) {
      result = this.findWordUp(word, posW + 1, wordL, j - 1, k);
      if (result !== false) {
        $("table#puzzle tr#r" + (j - 1) + " td#c" + k)
          .css("background-color", this.foundCharacterColor)
          .attr("rel", "X");
        return new Array(j - 1, k);
      }
    }
    return result;
  },
  findWordDown: function (word, posW, wordL, j, k) {
    var result = false;
    if (posW == wordL) {
      return true;
    } // check if all characters were found

    if (
      this.rows > j + 1 &&
      word.charAt(posW) == this.puzzle[j + 1].charAt(k)
    ) {
      result = this.findWordDown(word, posW + 1, wordL, j + 1, k);
      if (result !== false) {
        $("table#puzzle tr#r" + (j + 1) + " td#c" + k)
          .css("background-color", this.foundCharacterColor)
          .attr("rel", "X");
        return new Array(j + 1, k);
      }
    }
    return result;
  },
  findWordUpLeft: function (word, posW, wordL, j, k) {
    var result = false;
    if (posW == wordL) {
      return true;
    } // check if all characters were found

    if (
      0 < k &&
      0 < j &&
      word.charAt(posW) == this.puzzle[j - 1].charAt(k - 1)
    ) {
      result = this.findWordUpLeft(word, posW + 1, wordL, j - 1, k - 1);
      if (result !== false) {
        $("table#puzzle tr#r" + (j - 1) + " td#c" + (k - 1))
          .css("background-color", this.foundCharacterColor)
          .attr("rel", "X");
        return new Array(j - 1, k - 1);
      }
    }
    return result;
  },
  findWordUpRight: function (word, posW, wordL, j, k) {
    var result = false;
    if (posW == wordL) {
      return true;
    } // check if all characters were found

    if (
      this.columns > k &&
      0 < j &&
      word.charAt(posW) == this.puzzle[j - 1].charAt(k + 1)
    ) {
      result = this.findWordUpRight(word, posW + 1, wordL, j - 1, k + 1);
      if (result !== false) {
        $("table#puzzle tr#r" + (j - 1) + " td#c" + (k + 1))
          .css("background-color", this.foundCharacterColor)
          .attr("rel", "X");
        return new Array(j - 1, k + 1);
      }
    }
    return result;
  },
  findWordDownLeft: function (word, posW, wordL, j, k) {
    var result = false;
    if (posW == wordL) {
      return true;
    } // check if all characters were found

    if (
      this.rows > j + 1 &&
      0 < k &&
      word.charAt(posW) == this.puzzle[j + 1].charAt(k - 1)
    ) {
      result = this.findWordDownLeft(word, posW + 1, wordL, j + 1, k - 1);
      if (result !== false) {
        $("table#puzzle tr#r" + (j + 1) + " td#c" + (k - 1))
          .css("background-color", this.foundCharacterColor)
          .attr("rel", "X");
        return new Array(j + 1, k - 1);
      }
    }
    return result;
  },
  findWordDownRight: function (word, posW, wordL, j, k) {
    var result = false;
    if (posW == wordL) {
      return true;
    } // check if all characters were found

    if (
      this.rows > j + 1 &&
      this.columns > k &&
      word.charAt(posW) == this.puzzle[j + 1].charAt(k + 1)
    ) {
      result = this.findWordDownRight(word, posW + 1, wordL, j + 1, k + 1);
      if (result !== false) {
        $("table#puzzle tr#r" + (j + 1) + " td#c" + (k + 1))
          .css("background-color", this.foundCharacterColor)
          .attr("rel", "X");
        return new Array(j + 1, k + 1);
      }
    }
    return result;
  },
};
