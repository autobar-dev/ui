"use client";

import { Badge, Card, Flex, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Title, Text } from "@tremor/react";
import { DashboardLightButton } from "../atoms/DashboardLightButton";
import { serviceModuleToModule } from "@/utils/module_utils";
import { RepositoriesContext } from "@/contexts/RepositoriesContext";
import { useContext, useEffect, useState } from "react";
import { Module } from "@/types/module";

export default function ModulesSection() {
  const { moduleRepository } = useContext(RepositoriesContext);

  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!moduleRepository) {
      return;
    }

    setLoading(true);
    moduleRepository.getAll()
      .then(serviceModules => {
        const mappedModules = serviceModules.map(serviceModuleToModule);
        setModules(mappedModules);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load modules", err);
        setLoading(false);
      });
  }, [moduleRepository]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-400 animate-pulse">Loading modules...</p>
      </div>
    );
  }

  return (
    <Card className="rounded-2xl shadow-sm border-none bg-white">
      <Flex justifyContent="start" alignItems="center" className="space-x-3 mb-6">
        <Title className="text-xl font-bold text-slate-800">Modules</Title>
        <Badge size="xs" color="blue" className="rounded-full px-2.5">
          {modules.length}
        </Badge>
      </Flex>

      <Table>
        <TableHead>
          <TableRow className="border-b border-slate-100">
            <TableHeaderCell className="text-slate-500 font-semibold uppercase text-xs tracking-wider text-center">Serial number</TableHeaderCell>
            <TableHeaderCell className="text-slate-500 font-semibold uppercase text-xs tracking-wider text-center">Station</TableHeaderCell>
            <TableHeaderCell className="text-slate-500 font-semibold uppercase text-xs tracking-wider text-center">Product</TableHeaderCell>
            <TableHeaderCell className="text-slate-500 font-semibold uppercase text-xs tracking-wider text-center">Unit</TableHeaderCell>
            <TableHeaderCell className="text-slate-500 font-semibold uppercase text-xs tracking-wider text-center">Currency</TableHeaderCell>
            <TableHeaderCell className="text-slate-500 font-semibold uppercase text-xs tracking-wider text-center">Prices</TableHeaderCell>
            <TableHeaderCell className="text-slate-500 font-semibold uppercase text-xs tracking-wider text-center">Status</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {modules.map((module, index) => {
            const stationElement = module.stationId ? (
              <DashboardLightButton label={`Station ${module.stationId}`} />
            ) : (
              <Badge color="slate" size="xs" className="opacity-60 bg-slate-100 text-slate-500 border-none">None</Badge>
            );
            const productElement = module.productId ? (
              <DashboardLightButton label={`Product ${module.productId}`} />
            ) : (
              <Badge color="slate" size="xs" className="opacity-60 bg-slate-100 text-slate-500 border-none">None</Badge>
            );
            const unitElement = (
              <Text className="text-slate-700 font-medium">
                {module.displayUnit.amount} {module.displayUnit.symbol}
              </Text>
            );
            const currencyElement = (
              <Badge color="blue" size="xs" className="font-mono px-2 rounded-md">
                {module.displayCurrency.code}
              </Badge>
            );
            const pricesElement = module.prices.size > 0 ? (
              <DashboardLightButton label="See prices" />
            ) : (
              <Badge color="slate" size="xs" className="opacity-60 bg-slate-100 text-slate-500 border-none">None</Badge>
            );
            const statusElement = module.enabled ? (
              <Badge color="green" size="xs" className="rounded-md px-2">ENABLED</Badge>
            ) : (
              <Badge color="rose" size="xs" className="rounded-md px-2">DISABLED</Badge>
            );

            const rowBgClass = index % 2 === 1 ? "bg-slate-50/50" : "bg-transparent";

            return (
              <TableRow key={`module-table-row-${module.serialNumber}`} className={`${rowBgClass} hover:bg-slate-100/50 transition-colors`}>
                <TableCell className="text-center">
                  <Text className="font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded-md inline-block text-xs font-semibold border border-slate-200 shadow-sm">
                    {module.serialNumber}
                  </Text>
                </TableCell>
                <TableCell className="text-center">{stationElement}</TableCell>
                <TableCell className="text-center">{productElement}</TableCell>
                <TableCell className="text-center">{unitElement}</TableCell>
                <TableCell className="text-center">{currencyElement}</TableCell>
                <TableCell className="text-center">{pricesElement}</TableCell>
                <TableCell className="text-center">{statusElement}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
