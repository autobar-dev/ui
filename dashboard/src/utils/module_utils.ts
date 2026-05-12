import { ServiceModule } from "@/repositories/ModuleRepository";
import { Module } from "@/types/module";

export function serviceModuleToModule(service_module: ServiceModule): Module {
  return {
    id: service_module.id,
    serialNumber: service_module.serial_number,
    stationId: service_module.station_id ?? undefined,
    productId: service_module.product_id ?? undefined,
    enabled: service_module.enabled,
    displayCurrency: service_module.display_currency,
    displayUnit: {
      id: service_module.display_unit.id,
      amount: service_module.display_unit.amount,
      symbol: service_module.display_unit.symbol,
      divisorFromMillilitres: service_module.display_unit.divisor_from_millilitres,
      decimalsDisplayed: service_module.display_unit.decimals_displayed,
      createdAt: new Date(service_module.display_unit.created_at),
      updatedAt: service_module.display_unit.updated_at === "0001-01-01T00:00:00Z"
        ? undefined
        : new Date(service_module.display_unit.updated_at),
    },
    prices: new Map(Object.entries(service_module.prices || {})),
    createdAt: new Date(service_module.created_at),
    updatedAt: new Date(service_module.updated_at),
  };
}
