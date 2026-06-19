import * as React from "react";
import { colors, Address } from "./theme";
import {
  EmailLayout,
  EmailHeader,
  EmailFooter,
  EmailButton,
  Card,
  Text,
} from "./components";

export interface DeliveryCreatedEmailProps {
  orderId: string;
  deliveryDate: string;
  shippingAddress: Address;
  carrier: string;
  trackingNumber: string;
  storeUrl: string;
}

export const DeliveryCreatedEmail = ({
  orderId,
  deliveryDate,
  shippingAddress,
  carrier,
  trackingNumber,
  storeUrl,
}: DeliveryCreatedEmailProps) => {
  return (
    <EmailLayout previewText={`Delivery confirmation for Order #${orderId}.`}>
      <EmailHeader
        title="Shipment Delivered"
        subtitle={`Order #${orderId} • Delivered on ${deliveryDate}`}
      />
      <Text
        style={{
          fontSize: "14px",
          color: colors.onSurface,
          margin: "0 0 20px 0",
          lineHeight: "1.5",
        }}
      >
        Your wholesale liquidation cargo has been delivered by {carrier} to your
        delivery address. Please verify the shipment contents against your
        manifest/packing slip upon receipt.
      </Text>

      <Card title="Delivered Destination">
        <Text style={detailTextStyle}>
          {shippingAddress.first_name} {shippingAddress.last_name}
          <br />
          {shippingAddress.address_1}
          <br />
          {shippingAddress.address_2 && (
            <>
              {shippingAddress.address_2}
              <br />
            </>
          )}
          {shippingAddress.city}, {shippingAddress.province}{" "}
          {shippingAddress.postal_code}
          <br />
          {shippingAddress.country}
        </Text>
      </Card>

      <Card title="Logistics Reference">
        <Text style={{ ...detailTextStyle, margin: "2px 0" }}>
          <strong>Carrier:</strong> {carrier}
        </Text>
        <Text style={{ ...detailTextStyle, margin: "2px 0" }}>
          <strong>Tracking Number:</strong> {trackingNumber}
        </Text>
      </Card>

      <EmailButton
        href={`${storeUrl}/account/orders/${orderId}`}
        text="Verify Manifest Details"
      />
      <EmailFooter />
    </EmailLayout>
  );
};

const detailTextStyle: React.CSSProperties = {
  fontSize: "12px",
  color: colors.onSurface,
  margin: 0,
  lineHeight: "1.5",
};

DeliveryCreatedEmail.PreviewProps = {
  orderId: "9821-44",
  deliveryDate: "June 22, 2026 at 2:30 PM",
  shippingAddress: {
    first_name: "John",
    last_name: "Doe",
    address_1: "123 Warehouse Rd",
    city: "Liquid City",
    province: "CA",
    postal_code: "90210",
    country: "United States",
  },
  carrier: "FedEx Freight",
  trackingNumber: "771234567890",
  storeUrl: "https://onestopliquidation.com",
} as DeliveryCreatedEmailProps;

export default DeliveryCreatedEmail;
