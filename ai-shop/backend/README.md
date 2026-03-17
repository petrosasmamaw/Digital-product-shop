# AI Shop Backend

This is the backend for the AI Shop application, built with Node.js, Express, and MongoDB.

## Setup

1. Copy `.env.example` to `.env` and fill in your environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `PORT`: Port to run the server (default 5000)

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

   Or for development with auto-restart:
   ```
   npm run dev
   ```

## API Endpoints

- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product (auth required)
- `GET /api/products/:id` - Get a single product
- `PUT /api/products/:id` - Update a product (auth required)
- `DELETE /api/products/:id` - Delete a product (auth required)
- `GET /api/orders` - Get user's orders (auth required)
- `POST /api/orders` - Create a new order (auth required)
- `POST /api/ai/recommend` - Get AI product recommendations
- `GET /api/health` - Health check