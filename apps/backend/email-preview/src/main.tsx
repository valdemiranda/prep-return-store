import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const templates = [
  { id: "order-placed", name: "Order placed" },
  { id: "fulfillment-created", name: "Fulfillment created" },
  { id: "shipment-created", name: "Shipment created" },
  { id: "delivery-created", name: "Delivery created" },
  { id: "order-canceled", name: "Order canceled" },
];

function EmailPreviewApp() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = templates[selectedIndex];
  const previewUrl = `/__email-preview?template=${selected.id}`;

  return (
    <main>
      <aside>
        <div className="brand">One Stop Liquidation</div>
        <h1>Transactional Emails</h1>
        <nav>
          {templates.map((template, index) => (
            <button
              className={index === selectedIndex ? "active" : ""}
              key={template.name}
              onClick={() => setSelectedIndex(index)}
              type="button"
            >
              {template.name}
            </button>
          ))}
        </nav>
      </aside>
      <section>
        <header>
          <span>{selected.name}</span>
        </header>
        <iframe key={selected.id} src={previewUrl} title={selected.name} />
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<EmailPreviewApp />);
