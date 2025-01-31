import schema, { InvoiceDTO, InvoiceOutput } from './invoice.schema';

export const statuses = ['TO_BE_VALIDATED', 'REJECTED', 'APPROVED'] as const;

type Statuses = (typeof statuses)[number];

const STATUSES: Record<Statuses | 'UNKNOWN', string> = {
  TO_BE_VALIDATED: 'Validation',
  REJECTED: 'Rejected',
  APPROVED: 'Approved',
  UNKNOWN: 'Unknown',
} as const;

class Invoice implements InvoiceOutput {
  constructor(data: InvoiceOutput) {
    Object.keys(data).forEach((key: string) => {
      //@ts-ignore: copy the values into the instance's members
      this[key] = data[key];
    });
  }

  static parse(data: InvoiceDTO) {
    /** TESTING NOTE
     * zod's type for safeParse is not showing what I get when executing the application, so at the moment, i'm resorting for the calling code to catch this
     *
     * safe parsing would allow us to hide invoices that are not in a format recognized by the FE, thus preventing errors due to different schema
     *
     * doing this is one way to "force" BE and FE to be synchonized on the data
     */
    const parsed = schema.parse(data);
    return new Invoice(parsed);
  }

  readonly id!: number;
  readonly vendor!: string;
  readonly vendor_tax_registration_number!: string;
  readonly vendor_bank_details!: string;
  readonly vendor_address!: string;
  readonly billing_address!: string;
  readonly number!: string;
  readonly po_number!: string;
  readonly date_of_issue!: Date;
  readonly due_date!: Date;
  readonly payment_terms!: number;
  readonly description!: string;
  readonly line_item_details!: string;
  readonly pre_tax_amount!: number;
  readonly discount!: number;
  readonly tax_amount!: number;
  readonly total_amount!: number;
  readonly currency!: string;
  readonly gl_code!: string;
  readonly cost_centre!: string;
  readonly status!: string;
  readonly file!: File | undefined;

  get statusName(): string {
    return STATUSES[this.status as Statuses] ?? STATUSES.UNKNOWN;
  }

  clone(delta: Partial<Invoice> = {}): Invoice {
    return new Invoice({ ...this, ...delta });
  }
}

export default Invoice;
