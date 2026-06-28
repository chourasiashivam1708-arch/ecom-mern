const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const products = require('./data/products');

dotenv.config();

const seedProducts = async () => {
  try {
    await connectDB();

    for (const product of products) {
      await Product.findOneAndUpdate(
        { name: product.name },
        product,
        { upsert: true, returnDocument: 'after', runValidators: true }
      );
    }

    console.log(`${products.length} products seeded successfully`);
    process.exit(0);
  } catch (error) {
    console.error(`Product seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedProducts();
