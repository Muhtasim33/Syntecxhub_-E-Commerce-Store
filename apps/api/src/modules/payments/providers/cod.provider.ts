export interface CreateCodOrderParams {
  orderId: string;
  orderNumber: string;
  amountCents: number;
}

export class CodProvider {
  /**
   * Cash on Delivery Settlement Protocol (TRD Section 7.2)
   * Order marked processing with payment_status=unpaid
   * Stock decremented immediately upon courier dispatch
   */
  public processCodOrder(params: CreateCodOrderParams) {
    return {
      provider: 'cod',
      providerPaymentId: `cod_${params.orderNumber}`,
      amountCents: params.amountCents,
      status: 'unpaid',
      settlementInstruction: 'Collect certified funds upon private courier delivery',
    };
  }
}

export const codProvider = new CodProvider();
