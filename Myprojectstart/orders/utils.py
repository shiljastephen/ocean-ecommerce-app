def auto_complete_order(order):
    """
    Auto-complete order if all vendor items are delivered
    """
    # If ANY item is not delivered → stop
    if order.items.exclude(vendor_status="delivered").exists():
        return

    # All delivered → complete order
    if order.status != "completed":
        order.status = "completed"
        order.save(update_fields=["status"])
