require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('DATABASE_URL:', process.env.DATABASE_URL)
    const result = await prisma.$connect()
    console.log('Successfully connected to the database')
  } catch (error) {
    console.error('Error connecting to the database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 