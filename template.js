ITOL = (n) => (a=Math.floor(n/26)) >= 0 ? ITOL(a-1) + String.fromCharCode(65+(n%26)) : '';

class Template
{
  constructor(sheetName)
  {
    this.sheetname = sheetName;
    this.template = g_spreadsheet_template.getSheetByName(sheetName);
    this.range = this.template.getDataRange();
    this.formulas = this.range.getFormulas();
    
    if (sheetName == 'HCDeditor')
      this.lastRow = this.formulas.length;
    else
      this.lastRow = this.getFormulasLastRow();

    Logger.log("Formulas LastRow: " + this.lastRow);

    // 数式不一致情報 { 行番号: [列番号, ...] }
    this.not_match = {}
  }

  getFormulasLastRow()
  {
    var i;

    // 1行目 index=0（ヘッダ）は除外
    for (i = 1; i < this.formulas.length; i++)
    {
      var val = this.formulas[i][0];
      if (val.startsWith("=IMPORTRANGE"))
        break;
    }

    return i - 1;
  }

  addNotMatch(row, col)
  {
    if (!this.not_match[row]) {
      this.not_match[row] = [];
    }
    var letter = ITOL(col - 1);
    this.not_match[row].push(letter);
  }

  checkFormulas(braFormulas, reviewEL)
  {
    this.checkRows = Math.min(this.lastRow, reviewEL);
    Logger.log("Check Rows: " + this.checkRows);

    for (var i = 0; i < this.checkRows; i++)
    {
      var line = this.formulas[i];

      for (var j = 0; j < line.length; j++)
      {
        var tempFormula = line[j];

        if (tempFormula != null)
        {
          try {
            var braFormula = braFormulas[i][j];

            if (tempFormula !== braFormula)
            {
              this.addNotMatch(i + 1, j + 1);
              //Logger.log("Not match (row:%s col:%s)\nTMP[%s]\n != \nDAT[%s]", i + 1, j + 1, tempFormula, braFormula)
            }
          } catch (e) {
            this.addNotMatch(i + 1, j + 1);
            //Logger.log("(row:%s col:%s) [%s]", i + 1, j + 1, e.message);
          }
        }
      }
    }
  }

  getReportString()
  {
    var keys = Object.keys(this.not_match);
    if (keys.length == 0)
      return "";

    var str = "[" + this.sheetname + "]\n";
    str += "Row: Columns\n";

    for (var row = 1; row <= this.checkRows; row++)
    {
      if (this.not_match[row])
      {
        var cols = this.not_match[row];
        var line = row + ": " + cols.join(", ");
        str += line + "\n";
      }
    }

    return str + "\n";
  }
}
