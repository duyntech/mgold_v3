class LinkModel {
    url: string
    name: string
    constructor(
      url: string,
      name: string
    ){
      this.url=url,
      this.name=name
    }
}
class LinkWithIconModel extends LinkModel {
  icon: string
  constructor(
    url: string,
    name: string,
    icon:string
  ){
    super(
      url=url,
      name=name
    )
    this.icon=icon
  }
}
export { LinkModel, LinkWithIconModel }
