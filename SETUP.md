# Setup Guide

## Google Sheets Setup

### Products Sheet Structure

| Column Name | Type | Description | Required |
|-------------|------|-------------|----------|
| id | Number | Unique product ID | Yes |
| name | Text | Product name | Yes |
| category | Text | Product category | Yes |
| price | Number | Current price | Yes |
| oldPrice | Number | Old price (for showing discount) | No |
| shortDesc | Text | Short description for cards | Yes |
| description | Text | Full description for product page | Yes |
| images | Text | Comma-separated image URLs | Yes |
| colors | Text | Comma-separated color options | No |
| active | Boolean | Whether product is active | Yes |

### Orders Sheet Structure

| Column Name | Type | Description |
|-------------|------|-------------|
| Timestamp | DateTime | Order timestamp |
| OrderID | Text | Unique order ID |
| ClientID | Text | Client identifier |
| CustomerName | Text | Customer name |
| Phone | Text | Customer phone |
| Address | Text | Delivery address |
| Area | Text | Delivery area |
| PaymentMethod | Text | Payment method |
| Items | JSON | Order items as JSON |
| Subtotal | Number | Order subtotal |
| Discount | Number | Discount amount |
| DeliveryFee | Number | Delivery fee |
| Total | Number | Order total |
| Coupon | Text | Coupon code used |
| Status | Text | Order status |

## Google Apps Script Deployment

1. Create a new Google Apps Script project
2. Copy the contents of `products-api.gs` and `orders-api.gs`
3. Deploy as web app with these settings:
   - Execute as: "Me"
   - Who has access: "Anyone, even anonymous"
4. Note the deployment URL for your client configurations