/*
 *  Entity? 連想配列? SQL?
 */
class entityReferences
{
  constructor(header, data, row)
  {
    this.items = {};
    for (var i = 0; i < header.length; i++) {
      this.items[header[i].trim()] = data[i];
    }

    this.row = row;

    this.errorNums = {};
    this.errorNums['DOI'] = [];
    this.errorNums['BibTex'] = [];
    this.errorNums['Litterature type'] = [];
    this.errorNums['Alternative URL'] = [];
    this.errorNums['Contributor'] = [];
    this.errorNums['Project ID'] = [];

    this.check();
    this.setAutoErrorCodes();
  }

  /*
   *------------------------------------------------------------
   *  エラーチェック
   *------------------------------------------------------------
   */
  isDescribed(item)
  {
    if (item === '')
      return false;
    else
      return true;
  }

  check()
  {
    this.checkDOI();
    this.checkBibTex();
    this.checkLitteratureType();
    this.checkAlternativeURL();
    this.checkContributor();
    this.checkProjectID();
  }

  checkDOI()
  {
    // DOIが記述抜けており、同じレコードのAlternative URLにも記述がない。
    if (!this.isDescribed(this.items['DOI']) && !this.isDescribed(this.items['Alternative URL'])) {
      this.errorNums['DOI'].push(1);
    } else {
      // DOIの記述形式が正しくない。

      // DOIがユニークでない（重複している）。
    }
  }

  checkBibTex()
  {
    // BibTexが記述されていない。
    if (!this.isDescribed(this.items['BibTex'])) {
      this.errorNums['BibTex'].push(6);
    } else {
      // BibTexの記述形式が正しくない。（値は"{","}"で囲むこと。）
    }
  }

  checkLitteratureType()
  {
    // Litterature typeが記述されていない。
    if (!this.isDescribed(this.items['Litterature type'])) {
      this.errorNums['Litterature type'].push(10);
    } else {
      // Litterature typeに指定範囲外の値が記述されている。
      if (!listItems.LiteratureType.includes(this.items['Litterature type']))
        this.errorNums['Litterature type'].push(11);
    }
  }

  checkAlternativeURL()
  {
    // Alternative URLの記述形式がURL形式ではない。

  }

  checkContributor()
  {
    // Contributorが記述されていない。
    if (!this.isDescribed(this.items['Contributor'])) {
      this.errorNums['Contributor'].push(15);
    } else {
      // Contributorがtext形式で記述されていない。
    }
  }

  checkProjectID()
  {
    // Project IDが記述されていない。
    if (!this.isDescribed(this.items['Project ID'])) {
      this.errorNums['Project ID'].push(19);
    } else {
      // Project IDがtext形式で記述されていない。
    }
  }

  /*
   *------------------------------------------------------------
   *  エラー情報
   *------------------------------------------------------------
   */
  hasErrorNums(reviewItem) {
    if (this.errorNums[reviewItem].length > 0)
      return true;
    else
      return false;
  }

  getErrorIDsString(reviewItem) {
    var errorId = [];
    for (var i = 0; i < this.errorNums[reviewItem].length; i++) {
      errorId.push(Utilities.formatString("[%s:%s]", this.errorNums[reviewItem][i], reviewItem));
    }
    return errorId.join();
  }

  /*
   *------------------------------------------------------------
   *  エラー記録
   *------------------------------------------------------------
   */
  setAutoErrorCodes() {
    var allCount = 0;
    var count = 0;
    var errorsString = "";

    count = this.errorNums['DOI'].length;
    if (count > 0) {
      allCount += count;
      errorsString += ";\n" + this.getErrorIDsString('DOI')
    }

    count = this.errorNums['BibTex'].length;
    if (count > 0) {
      allCount += count;
      errorsString += ";\n" + this.getErrorIDsString('BibTex')
    }

    count = this.errorNums['Litterature type'].length;
    if (count > 0) {
      allCount += count;
      errorsString += ";\n" + this.getErrorIDsString('Litterature type')
    }
  
    this.items['Auto Error Codes'] = Utilities.formatString("%s%s", allCount, errorsString);

  }
}