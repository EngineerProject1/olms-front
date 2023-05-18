export interface LabDateType {
  key: React.Key
  name: string
  images: string
  description: string
  location: string
  master: string
  capacity: number
  type: string
  status: string
}

export interface LabPageParams {
  page: number
  pageSize: number
  total: number
  name: string
  capacity: string
  status: string
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
  status: number
}
