"use client"

import { useMemo, useState } from "react"

import {
  calculateWeightedLTRYoY,
  calculateLocalRPIYoY,
  getUniqueADs,
  getUniqueRVPs,
  filterRows,
} from "@/lib/metrics"

type Props = {
  reportDate: string
  rows: any[]
  netUnitGrowth: number
}

export default function DashboardClient({
  reportDate,
  rows,
  netUnitGrowth,
}: Props) {
  //
  // FILTER STATE
  //

  const [selectedAD, setSelectedAD] =
    useState("")

  const [selectedRVP, setSelectedRVP] =
    useState("")

  //
  // DROPDOWN OPTIONS
  //

  const adOptions = useMemo(() => {
    return getUniqueADs(rows)
  }, [rows])

  const rvpOptions = useMemo(() => {
    return getUniqueRVPs(
      rows,
      selectedAD
    )
  }, [rows, selectedAD])

  //
  // FILTERED DATA
  //

  const filteredRows = useMemo(() => {
    return filterRows(
      rows,
      selectedAD,
      selectedRVP
    )
  }, [
    rows,
    selectedAD,
    selectedRVP,
  ])

  //
  // KPI CALCULATIONS
  //

  const weightedLTRYoY =
    calculateWeightedLTRYoY(
      filteredRows
    )

  const localRPIYoY =
    calculateLocalRPIYoY(
      filteredRows
    )

  const propertyCount =
    filteredRows.length

  //
  // CURRENT VIEW LABEL
  //

  const currentView =
    selectedRVP
      ? selectedRVP
      : selectedAD
      ? selectedAD
      : "Enterprise Total"

  //
  // TARGETS
  //

  const ltrTarget = 0.05
  const rpiTarget = -50

  //
  // KPI STATUS
  //

  const ltrAboveTarget =
    weightedLTRYoY >= ltrTarget

  const rpiAboveTarget =
    localRPIYoY >= rpiTarget

  //
  // COLORS
  //

  const ltrColor =
    ltrAboveTarget
      ? "text-green-600"
      : "text-red-600"

  const rpiColor =
    rpiAboveTarget
      ? "text-green-600"
      : "text-red-600"

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}

        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900">
            AD MBO Dashboard
          </h1>

          <div className="text-gray-500 text-xl mt-3">
            Data as of {reportDate}
          </div>
        </div>

        {/* CONTROL BAND */}

        <div className="mt-10 bg-white rounded-3xl shadow-md px-8 py-6 max-w-6xl mx-auto">
          <div className="flex flex-wrap items-end justify-center gap-6">
            {/* AD FILTER */}

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                AD
              </label>

              <select
                value={selectedAD}
                onChange={(e) => {
                  setSelectedAD(
                    e.target.value
                  )

                  setSelectedRVP("")
                }}
                className="bg-gray-50 border border-gray-300 rounded-xl px-5 py-3 shadow-sm min-w-[220px] text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  All ADs
                </option>

                {adOptions.map(
                  (ad: string) => (
                    <option
                      key={ad}
                      value={ad}
                    >
                      {ad}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* RVP FILTER */}

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                RVP
              </label>

              <select
                value={selectedRVP}
                onChange={(e) =>
                  setSelectedRVP(
                    e.target.value
                  )
                }
                className="bg-gray-50 border border-gray-300 rounded-xl px-5 py-3 shadow-sm min-w-[220px] text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  All RVPs
                </option>

                {rvpOptions.map(
                  (rvp: string) => (
                    <option
                      key={rvp}
                      value={rvp}
                    >
                      {rvp}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* CLEAR FILTERS */}

            <button
              onClick={() => {
                setSelectedAD("")
                setSelectedRVP("")
              }}
              className="bg-gray-900 text-white rounded-xl px-6 py-3 shadow-md font-medium hover:bg-gray-800 transition"
            >
              Clear Filters
            </button>

            {/* CURRENT VIEW */}

            <div className="bg-blue-50 border border-blue-100 rounded-2xl px-8 py-5 min-w-[320px]">
              <div className="text-sm text-gray-500">
                Current View
              </div>

              <div className="text-3xl font-bold text-blue-700 mt-1">
                {currentView}
              </div>

              <div className="text-sm text-gray-500 mt-2">
                {selectedAD || "All ADs"} •{" "}
                {selectedRVP || "All RVPs"}
              </div>
            </div>
          </div>
        </div>

        {/* KPI GRID */}

        <div className="mt-10 flex flex-wrap justify-center gap-8">
          {/* LTR KPI */}

          <div className="bg-white rounded-3xl shadow-md w-[250px] h-[250px] p-7 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
            <div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Weighted LTR YoY
              </div>

              <div
                className={`text-6xl font-bold mt-5 flex items-center gap-2 ${ltrColor}`}
              >
                {weightedLTRYoY.toFixed(
                  2
                )}

                <span className="text-3xl">
                  {ltrAboveTarget
                    ? "↑"
                    : "↓"}
                </span>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500">
                Target Threshold:
                +0.05 YoY
              </div>

              <div
                className={`inline-flex mt-3 px-3 py-1 rounded-full text-sm font-semibold ${
                  ltrAboveTarget
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {ltrAboveTarget
                  ? "Above Target"
                  : "Below Target"}
              </div>
            </div>
          </div>

          {/* RPI KPI */}

          <div className="bg-white rounded-3xl shadow-md w-[250px] h-[250px] p-7 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
            <div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Local RPI YoY
              </div>

              <div
                className={`text-6xl font-bold mt-5 flex items-center gap-2 ${rpiColor}`}
              >
                {localRPIYoY.toFixed(
                  0
                )}

                <span className="text-3xl">
                  {rpiAboveTarget
                    ? "↑"
                    : "↓"}
                </span>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500">
                Target Threshold:
                -50 YoY
              </div>

              <div
                className={`inline-flex mt-3 px-3 py-1 rounded-full text-sm font-semibold ${
                  rpiAboveTarget
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {rpiAboveTarget
                  ? "Above Target"
                  : "Below Target"}
              </div>
            </div>
          </div>

          {/* NUG KPI */}

          <div className="bg-white rounded-3xl shadow-md w-[250px] h-[250px] p-7 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
            <div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Net Unit Growth
              </div>

              <div className="text-6xl font-bold text-blue-600 mt-5">
                {netUnitGrowth}
              </div>
            </div>

            <div className="text-sm text-gray-500">
              YTD Total
            </div>
          </div>

          {/* PROPERTY COUNT KPI */}

<div className="bg-white rounded-3xl shadow-md w-[250px] h-[250px] p-7 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
  <div>
    <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
      Property Count
    </div>

    <div className="text-6xl font-bold text-purple-600 mt-5">
      {propertyCount.toLocaleString()}
    </div>
  </div>

  <div className="text-sm text-gray-500">
    Active Properties
  </div>
</div>
        </div>
      </div>
    </main>
  )
}