/*
 *  Entity? 連想配列? SQL?
 */
class entityReferences extends entityBasic
{
  constructor(header, data, row)
  {
    super(header, data, row);

    this.reviewItems.push('DOI');
    this.reviewItems.push('BibTex');
    this.reviewItems.push('Litterature type');
    this.reviewItems.push('Alternative URL');
    this.reviewItems.push('Contributor');
    this.reviewItems.push('Project ID');

    for (var i = 0; i < this.reviewItems.length; i++)
      this.errorNums[this.reviewItems[i]] = [];

    this.check();
    this.setAutoErrorCodes();
  }

  /*
   *------------------------------------------------------------
   *  エラーチェック
   *------------------------------------------------------------
   */
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
}