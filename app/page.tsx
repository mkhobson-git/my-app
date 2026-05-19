import { loadScatterData } from "@/lib/excel"

import DashboardClient from "./DashboardClient"

export default async function Home() {
  const data =
    await loadScatterData()

  return (
    <DashboardClient
      reportDate={data.reportDate}
      rows={data.rows}
      netUnitGrowth={
        data.netUnitGrowth
      }
    />
  )
}