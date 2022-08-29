export function getServiceUri(): string {
  switch(process.env.NODE_ENV) {
    case 'development':
      return "http://localhost:4001";
    default:
      return "https://api.autobar.ovh";
  }
}