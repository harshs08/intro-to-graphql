import { Product } from './product.model'
import { User, roles } from '../user/user.model'
import { AuthenticationError } from 'apollo-server'
import mongoose from 'mongoose'

const productsTypeMatcher = {
  GAMING_PC: 'GamingPc',
  BIKE: 'Bike',
  DRONE: 'Drone'
}

/** product */
const product = (_, args, ctx) => {
  if (!ctx.user) {
    throw new AuthenticationError("no user found");
  }
  return Product.findById(args.id)
    .lean()
    .exec()
}

const newProduct = (_, args, ctx) => {
  if (!ctx.user || ctx.user.role !== roles.admin ) {
    throw new AuthenticationError("user error");
  }

  return Product.create({ ...args.input, createdBy: ctx.user._id })
}

const products = (_, args, ctx) => {
  if (!ctx.user || ctx.user.role !== roles.admin) {
    throw new AuthenticationError("no user found");
  }

  return Product.find({})
    .lean()
    .exec()
}

const updateProduct = (_, args, ctx) => {
  if (!ctx.user || ctx.user.role !== roles.admin ) {
    throw new AuthenticationError("user error");
  }
  const update = args.input
  return Product.findByIdAndUpdate(args.id, update, { new: true })
    .lean()
    .exec()
}

const removeProduct = (_, args, ctx) => {
  if (!ctx.user || ctx.user.role !== roles.admin ) {
    throw new AuthenticationError("user error");
  }

  return Product.findByIdAndRemove(args.id)
    .lean()
    .exec()
}

export default {
  Query: {
    products,
    product
  },
  Mutation: {
    newProduct,
    updateProduct,
    removeProduct
  },
  Product: {
    __resolveType(product) {
      return productsTypeMatcher[product.type]
    },
    createdBy(product) {
      return User.findById(product.createdBy)
        .lean()
        .exec()
    }
  }
}
