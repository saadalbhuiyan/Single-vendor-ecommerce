const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Coupon = require('../models/Coupon');

// Helper to calculate total price from cart and coupon
const calculateTotal = (cart, coupon) => {
    let total = 0;
    cart.items.forEach(item => {
        let price = 0;
        if (item.variant) {
            const variantDetail = item.product.variants.find(
                v => v._id.toString() === item.variant.toString()
            );
            price = variantDetail ? variantDetail.price : 0;
        } else {
            price = item.product.price || 0;
        }
        total += price * item.quantity;
    });

    if (coupon) {
        if (coupon.discountType === 'percentage') {
            total -= (total * coupon.discountValue) / 100;
        } else if (coupon.discountType === 'fixed') {
            total -= coupon.discountValue;
        }
    }
    return total < 0 ? 0 : total;
};

// Create order from cart
exports.createOrder = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        let couponData = null;
        if (cart.coupon && cart.coupon.code) {
            const coupon = await Coupon.findOne({ code: cart.coupon.code, active: true });
            if (coupon) {
                couponData = {
                    code: coupon.code,
                    discountType: coupon.discountType,
                    discountValue: coupon.discountValue,
                };
            }
        }

        const totalAmount = calculateTotal(cart, couponData);

        const orderItems = cart.items.map(item => {
            let price = 0;
            if (item.variant) {
                const variantDetail = item.product.variants.find(
                    v => v._id.toString() === item.variant.toString()
                );
                price = variantDetail ? variantDetail.price : 0;
            } else {
                price = item.product.price || 0;
            }
            return {
                product: item.product._id,
                variant: item.variant || null,
                quantity: item.quantity,
                price,
            };
        });

        const order = new Order({
            user: userId,
            items: orderItems,
            totalAmount,
            coupon: couponData,
            shippingAddress: req.body.shippingAddress || {},
            paymentStatus: 'pending',
            orderStatus: 'pending',
            paymentMethod: 'DemoGateway', // you can change this dynamically
        });

        await order.save();

        // Clear user cart
        cart.items = [];
        cart.coupon = null;
        await cart.save();

        res.status(201).json({ success: true, order });
    } catch (error) {
        console.error('createOrder error:', error);
        res.status(500).json({ success: false, message: 'Server error creating order' });
    }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error('getUserOrders error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching orders' });
    }
};

// Get order details
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
            .populate('items.product')
            .populate('items.variant');
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error('getOrderById error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching order' });
    }
};

// Cancel order (user)
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        if (['shipped', 'delivered'].includes(order.orderStatus)) {
            return res.status(400).json({ success: false, message: 'Cannot cancel shipped or delivered order' });
        }

        order.orderStatus = 'cancelled';
        await order.save();

        res.status(200).json({ success: true, message: 'Order cancelled', order });
    } catch (error) {
        console.error('cancelOrder error:', error);
        res.status(500).json({ success: false, message: 'Server error cancelling order' });
    }
};

// Initiate demo payment (simulate bKash or other gateway)
exports.initiatePayment = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        if (order.paymentStatus === 'paid') return res.status(400).json({ success: false, message: 'Order already paid' });

        // Instead of real gateway, simulate payment URL for demo:
        const paymentGatewayUrl = `https://demo-payment-gateway.com/pay?orderId=${order._id}&amount=${order.totalAmount}`;

        res.status(200).json({ success: true, paymentGatewayUrl });
    } catch (error) {
        console.error('initiatePayment error:', error);
        res.status(500).json({ success: false, message: 'Server error initiating payment' });
    }
};

// Simulate payment success webhook
exports.handlePaymentSuccess = async (req, res) => {
    try {
        const { tran_id } = req.body; // tran_id = order ID in our case

        const order = await Order.findById(tran_id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        order.paymentStatus = 'paid';
        order.orderStatus = 'processing';
        await order.save();

        res.status(200).json({ success: true, message: 'Payment successful', order });
    } catch (error) {
        console.error('handlePaymentSuccess error:', error);
        res.status(500).json({ success: false, message: 'Server error handling payment success' });
    }
};

// Simulate payment fail webhook
exports.handlePaymentFail = async (req, res) => {
    try {
        const { tran_id } = req.body;

        const order = await Order.findById(tran_id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        order.paymentStatus = 'failed';
        order.orderStatus = 'pending';
        await order.save();

        res.status(200).json({ success: true, message: 'Payment failed', order });
    } catch (error) {
        console.error('handlePaymentFail error:', error);
        res.status(500).json({ success: false, message: 'Server error handling payment fail' });
    }
};

// Request return/refund (user)
exports.requestReturn = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        if (order.returnRequested) {
            return res.status(400).json({ success: false, message: 'Return already requested' });
        }

        order.returnRequested = true;
        order.returnReason = req.body.reason || '';
        order.orderStatus = 'returned';
        await order.save();

        res.status(200).json({ success: true, message: 'Return requested', order });
    } catch (error) {
        console.error('requestReturn error:', error);
        res.status(500).json({ success: false, message: 'Server error requesting return' });
    }
};

// Admin: List all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error('getAllOrders error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching all orders' });
    }
};

// Admin: Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        order.orderStatus = status;
        order.updatedAt = new Date();

        await order.save();

        res.status(200).json({ success: true, message: 'Order status updated', order });
    } catch (error) {
        console.error('updateOrderStatus error:', error);
        res.status(500).json({ success: false, message: 'Server error updating order status' });
    }
};

// Admin: Approve order cancellation
exports.approveOrderCancellation = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        order.orderStatus = 'cancelled';
        order.updatedAt = new Date();

        await order.save();

        res.status(200).json({ success: true, message: 'Order cancellation approved', order });
    } catch (error) {
        console.error('approveOrderCancellation error:', error);
        res.status(500).json({ success: false, message: 'Server error approving cancellation' });
    }
};
