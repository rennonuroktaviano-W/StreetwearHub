declare module "midtrans-client" {
  type SnapTransactionDetails = {
    order_id: string;
    gross_amount: number;
  };

  type SnapCustomerDetails = {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    billing_address?: Record<string, string>;
    shipping_address?: Record<string, string>;
  };

  type SnapItemDetail = {
    id?: string;
    name: string;
    price: number;
    quantity: number;
  };

  type SnapTransactionPayload = {
    transaction_details: SnapTransactionDetails;
    customer_details?: SnapCustomerDetails;
    item_details?: SnapItemDetail[];
  };

  type SnapTransactionResponse = {
    token: string;
    redirect_url: string;
  };

  class Snap {
    constructor(options: { isProduction: boolean; serverKey: string; clientKey: string });
    createTransaction(payload: SnapTransactionPayload): Promise<SnapTransactionResponse>;
  }

  const midtransClient: { Snap: new (options: { isProduction: boolean; serverKey: string; clientKey: string }) => Snap };
  export default midtransClient;
}
