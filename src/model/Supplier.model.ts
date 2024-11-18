class SupplierModel {
  id: string;
  code: string;
  name: string;
  standard: string;
  address: string;
  tax_code: string;
  phone: string;
  active: boolean;
  disabled: boolean;
  customer: boolean;
  supplier: boolean;
  constructor(
    id: string,
    code: string,
    name: string,
    standard: string,
    address: string,
    tax: string,
    phone: string,
    active: boolean,
    disabled: boolean,
    customer: boolean,
    supplier: boolean
  ) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.standard = standard;
    this.address = address;
    this.tax_code = tax;
    this.phone = phone;
    this.active = active;
    this.disabled = disabled;
    this.customer = customer;
    this.supplier = supplier;
  }
  static initial() {
    return {
      id: "",
      code: "",
      name: "",
      standard: "",
      address: "",
      tax_code: "",
      phone: "",
      active: false,
      disabled: false,
      customer: false,
      supplier: true,
    };
  }
}
export { SupplierModel };
