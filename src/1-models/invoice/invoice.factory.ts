import { Factory } from 'rosie';
import { faker } from '@faker-js/faker';
import Invoice, { statuses } from '.';

const factory = Factory.define<Invoice>('Invoice', Invoice)
  .attrs({
    id: faker.number.int,
    vendor: faker.company.name,
    vendor_tax_registration_number: () => faker.number.int().toString(),
    vendor_bank_details: faker.finance.accountNumber,
    vendor_address: faker.location.streetAddress,
    billing_address: faker.location.streetAddress,
    po_number: faker.location.zipCode,
    date_of_issue: () => faker.date.past({ years: 0.5 }),
    due_date: () => faker.date.past({ years: 0.5 }),
    payment_terms: faker.number.int({ max: 30 }),
    description: faker.commerce.product,
    line_item_details: faker.commerce.productAdjective,
    pre_tax_amount: () =>
      faker.number.float({ fractionDigits: 2, min: 100, max: 10_000 }),
    discount: 0,
    tax_amount: () =>
      faker.number.float({ fractionDigits: 2, min: 100, max: 10_000 }),
    currency: faker.finance.currencyCode,
    gl_code: faker.commerce.productName,
    cost_centre: faker.commerce.department,
    status: faker.helpers.arrayElement(statuses),
  })
  .attr('number', ['id'], (id) => `INV-${id}`)
  .attr(
    'total_amount',
    ['pre_tax_amount', 'tax_amount'],
    (pre, tax) => pre + tax,
  );

class InvoiceFactory {
  private static _data: Record<string, any> = {};

  static buildSingle() {
    const result = factory.build(this._data);

    this._data = {};

    return result;
  }

  static buildList(size: number) {
    const result = factory.buildList(size, this._data);

    this._data = {};

    return result;
  }

  static withPendingApproval() {
    this._data.status = 'TO_BE_VALIDATED';
    return this;
  }

  static withApproval() {
    this._data.status = 'APPROVED';
    return this;
  }

  static withRejection() {
    this._data.status = 'REJECTED';
    return this;
  }

  static withUnknownStatus() {
    this._data.status = faker.word.words(5);
    return this;
  }
}

export default InvoiceFactory;
