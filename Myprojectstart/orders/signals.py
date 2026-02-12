from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import OrderItem, Order
from orders.utils import auto_complete_order


@receiver(post_save, sender=OrderItem)
def update_order_status(sender, instance, **kwargs):
    order = instance.order

    # Get all items of this order
    items = order.items.all()

    # If no items, do nothing
    if not items.exists():
        return

    # Check if all items delivered
    all_delivered = all(
        item.vendor_status == 'delivered' for item in items
    )

    if all_delivered:
        order.status = 'completed'
        order.save(update_fields=['status'])
    else:
        # Optional: move to processing if any item is active
        if order.status == 'completed':
            order.status = 'processing'
            order.save(update_fields=['status'])

@receiver(post_save, sender=OrderItem)
def order_item_status_signal(sender, instance, **kwargs):
    auto_complete_order(instance.order)