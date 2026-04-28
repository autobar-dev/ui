import { ModuleRepository } from "@/repositories/ModuleRepository";
import { Badge, Card, Flex, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Title } from "@tremor/react";
import { DashboardLightButton } from "../atoms/DashboardLightButton";
import { serviceModuleToModule } from "@/utils/module_utils";

export default async function ModulesSection() {
  const module_repository = new ModuleRepository("http://localhost:9000/module");
  const service_modules = await module_repository.getAll();

  const modules = service_modules.map(serviceModuleToModule);

  return (
    <Card>
      <Flex justifyContent="start" className="space-x-2">
        <Title>Modules</Title>
        <Badge color="gray">{modules.length}</Badge>
      </Flex>

      <Table className="mt-6">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Serial number</TableHeaderCell>
            <TableHeaderCell>Station</TableHeaderCell>
            <TableHeaderCell>Product</TableHeaderCell>
            <TableHeaderCell>Prices</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {modules.map(module => {
            const stationElement = module.stationSlug ? (
              <DashboardLightButton label="See station" />
            ) : (
              <Badge color="gray">None</Badge>
            );
            const productElement = module.productSlug ? (
              <DashboardLightButton label="See product" />
            ) : (
              <Badge color="gray">None</Badge>
            );
            const pricesElement = module.prices.size > 0 ? (
              <DashboardLightButton label="See prices" />
            ) : (
              <Badge color="gray">None</Badge>
            );
            const statusElement = (
              <Badge color="green">OK</Badge>
            );


            return (
              <TableRow key={`module-table-row-${module.serialNumber}`}>
                <TableCell className="italic">{module.serialNumber}</TableCell>
                <TableCell>{stationElement}</TableCell>
                <TableCell>{productElement}</TableCell>
                <TableCell>{pricesElement}</TableCell>
                <TableCell>{statusElement}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
