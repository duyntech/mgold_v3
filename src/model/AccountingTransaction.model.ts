class AccountingTransactionModel {
  id: string;
  code: string;
  type: string;
  name: string;
  note: string;
  status: string;
  for_module: string;
  approve_enable: boolean;
  active: boolean;
  disabled: boolean;
  constructor(
    id: string,
    code: string,
    type: string,
    name: string,
    note: string,
    status: string,
    for_module: string,
    approve_enable: boolean,
    active: boolean,
    disabled: boolean
  ) {
    this.id = id;
    this.code = code;
    this.type = type;
    this.name = name;
    this.note = note;
    this.status = status;
    this.for_module = for_module;
    this.approve_enable = approve_enable;
    this.active = active;
    this.disabled = disabled;
  }
  static initial() {
    return {
      id: "",
      code: "",
      type: "",
      name: "",
      note: "",
      status: "",
      for_module: "",
      approve_enable: false,
      active: false,
      disabled: false,
    };
  }
}
export { AccountingTransactionModel };
