export interface UserCreatedData {
  id: string
  username: string
  avatar: {
    url: string
    cloudinaryId: string
  }
  createdAt: Date
  updatedAt: Date
  version: number
}
