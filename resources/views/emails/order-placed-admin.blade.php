<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Order</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #bb1403;">New Order Received!</h2>

        <p><strong>Order ID:</strong> #{{ $order->id }}</p>
        <p><strong>Customer:</strong> {{ $order->customer_name }}</p>
        <p><strong>Email:</strong> {{ $order->customer_email }}</p>
        <p><strong>Phone:</strong> {{ $order->customer_phone ?? 'N/A' }}</p>
        <p><strong>Address:</strong> {{ $order->address }}</p>
        <p><strong>Total:</strong> Rs. {{ number_format($order->total, 2) }}</p>

        <h3>Items:</h3>
        <ul>
            @foreach($order->items as $item)
                <li>
                    {{ $item->product_name }} × {{ $item->quantity }}
                    — Rs. {{ number_format($item->price, 2) }}
                </li>
            @endforeach
        </ul>

        <p>Please process this order.</p>
    </div>
</body>
</html>