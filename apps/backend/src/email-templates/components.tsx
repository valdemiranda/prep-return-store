import * as React from "react";
import { colors, fonts, OrderItem } from "./theme";

const logoUrl = process.env.EMAIL_LOGO_URL || "/logo.png";

const Html = ({ children, ...props }: any) => (
  <html {...props}>{children}</html>
);
const Head = () => <head />;
const Preview = ({ children }: any) => (
  <div style={{ display: "none", maxHeight: 0, overflow: "hidden" }}>
    {children}
  </div>
);
const Body = ({ children, style }: any) => (
  <body style={style}>{children}</body>
);
const Container = ({ children, style }: any) => (
  <table align="center" cellPadding="0" cellSpacing="0" style={style}>
    <tbody>
      <tr>
        <td>{children}</td>
      </tr>
    </tbody>
  </table>
);
const Section = ({ children, style }: any) => (
  <div style={style}>{children}</div>
);
export const Row = ({ children, style }: any) => (
  <table cellPadding="0" cellSpacing="0" style={{ width: "100%", ...style }}>
    <tbody>
      <tr>{children}</tr>
    </tbody>
  </table>
);
export const Column = ({ children, style, align }: any) => (
  <td align={align} style={style}>
    {children}
  </td>
);
const Img = ({ alt, ...props }: any) => <img alt={alt} {...props} />;
export const Text = ({ children, style }: any) => (
  <p style={{ fontFamily: fonts.sans, margin: 0, ...style }}>{children}</p>
);
const Hr = ({ style }: any) => <hr style={style} />;
const Heading = ({ children, style }: any) => (
  <h1 style={{ fontFamily: fonts.headline, margin: 0, ...style }}>
    {children}
  </h1>
);
const Button = ({ children, href, style }: any) => (
  <a href={href} style={style}>
    {children}
  </a>
);

export const EmailLayout = ({
  previewText,
  children,
}: {
  previewText: string;
  children: any;
}) => (
  <Html lang="en">
    <Head />
    <Preview>{previewText}</Preview>
    <Body
      style={{
        backgroundColor: colors.background,
        fontFamily: fonts.sans,
        margin: "0 auto",
        padding: "40px 10px",
      }}
    >
      <Container
        style={{
          backgroundColor: colors.surface,
          border: `1px solid ${colors.surfaceContainerHighest}`,
          borderRadius: "4px",
          borderTop: `4px solid ${colors.primary}`,
          boxShadow: "0 4px 12px rgba(28,27,27,0.03)",
          margin: "0 auto",
          maxWidth: "560px",
          padding: "32px 24px",
          width: "100%",
        }}
      >
        {children}
      </Container>
    </Body>
  </Html>
);

export const EmailHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <Section style={{ marginBottom: "24px" }}>
    <Row>
      <Column align="left" style={{ verticalAlign: "middle" }}>
        <Img
          src={logoUrl}
          alt="One Stop Liquidation"
          width="74"
          height="50"
          style={{ display: "block", height: "42px", width: "auto" }}
        />
      </Column>
    </Row>
    <Hr
      style={{
        borderColor: colors.surfaceContainerHighest,
        borderStyle: "solid",
        borderWidth: "1px 0 0 0",
        margin: "16px 0 20px",
      }}
    />
    <Heading
      style={{
        color: colors.onSurface,
        fontSize: "22px",
        fontWeight: 800,
        letterSpacing: "-0.2px",
        lineHeight: "1.2",
      }}
    >
      {title}
    </Heading>
    {subtitle && (
      <Text
        style={{
          color: colors.onSurfaceVariant,
          fontSize: "13px",
          lineHeight: "1.4",
          marginTop: "6px",
        }}
      >
        {subtitle}
      </Text>
    )}
  </Section>
);

export const EmailFooter = () => (
  <Section style={{ marginTop: "32px" }}>
    <Hr
      style={{
        borderColor: colors.surfaceContainerHighest,
        borderStyle: "solid",
        borderWidth: "1px 0 0 0",
        margin: "24px 0 16px",
      }}
    />
    <Text
      style={{
        color: colors.onSurface,
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.5px",
        margin: "4px 0",
        textAlign: "center",
        textTransform: "uppercase",
      }}
    >
      One Stop Liquidation
    </Text>
    <Text
      style={{
        color: colors.onSurfaceVariant,
        fontSize: "10px",
        margin: "2px 0",
        textAlign: "center",
      }}
    >
      1 Chestnut St, Suite 5-E, Nashua, NH 03060 | support@1stop-liquidation.com
    </Text>
    <Text
      style={{
        color: colors.onSurfaceVariant,
        fontSize: "9px",
        lineHeight: "1.4",
        margin: "4px 0 0",
        textAlign: "center",
      }}
    >
      You are receiving this transaction notification regarding your recent
      order activity.
    </Text>
  </Section>
);

export const EmailButton = ({
  href,
  text,
  variant = "primary",
}: {
  href: string;
  text: string;
  variant?: "primary" | "secondary";
}) => (
  <Section style={{ margin: "24px 0", textAlign: "center" }}>
    <Button
      href={href}
      style={{
        backgroundColor:
          variant === "primary" ? colors.primary : colors.secondary,
        borderRadius: "4px",
        color: "#ffffff",
        display: "inline-block",
        fontFamily: fonts.headline,
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.5px",
        padding: "12px 24px",
        textAlign: "center",
        textDecoration: "none",
        textTransform: "uppercase",
      }}
    >
      {text}
    </Button>
  </Section>
);

export const Card = ({
  title,
  children,
  style,
}: {
  title: string;
  children: any;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      backgroundColor: colors.surfaceContainerLow,
      border: `1px solid ${colors.outlineVariant}`,
      borderRadius: "4px",
      marginBottom: "16px",
      padding: "16px",
      ...style,
    }}
  >
    <Text
      style={{
        borderBottom: `1px solid ${colors.surfaceContainerHighest}`,
        color: colors.primary,
        fontFamily: fonts.headline,
        fontSize: "11px",
        fontWeight: 800,
        letterSpacing: "1px",
        margin: "0 0 12px",
        paddingBottom: "6px",
        textTransform: "uppercase",
      }}
    >
      {title}
    </Text>
    {children}
  </div>
);

export const ItemRow = ({ item }: { item: OrderItem }) => (
  <Row style={{ marginBottom: "12px" }}>
    <Column style={{ verticalAlign: "middle", width: "40px" }}>
      {item.thumbnail ? (
        <Img
          src={item.thumbnail}
          alt={item.title}
          width="40"
          height="40"
          style={{
            border: `1px solid ${colors.outlineVariant}`,
            borderRadius: "2px",
            display: "block",
            objectFit: "cover",
          }}
        />
      ) : (
        <div
          style={{
            backgroundColor: colors.surfaceContainer,
            border: `1px solid ${colors.outlineVariant}`,
            borderRadius: "2px",
            height: "40px",
            width: "40px",
          }}
        />
      )}
    </Column>
    <Column style={{ paddingLeft: "12px", verticalAlign: "middle" }}>
      <Text
        style={{
          color: colors.onSurface,
          fontSize: "13px",
          fontWeight: 700,
          lineHeight: "1.4",
        }}
      >
        {item.title}
      </Text>
      <Text
        style={{
          color: colors.onSurfaceVariant,
          fontSize: "11px",
          marginTop: "2px",
        }}
      >
        Qty: {item.quantity}
      </Text>
    </Column>
    <Column
      align="right"
      style={{ textAlign: "right", verticalAlign: "middle", width: "80px" }}
    >
      <Text
        style={{
          color: colors.primary,
          fontFamily: fonts.headline,
          fontSize: "13px",
          fontWeight: 800,
        }}
      >
        {item.price}
      </Text>
    </Column>
  </Row>
);
