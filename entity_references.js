/*
 *  References エンティティ クラス
 */
class entityReferences extends entityBasic
{
  constructor(header, data, row, reviewItems)
  {
    super(header, data, row, reviewItems);
    this.check();
  }

  /*
   *------------------------------------------------------------
   *  エラーチェック
   *------------------------------------------------------------
   */
  check()
  {
    this.check_DOI_AlternativeURL();
    this.checkBibTex();
    this.checkLitteratureType();
    this.check_Contributor(15, 16);
    this.check_Project_ID(19, 20);
  }

  check_DOI_AlternativeURL()
  {
    if (!this.isDescribed(this.items['DOI'])) {
      if (!this.isDescribed(this.items['Alternative URL'])) {
      // DOIが記述抜けており、同じレコードのAlternative URLにも記述がない。
        this.errorNums['DOI'].push(1);
      } else {
        // Alternative URLの記述形式がURL形式ではない。[12:Alternative URL]
        if (!this.isURL(this.items['Alternative URL']))
          this.errorNums['Alternative URL'].push(12);
      }
    } else {
      // DOIの記述形式が正しくない。>>NEXT

      // DOIがユニークでない（重複している）。[3:DOI]
      var rows = g_references.searchItem('DOI', this.items['DOI']);
      if (rows.length > 1)
        this.errorNums['DOI'].push(3);
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
}