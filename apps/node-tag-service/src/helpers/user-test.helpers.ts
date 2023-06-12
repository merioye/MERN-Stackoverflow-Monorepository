import { UserModel } from '../models'

const users = [
  {
    _id: '6423c07564c35144c5c7f611',
    username: 'user1',
    avatar: { url: 'https://www.google.com', cloudinaryId: 'abc' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '6423c07f64c35144c5c7f614',
    username: 'user2',
    avatar: { url: 'https://www.google.com', cloudinaryId: 'abc' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
export const createUsers = async (): Promise<void> => {
  for (const user of users) {
    const newUser = UserModel.build(user)
    await newUser.save()
  }
}
