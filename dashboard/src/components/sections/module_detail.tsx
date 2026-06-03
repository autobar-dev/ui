"use client";

import { Card, Title, Text, Group, Badge, Center, Stack, Loader, Button, Grid, Table, ScrollArea } from "@mantine/core";
import { RepositoriesContext } from "@/contexts/RepositoriesContext";
import { useContext, useEffect, useState } from "react";
import { Module } from "@/types/module";
import { LatencyReport } from "@/repositories/RealtimeRepository";
import { Currency } from "@/types/currency";
import Link from "next/link";
import { serviceModuleToModule } from "@/utils/module_utils";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface ModuleDetailsSectionProps {
  serialNumber: string;
}

export default function ModuleDetailsSection({ serialNumber }: ModuleDetailsSectionProps) {
  const { moduleRepository, productRepository, currencyRepository, realtimeRepository } = useContext(RepositoriesContext);

  const [module, setModule] = useState<Module | null>(null);
  const [loadingModule, setLoadingModule] = useState(true);

  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [stationName, setStationName] = useState<string>("Loading...");
  const [productName, setProductName] = useState<string>("Loading...");

  const [latencyData, setLatencyData] = useState<LatencyReport[]>([]);
  const [loadingLatency, setLoadingLatency] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  // Set mounted state to prevent SSR hydration mismatch with Recharts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update current time every second to reactively check for offline status
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch static currencies info for price display
  useEffect(() => {
    if (!currencyRepository) return;
    currencyRepository.getAllEnabled()
      .then(setCurrencies)
      .catch(err => console.error("Failed to load currencies", err));
  }, [currencyRepository]);

  // Fetch module detail on load
  useEffect(() => {
    if (!moduleRepository || !serialNumber) return;

    setLoadingModule(true);
    moduleRepository.get(serialNumber)
      .then(data => {
        setModule(serviceModuleToModule(data));
      })
      .catch(err => {
        console.error("Failed to load module details", err);
      })
      .finally(() => {
        setLoadingModule(false);
      });
  }, [moduleRepository, serialNumber]);

  // Fetch station name and product slug when module loaded
  useEffect(() => {
    if (!module || !moduleRepository || !productRepository) return;

    if (module.stationId) {
      moduleRepository.getStation(module.stationId)
        .then(station => setStationName(station.name || `Station ${station.id}`))
        .catch(() => setStationName(`Station ${module.stationId}`));
    } else {
      setStationName("Not Assigned");
    }

    if (module.productId) {
      productRepository.getAll()
        .then(products => {
          const prod = products.find(p => p.id === module.productId);
          setProductName(prod?.slug || `Product ${module.productId}`);
        })
        .catch(() => setProductName(`Product ${module.productId}`));
    } else {
      setProductName("None");
    }
  }, [module, moduleRepository, productRepository]);

  // Set up auto-update polling loop for latency history (every 5 seconds)
  useEffect(() => {
    if (!realtimeRepository || !serialNumber) return;

    let isFirstLoad = true;

    const fetchLatency = () => {
      if (isFirstLoad) {
        setLoadingLatency(true);
      }
      realtimeRepository.getLatencyHistory({
        identifier: serialNumber,
        client_type: "module"
      })
      .then(data => {
        // Sort data chronologically by sent_at
        const sortedData = [...data].sort((a, b) => a.sent_at - b.sent_at);
        setLatencyData(sortedData);
      })
      .catch(err => {
        console.error("Failed to fetch latency history", err);
      })
      .finally(() => {
        if (isFirstLoad) {
          setLoadingLatency(false);
          isFirstLoad = false;
        }
      });
    };

    fetchLatency();
    const interval = setInterval(fetchLatency, 5000);

    return () => clearInterval(interval);
  }, [realtimeRepository, serialNumber]);

  const parseTimestamp = (sent_at: number): Date => {
    // Check if timestamp is in seconds (10 digits) or milliseconds (13 digits)
    const isSeconds = sent_at < 9999999999;
    return new Date(isSeconds ? sent_at * 1000 : sent_at);
  };

  const formatTime = (sent_at: number) => {
    const d = parseTimestamp(sent_at);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const isOffline = latencyData.length === 0 || (() => {
    const latest = latencyData[latencyData.length - 1];
    const latestTime = parseTimestamp(latest.sent_at).getTime();
    return (currentTime - latestTime) > 15000;
  })();

  // Custom Dot component to style points based on status
  const renderCustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (cx === undefined || cy === undefined || !payload) return null;

    if (payload.command?.toLowerCase() === "heartbeat") {
      return null;
    }

    let fill = "#94a3b8"; // Slate gray for unknown
    if (payload.status === "replied") {
      fill = "#10b981"; // Green
    } else if (payload.status === "timeout" || payload.status === "failed" || payload.status === "error") {
      fill = "#ef4444"; // Red
    } else if (payload.status === "pending" || payload.status === "sent") {
      fill = "#f59e0b"; // Orange/Yellow
    }

    return (
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill={fill}
        stroke="#ffffff"
        strokeWidth={1.5}
        style={{ filter: "drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.15))" }}
        key={`dot-${payload.id || payload.sent_at}`}
      />
    );
  };

  // Custom Active (Hovered) Dot component
  const renderActiveDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (cx === undefined || cy === undefined || !payload) return null;

    let fill = "#94a3b8";
    if (payload.status === "replied") {
      fill = "#10b981";
    } else if (payload.status === "timeout" || payload.status === "failed" || payload.status === "error") {
      fill = "#ef4444";
    } else if (payload.status === "pending" || payload.status === "sent") {
      fill = "#f59e0b";
    }

    return (
      <circle
        cx={cx}
        cy={cy}
        r={7}
        fill={fill}
        stroke="#ffffff"
        strokeWidth={2}
        style={{ filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.2))" }}
        key={`activedot-${payload.id || payload.sent_at}`}
      />
    );
  };

  // Custom Tooltip for premium info representation
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as LatencyReport;
      const d = parseTimestamp(data.sent_at);
      const timeStr = d.toLocaleString();

      let statusColor = "gray";
      if (data.status === "replied") statusColor = "green";
      else if (data.status === "pending" || data.status === "sent") statusColor = "yellow";
      else statusColor = "red";

      return (
        <Card p="md" shadow="md" radius="md" style={{ border: "1px solid #e2e8f0", backgroundColor: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(4px)" }}>
          <Stack gap="xs">
            <Group justify="space-between" gap="xl">
              <Text size="xs" fw={700} c="dimmed">COMMAND</Text>
              <Text size="xs" ff="monospace" fw={600} style={{ backgroundColor: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>
                {data.command}
              </Text>
            </Group>
            <Group justify="space-between">
              <Text size="xs" fw={700} c="dimmed">LATENCY</Text>
              <Text size="sm" fw={700} c="blue">{data.latency_ms} ms</Text>
            </Group>
            <Group justify="space-between">
              <Text size="xs" fw={700} c="dimmed">STATUS</Text>
              <Badge size="xs" color={statusColor} variant="light">
                {data.status}
              </Badge>
            </Group>
            <Group justify="space-between">
              <Text size="xs" fw={700} c="dimmed">SENT AT</Text>
              <Text size="xs" c="dimmed">{timeStr}</Text>
            </Group>
          </Stack>
        </Card>
      );
    }
    return null;
  };

  if (loadingModule) {
    return (
      <Center h={400}>
        <Stack align="center" gap="xs">
          <Loader size="lg" variant="dots" />
          <Text size="sm" c="dimmed" fw={300}>Loading module details...</Text>
        </Stack>
      </Center>
    );
  }

  if (!module) {
    return (
      <Center h={400}>
        <Text c="red" fw={500}>Module not found</Text>
      </Center>
    );
  }

  return (
    <Stack gap="xl" className="pb-10">
      <Group>
        <Button component={Link} href="/modules" variant="light" size="sm">
          &larr; Back to Modules
        </Button>
      </Group>

      <Grid gap="xl">
        {/* Left Side: Module Details Card */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Stack gap="xl">
            <Card p="xl" radius={32} shadow="sm">
              <Stack gap="md">
                <Group justify="space-between" align="center">
                  <div>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700} mb={4}>Serial Number</Text>
                    <Title order={2} size="h3" fw={600} ff="monospace" style={{ letterSpacing: "-0.5px" }}>
                      {module.serialNumber}
                    </Title>
                  </div>
                  <Badge size="lg" variant="light" color={module.enabled ? "green" : "red"} radius="md">
                    {module.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </Group>

                <div style={{ height: "1px", backgroundColor: "#f1f5f9", margin: "8px 0" }} />

                <Grid gap="md">
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Station</Text>
                    {module.stationId ? (
                      <Link href={`/stations/${module.stationId}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <Text fw={500} c="blue" className="hover:underline cursor-pointer mt-1">
                          {stationName}
                        </Text>
                      </Link>
                    ) : (
                      <Text fw={500} c="dimmed" className="mt-1">{stationName}</Text>
                    )}
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Product Slug</Text>
                    <Text fw={500} className="mt-1">{productName}</Text>
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Display Unit</Text>
                    <Text fw={500} className="mt-1">
                      {module.displayUnit.amount} {module.displayUnit.symbol}
                    </Text>
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Display Currency</Text>
                    <Text fw={500} className="mt-1">{module.displayCurrency.code}</Text>
                  </Grid.Col>
                </Grid>
              </Stack>
            </Card>

            {/* Price Configurations Card */}
            <Card p="xl" radius={32} shadow="sm">
              <Stack gap="md">
                <Title order={3} size="h4" fw={500}>
                  Configured Prices
                </Title>
                {module.prices && module.prices.size > 0 ? (
                  <ScrollArea>
                    <Table verticalSpacing="sm" striped>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th style={{ textAlign: "left" }}>Currency</Table.Th>
                          <Table.Th style={{ textAlign: "right" }}>Price</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {Array.from(module.prices.entries()).map(([currencyCode, rawValue]) => {
                          const currency = currencies.find(c => c.code === currencyCode);
                          const divisor = currency ? currency.minor_unit_divisor : 100;
                          const formattedValue = (rawValue / divisor).toFixed(currency ? Math.log10(currency.minor_unit_divisor) : 2);
                          return (
                            <Table.Tr key={currencyCode}>
                              <Table.Td>
                                <Text size="sm" fw={500}>{currencyCode}</Text>
                              </Table.Td>
                              <Table.Td style={{ textAlign: "right" }}>
                                <Text size="sm" ff="monospace" fw={600}>
                                  {formattedValue} {currencyCode}
                                </Text>
                              </Table.Td>
                            </Table.Tr>
                          );
                        })}
                      </Table.Tbody>
                    </Table>
                  </ScrollArea>
                ) : (
                  <Text size="sm" c="dimmed" fs="italic">No custom prices configured for this module.</Text>
                )}
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>

        {/* Right Side: Latency Graph Card */}
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Card p="xl" radius={32} shadow="sm" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Stack gap="md" style={{ flex: 1 }}>
              <Group justify="space-between" align="center">
                <Group gap="sm">
                  <Title order={3} size="h4" fw={500}>
                    Latency History
                  </Title>
                  {!isOffline ? (
                    <div key="badge-live" className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <Text size="10px" fw={700} c="green.7" style={{ letterSpacing: "0.5px" }}>LIVE</Text>
                    </div>
                  ) : (
                    <div key="badge-offline" className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-50 border border-red-200">
                      <span className="relative flex h-2 w-2">
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                      <Text size="10px" fw={700} c="red.7" style={{ letterSpacing: "0.5px" }}>OFFLINE</Text>
                    </div>
                  )}
                </Group>

                {/* Status Legend */}
                <Group gap="xs">
                  <Badge size="xs" color="green" variant="dot">Replied</Badge>
                  <Badge size="xs" color="yellow" variant="dot">Pending</Badge>
                  <Badge size="xs" color="red" variant="dot">Timeout/Error</Badge>
                </Group>
              </Group>

              <div style={{ flex: 1, minHeight: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {loadingLatency ? (
                  <Stack align="center" gap="xs">
                    <Loader size="md" variant="dots" />
                    <Text size="xs" c="dimmed">Fetching latency history...</Text>
                  </Stack>
                ) : latencyData.length === 0 ? (
                  <Text size="sm" c="dimmed" fs="italic">No latency reports found for this module.</Text>
                ) : mounted ? (
                  <div style={{ width: "100%", height: 350 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={latencyData}
                        margin={{ top: 20, right: 20, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                          dataKey="sent_at"
                          tickFormatter={formatTime}
                          tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "monospace" }}
                          stroke="#e2e8f0"
                        />
                        <YAxis
                          tick={{ fill: "#94a3b8", fontSize: 10 }}
                          stroke="#e2e8f0"
                          domain={[0, "auto"]}
                          unit="ms"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="natural"
                          dataKey="latency_ms"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={renderCustomDot}
                          activeDot={renderActiveDot}
                          isAnimationActive={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : null}
              </div>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
