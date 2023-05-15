export interface LabDateType {
  key: React.Key
  name: string
  images: string
  description: string
  location: string
  master: string
  capacity: number
  type: string
}

export interface LabPageParams {
  page: number
  pageSize: number
  total: number
  name: string
  capacity: string
}
export interface LabModel {
  id: number
  name: string
  masterId: number
  images: string
  description: string
  location: string
  masterName: string
  capacity: number
  type: string
}
