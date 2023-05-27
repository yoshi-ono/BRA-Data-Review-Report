/*
 *  References エンティティ クラス
 */
class entityReferences extends entityBasic
{
  constructor(header, data, row, reviewItems)
  {
    super(header, data, row, reviewItems);

    this.BibTex = "";

    this.check();
  }

  /*
   *------------------------------------------------------------
   *  エラーチェック
   *------------------------------------------------------------
   */
  getBibTex(doi)
  {
    var requestUrl = 'https://doi.org/' + doi;

    var headers = {
      'Accept': 'application/x-bibtex; charset=utf-8'
    };

    var requestOptions = {
      'method' : 'get',
      'headers' : headers,
      'muteHttpExceptions' : true
    }

    var response = UrlFetchApp.fetch(requestUrl, requestOptions,);

    var responseCode = response.getResponseCode();
    Logger.log(responseCode);

    var responseText = null;
    if (responseCode == 200) {
      responseText = response.getContentText();
      Logger.log(responseText);
    }
    
    return responseText;
  }

  check()
  {
    this.check_DOI_AlternativeURL();
    this.checkBibTex();
    this.checkLitteratureType();
    this.check_Contributor(15);
    this.check_Project_ID(19);
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
      // DOIの記述形式が正しくない。[2:DOI]
      var regex = /^10\.\d+\/.+/;
      if (regex.exec(this.items['DOI']) == null) {
        this.errorNums['DOI'].push(2);
        return;
      }
      var len = this.items['DOI'].length;
      if (len > 100) {
        this.errorNums['DOI'].push(2);
        return;
      }

      // DOIがユニークでない（重複している）。[3:DOI]
      var rows = g_references.searchItem('DOI', this.items['DOI']);
      if (rows.length > 1) {
        this.errorNums['DOI'].push(3);
        return;
      }

      // https://doi.org/ からDOIの登録を確認できない（BibTexを取得できない）。[4:DOI]
      var bibtex = this.getBibTex(this.items['DOI']);
      if (bibtex == null) {
        this.errorNums['DOI'].push(4);
        return;
      } else {
        this.BibTex = bibtex;
      }
    }
  }

  checkBibTex()
  {
    if (!this.isDescribed(this.items['DOI'])) {
      // DOIが空欄にも関わらず、BibTexが記述されていない。
      if (!this.isDescribed(this.items['BibTex'])) {
        this.errorNums['BibTex'].push(6);
      } else {
        // BibTexの記述形式が正しくない。（値は"{","}"で囲むこと。）
      }
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