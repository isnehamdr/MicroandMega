<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Order Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #bb1403;">Order Confirmed!</h2>

        <p>Hello <strong>{{ $order->customer_name }}</strong>,</p>
        <p>Your order has been placed successfully and sent to the admin.</p>

        <p>
            <strong>Order Number:</strong> {{ $order->order_number }}<br>
            <strong>Status:</strong> {{ ucfirst($order->status) }}<br>
            <strong>Total:</strong> Rs. {{ number_format($order->grand_total, 2) }}
        </p>

        <h3>Items:</h3>
        <ul>
            @foreach($order->items as $item)
                <li>
                    {{ $item->product_name }} × {{ $item->quantity }}
                    — Rs. {{ number_format($item->price, 2) }}
                </li>
            @endforeach
        </ul>

        <p>Thank you for shopping with <strong>Micro & Mega</strong>!</p>
    </div>
</body>
</html>