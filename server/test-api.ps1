$baseUrl = "http://localhost:4000/api/v1"

Write-Host "===== Testing Auth Endpoints =====" -ForegroundColor Cyan

# Test Register
Write-Host "`n[TEST] Register User" -ForegroundColor Yellow
$registerBody = @{
    name = "Test User"
    email = "testuser999@example.com"
    password = "test123456"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -ContentType "application/json" -Body $registerBody
    Write-Host "Register Response: SUCCESS" -ForegroundColor Green
    $global:token = $response.token
    Write-Host "Token received: $($global:token.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Login
Write-Host "`n[TEST] Login User" -ForegroundColor Yellow
$loginBody = @{
    email = "testuser999@example.com"
    password = "test123456"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -ContentType "application/json" -Body $loginBody
    Write-Host "Login Response: SUCCESS" -ForegroundColor Green
    $global:token = $loginResponse.token
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Get Products
Write-Host "`n[TEST] Get All Products" -ForegroundColor Yellow
try {
    $products = Invoke-RestMethod -Uri "$baseUrl/products" -Method Get
    Write-Host "Get Products: SUCCESS - Found $($products.totalProducts) products" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Create Product (Admin) - with Authorization header
Write-Host "`n[TEST] Create Product (Admin)" -ForegroundColor Yellow
$productBody = @{
    name = "Test Product"
    description = "This is a test product"
    price = 99.99
    stock = 10
    category = "Electronics"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $($global:token)"
}

try {
    $newProduct = Invoke-RestMethod -Uri "$baseUrl/admin/products" -Method Post -ContentType "application/json" -Body $productBody -Headers $headers
    Write-Host "Create Product: SUCCESS - ID: $($newProduct.product.id)" -ForegroundColor Green
    $global:productId = $newProduct.product.id
} catch {
    Write-Host "Create Product Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Get Single Product
Write-Host "`n[TEST] Get Single Product" -ForegroundColor Yellow
try {
    if ($global:productId) {
        $singleProduct = Invoke-RestMethod -Uri "$baseUrl/products/$global:productId" -Method Get
        Write-Host "Get Single Product: SUCCESS" -ForegroundColor Green
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Create Order
Write-Host "`n[TEST] Create Order" -ForegroundColor Yellow
if ($global:productId) {
    $orderBody = @{
        orderItems = @(
            @{
                name = "Test Product"
                quantity = 2
                price = 99.99
                product = $global:productId
            }
        )
        shippingInfo = @{
            address = "123 Test Street"
            city = "Test City"
            state = "Test State"
            country = "India"
            pinCode = "123456"
            phoneNo = "1234567890"
        }
        itemsPrice = 199.98
        taxPrice = 20
        shippingPrice = 10
        totalPrice = 229.98
    } | ConvertTo-Json

    try {
        $newOrder = Invoke-RestMethod -Uri "$baseUrl/order/new" -Method Post -ContentType "application/json" -Body $orderBody -Headers $headers
        Write-Host "Create Order: SUCCESS - Order ID: $($newOrder.order.id)" -ForegroundColor Green
        $global:orderId = $newOrder.order.id
    } catch {
        Write-Host "Create Order Error: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "Skipping - No product ID" -ForegroundColor Yellow
}

# Test Get My Orders
Write-Host "`n[TEST] Get My Orders" -ForegroundColor Yellow
try {
    $myOrders = Invoke-RestMethod -Uri "$baseUrl/orders/my" -Method Get -Headers $headers
    Write-Host "Get My Orders: SUCCESS - Found $($myOrders.orders.Count) orders" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Logout
Write-Host "`n[TEST] Logout" -ForegroundColor Yellow
try {
    $logoutResponse = Invoke-RestMethod -Uri "$baseUrl/auth/logout" -Method Get -Headers $headers
    Write-Host "Logout: SUCCESS" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n===== All Tests Complete =====" -ForegroundColor Cyan
