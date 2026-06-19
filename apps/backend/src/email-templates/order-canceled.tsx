import * as React from "react";
import { colors, OrderItem } from "./theme";
import { EmailLayout, EmailHeader, EmailFooter, EmailButton, Card, ItemRow, Text } from "./components";

export interface OrderCanceledEmailProps {
  orderId: string;
  cancellationReason?: string;
  refundStatus: string;
  items: OrderItem[];
  storeUrl: string;
}

export const OrderCanceledEmail = ({
  orderId,
  cancellationReason,
  refundStatus,
  items,
  storeUrl,
}: OrderCanceledEmailProps) => {
  return (
    <EmailLayout previewText={`Cancellation confirmation for Order #OSL-${orderId}.`}>
      <EmailHeader
        title="Order Canceled"
        subtitle={`Order #OSL-${orderId} • Status: Canceled`}
      />
      <Text style={{ fontSize: "14px", color: colors.onSurface, margin: "0 0 20px 0", lineHeight: "1.5" }}>
        This transaction notification confirms that your recent liquidation order has been canceled. Please find details of the canceled items and the status of your refund below:
      </Text>
      
      {cancellationReason && (
        <Card title="Reason for Cancellation">
          <Text style={detailTextStyle}>{cancellationReason}</Text>
        </Card>
      )}

      <Card title="Refund Information">
        <Text style={detailTextStyle}>
          <strong>Status:</strong> {refundStatus}
        </Text>
      </Card>

      <Card title="Canceled Items">
        {items.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </Card>
      
      <EmailButton href={storeUrl} text="Return to Storefront" />
      <EmailFooter />
    </EmailLayout>
  );
};

const detailTextStyle: React.CSSProperties = {
  fontSize: "12px",
  color: colors.onSurface,
  margin: "4px 0",
};

OrderCanceledEmail.PreviewProps = {
  orderId: "9821-44",
  cancellationReason: "Inventory discrepancy or customer requested cancellation.",
  refundStatus: "A refund of $564.57 has been initiated and will post to your original payment method within 3-5 business days.",
  items: [
    { id: "1", title: "Industrial Heavy Duty Pallet Jack 5500 lbs", quantity: 1, price: "$299.99", thumbnail: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=100&auto=format&fit=crop&q=60" }
  ],
  storeUrl: "https://onestopliquidation.com",
} as OrderCanceledEmailProps;

export default OrderCanceledEmail;
