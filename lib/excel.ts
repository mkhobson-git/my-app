import * as XLSX from "xlsx"
import path from "path"
import fs from "fs"

export interface ScatterRow {
  ad: string
  rvp: string
  ltrYoy: number
  surveyCountCY: number
  localRpiYoy: number
}

export async function loadScatterData() {
  const filePath = path.join(
    process.cwd(),
    "data",
    "scatter.xlsx"
  )

  const fileBuffer = fs.readFileSync(filePath)

  const workbook = XLSX.read(fileBuffer, {
    type: "buffer",
  })

  //
  // SHEET 1 — Scatter Data
  //

  const scatterSheetName =
    workbook.SheetNames[0]

  const scatterWorksheet =
    workbook.Sheets[scatterSheetName]

  //
  // REPORT DATE
  //

  const reportDateCell =
    scatterWorksheet["B1"]

  let reportDate = "Unknown"

  if (reportDateCell) {
    // Text date
    if (typeof reportDateCell.v === "string") {
      reportDate = reportDateCell.v
    }

    // Excel numeric date
    else if (
      typeof reportDateCell.v === "number"
    ) {
      const excelDate = reportDateCell.v

      const jsDate = new Date(
        (excelDate - 25569) * 86400 * 1000
      )

      reportDate =
        jsDate.toLocaleDateString("en-GB", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
    }
  }

  //
  // TABLE DATA
  //

  const rawRows = XLSX.utils.sheet_to_json(
    scatterWorksheet,
    {
      range: 1,
    }
  )

  const rows: ScatterRow[] = rawRows.map(
    (row: any) => ({
      ad: row["AD"] || "",
      rvp: row["RVP"] || "",

      ltrYoy: Number(row["LTR YOY"]) || 0,

      surveyCountCY:
        Number(row["Survey Count CY"]) || 0,

      localRpiYoy:
        Number(row["Local RPI YOY"]) || 0,
    })
  )

  //
  // SHEET 2 — NUG
  //

  const nugWorksheet =
    workbook.Sheets["NUG"]

  let netUnitGrowth = 0

  if (nugWorksheet) {
    const nugCell = nugWorksheet["B2"]

    if (nugCell) {
      netUnitGrowth = Number(nugCell.v)
    }
  }

  return {
    reportDate,
    rows,
    netUnitGrowth,
  }
}