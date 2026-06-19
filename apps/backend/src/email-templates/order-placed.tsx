import * as React from "react";
import { colors, OrderItem, Address } from "./theme";
import {
  EmailLayout,
  EmailHeader,
  EmailFooter,
  EmailButton,
  Card,
  ItemRow,
  Text,
  Row,
  Column,
} from "./components";

export interface OrderPlacedEmailProps {
  orderId: string;
  date: string;
  items: OrderItem[];
  shippingAddress: Address;
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  storeUrl: string;
}

export const OrderPlacedEmail = ({
  orderId,
  date,
  items,
  shippingAddress,
  subtotal,
  shipping,
  tax,
  total,
  storeUrl,
}: OrderPlacedEmailProps) => {
  return (
    <EmailLayout
      previewText={`Order confirmation for ${orderId}. Thank you for your purchase!`}
    >
      <EmailHeader
        title="Order Placed Successfully"
        subtitle={`Order #${orderId} • Placed on ${date}`}
      />
      <Text
        style={{
          fontSize: "14px",
          color: colors.onSurface,
          margin: "0 0 20px 0",
          lineHeight: "1.5",
        }}
      >
        Thank you for your business. We are processing your wholesale
        liquidation order. We will notify you as soon as your items are prepared
        for shipping.
      </Text>

      <Card title="Items Ordered">
        {items.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </Card>

      <Card title="Shipping Address">
        <Text style={addressTextStyle}>
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

      <Card title="Order Summary">
        <Row style={{ marginBottom: "6px" }}>
          <Column>
            <Text style={summaryLabelStyle}>Subtotal</Text>
          </Column>
          <Column align="right" style={{ textAlign: "right" }}>
            <Text style={summaryValueStyle}>{subtotal}</Text>
          </Column>
        </Row>
        <Row style={{ marginBottom: "6px" }}>
          <Column>
            <Text style={summaryLabelStyle}>Shipping</Text>
          </Column>
          <Column align="right" style={{ textAlign: "right" }}>
            <Text style={summaryValueStyle}>{shipping}</Text>
          </Column>
        </Row>
        <Row style={{ marginBottom: "6px" }}>
          <Column>
            <Text style={summaryLabelStyle}>Tax</Text>
          </Column>
          <Column align="right" style={{ textAlign: "right" }}>
            <Text style={summaryValueStyle}>{tax}</Text>
          </Column>
        </Row>
        <Row
          style={{
            marginTop: "8px",
            borderTop: `1px solid ${colors.surfaceContainerHighest}`,
            paddingTop: "8px",
          }}
        >
          <Column>
            <Text style={{ ...summaryLabelStyle, fontWeight: 700 }}>Total</Text>
          </Column>
          <Column align="right" style={{ textAlign: "right" }}>
            <Text
              style={{
                ...summaryValueStyle,
                color: colors.primary,
                fontWeight: 900,
                fontSize: "14px",
              }}
            >
              {total}
            </Text>
          </Column>
        </Row>
      </Card>

      <EmailButton href={`${storeUrl}/track-order`} text="Track & View Order" />
      <EmailFooter />
    </EmailLayout>
  );
};

const addressTextStyle: React.CSSProperties = {
  fontSize: "12px",
  color: colors.onSurface,
  margin: 0,
  lineHeight: "1.5",
};

const summaryLabelStyle: React.CSSProperties = {
  fontSize: "12px",
  color: colors.onSurfaceVariant,
  margin: 0,
};

const summaryValueStyle: React.CSSProperties = {
  fontSize: "12px",
  color: colors.onSurface,
  margin: 0,
};

OrderPlacedEmail.PreviewProps = {
  orderId: "9821-44",
  date: "June 18, 2026",
  items: [
    {
      id: "1",
      title: "Industrial Heavy Duty Pallet Jack 5500 lbs",
      quantity: 1,
      price: "$299.99",
      thumbnail:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=100&auto=format&fit=crop&q=60",
    },
    {
      id: "2",
      title: "Heavy Duty Metal Storage Shelving Unit",
      quantity: 2,
      price: "$179.98",
      thumbnail:
        "https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=100&auto=format&fit=crop&q=60",
    },
  ],
  shippingAddress: {
    first_name: "John",
    last_name: "Doe",
    address_1: "123 Warehouse Rd",
    city: "Liquid City",
    province: "CA",
    postal_code: "90210",
    country: "United States",
  },
  subtotal: "$479.97",
  shipping: "$45.00",
  tax: "$39.60",
  total: "$564.57",
  storeUrl: "https://onestopliquidation.com",
} as OrderPlacedEmailProps;

export default OrderPlacedEmail;
