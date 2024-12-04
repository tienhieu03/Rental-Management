interface IRouter {
  path: string;
  component: any;
  isShowNav?: boolean;
  icon?: string;
  label?: string;
  children?: IRouter[];
}
export default IRouter;
