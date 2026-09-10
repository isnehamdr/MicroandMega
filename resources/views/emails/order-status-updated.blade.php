<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Order Status Update</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #bb1403;">Order Status Updated</h2>

        <p>Hello <strong>{{ $order->customer_name }}</strong>,</p>
        <p>Your order status has been updated.</p>

        <p>
            <strong>Order Number:</strong> {{ $order->order_number }}<br>
            <strong>New Status:</strong> {{ ucfirst($order->status) }}
        </p>

        <p>Thank you for shopping with <strong>Micro & Mega</strong>!</p>
    </div>
</body>
</html>