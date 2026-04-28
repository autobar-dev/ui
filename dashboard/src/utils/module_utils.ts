import { ServiceModule } from "@/repositories/ModuleRepository";
import { Module } from "@/types/module";

export function serviceModuleToModule(service_module: ServiceModule): Module {
  return {
    id: service_module.id,
    serialNumber: service_module.serial_number,
    stationSlug: service_module.station_slug ?? undefined,
    productSlug: service_module.product_slug ?? undefined,
    prices: service_module.prices,
    createdAt: new Date(service_module.created_at),
  };
}
