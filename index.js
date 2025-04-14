require('dotenv').config()
const cors = require('cors')
const express = require('express')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const morgan = require('morgan')
const app = express()
const PORT = process.env.PORT || 8000
const connectToDb = require('./config/connectToDB');
const userRoute = require('./routes/userRoute');
const shoppingListRoute = require('./routes/shoppingList');
const savedRecipeRoute = require('./routes/savedRecipeRoute')
const recipeRoute = require('./routes/recipeRoute')
const myKitchenRoute = require('./routes/myKitchenRoute')

// Connect to database
connectToDb()

// Security middleware
app.use(helmet())
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}))

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// Logging middleware
app.use(morgan('dev'))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    })
})

// Routes
app.use('/users', userRoute);
app.use('/shoppingList', shoppingListRoute);
app.use('/savedRecipe', savedRecipeRoute)
app.use('/recipes', recipeRoute)
app.use('/myKitchen', myKitchenRoute)

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    })
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    // Handle specific error types
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: err.errors
        })
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized access'
        })
    }

    // Default error response
    res.status(err.status || 500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`Server started on http://localhost:${PORT}`);
})
