class FeatureModel {
  id: string;
  code: string;
  name: string;
  target: string;
  module: string;
  icon: string;
  constructor(
    id: string,
    code: string,
    name: string,
    target: string,
    module: string,
    icon: string
  ) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.target = target;
    this.module = module;
    this.icon = icon;
  }
  static initial() {
    return {
      id: "",
      code: "",
      name: "",
      target: "",
      module: "GENERAL",
      icon: "",
    };
  }
}
export { FeatureModel };
