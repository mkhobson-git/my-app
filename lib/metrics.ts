export function calculateWeightedLTRYoY(
  rows: any[]
) {
  const numerator = rows.reduce(
    (sum, row) =>
      sum +
      row.ltrYoy * row.surveyCountCY,
    0
  )

  const denominator = rows.reduce(
    (sum, row) =>
      sum + row.surveyCountCY,
    0
  )

  if (!denominator) {
    return 0
  }

  return numerator / denominator
}

export function calculateLocalRPIYoY(
  rows: any[]
) {
  if (!rows.length) {
    return 0
  }

  const total = rows.reduce(
    (sum, row) =>
      sum + row.localRpiYoy,
    0
  )

  return total / rows.length
}

//
// FILTER HELPERS
//

export function getUniqueADs(
  rows: any[]
) {
  return [...new Set(
    rows.map(row => row.ad)
  )]
    .filter(Boolean)
    .sort()
}

export function getUniqueRVPs(
  rows: any[],
  selectedAD?: string
) {
  let filteredRows = rows

  if (selectedAD) {
    filteredRows = rows.filter(
      row => row.ad === selectedAD
    )
  }

  return [...new Set(
    filteredRows.map(row => row.rvp)
  )]
    .filter(Boolean)
    .sort()
}

export function filterRows(
  rows: any[],
  selectedAD?: string,
  selectedRVP?: string
) {
  return rows.filter(row => {
    const matchesAD =
      !selectedAD ||
      row.ad === selectedAD

    const matchesRVP =
      !selectedRVP ||
      row.rvp === selectedRVP

    return (
      matchesAD &&
      matchesRVP
    )
  })
}