import * as React from "react";
import { colors, OrderItem } from "./theme";
import { EmailLayout, EmailHeader, EmailFooter, EmailButton, Card, ItemRow, Text } from "./components";

export interface FulfillmentCreatedEmailProps {
  orderId: string;
  fulfillmentId: string;
  items: OrderItem[];
  carrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  storeUrl: string;
}

export const FulfillmentCreatedEmail = ({
  orderId,
  fulfillmentId,
  items,
  carrier,
  trackingNumber,
  trackingUrl,
  storeUrl,
}: FulfillmentCreatedEmailProps) => {
  return (
    <EmailLayout previewText={`Items from Order #OSL-${orderId} are prepared and packed.`}>
      <EmailHeader
        title="Items Prepared for Shipping"
        subtitle={`Order #OSL-${orderId} • Fulfillment #${fulfillmentId}`}
      />
      <Text style={{ fontSize: "14px", color: colors.onSurface, margin: "0 0 20px 0", lineHeight: "1.5" }}>
        Your items have been picked and packed at our central warehouse facility. They are now secured and waiting for carrier collection.
      </Text>
      
      <Card title="Items Prepared">
        {items.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </Card>
      
      {(carrier || trackingNumber) && (
        <Card title="Carrier & Tracking Details">
          {carrier && (
            <Text style={detailTextStyle}>
              <strong>Carrier:</strong> {carrier}
            </Text>
          )}
          {trackingNumber && (
            <Text style={detailTextStyle}>
              <strong>Tracking Number:</strong> {trackingNumber}
            </Text>
          )}
        </Card>
      )}
      
      {trackingUrl ? (
        <EmailButton href={trackingUrl} text="Track Package Status" />
      ) : (
        <EmailButton href={`${storeUrl}/account/orders/${orderId}`} text="View Order Details" />
      )}
      <EmailFooter />
    </EmailLayout>
  );
};

const detailTextStyle: React.CSSProperties = {
  fontSize: "12px",
  color: colors.onSurface,
  margin: "4px 0",
};

FulfillmentCreatedEmail.PreviewProps = {
  orderId: "9821-44",
  fulfillmentId: "ful_01H238FGA",
  items: [
    { id: "1", title: "Industrial Heavy Duty Pallet Jack 5500 lbs", quantity: 1, price: "$299.99", thumbnail: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=100&auto=format&fit=crop&q=60" }
  ],
  carrier: "FedEx Freight",
  trackingNumber: "771234567890",
  trackingUrl: "https://www.fedex.com/fedextrack/?trknbr=771234567890",
  storeUrl: "https://onestopliquidation.com",
} as FulfillmentCreatedEmailProps;

export default FulfillmentCreatedEmail;
