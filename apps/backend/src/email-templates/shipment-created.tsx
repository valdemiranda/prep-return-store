import * as React from "react";
import { colors, OrderItem } from "./theme";
import {
  EmailLayout,
  EmailHeader,
  EmailFooter,
  EmailButton,
  Card,
  ItemRow,
  Text,
} from "./components";

export interface ShipmentCreatedEmailProps {
  orderId: string;
  items: OrderItem[];
  carrier: string;
  trackingNumber: string;
  trackingUrl: string;
  estimatedDelivery?: string;
}

export const ShipmentCreatedEmail = ({
  orderId,
  items,
  carrier,
  trackingNumber,
  trackingUrl,
  estimatedDelivery,
}: ShipmentCreatedEmailProps) => {
  return (
    <EmailLayout previewText={`Order #${orderId} is on the way!`}>
      <EmailHeader
        title="Your Order has Shipped"
        subtitle={`Order #${orderId} • Dispatched via ${carrier}`}
      />
      <Text
        style={{
          fontSize: "14px",
          color: colors.onSurface,
          margin: "0 0 20px 0",
          lineHeight: "1.5",
        }}
      >
        Good news! Your liquidation cargo has been picked up by the logistics
        provider and is actively in transit to your specified warehouse
        destination.
      </Text>

      <Card title="Shipped Items">
        {items.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </Card>

      <Card title="Shipment Tracking Details">
        <Text style={detailTextStyle}>
          <strong>Carrier:</strong> {carrier}
        </Text>
        <Text style={detailTextStyle}>
          <strong>Tracking Number:</strong> {trackingNumber}
        </Text>
        {estimatedDelivery && (
          <Text style={detailTextStyle}>
            <strong>Estimated Delivery:</strong> {estimatedDelivery}
          </Text>
        )}
      </Card>

      <EmailButton href={trackingUrl} text="Track Shipment Location" />
      <EmailFooter />
    </EmailLayout>
  );
};

const detailTextStyle: React.CSSProperties = {
  fontSize: "12px",
  color: colors.onSurface,
  margin: "4px 0",
};

ShipmentCreatedEmail.PreviewProps = {
  orderId: "9821-44",
  items: [
    {
      id: "1",
      title: "Industrial Heavy Duty Pallet Jack 5500 lbs",
      quantity: 1,
      price: "$299.99",
      thumbnail:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=100&auto=format&fit=crop&q=60",
    },
  ],
  carrier: "FedEx Freight",
  trackingNumber: "771234567890",
  trackingUrl: "https://www.fedex.com/fedextrack/?trknbr=771234567890",
  estimatedDelivery: "Monday, June 22, 2026",
} as ShipmentCreatedEmailProps;

export default ShipmentCreatedEmail;
