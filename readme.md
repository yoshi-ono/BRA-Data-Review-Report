# BRA Data Review Report
**BRA Data Review Tool** および **BRAES** から呼び出されるスタンドアロンのメインプログラムです。

エラーコードリストに従い、BRAデータを自動審査します。

## BRA Data Review Tool
**BRA Data Review Tool**は、自動審査のUIです。Toolにコンテナバインドされた最小限プログラム
[BRA Data Review Processing](https://github.com/yoshi-ono/BRA-Data-Review-Processing/)
から本プログラムを呼び出します。

## BRAES
**BRAES**は、BRAデータの Editorial System です。
投稿されたBRAデータを自動審査する時に本プログラムを呼び出します。

[BRAESメインプログラム](https://github.com/yoshi-ono/BRAES_Main)

## エラーコードリスト
[BRA data: Error code List (Master)](https://docs.google.com/spreadsheets/d/1mCQOmjBRIx-k12a2x8uV3aSKKZ5dDW0na4bVnZtAzhM/edit)

Error type: 0, 2 が自動審査の対象。0(Auto error), 2(Auto warnig)

Error type: 1, 3 は、手動審査の対象なので実装しない。ただし、1(Manual error), 3(Manual warnig)の区別のため、ManualWarning 変数に該当エラーコードを定義する。

廃止エラーコード（実装不要）: 137, 203, 241, 278

### FRG: Capability&Mechanism の空欄判定
エラーコード452は、`<<mechanism to realize the capability>>` から
`<<mechanism realized by grainest coding scheme>>` までのMechanism文が空欄（空白・改行のみを含む）の場合にAuto errorとして検出します。
後者の見出しがない場合は、前者の見出しからセル末尾までを判定します。
コーディングスキーム文の空欄は、エラーコード449（Auto warning）として別に判定します。

### Error code List in CSV format
- [References](error_code_list/References.csv)
- [Circuits](error_code_list/Circuits.csv)
- [Connections](error_code_list/Connections.csv)
- [FRG](error_code_list/FRG.csv)
