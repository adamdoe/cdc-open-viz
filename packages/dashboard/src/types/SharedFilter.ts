import { APIFilter } from "./APIFilter"
export type SharedFilter = {
    type?: 'urlfilter' | 'datafilter' | ''
    queryParameter?: string
    active?: string
    usedBy?: string[]
    parents?: string[]
    setBy?: string
    columnName?: string
    resetLabel?: string
    showDropdown?: boolean
    labels?: Record<string, any>
    key: string
    values?: string[]
    apiFilter?: APIFilter
    datasetKey?: string
    tier?: number
  }