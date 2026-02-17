export const parseOrderText = (text) => {
    if (!text) {
      return { error: "Message is required" };
    }
  
    const lowerText = text.toLowerCase().trim();
  
    // Example format: order 20 kg wheat
    const regex = /order\s+(\d+)\s*(kg|g|litre|ltr)?\s*(.+)/;
  
    const match = lowerText.match(regex);
  
    if (!match) {
      return { error: "Invalid format. Try: order 20 kg wheat" };
    }
  
    return {
      quantity: Number(match[1]),
      unit: match[2] || "kg",
      productName: match[3].trim(),
    };
  };
  