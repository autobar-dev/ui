"use client";

import { Badge, Card, Table, Title, Text, Group, ScrollArea, Center, Stack, Loader, Select, TextInput, Pagination } from "@mantine/core";
import { RepositoriesContext } from "@/contexts/RepositoriesContext";
import { useContext, useEffect, useState } from "react";
import { ServiceFirmware } from "@/repositories/ModuleRepository";
import UploadFirmware from "../organisms/UploadFirmware";

const PAGE_SIZE = 10;

export default function FirmwareSection() {
  const { moduleRepository } = useContext(RepositoriesContext);

  const [firmwares, setFirmwares] = useState<ServiceFirmware[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [filterProgram, setFilterProgram] = useState<string>("");
  const [filterChannel, setFilterChannel] = useState<string>("");
  const [filterTarget, setFilterTarget] = useState<string>("");
  const [allFirmwares, setAllFirmwares] = useState<ServiceFirmware[]>([]);

  const loadFirmware = () => {
    if (!moduleRepository) return;

    setLoading(true);
    moduleRepository.getAllFirmware(
      filterProgram || undefined,
      filterChannel || undefined,
      filterTarget || undefined
    )
      .then(data => {
        setFirmwares(Array.isArray(data) ? data : []);
        setPage(1);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load firmware", err);
        setFirmwares([]);
        setLoading(false);
      });
    
    moduleRepository.getAllFirmware().then(data => setAllFirmwares(Array.isArray(data) ? data : []));
  };

  useEffect(() => {
    loadFirmware();
  }, [moduleRepository, filterProgram, filterChannel, filterTarget]);

  if (loading && firmwares.length === 0) {
    return (
      <Center h={400}>
        <Stack align="center" gap="xs">
          <Loader size="lg" variant="dots" />
          <Text size="sm" c="dimmed" fw={300}>Loading firmware...</Text>
        </Stack>
      </Center>
    );
  }

  const totalPages = Math.max(1, Math.ceil(firmwares.length / PAGE_SIZE));
  const paginated = firmwares.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getColorForString = (str: string, salt: string = "") => {
    if (!str) return "gray";
    const colors = ["blue", "cyan", "grape", "indigo", "orange", "pink", "teal", "violet", "lime", "yellow", "red", "green"];
    let hash = 0;
    const saltedStr = str + salt;
    for (let i = 0; i < saltedStr.length; i++) {
      hash = saltedStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const rows = paginated.map((fw, index) => {
    return (
      <Table.Tr key={`fw-${fw.id || index}`}>
        <Table.Td align="center">
          <Text size="xs" ff="monospace" fw={300} style={{ backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'inline-block' }}>
            {fw.id || "—"}
          </Text>
        </Table.Td>
        <Table.Td align="center">
          <Badge color={getColorForString(fw.program, "prog")} variant="light" size="sm" radius="sm">{fw.program || "—"}</Badge>
        </Table.Td>
        <Table.Td align="center">
          <Badge color={getColorForString(fw.target, "targ")} variant="light" size="sm" radius="sm">{fw.target || "—"}</Badge>
        </Table.Td>
        <Table.Td align="center">
          <Badge
            color={fw.channel === 'stable' ? 'green' : fw.channel === 'beta' ? 'yellow' : 'red'}
            variant="light" size="sm" radius="sm"
          >
            {fw.channel || "—"}
          </Badge>
        </Table.Td>
        <Table.Td align="center">
          <Text size="sm" fw={500} ff="monospace">{fw.version || "—"}</Text>
        </Table.Td>
        <Table.Td align="center">
          <Text size="xs" c="dimmed">{fw.created_at ? new Date(fw.created_at).toLocaleDateString() : "—"}</Text>
        </Table.Td>
      </Table.Tr>
    );
  });

  const programs = [...new Set(allFirmwares.map(f => f.program))].filter(Boolean).sort();
  const targets = [...new Set(allFirmwares.map(f => f.target))].filter(Boolean).sort();

  return (
    <Stack gap="xl">
      <Card p="xl" radius={32} shadow="sm">
        <Group mb="xl" justify="space-between">
          <Group gap="xs">
            <Title order={3} size="h4" fw={500}>
              Firmware Revisions
            </Title>
            <Badge color="blue" variant="light" radius="xl" size="xs">
              {firmwares.length}
            </Badge>
          </Group>
        </Group>

        <Group mb="md" gap="md">
          <Select
            placeholder="Filter by Program"
            data={[
              { value: "", label: "All Programs" },
              ...programs.map(p => ({ value: p, label: p }))
            ]}
            value={filterProgram}
            onChange={(val) => setFilterProgram(val || "")}
            size="sm"
            radius="md"
            searchable
            clearable
          />
          <Select
            placeholder="Filter by Target"
            data={[
              { value: "", label: "All Targets" },
              ...targets.map(t => ({ value: t, label: t }))
            ]}
            value={filterTarget}
            onChange={(val) => setFilterTarget(val || "")}
            size="sm"
            radius="md"
            searchable
            clearable
          />
          <Select
            placeholder="Filter by Channel"
            data={[
              { value: "", label: "All Channels" },
              { value: "stable", label: "Stable" },
              { value: "beta", label: "Beta" },
              { value: "alpha", label: "Alpha" },
            ]}
            value={filterChannel}
            onChange={(val) => setFilterChannel(val || "")}
            size="sm"
            radius="md"
            clearable
          />
        </Group>

        <ScrollArea>
          <Table verticalSpacing="md" striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ textAlign: 'center' }}>ID</Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>Program</Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>Target</Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>Channel</Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>Version</Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>Date</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.length > 0 ? rows : (
                <Table.Tr key="empty">
                  <Table.Td colSpan={6} align="center">
                    <Text c="dimmed" fs="italic">No firmware found matching filters.</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>

        {totalPages > 1 && (
          <Group justify="center" mt="md">
            <Pagination value={page} onChange={setPage} total={totalPages} size="sm" radius="md" siblings={0} boundaries={1} />
          </Group>
        )}
      </Card>

      <UploadFirmware onUploaded={loadFirmware} />
    </Stack>
  );
}
